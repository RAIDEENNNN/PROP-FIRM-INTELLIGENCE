# FundedScope Implementation Roadmap

For a more precise day-by-day launch plan, see [mvp-timeline.md](/docs/mvp-timeline.md).

## Phase 1 — Production foundation

- Install dependencies and verify both workspaces build.
- Connect PostgreSQL with Prisma migrations.
- Seed initial prop firm, account, rule, instrument and news data.
- Implement auth:
  - sign up
  - sign in
  - refresh token rotation
  - logout
  - email verification
  - password reset
- Add protected routes for dashboard, profile, settings, alerts, journal and admin.

## Phase 2 — Core intelligence

- Replace static frontend data with API calls.
- Build real prop firm search:
  - fuzzy search by name
  - filters by challenge type, fee, payout speed, drawdown, country, market and score
  - sorting by score, rating, payout frequency and price
- Build compare-any-five workflow.
- Add firm profile SEO pages from database slugs.
- Add rule-change history and admin-controlled rule updates.
- Add verified reviews and payout proof moderation.

## Phase 3 — Trader dashboard

- Save firms to watchlist.
- Create policy/spread/news/payout alerts.
- Track challenges and funded accounts.
- Show progress to payout, drawdown buffer and profit target analytics.
- Store calculator results against a user profile.

## Phase 4 — Monetization

- Add affiliate link routing and click tracking.
- Add featured firm listing placements.
- Add Stripe Pro subscription checkout, billing portal and webhooks.
- Add sponsorship/reporting tools.
- Add API access tier for business users.

## Phase 5 — Advanced intelligence

- AI-powered firm recommendation engine based on trader profile.
- Live rule-change monitoring from firm websites and admin review queue.
- Live spread ingestion from approved data providers.
- News radar ingestion from trusted feeds.
- Weekly market/prop firm intelligence reports.

## Deployment plan

- Frontend: Vercel.
- API: Render, Railway, Fly.io or AWS ECS/App Runner.
- Database: Supabase, Neon, Railway Postgres or AWS RDS.
- Secrets: platform environment variables, never committed.
- Monitoring: API health check, error logging, uptime checks and database backups.
