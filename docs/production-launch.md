# FundedScope Production Launch Checklist

## 1. Database

Production database is Supabase project `myfundedscope-production`.

The first production tables were already created manually in the Supabase SQL Editor:

- `public.profiles`
- `public.prop_firms`
- `public.prop_firm_challenges`
- `public.prop_firm_rules`

Their baseline SQL is now documented in Git at:

```text
supabase/migrations/001_create_profiles.sql
supabase/migrations/002_create_prop_firms.sql
supabase/migrations/003_create_prop_firm_challenges.sql
supabase/migrations/004_create_prop_firm_rules.sql
```

Do not rerun these baseline migrations against production unless intentionally rebuilding or repairing the database. Future database changes should be written first as new files inside `supabase/migrations/`, reviewed, then applied.

Set:

```bash
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
SUPABASE_PUBLISHABLE_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```

Frontend-safe Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in the frontend. Keep it backend-only.

Then run:

```bash
npm run prisma:generate
npx prisma migrate deploy
npm run db:seed
```

For local development, use `npm run prisma:migrate`. For production, use `npx prisma migrate deploy` so the Trading DNA profile migration runs safely against the hosted database.

If using the raw SQL Supabase migrations instead of Prisma for a table, enable RLS explicitly in that SQL file. Do not paste migration SQL into `server.js`, `app.js`, route handlers or frontend components.

To create the first admin user during seed, set:

```bash
ADMIN_EMAIL="admin@myfundedscope.com"
ADMIN_PASSWORD="use-a-real-strong-password"
```

## 2. API hosting

Deploy `apps/api` to Render, Railway, Fly.io, AWS App Runner or ECS.

Required API env:

```bash
DATABASE_URL=""
JWT_ACCESS_SECRET=""
JWT_REFRESH_SECRET=""
SUPABASE_URL=""
SUPABASE_PUBLISHABLE_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
FRONTEND_URL="https://myfundedscope.com"
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
EMAIL_FROM="FundedScope <hello@myfundedscope.com>"
```

Generate JWT secrets with at least 32 random characters each.

## 3. Frontend hosting

Deploy the Next.js app to Netlify or Vercel.

Netlify uses:

```bash
npm run build:web
```

Set:

```bash
NEXT_PUBLIC_SITE_URL="https://myfundedscope.com"
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""
API_URL="https://YOUR_DEPLOYED_API_DOMAIN/api"
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
NEXT_PUBLIC_CLARITY_PROJECT_ID=""
NEXT_PUBLIC_BRAND_SAME_AS="https://x.com/MyFundedScope,https://www.linkedin.com/company/myfundedscope"
```

`API_URL` is required for signup, signin and My Trading DNA profile saving. This is a server-side Next.js variable, not a browser variable. It must include `/api`, for example `https://api.myfundedscope.com/api`. If it is missing, the frontend will load, but account/database features will show a clear temporary connection-error message.

After adding or changing `API_URL` in Netlify, trigger a fresh frontend deployment. Next.js reads this value during the deployed server/runtime environment, so the live site will keep showing the connection warning until the environment variable exists on Netlify.

After reserving official MyFundedScope social profiles, add all real URLs to `NEXT_PUBLIC_BRAND_SAME_AS`. Do not add fake or unclaimed profiles; Google uses this field to connect the brand entity.

## 4. Stripe

Create Stripe products for:

- Pro membership
- Featured firm listings
- Business/API access
- Reports/analytics

Add:

```bash
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

The billing routes are ready:

- `POST /api/billing/checkout`
- `POST /api/billing/portal`
- `POST /api/billing/webhook`

## 5. Live data providers

Add keys as accounts are created:

```bash
TWELVE_DATA_API_KEY=""
POLYGON_API_KEY=""
DERIV_APP_ID=""
GNEWS_API_KEY=""
NEWS_API_KEY=""
BINANCE_MARKET_DATA_ENABLED="true"
```

FundedScope is already structured with source health and live-data routes:

- `/sources`
- `/api/live/source-health`
- `/api/live/news`
- `/api/live/spreads`

## 6. Email

Recommended providers:

- Resend
- Postmark
- SendGrid

Needed for:

- email verification
- password reset
- alerts
- payout/rule-change notifications

## 7. Before public marketing

- Finalize Privacy, Terms, Affiliate Disclosure and Editorial Policy.
- Add analytics.
- Test auth and checkout in production.
- Test signup → signin → My Trading DNA save against the hosted database.
- Submit sitemap to Google Search Console.
- Request indexing for `/about`, `/articles`, and the four launch articles after deployment.
- Reserve official `@MyFundedScope` profiles on X, LinkedIn, YouTube, TikTok and Instagram.
- Confirm mobile navigation and spread matrix usability.
- Manually verify firm data before heavy SEO traffic.
