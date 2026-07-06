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
npm run prisma:migrate
npm run db:seed
```

To create the first admin user during seed, set:

```bash
ADMIN_EMAIL="admin@fundedscope.com"
ADMIN_PASSWORD="use-a-real-strong-password"
```

## 2. API hosting

Deploy `apps/api` to Render, Railway, Fly.io, AWS App Runner or ECS.

Required API env:

```bash
DATABASE_URL=""
JWT_ACCESS_SECRET=""
JWT_REFRESH_SECRET=""
FRONTEND_URL="https://your-frontend-domain.com"
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
EMAIL_FROM="FundedScope <hello@fundedscope.com>"
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
NEXT_PUBLIC_SITE_URL="https://fundedscope.com"
```

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
- Submit sitemap to Google Search Console.
- Confirm mobile navigation and spread matrix usability.
- Manually verify firm data before heavy SEO traffic.
