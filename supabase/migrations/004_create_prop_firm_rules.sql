-- MyFundedScope Supabase baseline migration.
--
-- Production note:
-- This documents the public.prop_firm_rules table reported as already
-- created in the Supabase SQL Editor for myfundedscope-production.
-- Do not rerun this migration against production unless intentionally
-- rebuilding/repairing the database.
--
-- RLS is explicitly enabled because this table is exposed through Supabase.

create table if not exists public.prop_firm_rules (
  id uuid primary key default gen_random_uuid(),
  prop_firm_id uuid not null references public.prop_firms(id) on delete cascade,
  category text not null,
  title text not null,
  current_value text not null,
  previous_value text,
  impact_level text not null default 'medium' check (impact_level in ('low', 'medium', 'high')),
  source_url text,
  effective_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prop_firm_rules_prop_firm_id_idx
  on public.prop_firm_rules(prop_firm_id);

create index if not exists prop_firm_rules_category_idx
  on public.prop_firm_rules(category);

alter table public.prop_firm_rules enable row level security;

drop policy if exists "Anyone can read active prop firm rules" on public.prop_firm_rules;
create policy "Anyone can read active prop firm rules"
  on public.prop_firm_rules
  for select
  to anon, authenticated
  using (status = 'active');

drop trigger if exists set_prop_firm_rules_updated_at on public.prop_firm_rules;
create trigger set_prop_firm_rules_updated_at
  before update on public.prop_firm_rules
  for each row
  execute function public.set_updated_at();
