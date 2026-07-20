# Prisma to Supabase Mapping Audit

Date: 2026-07-20

## Decision

Supabase snake_case tables are the canonical production tables. Prisma model names are now mapped to those tables with `@@map` and field-level `@map` instead of allowing Prisma to target PascalCase tables.

The old local-password backend auth flow has been retired from the API. Supabase Auth owns login accounts, and `public.profiles` owns application user/profile data.

## Canonical Tables Mapped

- `profiles`
- `prop_firms`
- `prop_firm_challenges`
- `prop_firm_rules`
- `brokers`
- `broker_accounts`
- `broker_instruments`
- `broker_regulations`
- `broker_spread_history`
- `country_availability`
- `internal_research_notes`
- `bookmarks`
- `recently_viewed`
- `notifications`
- `information_reports`
- `saved_comparisons`
- `watchlists`

## Legacy Models Mapped To Snake Case

These Prisma models are mapped to snake_case names so Prisma will not attempt to create PascalCase tables, but their tables are not fully covered by the current Supabase migrations:

- `alerts`
- `reviews`
- `subscriptions`
- `kyc_verifications`
- `audit_logs`
- `journal_entries`
- `saved_tool_results`
- `instruments`
- `spread_records`
- `news_events`

Before relying on these in production, either verify they already exist in Supabase or add additive migrations for them.

## Important Compatibility Notes

- `profiles.email` is not unique in the current SQL migrations. The API no longer uses email as a Prisma unique key.
- `profiles` combines account display data and Trading DNA data. Prisma now has one active model mapped to `profiles`; the previous separate `TraderProfile` model was removed to avoid duplicate table mapping.
- Existing Supabase migrations use lowercase text values for several checked fields, such as profile role and prop-firm rule impact level. Seed data was adjusted to avoid writing uppercase rule-impact values.
- Prisma `DIRECT_URL` is not configured in `schema.prisma` yet because the local `.env` does not have a real `DIRECT_URL`. Add it after the real Supabase direct connection string is available.

## Migration 007 Status

Migration `007_complete_database_persistence_layer.sql` remains additive, with RLS policy replacement and publication backfill for rows that were already public under the older `status = 'active'` policy.

It now includes duplicate preflight checks before adding lower-case unique indexes for:

- `prop_firms.lower(slug)`
- `prop_firms.lower(name)`
- `brokers.lower(slug)`
- `brokers.lower(name)`

Migration 007 is safe to apply only after the preflight duplicate checks pass against production. Back up the database first and do not run it blindly.

## Existing Users

Migration 005 already creates the `auth.users` to `public.profiles` trigger. For existing Supabase Auth users without a profile, run a reviewed one-time backfill after connecting to the real database:

```sql
insert into public.profiles (id, email, full_name, email_verified_at)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
  email_confirmed_at
from auth.users
on conflict (id) do nothing;
```
