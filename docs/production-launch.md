# FundedScope Production Launch Checklist

## 1. Database

Create a PostgreSQL database on Supabase, Neon, Railway or AWS RDS.

Set:

```bash
DATABASE_URL="postgresql://..."
```

Then run:

```bash
npm run prisma:generate
npx prisma migrate deploy
npm run db:seed
```

For local development, use `npm run prisma:migrate`. For production, use `npx prisma migrate deploy` so the Trading DNA profile migration runs safely against the hosted database.

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
API_URL="https://YOUR_DEPLOYED_API_DOMAIN/api"
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
NEXT_PUBLIC_CLARITY_PROJECT_ID=""
```

`API_URL` is required for signup, signin and My Trading DNA profile saving. If it is missing, the frontend will load, but account/database features will show a clear backend-not-configured message.

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
- Confirm mobile navigation and spread matrix usability.
- Manually verify firm data before heavy SEO traffic.
