-- Complete launch persistence, publication workflow and data-quality fields.
--
-- Safety notes:
-- - Additive-only except for RLS policy replacement.
-- - Existing active prop-firm/challenge/rule rows were already public through
--   earlier status='active' policies, so this migration marks those rows as
--   published to preserve current public visibility under the stricter policy.
-- - No production rows are deleted or overwritten with seeded content.

alter table public.prop_firms
  add column if not exists official_url text,
  add column if not exists website_url text,
  add column if not exists platforms text[] not null default '{}',
  add column if not exists payout_details jsonb not null default '{}'::jsonb,
  add column if not exists restrictions jsonb not null default '{}'::jsonb,
  add column if not exists fee_notes text,
  add column if not exists confidence_score numeric(5,2),
  add column if not exists confidence_score_details jsonb not null default '{}'::jsonb,
  add column if not exists published_at timestamptz;

alter table public.prop_firm_challenges
  add column if not exists platforms text[] not null default '{}',
  add column if not exists payout_details jsonb not null default '{}'::jsonb,
  add column if not exists restrictions jsonb not null default '{}'::jsonb,
  add column if not exists fee_notes text;

alter table public.prop_firm_rules
  add column if not exists rule_key text,
  add column if not exists official_url text;

update public.prop_firms
set
  content_status = 'published',
  published_at = coalesce(published_at, updated_at, created_at),
  confidence_score = coalesce(confidence_score, score),
  website_url = coalesce(website_url, official_url, case when domain is null then null else 'https://' || regexp_replace(domain, '^https?://', '') end),
  official_url = coalesce(official_url, website_url, source_url)
where status = 'active'
  and content_status = 'draft';

update public.prop_firm_challenges
set content_status = 'published'
where status = 'active'
  and content_status = 'draft';

update public.prop_firm_rules
set content_status = 'published'
where status = 'active'
  and content_status = 'draft';

create unique index if not exists prop_firms_lower_slug_unique
  on public.prop_firms(lower(slug));

create unique index if not exists prop_firms_lower_name_unique
  on public.prop_firms(lower(name));

create index if not exists prop_firms_public_status_idx
  on public.prop_firms(status, content_status, featured, score desc);

create index if not exists prop_firm_challenges_public_status_idx
  on public.prop_firm_challenges(prop_firm_id, status, content_status);

create index if not exists prop_firm_rules_public_status_idx
  on public.prop_firm_rules(prop_firm_id, status, content_status);

drop policy if exists "Anyone can read active prop firms" on public.prop_firms;
create policy "Public reads published active prop firms"
  on public.prop_firms
  for select
  to anon, authenticated
  using (status = 'active' and content_status = 'published');

drop policy if exists "Anyone can read active prop firm challenges" on public.prop_firm_challenges;
create policy "Public reads published active prop firm challenges"
  on public.prop_firm_challenges
  for select
  to anon, authenticated
  using (status = 'active' and content_status = 'published');

drop policy if exists "Anyone can read active prop firm rules" on public.prop_firm_rules;
create policy "Public reads published active prop firm rules"
  on public.prop_firm_rules
  for select
  to anon, authenticated
  using (status = 'active' and content_status = 'published');

drop policy if exists "Admins manage prop firms" on public.prop_firms;
create policy "Admins manage prop firms"
  on public.prop_firms for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage prop firm challenges" on public.prop_firm_challenges;
create policy "Admins manage prop firm challenges"
  on public.prop_firm_challenges for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage prop firm rules" on public.prop_firm_rules;
create policy "Admins manage prop firm rules"
  on public.prop_firm_rules for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));

alter table public.brokers
  add column if not exists official_url text,
  add column if not exists source_url text,
  add column if not exists countries text[] not null default '{}',
  add column if not exists platforms text[] not null default '{}',
  add column if not exists funding_methods text[] not null default '{}',
  add column if not exists withdrawal_methods text[] not null default '{}',
  add column if not exists minimum_deposit numeric(12,2),
  add column if not exists spread_summary text,
  add column if not exists commission_summary text,
  add column if not exists swap_summary text,
  add column if not exists confidence_score_details jsonb not null default '{}'::jsonb,
  add column if not exists published_at timestamptz;

update public.brokers
set
  official_url = coalesce(official_url, website_url, source_url),
  published_at = case when content_status = 'published' then coalesce(published_at, updated_at, created_at) else published_at end
where official_url is null
   or published_at is null;

create unique index if not exists brokers_lower_slug_unique
  on public.brokers(lower(slug));

create unique index if not exists brokers_lower_name_unique
  on public.brokers(lower(name));

create index if not exists brokers_public_status_idx
  on public.brokers(content_status, trust_score desc, last_verified_at desc);

create table if not exists public.saved_comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  comparison_type text not null default 'prop_firm'
    check (comparison_type in ('prop_firm', 'broker', 'mixed')),
  entity_slugs text[] not null default '{}',
  notes text,
  filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create index if not exists saved_comparisons_user_created_idx
  on public.saved_comparisons(user_id, created_at desc);

alter table public.saved_comparisons enable row level security;

drop policy if exists "Users manage own saved comparisons" on public.saved_comparisons;
create policy "Users manage own saved comparisons"
  on public.saved_comparisons for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists set_saved_comparisons_updated_at on public.saved_comparisons;
create trigger set_saved_comparisons_updated_at
  before update on public.saved_comparisons
  for each row
  execute function public.set_updated_at();
