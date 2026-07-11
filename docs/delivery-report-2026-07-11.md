# FundedScope Persistence, Security and Reliability Milestone — 2026-07-11

## Completed locally

### Supabase integration

- Frontend sign-up, sign-in and password reset now use Supabase Auth directly.
- Sign-up sends Trading DNA profile metadata to Supabase Auth.
- If Supabase returns an immediate session, the frontend upserts `public.profiles`.
- API auth middleware now accepts Supabase access tokens when `SUPABASE_JWT_SECRET` is configured.
- API role enforcement reads the server-side Supabase `profiles.role` and maps it to backend roles.

### Migrations created

- `supabase/migrations/005_create_user_persistence_and_reports.sql`
  - Adds profile role/email verification metadata.
  - Adds `auth.users` profile creation trigger.
  - Adds:
    - `bookmarks`
    - `recently_viewed`
    - `notifications`
    - `information_reports`
  - Enables RLS and user/admin policies.

- `supabase/migrations/006_create_availability_brokers_and_workflow.sql`
  - Adds content workflow status support.
  - Adds verification metadata to existing prop firm tables.
  - Adds:
    - `prop_firm_rule_history`
    - `brokers`
    - `broker_accounts`
    - `broker_instruments`
    - `broker_regulations`
    - `broker_spread_history`
    - `country_availability`
    - `internal_research_notes`
  - Enables RLS and separates admin-only research/scoring notes from public availability rows.

### API routes connected

- `GET /api/health`
- `GET /api/persistence/bookmarks`
- `POST /api/persistence/bookmarks`
- `DELETE /api/persistence/bookmarks/:entityType/:entitySlug`
- `GET /api/persistence/recently-viewed`
- `POST /api/persistence/recently-viewed`
- `GET /api/persistence/notifications`
- `PATCH /api/persistence/notifications/:id/read`
- `POST /api/persistence/information-reports`
- `GET /api/admin/reports`
- `PATCH /api/admin/reports/:id`
- `GET /api/admin/content-states`

### Browser-only persistence replaced where practical

- Bookmark button now writes to the API for signed-in users when `NEXT_PUBLIC_API_URL` is configured.
- Recently viewed tracker now writes to the API for signed-in users when `NEXT_PUBLIC_API_URL` is configured.
- Notification bell now reads from the API when configured and falls back to honest launch notices.
- Report page now submits to a moderation queue instead of only opening email.

### Public/internal separation

- Public firm and compare API responses now return explicit public DTOs.
- Public API responses no longer include raw database IDs by default.
- Public firm/rule responses omit private source/admin fields.
- Admin reports endpoint is protected behind authenticated admin role.
- Internal notes and scoring overrides are modeled in `internal_research_notes`, which is admin-only by RLS.

### Decision Engine integrity

- Public wording changed from “best” style certainty to “Options worth researching based on your preferences.”
- Outputs now include:
  - match reasoning
  - important limitations
  - country availability warning
  - last verified / verification status where available
  - data completeness warning
- The engine no longer implies guaranteed outcomes or financial advice.

### Security and reliability

- Express CORS only permits approved origins already present in `server.ts`.
- Express rate limiting is active.
- New persistence/admin routes validate input with Zod.
- User-generated strings are minimally sanitized before persistence.
- Admin routes require authenticated admin/super-admin/editor-equivalent role.
- Supabase service-role keys are not used in frontend code.

## Mock/static data status

Removed/reduced:

- Public API responses now avoid returning raw internal database objects.
- Report/bookmark/recently-viewed/notification flows no longer need browser-only storage for signed-in users.

Still present:

- Frontend prop firm, broker and comparison pages still include static launch datasets for renderability.
- Full replacement with Supabase data requires:
  1. Applying migrations to production.
  2. Seeding verified prop firm and broker records.
  3. Setting `NEXT_PUBLIC_API_URL` and `API_URL` to the deployed Express API.
  4. Updating frontend server components to fetch from the API/Supabase instead of local arrays.

## Tests performed

- `npm run build:api` — passed.
- `npm run build:web` — passed.
- `npm run typecheck` — passed.

## Known limitations

- I could not apply migrations to production Supabase because production database credentials/service access were not available in this runtime.
- I could not verify Supabase email delivery, email confirmation links, or password reset delivery without the live Supabase project Auth configuration.
- I could not verify one user cannot read or edit another user in production RLS without applying the migrations and running two live Supabase users.
- The Express backend still needs a production host URL. Netlify must receive:
  - `API_URL`
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- The backend host must receive:
  - `DATABASE_URL`
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`
  - `SUPABASE_JWT_SECRET`
  - approved `FRONTEND_URL`

## Production deployment checklist

1. Apply `005` and `006` migrations to Supabase using Supabase CLI or SQL editor.
2. Confirm RLS policies exist on all new public tables.
3. Host the Express API.
4. Set `NEXT_PUBLIC_API_URL=https://YOUR_API_HOST/api` in Netlify.
5. Set `API_URL=https://YOUR_API_HOST/api` in Netlify for server proxy routes.
6. Redeploy Netlify.
7. Create two test users.
8. Confirm user A cannot query user B bookmarks, recently viewed rows, notifications, profile or reports.
9. Promote one test user to admin in `profiles.role`.
10. Confirm only admin can access `/api/admin/reports`.

## Screenshots

Screenshots were not captured in this milestone. The implementation was validated by build/typecheck. After production API deployment, capture:

- Sign-up flow.
- Email verification flow.
- Sign-in flow.
- Profile save flow.
- Bookmark save/remove flow.
- Report submission flow.
- Admin reports moderation queue.
- Mobile homepage, firm profile, broker page, decision engine and report form.
