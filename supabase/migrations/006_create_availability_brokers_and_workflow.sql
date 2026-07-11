-- Public data workflow, broker intelligence, rule history and country availability.
-- Internal notes/private research sources are kept in separate admin-only tables.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum ('draft', 'under_review', 'published', 'archived');
  end if;
end
$$;

alter table public.prop_firms
  add column if not exists content_status public.content_status not null default 'draft',
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'pending_review', 'verified', 'needs_update')),
  add column if not exists public_source_name text,
  add column if not exists last_verified_at timestamptz;

alter table public.prop_firm_challenges
  add column if not exists content_status public.content_status not null default 'draft',
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'pending_review', 'verified', 'needs_update')),
  add column if not exists public_source_name text,
  add column if not exists last_verified_at timestamptz;

alter table public.prop_firm_rules
  add column if not exists content_status public.content_status not null default 'draft',
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'pending_review', 'verified', 'needs_update')),
  add column if not exists public_source_name text,
  add column if not exists last_verified_at timestamptz;

create table if not exists public.prop_firm_rule_history (
  id uuid primary key default gen_random_uuid(),
  prop_firm_id uuid not null references public.prop_firms(id) on delete cascade,
  rule_id uuid references public.prop_firm_rules(id) on delete set null,
  rule_category text not null,
  rule_title text not null,
  previous_value text,
  new_value text not null,
  change_summary text not null,
  public_source_name text,
  source_url text,
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  content_status public.content_status not null default 'under_review',
  created_at timestamptz not null default now()
);

create table if not exists public.brokers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  website_url text,
  founded_year int,
  headquarters text,
  trust_score numeric(5,2),
  public_summary text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'pending_review', 'verified', 'needs_update')),
  public_source_name text,
  last_verified_at timestamptz,
  content_status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.broker_accounts (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references public.brokers(id) on delete cascade,
  name text not null,
  minimum_deposit numeric(12,2),
  commission text,
  spread_model text,
  leverage text,
  platforms text[] not null default '{}',
  base_currencies text[] not null default '{}',
  public_source_name text,
  last_verified_at timestamptz,
  content_status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.broker_instruments (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references public.brokers(id) on delete cascade,
  symbol text not null,
  display_name text,
  asset_class text not null,
  average_spread_pips numeric(12,4),
  minimum_spread_pips numeric(12,4),
  commission text,
  swap_long text,
  swap_short text,
  trading_hours text,
  max_leverage text,
  public_source_name text,
  last_verified_at timestamptz,
  content_status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (broker_id, symbol)
);

create table if not exists public.broker_regulations (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references public.brokers(id) on delete cascade,
  regulator text not null,
  license_number text,
  country text,
  entity_name text,
  license_status text,
  verification_link text,
  negative_balance_protection boolean,
  segregated_client_funds boolean,
  public_source_name text,
  last_verified_at timestamptz,
  content_status public.content_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.broker_spread_history (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references public.brokers(id) on delete cascade,
  symbol text not null,
  spread_pips numeric(12,4) not null,
  session text,
  source_name text,
  source_type text not null default 'manual_verified'
    check (source_type in ('official', 'feed_backed', 'manual_verified', 'indicative')),
  recorded_at timestamptz not null default now()
);

create table if not exists public.country_availability (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('prop_firm', 'broker')),
  prop_firm_id uuid references public.prop_firms(id) on delete cascade,
  broker_id uuid references public.brokers(id) on delete cascade,
  country_code text not null,
  country_name text not null,
  available boolean not null default false,
  restricted boolean not null default false,
  conditions text,
  supported_payment_methods text[] not null default '{}',
  regulatory_entity text,
  public_source_name text,
  source_url text,
  last_verified_at timestamptz,
  content_status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (entity_type = 'prop_firm' and prop_firm_id is not null and broker_id is null) or
    (entity_type = 'broker' and broker_id is not null and prop_firm_id is null)
  )
);

create table if not exists public.internal_research_notes (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  note text,
  private_research_url text,
  scoring_override jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prop_firm_rule_history_firm_created_idx on public.prop_firm_rule_history(prop_firm_id, created_at desc);
create index if not exists brokers_status_verified_idx on public.brokers(content_status, last_verified_at desc);
create index if not exists broker_accounts_broker_idx on public.broker_accounts(broker_id);
create index if not exists broker_instruments_symbol_idx on public.broker_instruments(symbol);
create index if not exists broker_spread_history_symbol_recorded_idx on public.broker_spread_history(symbol, recorded_at desc);
create index if not exists country_availability_country_idx on public.country_availability(country_code, entity_type);
create index if not exists country_availability_prop_firm_idx on public.country_availability(prop_firm_id);
create index if not exists country_availability_broker_idx on public.country_availability(broker_id);

alter table public.prop_firm_rule_history enable row level security;
alter table public.brokers enable row level security;
alter table public.broker_accounts enable row level security;
alter table public.broker_instruments enable row level security;
alter table public.broker_regulations enable row level security;
alter table public.broker_spread_history enable row level security;
alter table public.country_availability enable row level security;
alter table public.internal_research_notes enable row level security;

drop policy if exists "Public reads published brokers" on public.brokers;
create policy "Public reads published brokers"
  on public.brokers for select
  to anon, authenticated
  using (content_status = 'published');

drop policy if exists "Public reads published broker accounts" on public.broker_accounts;
create policy "Public reads published broker accounts"
  on public.broker_accounts for select
  to anon, authenticated
  using (content_status = 'published');

drop policy if exists "Public reads published broker instruments" on public.broker_instruments;
create policy "Public reads published broker instruments"
  on public.broker_instruments for select
  to anon, authenticated
  using (content_status = 'published');

drop policy if exists "Public reads published broker regulations" on public.broker_regulations;
create policy "Public reads published broker regulations"
  on public.broker_regulations for select
  to anon, authenticated
  using (content_status = 'published');

drop policy if exists "Public reads published country availability" on public.country_availability;
create policy "Public reads published country availability"
  on public.country_availability for select
  to anon, authenticated
  using (content_status = 'published');

drop policy if exists "Public reads published rule history" on public.prop_firm_rule_history;
create policy "Public reads published rule history"
  on public.prop_firm_rule_history for select
  to anon, authenticated
  using (content_status = 'published');

drop policy if exists "Admins manage broker and workflow data" on public.brokers;
create policy "Admins manage broker and workflow data"
  on public.brokers for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage broker accounts" on public.broker_accounts;
create policy "Admins manage broker accounts"
  on public.broker_accounts for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage broker instruments" on public.broker_instruments;
create policy "Admins manage broker instruments"
  on public.broker_instruments for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage broker regulations" on public.broker_regulations;
create policy "Admins manage broker regulations"
  on public.broker_regulations for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage broker spread history" on public.broker_spread_history;
create policy "Admins manage broker spread history"
  on public.broker_spread_history for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage country availability" on public.country_availability;
create policy "Admins manage country availability"
  on public.country_availability for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage rule history" on public.prop_firm_rule_history;
create policy "Admins manage rule history"
  on public.prop_firm_rule_history for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage internal research notes" on public.internal_research_notes;
create policy "Admins manage internal research notes"
  on public.internal_research_notes for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin')));
