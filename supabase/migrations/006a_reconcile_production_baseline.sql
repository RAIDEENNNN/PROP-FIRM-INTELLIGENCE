-- Reconcile the live Supabase production baseline with the current FundedScope app.
--
-- Safety:
-- - Additive only: no table drops, column drops, destructive renames or seed writes.
-- - Existing production tables/columns remain canonical.
-- - Equivalent production columns are reused by Prisma/API mappings:
--   profiles.account_role, prop_firms.trust_score, prop_firms.is_verified,
--   prop_firms.description, prop_firms.website_url, brokers.trust_score,
--   brokers.is_verified, brokers.description, brokers.website_url,
--   brokers.supported_countries and brokers.regulation_summary.
-- - public.prop_firm_rules is kept as the existing boolean rules table.
--   Text/history-style rule cards are stored in public.prop_firm_rule_details.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum ('draft', 'under_review', 'published', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'AlertType') then
    create type public."AlertType" as enum ('RULE_CHANGE', 'SPREAD_SPIKE', 'NEWS_EVENT', 'PAYOUT_UPDATE', 'PRICE_CHANGE', 'CUSTOM');
  end if;

  if not exists (select 1 from pg_type where typname = 'SubscriptionStatus') then
    create type public."SubscriptionStatus" as enum ('FREE', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED');
  end if;

  if not exists (select 1 from pg_type where typname = 'InstrumentCategory') then
    create type public."InstrumentCategory" as enum ('FOREX', 'CRYPTO', 'INDICES', 'COMMODITIES', 'STOCKS');
  end if;

  if not exists (select 1 from pg_type where typname = 'TradingSession') then
    create type public."TradingSession" as enum ('ASIA', 'LONDON', 'NEW_YORK', 'OVERLAP');
  end if;

  if not exists (select 1 from pg_type where typname = 'ImpactLevel') then
    create type public."ImpactLevel" as enum ('LOW', 'MEDIUM', 'HIGH');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists email text,
  add column if not exists timezone text,
  add column if not exists trader_type text,
  add column if not exists experience_level text,
  add column if not exists markets text[] not null default '{}',
  add column if not exists brokers text[] not null default '{}',
  add column if not exists prop_firms text[] not null default '{}',
  add column if not exists live_account_size numeric,
  add column if not exists prop_account_size numeric,
  add column if not exists challenge_size numeric,
  add column if not exists trading_style text,
  add column if not exists strategy text,
  add column if not exists max_risk_per_trade numeric,
  add column if not exists goals text[] not null default '{}',
  add column if not exists target_monthly_percent numeric,
  add column if not exists target_monthly_profit numeric,
  add column if not exists target_win_rate numeric,
  add column if not exists maximum_drawdown numeric,
  add column if not exists trading_sessions text[] not null default '{}',
  add column if not exists favorite_assets text[] not null default '{}',
  add column if not exists years_experience numeric,
  add column if not exists prop_challenges_count integer,
  add column if not exists funded_before boolean not null default false,
  add column if not exists largest_account numeric,
  add column if not exists psychology_weaknesses text[] not null default '{}',
  add column if not exists personality jsonb not null default '{}'::jsonb,
  add column if not exists preferences jsonb not null default '{}'::jsonb,
  add column if not exists connected_accounts jsonb not null default '{}'::jsonb,
  add column if not exists performance jsonb not null default '{}'::jsonb,
  add column if not exists email_verified_at timestamptz,
  add column if not exists account_role text not null default 'user';

alter table public.profiles enable row level security;

drop policy if exists "Authenticated users can view their own profile" on public.profiles;
create policy "Authenticated users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Authenticated users can create their own profile" on public.profiles;
create policy "Authenticated users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Authenticated users can update their own profile" on public.profiles;
create policy "Authenticated users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    country,
    account_role,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    nullif(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), ''),
    nullif(new.raw_user_meta_data->>'avatar_url', ''),
    nullif(new.raw_user_meta_data->>'country', ''),
    'user',
    now(),
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row
  execute function public.handle_new_user_profile();

-- Optional one-time backfill to run manually after review:
-- insert into public.profiles (id, email, account_role, created_at, updated_at)
-- select id, email, 'user', now(), now()
-- from auth.users
-- where not exists (select 1 from public.profiles where profiles.id = auth.users.id)
-- on conflict (id) do nothing;

