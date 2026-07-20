# Railway API Deployment — FundedScope

Recommended setup:

- Netlify continues hosting the Next.js frontend.
- Railway hosts only the Express API.
- Supabase remains the production database and authentication provider.
- Do not create a second Railway database for this project.

## Confirmed API runtime configuration

The API is Railway-compatible:

- Entry point: `apps/api/src/server.ts`
- Production build script: `npm run build:api`
- Production start script from repo root: `npm run start:api`
- API package start script: `node dist/server.js`
- Health-check path: `/health`
- Port: `process.env.PORT`
- Host binding: `0.0.0.0`

Expected health response:

```json
{
  "status": "ok",
  "environment": "production",
  "version": "0.1.0",
  "database": "ok",
  "timestamp": "2026-07-20T00:00:00.000Z"
}
```

## Railway monorepo configuration

Use the repository root so workspace scripts and shared root dependencies resolve correctly.

```text
Root Directory: /
Build command: npm run prisma:generate && npm run build:api
Start command: npm run start:api
Health-check path: /health
```

Alternative if Railway installs dependencies automatically:

```text
Root Directory: /
Build command: npm run build:api
Start command: npm run start:api
Health-check path: /health
```

Do not set Root Directory to `/apps/api` unless the deployment has been tested with workspace dependency resolution from that directory.

## Required Railway variables

Configure these in Railway service variables. Do not commit values to GitHub.

```env
NODE_ENV="production"

DATABASE_URL=""
DIRECT_URL=""
API_VERSION="0.1.0"

JWT_ACCESS_SECRET=""
JWT_REFRESH_SECRET=""

SUPABASE_URL=""
SUPABASE_PUBLISHABLE_KEY=""

SUPABASE_JWKS_URL=""
SUPABASE_JWT_ISSUER=""
SUPABASE_JWT_SECRET=""

FRONTEND_URL="https://myfundedscope.com"
CORS_ORIGINS="https://myfundedscope.com,https://www.myfundedscope.com"
RATE_LIMIT_WINDOW_MS="60000"
RATE_LIMIT_MAX="180"
```

Recommended:

- Prefer `SUPABASE_JWKS_URL` + `SUPABASE_JWT_ISSUER` when the Supabase project uses asymmetric signing keys.
- Keep `SUPABASE_JWT_SECRET` only as the legacy HS256 fallback.
- `JWT_ACCESS_SECRET` is optional legacy/internal-token support. Supabase JWT validation should be the production auth path.
- `JWT_REFRESH_SECRET` is legacy and is not required for the current Supabase-auth frontend flow.
- Keep `SUPABASE_SERVICE_ROLE_KEY` backend-only and add it only when a route genuinely needs privileged service-role operations.

Later variables:

```env
SUPABASE_SERVICE_ROLE_KEY=""
RESEND_API_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
TWELVE_DATA_API_KEY=""
GNEWS_API_KEY=""
```

## Supabase database URL

Use the Supabase production project connection string.

Recommended for external hosts:

- Supabase Dashboard
- Project: `myfundedscope-production`
- Connect
- Session Pooler connection string
- Replace the password placeholder
- Store full string in Railway as `DATABASE_URL`

Do not paste the database URL into chat or commit it.

## Supabase migrations

Persistence depends on:

- `supabase/migrations/005_create_user_persistence_and_reports.sql`
- `supabase/migrations/006_create_availability_brokers_and_workflow.sql`

Deployment order:

1. Confirm production backup/rollback plan.
2. Link the correct Supabase project.
3. Preview pending migrations.
4. Apply using Supabase CLI.

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Do not paste random SQL into Supabase manually unless migration tooling is unavailable and the exact same SQL is recorded in Git.

## CORS

Production CORS allows:

```text
https://myfundedscope.com
https://www.myfundedscope.com
```

Localhost is allowed only outside production.

Do not use:

```text
Access-Control-Allow-Origin: *
```

for authenticated routes.

## Connect Netlify to Railway

After Railway deploys successfully and a public domain is generated, set these in Netlify:

```env
NEXT_PUBLIC_API_URL="https://YOUR-RAILWAY-DOMAIN/api"
API_URL="https://YOUR-RAILWAY-DOMAIN/api"
```

Then trigger a new production deploy. If the old backend warning remains, use “Clear cache and deploy site.”

## Production test checklist

Create:

- User A.
- User B.
- Admin user.

Verify:

- Signup works.
- Email verification works.
- Sign-in works.
- Password reset works.
- Profile saves.
- Bookmarks survive refresh and login.
- Recently viewed persists.
- Report submission reaches admin moderation queue.
- User A cannot read User B private rows.
- Normal user cannot access admin endpoints.
- Admin can view and resolve reports.
- Live frontend no longer shows “Backend API is not configured.”

## Completion report template

Do not include secrets.

```text
Railway root directory:
Build command:
Start command:
Health-check URL:
Health-check result:
Environment variables configured by name only:
Supabase migrations applied:
Netlify API variables configured:
CORS origins confirmed:
Two-user RLS tests:
Admin authorization tests:
Known limitations:
```
