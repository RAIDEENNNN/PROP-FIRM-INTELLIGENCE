-- MyFundedScope Supabase baseline migration.
--
-- Production note:
-- This documents the public.profiles table that was already created directly
-- in the Supabase SQL Editor for myfundedscope-production.
-- Do not rerun this migration against production unless intentionally
-- rebuilding the database. Keep it in Git as the source-of-truth record.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  email text,
  country text,
  timezone text,
  avatar_url text,
  trader_type text check (trader_type is null or trader_type in ('Prop Trader', 'Live Trader', 'Both')),
  experience_level text check (experience_level is null or experience_level in ('Beginner', 'Intermediate', 'Advanced', 'Professional')),
  markets text[] not null default '{}',
  brokers text[] not null default '{}',
  prop_firms text[] not null default '{}',
  live_account_size numeric,
  prop_account_size numeric,
  challenge_size numeric,
  trading_style text,
  strategy text,
  max_risk_per_trade numeric,
  goals text[] not null default '{}',
  target_monthly_percent numeric,
  target_monthly_profit numeric,
  target_win_rate numeric,
  maximum_drawdown numeric,
  trading_sessions text[] not null default '{}',
  favorite_assets text[] not null default '{}',
  years_experience numeric,
  prop_challenges_count integer,
  funded_before boolean not null default false,
  largest_account numeric,
  psychology_weaknesses text[] not null default '{}',
  personality jsonb not null default '{}'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  connected_accounts jsonb not null default '{}'::jsonb,
  performance jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Authenticated users can view their own profile" on public.profiles;
create policy "Authenticated users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Authenticated users can create their own profile" on public.profiles;
create policy "Authenticated users can create their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Authenticated users can update their own profile" on public.profiles;
create policy "Authenticated users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

