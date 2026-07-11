-- Creates the public prop firm directory table.
-- RLS is explicitly enabled because this table is exposed through Supabase.

create table if not exists public.prop_firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  domain text,
  logo_url text,
  country text,
  summary text,
  score numeric not null default 0 check (score >= 0 and score <= 100),
  rating numeric not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  payout_frequency text,
  max_drawdown text,
  daily_drawdown text,
  profit_target text,
  challenge_fee text,
  max_account text,
  markets text[] not null default '{}',
  challenge_types text[] not null default '{}',
  tags text[] not null default '{}',
  verified boolean not null default false,
  featured boolean not null default false,
  status text not null default 'active',
  last_rule_update date,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prop_firms enable row level security;

drop policy if exists "Anyone can read active prop firms" on public.prop_firms;
create policy "Anyone can read active prop firms"
  on public.prop_firms
  for select
  to anon, authenticated
  using (status = 'active');

drop trigger if exists set_prop_firms_updated_at on public.prop_firms;
create trigger set_prop_firms_updated_at
  before update on public.prop_firms
  for each row
  execute function public.set_updated_at();

