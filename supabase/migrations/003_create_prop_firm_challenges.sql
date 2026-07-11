-- MyFundedScope Supabase baseline migration.
--
-- Production note:
-- This documents the public.prop_firm_challenges table reported as already
-- created in the Supabase SQL Editor for myfundedscope-production.
-- Do not rerun this migration against production unless intentionally
-- rebuilding/repairing the database.
--
-- RLS is explicitly enabled because this table is exposed through Supabase.

create table if not exists public.prop_firm_challenges (
  id uuid primary key default gen_random_uuid(),
  prop_firm_id uuid not null references public.prop_firms(id) on delete cascade,
  name text not null,
  challenge_type text,
  account_size numeric,
  challenge_fee numeric,
  currency text not null default 'USD',
  profit_target_phase_one numeric,
  profit_target_phase_two numeric,
  daily_drawdown numeric,
  max_drawdown numeric,
  payout_split numeric,
  minimum_trading_days integer,
  max_trading_days integer,
  refundable_fee boolean not null default false,
  status text not null default 'active',
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prop_firm_challenges_prop_firm_id_idx
  on public.prop_firm_challenges(prop_firm_id);

create index if not exists prop_firm_challenges_account_size_idx
  on public.prop_firm_challenges(account_size);

alter table public.prop_firm_challenges enable row level security;

drop policy if exists "Anyone can read active prop firm challenges" on public.prop_firm_challenges;
create policy "Anyone can read active prop firm challenges"
  on public.prop_firm_challenges
  for select
  to anon, authenticated
  using (status = 'active');

drop trigger if exists set_prop_firm_challenges_updated_at on public.prop_firm_challenges;
create trigger set_prop_firm_challenges_updated_at
  before update on public.prop_firm_challenges
  for each row
  execute function public.set_updated_at();
