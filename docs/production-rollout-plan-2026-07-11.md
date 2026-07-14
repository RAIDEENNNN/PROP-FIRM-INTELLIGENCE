# FundedScope Production Rollout Plan — 2026-07-11

This document moves the local persistence/security milestone toward production deployment.

## Migration safety review

Reviewed files:

- `supabase/migrations/005_create_user_persistence_and_reports.sql`
- `supabase/migrations/006_create_availability_brokers_and_workflow.sql`

Confirmed:

- No `DROP TABLE`.
- No `DROP COLUMN`.
- No `TRUNCATE`.
- No unsafe bulk `DELETE`.
- Existing baseline tables are not recreated.
- Existing four production tables are only extended with `ADD COLUMN IF NOT EXISTS`.
- RLS is enabled on all new exposed tables.
- The only destructive-looking statements are idempotent policy/trigger replacements:
  - `DROP POLICY IF EXISTS ...`
  - `DROP TRIGGER IF EXISTS on_auth_user_created_create_profile ...`
  These are used so policies/triggers can be safely reapplied by migration tooling.

Local Supabase CLI execution was not completed in this runtime because npm registry access was unavailable. Production migration application must be done from a machine/session with Supabase CLI access and authenticated Supabase permissions.

## Migration 005 summary

### Existing table changes

`public.profiles`

- Adds `role text not null default 'user'`.
- Adds role check: `user`, `editor`, `admin`, `super_admin`.
- Adds `email_verified_at timestamptz`.

### Function and trigger

`public.handle_new_user_profile()`

- Creates or updates a `public.profiles` row when a Supabase Auth user is created.
- Pulls `full_name`, `username`, `country`, `timezone`, `trader_type`, `experience_level`, `markets` from Supabase Auth metadata.

`on_auth_user_created_create_profile`

- Trigger on `auth.users`.
- Runs after insert.

### New tables

`public.bookmarks`

- `id uuid primary key`
- `user_id uuid references auth.users(id) on delete cascade`
- `entity_type text`
- `entity_slug text`
- `title text`
- `href text`
- `created_at timestamptz`
- Unique: `(user_id, entity_type, entity_slug)`

`public.recently_viewed`

- `id uuid primary key`
- `user_id uuid references auth.users(id) on delete cascade`
- `entity_type text`
- `entity_slug text`
- `title text`
- `href text`
- `viewed_at timestamptz`
- Unique: `(user_id, href)`

`public.notifications`

- `id uuid primary key`
- `user_id uuid references auth.users(id) on delete cascade`
- `title text`
- `message text`
- `notification_type text`
- `href text`
- `read_at timestamptz`
- `created_at timestamptz`

`public.information_reports`

- `id uuid primary key`
- `reporter_user_id uuid references auth.users(id) on delete set null`
- `reported_page text`
- `reported_company text`
- `category text`
- `explanation text`
- `supporting_url text`
- `evidence text`
- `status text`
- `assigned_admin uuid references auth.users(id) on delete set null`
- `resolution_notes text`
- `created_at timestamptz`
- `resolved_at timestamptz`

### Migration 005 RLS policies

- Users manage only their own bookmarks.
- Users manage only their own recently viewed rows.
- Users read only their own notifications.
- Users update only their own notification read state.
- Users create reports only for themselves.
- Users read only their own reports.
- Admin/editor/super_admin profiles manage all information reports.

## Migration 006 summary

### Type

`public.content_status`

- `draft`
- `under_review`
- `published`
- `archived`

### Existing table changes

`public.prop_firms`

- Adds `content_status`.
- Adds `verification_status`.
- Adds `public_source_name`.
- Adds `last_verified_at`.

`public.prop_firm_challenges`

- Adds `content_status`.
- Adds `verification_status`.
- Adds `public_source_name`.
- Adds `last_verified_at`.

`public.prop_firm_rules`

- Adds `content_status`.
- Adds `verification_status`.
- Adds `public_source_name`.
- Adds `last_verified_at`.

### New tables

`public.prop_firm_rule_history`

- Stores previous/new rule values, change summary, public source, verification user/date, status.
- Foreign keys:
  - `prop_firm_id -> public.prop_firms(id)`
  - `rule_id -> public.prop_firm_rules(id)`
  - `verified_by -> auth.users(id)`

`public.brokers`

- Stores public broker profile metadata, trust score, source, verification status, content status.

`public.broker_accounts`

- Stores account types, minimum deposit, commission, spread model, leverage, platforms, base currencies.
- Foreign key:
  - `broker_id -> public.brokers(id)`