alter table public.prop_firms
  add column if not exists website_url text,
  add column if not exists headquarters_country text,
  add column if not exists description text,
  add column if not exists trust_score numeric not null default 0,
  add column if not exists is_verified boolean not null default false,
  add column if not exists rating numeric not null default 0,
  add column if not exists review_count integer not null default 0,
  add column if not exists payout_frequency text,
  add column if not exists max_drawdown text,
  add column if not exists daily_drawdown text,
  add column if not exists profit_target text,
  add column if not exists challenge_fee text,
  add column if not exists max_account text,
  add column if not exists markets text[] not null default '{}',
  add column if not exists challenge_types text[] not null default '{}',
  add column if not exists platforms text[] not null default '{}',
  add column if not exists tags text[] not null default '{}',
  add column if not exists featured boolean not null default false,
  add column if not exists content_status public.content_status not null default 'draft',
  add column if not exists verification_status text not null default 'unverified',
  add column if not exists public_source_name text,
  add column if not exists confidence_score numeric(5,2),
  add column if not exists confidence_score_details jsonb not null default '{}'::jsonb,
  add column if not exists payout_details jsonb not null default '{}'::jsonb,
  add column if not exists restrictions jsonb not null default '{}'::jsonb,
  add column if not exists fee_notes text,
  add column if not exists published_at timestamptz,
  add column if not exists last_rule_update date;

do $$
declare
  duplicate_value text;
begin
  select lower(slug)
  into duplicate_value
  from public.prop_firms
  where slug is not null
  group by lower(slug)
  having count(*) > 1
  limit 1;

  if duplicate_value is not null then
    raise exception 'Cannot create prop_firms lower(slug) unique index; duplicate public.prop_firms.slug exists: %', duplicate_value;
  end if;

  select lower(name)
  into duplicate_value
  from public.prop_firms
  where name is not null
  group by lower(name)
  having count(*) > 1
  limit 1;

  if duplicate_value is not null then
    raise exception 'Cannot create prop_firms lower(name) unique index; duplicate public.prop_firms.name exists: %', duplicate_value;
  end if;
end
$$;

create unique index if not exists prop_firms_lower_slug_unique
  on public.prop_firms(lower(slug));

create unique index if not exists prop_firms_lower_name_unique
  on public.prop_firms(lower(name));

create index if not exists prop_firms_public_status_idx
  on public.prop_firms(status, content_status, featured, trust_score desc);

alter table public.prop_firms enable row level security;

drop policy if exists "Anyone can read active prop firms" on public.prop_firms;
drop policy if exists "Public reads published active prop firms" on public.prop_firms;
create policy "Public reads published active prop firms"
  on public.prop_firms for select
  to anon, authenticated
  using (status = 'active' and content_status = 'published');

drop policy if exists "Admins manage prop firms" on public.prop_firms;
create policy "Admins manage prop firms"
  on public.prop_firms for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

alter table public.prop_firm_challenges
  add column if not exists is_active boolean not null default true,
  add column if not exists platforms text[] not null default '{}',
  add column if not exists payout_details jsonb not null default '{}'::jsonb,
  add column if not exists restrictions jsonb not null default '{}'::jsonb,
  add column if not exists fee_notes text,
  add column if not exists status text not null default 'active',
  add column if not exists content_status public.content_status not null default 'draft',
  add column if not exists verification_status text not null default 'unverified',
  add column if not exists public_source_name text;

create index if not exists prop_firm_challenges_public_status_idx
  on public.prop_firm_challenges(prop_firm_id, is_active, content_status);

alter table public.prop_firm_challenges enable row level security;

drop policy if exists "Anyone can read active prop firm challenges" on public.prop_firm_challenges;
drop policy if exists "Public reads published active prop firm challenges" on public.prop_firm_challenges;
create policy "Public reads published active prop firm challenges"
  on public.prop_firm_challenges for select
  to anon, authenticated
  using (is_active = true and content_status = 'published');

drop policy if exists "Admins manage prop firm challenges" on public.prop_firm_challenges;
create policy "Admins manage prop firm challenges"
  on public.prop_firm_challenges for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

