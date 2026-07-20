# FundedScope Database and Persistence Audit - 2026-07-20

## Existing Database Surfaces

Prisma currently defines application tables using default Prisma table names:

- `User`
- `TraderProfile`
- `PropFirm`
- `PropFirmAccount`
- `PropFirmRule`
- `Instrument`
- `SpreadRecord`
- `NewsEvent`
- `Watchlist`
- `Alert`
- `Review`
- `Subscription`
- `KycVerification`
- `AuditLog`
- `JournalEntry`
- `Notification`
- `SavedToolResult`

Supabase migrations currently define public snake_case tables:

- `profiles`
- `prop_firms`
- `prop_firm_challenges`
- `prop_firm_rules`
- `prop_firm_rule_history`
- `bookmarks`
- `recently_viewed`
- `notifications`
- `information_reports`
- `brokers`
- `broker_accounts`
- `broker_instruments`
- `broker_regulations`
- `broker_spread_history`
- `country_availability`
- `internal_research_notes`
- `saved_comparisons`

## Existing API Routes

- `/api/health`
- `/api/auth/*`
- `/api/users/*`
- `/api/trader-profile`
- `/api/firms/*`
- `/api/brokers/*`
- `/api/compare/*`
- `/api/spreads/*`
- `/api/news/*`
- `/api/alerts/*`
- `/api/reviews/*`
- `/api/billing/*`
- `/api/tools/*`
- `/api/persistence/*`
- `/api/admin/*`

## Why Supabase Records May Exist But Not Appear Publicly

1. Prisma and Supabase table names do not currently point to the same physical tables.
   - Prisma reads/writes default PascalCase tables such as `PropFirm`.
   - Supabase migrations create public snake_case tables such as `public.prop_firms`.
   - A record in `public.prop_firms` will not appear through a Prisma `prisma.propFirm.findMany()` query unless the API explicitly reads `public.prop_firms`.

2. Public frontend pages still use static TypeScript data for many routes.
   - Prop firm pages read from `apps/web/src/lib/data.ts`.
   - Broker pages read from `apps/web/src/lib/brokers.ts`.
   - Database records can be correct but still not render on the public frontend until those pages switch to API/database-backed data.

3. Publication filters were inconsistent.
   - Early prop-firm migrations exposed `status = 'active'`.
   - Later workflow migrations added `content_status = 'published'`.
   - Broker RLS already uses `content_status = 'published'`.
   - Migration `007_complete_database_persistence_layer.sql` aligns prop-firm public policies to require both `status = 'active'` and `content_status = 'published'`, while preserving previously public active rows by marking them published.

4. RLS policies may hide rows from anon/authenticated users.
   - Public reads only see published rows.
   - Admin access depends on `profiles.role in ('admin', 'super_admin', 'editor')`.

5. Slug and URL mismatches can prevent route lookup.
   - Admin inputs now normalize slugs.
   - New indexes protect lowercase duplicate slugs and names in Supabase public tables.

6. Environment configuration can make working code appear broken.
   - Frontend persistence requires `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_BACKEND_API_URL`.
   - Supabase browser auth requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - API Supabase JWT validation requires Supabase JWT/JWKS env vars.

## Changes Added In This Sprint

Migration `007_complete_database_persistence_layer.sql`:

- Adds missing prop-firm fields: official URL, website URL, platforms, payout details, restrictions, fee notes, confidence score details, publish timestamp.
- Adds missing challenge/rule metadata fields.
- Adds missing broker fields: official URL, source URL, countries, platforms, payment methods, deposits, spread/commission/swap summaries, publish timestamp.
- Adds `saved_comparisons`.
- Adds public/admin RLS policies for prop-firm tables and saved comparisons.
- Adds duplicate protection for lowercase slugs/names.
- Aligns public prop-firm visibility around `status = 'active'` and `content_status = 'published'`.

API:

- Added `/api/brokers`.
- Added saved comparison persistence endpoints.
- Expanded admin prop-firm CRUD against `public.prop_firms`.
- Added admin broker CRUD against `public.brokers`.
- Kept admin routes protected by `requireAuth` and `requireAdmin`.

Seed:

- Added production safety guard.
- Removed destructive delete/recreate loops for seeded accounts, rules and spreads.
- Made seed updates idempotent by matching existing records first.
- Prevented duplicate seeded news rows.

## Manual Supabase Steps Still Required

1. Apply `supabase/migrations/007_complete_database_persistence_layer.sql` in the Supabase project.
2. Confirm `profiles.role` is set to `admin`, `super_admin`, or `editor` for approved admin users.
3. Confirm existing public records have:
   - `status = 'active'`
   - `content_status = 'published'`
   - valid `slug`
   - valid official/source URLs
   - `last_verified_at`
4. Decide whether to migrate legacy Prisma `PropFirm` data into `public.prop_firms`, or remap Prisma models to the Supabase snake_case tables in a separate carefully planned migration.
5. Switch frontend public pages from static TypeScript data to API/database-backed reads when data quality is ready.
