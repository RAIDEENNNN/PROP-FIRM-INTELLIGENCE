-- User persistence and moderation workflow.
-- Apply after the baseline profiles/prop firm tables exist.

alter table public.profiles
  add column if not exists role text not null default 'user'
    check (role in ('user', 'editor', 'admin', 'super_admin')),
  add column if not exists email_verified_at timestamptz;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    username,
    country,
    timezone,
    trader_type,
    experience_level,
    markets,
    email_verified_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'timezone',
    new.raw_user_meta_data->>'trader_type',
    new.raw_user_meta_data->>'experience_level',
    coalesce(array(select jsonb_array_elements_text(new.raw_user_meta_data->'markets')), '{}'),
    case when new.email_confirmed_at is null then null else new.email_confirmed_at end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    username = coalesce(public.profiles.username, excluded.username),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('prop_firm', 'broker', 'news', 'article')),
  entity_slug text not null,
  title text not null,
  href text not null,
  created_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_slug)
);

create table if not exists public.recently_viewed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('prop_firm', 'broker', 'news', 'article', 'page')),
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
  category text not null check (category in ('prop_firm', 'broker', 'spread', 'rule', 'payout', 'review', 'availability', 'other')),
  explanation text not null,
  supporting_url text,
  evidence text,
  status text not null default 'new' check (status in ('new', 'under_review', 'resolved', 'rejected', 'archived')),
  assigned_admin uuid references auth.users(id) on delete set null,
  resolution_notes text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists bookmarks_user_created_idx on public.bookmarks(user_id, created_at desc);
create index if not exists recently_viewed_user_viewed_idx on public.recently_viewed(user_id, viewed_at desc);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
create index if not exists information_reports_status_created_idx on public.information_reports(status, created_at desc);

alter table public.bookmarks enable row level security;
alter table public.recently_viewed enable row level security;
alter table public.notifications enable row level security;
alter table public.information_reports enable row level security;

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

drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users update own notification reads" on public.notifications;
create policy "Users update own notification reads"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users create own information reports" on public.information_reports;
create policy "Users create own information reports"
  on public.information_reports for insert
  to authenticated
  with check (auth.uid() = reporter_user_id);

drop policy if exists "Users read own information reports" on public.information_reports;
create policy "Users read own information reports"
  on public.information_reports for select
  to authenticated
  using (auth.uid() = reporter_user_id);

drop policy if exists "Admins manage information reports" on public.information_reports;
create policy "Admins manage information reports"
  on public.information_reports for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin', 'editor')));
