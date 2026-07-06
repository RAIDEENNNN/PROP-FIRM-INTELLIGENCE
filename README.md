# FundedScope

FundedScope is being rebuilt as a premium trader intelligence platform: a dark-mode command center for comparing prop firms, monitoring rule changes, tracking spreads/news, saving alerts, calculating risk and managing funded-account progress.

This repo is now the clean full-stack restart. The old static MVP has been removed from the root.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Prisma
- Payments: Stripe-ready billing module
- Auth target: JWT access/refresh tokens with email verification and password reset

## Project structure

```txt
apps/
  web/       Next.js app, dark UI, routes and component system
  api/       Express API, modular route contracts and calculator logic
prisma/      PostgreSQL schema for users, firms, rules, spreads, alerts, reviews and billing
docs/        Product and implementation planning
```

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment file:

   ```bash
   cp .env.example .env
   ```

3. Add a PostgreSQL connection string to `.env`.

4. Generate Prisma client and run migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. Run the frontend:

   ```bash
   npm run dev
   ```

6. Run the API in a second terminal:

   ```bash
   npm run dev:api
   ```

## Deploying the frontend

Netlify should use the included [netlify.toml](/netlify.toml):

- Build command: `npm run build:web`
- Publish directory: `apps/web/.next`
- Plugin: `@netlify/plugin-nextjs`

For Vercel, set the project root directory to `apps/web`.

## Current status

The restart foundation is in place:

- Full-stack workspace at the root
- Prisma schema covering the core product data model
- API route modules for auth, users, trader profiles, firms, compare, spreads, news, alerts, reviews, billing, tools and admin
- Database-backed auth, user profile, firm search, comparison, watchlist, alerts, reviews, news and spread routes
- Stripe-ready checkout and billing portal routes
- Prisma seed for prop firms, rules, accounts, spreads, news and optional admin user
- Working calculator endpoint logic for lot size, drawdown and profit target
- Next.js dark-mode UI shell with landing, dashboard, prop firm directory/profile, compare, spreads, news, tools, pricing, auth, legal and admin pages

See [docs/production-launch.md](/docs/production-launch.md) for the deployment/key setup checklist.

## Product specification pack

- [UI wireframes](/docs/ui-wireframes.md)
- [Database ERD](/docs/database-erd.md)
- [API contract and examples](/docs/api-contract.md)
- [Scoring formulas](/docs/scoring-formulas.md)
- [Role permissions](/docs/permissions.md)
- [Precise MVP timeline](/docs/mvp-timeline.md)
- [Sample data guide](/docs/sample-data.md)
- [Testing checklist](/docs/testing-checklist.md)
- [Professional legal copy drafts](/docs/legal-copy.md)
- [Investor and business model](/docs/investor-business-model.md)