create table if not exists public.prop_firm_rule_details (
  id uuid primary key default gen_random_uuid(),
  prop_firm_id uuid not null references public.prop_firms(id) on delete cascade,
  category text not null,
  title text not null,
  current_value text not null,
  previous_value text,
  impact_level text not null default 'medium' check (impact_level in ('low', 'medium', 'high')),
  rule_key text,
  source_url text,
  effective_at timestamptz,
  status text not null default 'active',
  content_status public.content_status not null default 'draft',
  verification_status text not null default 'unverified',
  public_source_name text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prop_firm_rule_details_firm_category_idx
  on public.prop_firm_rule_details(prop_firm_id, category);

create index if not exists prop_firm_rule_details_public_status_idx
  on public.prop_firm_rule_details(prop_firm_id, status, content_status);

alter table public.prop_firm_rule_details enable row level security;

drop trigger if exists set_prop_firm_rule_details_updated_at on public.prop_firm_rule_details;
create trigger set_prop_firm_rule_details_updated_at
  before update on public.prop_firm_rule_details
  for each row
  execute function public.set_updated_at();

drop policy if exists "Public reads published active prop firm rule details" on public.prop_firm_rule_details;
create policy "Public reads published active prop firm rule details"
  on public.prop_firm_rule_details for select
  to anon, authenticated
  using (status = 'active' and content_status = 'published');

drop policy if exists "Admins manage prop firm rule details" on public.prop_firm_rule_details;
create policy "Admins manage prop firm rule details"
  on public.prop_firm_rule_details for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

alter table public.brokers
  add column if not exists website_url text,
  add column if not exists source_url text,
  add column if not exists headquarters_country text,
  add column if not exists description text,
  add column if not exists supported_countries text[] not null default '{}',
  add column if not exists trust_score numeric(5,2),
  add column if not exists is_verified boolean not null default false,
  add column if not exists status text not null default 'active',
  add column if not exists funding_methods text[] not null default '{}',
  add column if not exists withdrawal_methods text[] not null default '{}',
  add column if not exists spread_summary text,
  add column if not exists commission_summary text,
  add column if not exists swap_summary text,
  add column if not exists confidence_score_details jsonb not null default '{}'::jsonb,
  add column if not exists verification_status text not null default 'unverified',
  add column if not exists public_source_name text,
  add column if not exists content_status public.content_status not null default 'draft',
  add column if not exists published_at timestamptz;

do $$
declare
  duplicate_value text;
begin
  select lower(slug)
  into duplicate_value
  from public.brokers
  where slug is not null
  group by lower(slug)
  having count(*) > 1
  limit 1;

  if duplicate_value is not null then
    raise exception 'Cannot create brokers lower(slug) unique index; duplicate public.brokers.slug exists: %', duplicate_value;
  end if;

  select lower(name)
  into duplicate_value
  from public.brokers
  where name is not null
  group by lower(name)
  having count(*) > 1
  limit 1;

  if duplicate_value is not null then
    raise exception 'Cannot create brokers lower(name) unique index; duplicate public.brokers.name exists: %', duplicate_value;
  end if;
end
$$;

create unique index if not exists brokers_lower_slug_unique
  on public.brokers(lower(slug));

create unique index if not exists brokers_lower_name_unique
  on public.brokers(lower(name));

create index if not exists brokers_public_status_idx
  on public.brokers(status, content_status, trust_score desc, last_verified_at desc);

alter table public.brokers enable row level security;

drop policy if exists "Public reads published brokers" on public.brokers;
create policy "Public reads published active brokers"
  on public.brokers for select
  to anon, authenticated
  using (status = 'active' and content_status = 'published');

drop policy if exists "Admins manage broker and workflow data" on public.brokers;
drop policy if exists "Admins manage brokers" on public.brokers;
create policy "Admins manage brokers"
  on public.brokers for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

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

alter table public.broker_accounts
  add column if not exists commission text,
  add column if not exists spread_model text,
  add column if not exists leverage text,
  add column if not exists public_source_name text,
  add column if not exists content_status public.content_status not null default 'draft';

create table if not exists public.broker_instruments (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references public.brokers(id) on delete cascade,
  symbol text not null,
  display_name text not null,
  asset_class text not null,
  average_spread_pips numeric(12,4),
  minimum_spread_pips numeric(12,4),
  commission text,
  swap_long text,
  swap_short text,
  max_leverage text,
  public_source_name text,
  last_verified_at timestamptz,
  content_status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (broker_id, symbol)
);

alter table public.broker_instruments
  add column if not exists display_name text,
  add column if not exists asset_class text,
  add column if not exists average_spread_pips numeric(12,4),
  add column if not exists minimum_spread_pips numeric(12,4),
  add column if not exists commission text,
  add column if not exists swap_long text,
  add column if not exists swap_short text,
  add column if not exists max_leverage text,
  add column if not exists public_source_name text,
  add column if not exists last_verified_at timestamptz,
  add column if not exists content_status public.content_status not null default 'draft',
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.broker_regulations (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references public.brokers(id) on delete cascade,
  regulator text not null,
  license_number text,
  country text,
  entity_name text,
  license_status text,
  verification_link text,
  negative_balance_protection boolean not null default false,
  segregated_client_funds boolean not null default false,
  public_source_name text,
  last_verified_at timestamptz,
  content_status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.broker_regulations
  add column if not exists regulator text,
  add column if not exists license_number text,
  add column if not exists country text,
  add column if not exists entity_name text,
  add column if not exists license_status text,
  add column if not exists verification_link text,
  add column if not exists negative_balance_protection boolean not null default false,
  add column if not exists segregated_client_funds boolean not null default false,
  add column if not exists public_source_name text,
  add column if not exists content_status public.content_status not null default 'draft';

create index if not exists broker_accounts_broker_idx on public.broker_accounts(broker_id);
create index if not exists broker_instruments_symbol_idx on public.broker_instruments(symbol);
create index if not exists broker_regulations_broker_idx on public.broker_regulations(broker_id);

alter table public.broker_accounts enable row level security;
alter table public.broker_instruments enable row level security;
alter table public.broker_regulations enable row level security;

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

drop policy if exists "Admins manage broker accounts" on public.broker_accounts;
create policy "Admins manage broker accounts"
  on public.broker_accounts for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage broker instruments" on public.broker_instruments;
create policy "Admins manage broker instruments"
  on public.broker_instruments for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage broker regulations" on public.broker_regulations;
create policy "Admins manage broker regulations"
  on public.broker_regulations for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

drop trigger if exists set_broker_accounts_updated_at on public.broker_accounts;
create trigger set_broker_accounts_updated_at
  before update on public.broker_accounts
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_broker_instruments_updated_at on public.broker_instruments;
create trigger set_broker_instruments_updated_at
  before update on public.broker_instruments
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_broker_regulations_updated_at on public.broker_regulations;
create trigger set_broker_regulations_updated_at
  before update on public.broker_regulations
  for each row
  execute function public.set_updated_at();

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  firm_id uuid references public.prop_firms(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  firm_id uuid references public.prop_firms(id) on delete set null,
  type public."AlertType" not null,
  title text not null,
  message text not null,
  trigger_config jsonb,
  enabled boolean not null default true,
  last_triggered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan text not null,
  status public."SubscriptionStatus" not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.instruments (
  id uuid primary key default gen_random_uuid(),
  symbol text not null unique,
  name text not null,
  category public."InstrumentCategory" not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spread_records (
  id uuid primary key default gen_random_uuid(),
  instrument_id uuid not null references public.instruments(id) on delete cascade,
  broker_or_firm text not null,
  bid numeric,
  ask numeric,
  spread_pips numeric not null,
  session public."TradingSession",
  recorded_at timestamptz not null default now()
);

create table if not exists public.news_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  source_name text,
  source_url text,
  affected_firms text[] not null default '{}',
  affected_symbols text[] not null default '{}',
  impact_level public."ImpactLevel" not null default 'MEDIUM',
  published_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);
create index if not exists alerts_user_enabled_idx on public.alerts(user_id, enabled);
create index if not exists subscriptions_user_idx on public.subscriptions(user_id);
create index if not exists spread_records_instrument_recorded_idx on public.spread_records(instrument_id, recorded_at desc);
create index if not exists spread_records_broker_or_firm_idx on public.spread_records(broker_or_firm);
create index if not exists news_events_published_idx on public.news_events(published_at desc);

alter table public.audit_logs enable row level security;
alter table public.alerts enable row level security;
alter table public.subscriptions enable row level security;
alter table public.instruments enable row level security;
alter table public.spread_records enable row level security;
alter table public.news_events enable row level security;

drop policy if exists "Admins read audit logs" on public.audit_logs;
create policy "Admins read audit logs"
  on public.audit_logs for select
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

drop policy if exists "Users manage own alerts" on public.alerts;
create policy "Users manage own alerts"
  on public.alerts for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users read own subscriptions" on public.subscriptions;
create policy "Users read own subscriptions"
  on public.subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Public reads instruments" on public.instruments;
create policy "Public reads instruments"
  on public.instruments for select
  to anon, authenticated
  using (true);

drop policy if exists "Public reads spread records" on public.spread_records;
create policy "Public reads spread records"
  on public.spread_records for select
  to anon, authenticated
  using (true);

drop policy if exists "Public reads news events" on public.news_events;
create policy "Public reads news events"
  on public.news_events for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins manage subscriptions" on public.subscriptions;
create policy "Admins manage subscriptions"
  on public.subscriptions for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin')));

drop policy if exists "Admins manage spread instruments" on public.instruments;
create policy "Admins manage spread instruments"
  on public.instruments for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage spread records" on public.spread_records;
create policy "Admins manage spread records"
  on public.spread_records for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

drop policy if exists "Admins manage news events" on public.news_events;
create policy "Admins manage news events"
  on public.news_events for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

drop trigger if exists set_alerts_updated_at on public.alerts;
create trigger set_alerts_updated_at
  before update on public.alerts
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_instruments_updated_at on public.instruments;
create trigger set_instruments_updated_at
  before update on public.instruments
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_news_events_updated_at on public.news_events;
create trigger set_news_events_updated_at
  before update on public.news_events
  for each row
  execute function public.set_updated_at();

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null,
  entity_slug text not null,
  title text not null,
  href text not null,
  created_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_slug)
);

create table if not exists public.recently_viewed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null,
  entity_slug text,
  title text not null,
  href text not null,
  viewed_at timestamptz not null default now(),
  unique (user_id, href)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  notification_type text not null default 'system',
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.information_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references auth.users(id) on delete set null,
  reported_page text not null,
  reported_company text,
  category text not null,
  explanation text not null,
  supporting_url text,
  evidence text,
  status text not null default 'new',
  assigned_admin uuid references auth.users(id) on delete set null,
  resolution_notes text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.saved_comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  comparison_type text not null default 'prop_firm',
  entity_slugs text[] not null default '{}',
  notes text,
  filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null default 'prop_firm',
  entity_slug text not null,
  title text,
  href text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_slug)
);

