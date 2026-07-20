-- Generic account watchlists for signed-in persistence.
--
-- Safety notes:
-- - Additive-only.
-- - Does not touch or migrate production rows from legacy tables.
-- - RLS restricts users to their own records.

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('prop_firm', 'broker', 'news', 'article')),
  entity_slug text not null,
  title text,
  href text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_slug)
);

create index if not exists watchlists_user_created_idx
  on public.watchlists(user_id, created_at desc);

alter table public.watchlists enable row level security;

drop policy if exists "Users manage own watchlists" on public.watchlists;
create policy "Users manage own watchlists"
  on public.watchlists for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists set_watchlists_updated_at on public.watchlists;
create trigger set_watchlists_updated_at
  before update on public.watchlists
  for each row
  execute function public.set_updated_at();
