-- FundScope Postgres/Supabase schema
-- Run this once in Supabase SQL Editor or any Postgres database.

create table if not exists app_users (
  id text primary key,
  name text not null default 'Trader',
  email text not null unique,
  password_hash text not null,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists app_sessions (
  id text primary key,
  user_id text not null references app_users(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  user_agent text
);

create index if not exists app_sessions_user_id_idx on app_sessions(user_id);
create index if not exists app_sessions_expires_at_idx on app_sessions(expires_at);

create table if not exists app_profiles (
  user_id text primary key references app_users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists app_dashboard_accounts (
  id text primary key,
  user_id text not null references app_users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_dashboard_accounts_user_id_idx on app_dashboard_accounts(user_id);

create table if not exists app_records (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

create index if not exists app_records_collection_idx on app_records(collection);
create index if not exists app_records_data_gin_idx on app_records using gin(data);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_app_profiles_updated_at on app_profiles;
create trigger set_app_profiles_updated_at
before update on app_profiles
for each row execute function set_updated_at();

drop trigger if exists set_app_dashboard_accounts_updated_at on app_dashboard_accounts;
create trigger set_app_dashboard_accounts_updated_at
before update on app_dashboard_accounts
for each row execute function set_updated_at();

drop trigger if exists set_app_records_updated_at on app_records;
create trigger set_app_records_updated_at
before update on app_records
for each row execute function set_updated_at();