create index if not exists bookmarks_user_created_idx on public.bookmarks(user_id, created_at desc);
create index if not exists recently_viewed_user_viewed_idx on public.recently_viewed(user_id, viewed_at desc);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
create index if not exists information_reports_status_created_idx on public.information_reports(status, created_at desc);
create index if not exists saved_comparisons_user_created_idx on public.saved_comparisons(user_id, created_at desc);
create index if not exists watchlists_user_created_idx on public.watchlists(user_id, created_at desc);

alter table public.bookmarks enable row level security;
alter table public.recently_viewed enable row level security;
alter table public.notifications enable row level security;
alter table public.information_reports enable row level security;
alter table public.saved_comparisons enable row level security;
alter table public.watchlists enable row level security;

drop policy if exists "Users manage own bookmarks" on public.bookmarks;
create policy "Users manage own bookmarks"
  on public.bookmarks for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own recently viewed" on public.recently_viewed;
create policy "Users manage own recently viewed"
  on public.recently_viewed for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own notifications" on public.notifications;
create policy "Users manage own notifications"
  on public.notifications for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users create information reports" on public.information_reports;
create policy "Users create information reports"
  on public.information_reports for insert
  to authenticated
  with check (auth.uid() = reporter_user_id);

drop policy if exists "Admins manage information reports" on public.information_reports;
create policy "Admins manage information reports"
  on public.information_reports for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and lower(account_role) in ('admin', 'super_admin', 'editor')));

drop policy if exists "Users manage own saved comparisons" on public.saved_comparisons;
create policy "Users manage own saved comparisons"
  on public.saved_comparisons for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own watchlists" on public.watchlists;
create policy "Users manage own watchlists"
  on public.watchlists for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists set_saved_comparisons_updated_at on public.saved_comparisons;
create trigger set_saved_comparisons_updated_at
  before update on public.saved_comparisons
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_watchlists_updated_at on public.watchlists;
create trigger set_watchlists_updated_at
  before update on public.watchlists
  for each row
  execute function public.set_updated_at();