`public.broker_instruments`

- Stores instrument-level broker data including symbol, asset class, spread pips, commission, swaps, hours, leverage.
- Foreign key:
  - `broker_id -> public.brokers(id)`
- Unique:
  - `(broker_id, symbol)`

`public.broker_regulations`

- Stores regulator, license number, country, entity name, license status, verification link, negative balance protection, segregated funds.
- Foreign key:
  - `broker_id -> public.brokers(id)`

`public.broker_spread_history`

- Stores spread pips by symbol/session/source/recorded time.
- Foreign key:
  - `broker_id -> public.brokers(id)`

`public.country_availability`

- Stores country-specific availability for prop firms and brokers.
- Fields include country, available/restricted flags, conditions, payment methods, regulatory entity, source, last verified, status.
- Foreign keys:
  - `prop_firm_id -> public.prop_firms(id)`
  - `broker_id -> public.brokers(id)`
- Check constraint ensures each row belongs to either a prop firm or broker, not both.

`public.internal_research_notes`

- Admin-only storage for internal notes, private research URLs and scoring overrides.
- Foreign key:
  - `created_by -> auth.users(id)`

### Migration 006 RLS policies

Public read policies:

- Public reads only published brokers.
- Public reads only published broker accounts.
- Public reads only published broker instruments.
- Public reads only published broker regulations.
- Public reads only published country availability.
- Public reads only published prop firm rule history.

Admin/editor policies:

- Admin/editor/super_admin profiles manage brokers.
- Admin/editor/super_admin profiles manage broker accounts.
- Admin/editor/super_admin profiles manage broker instruments.
- Admin/editor/super_admin profiles manage broker regulations.
- Admin/editor/super_admin profiles manage broker spread history.
- Admin/editor/super_admin profiles manage country availability.
- Admin/editor/super_admin profiles manage rule history.

Admin-only policies:

- Only admin/super_admin profiles manage internal research notes.

## JWT verification update

The backend now supports both:

1. Supabase JWKS/asymmetric verification via:
   - `SUPABASE_JWKS_URL`
   - `SUPABASE_JWT_ISSUER`

2. Legacy shared-secret verification via:
   - `SUPABASE_JWT_SECRET`

Recommended production posture:

- Prefer JWKS/asymmetric verification when the Supabase project is using asymmetric signing keys.
- Keep `SUPABASE_JWT_SECRET` only as a transition fallback if the project is still on legacy HS256 tokens.
- Do not expose either private JWT secret or service-role key to frontend code.

## Production deployment order

1. Backup/export production Supabase schema before applying migrations.
2. Confirm the production project is linked correctly:
   - Project ref must match the intended production Supabase project.
3. Apply pending migrations using Supabase CLI:
   - `npx supabase login`
   - `npx supabase link --project-ref <PROJECT_REF>`
   - `npx supabase db push`
4. Deploy the Express backend to Railway using the confirmed monorepo configuration:
   - Root Directory: `/`
   - Build command: `npm install && npm run build:api`
   - Start command: `npm run start:api`
   - Health-check path: `/api/health`
   The API listens on `process.env.PORT` and binds to `0.0.0.0`.
5. Verify live backend health:
   - `GET /api/health`
   - Expected response: `{ "status": "ok", "service": "myfundedscope-api" }`
6. Configure backend environment variables by name:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_JWKS_URL` or `SUPABASE_JWT_SECRET`
   - `SUPABASE_JWT_ISSUER` if using JWKS
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `FRONTEND_URL`
7. Configure Netlify environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
8. Redeploy Netlify.
9. Run production user/RLS/admin tests.

## Required production tests

Create:

- User A.
- User B.
- Admin user.

Verify:

- User A cannot read User B bookmarks.
- User A cannot write User B bookmarks.
- User A cannot read User B recently viewed rows.
- User A cannot read User B notifications.
- User A cannot read User B reports.
- User A cannot edit User B profile.
- Normal user cannot access `/api/admin/reports`.
- Admin user can access `/api/admin/reports`.
- Admin user can assign/resolve a report.
- Logout clears protected access.
- Browser refresh preserves the authenticated Supabase session.
- Clearing local storage does not delete database-persisted bookmarks/reports/profile data.

## Completion report required after production rollout

Do not include secret values.

Report:

- Migrations applied.
- Backend URL.
- Health-check result.
- Environment variables configured by name only.
- Authentication flows tested.
- RLS tests performed.
- Admin tests performed.
- Remaining limitations.
