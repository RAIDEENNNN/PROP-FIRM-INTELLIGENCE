# FundScope — Prop Firm Intelligence Platform

FundScope is a prop firm comparison, discount-code, giveaway, and trader dashboard platform.

## Run locally

```bash
npm start
```

Open:

```text
http://localhost:48732
```

## Backend API

- `GET /api/health`
- `GET /api/bootstrap`
- `GET /api/auth/me`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/admin/setup-status`
- `POST /api/admin/setup`
- `GET /api/admin`
- `POST /api/admin/firms`
- `PUT /api/admin/firms/:id`
- `DELETE /api/admin/firms/:id`
- `POST /api/admin/discount-codes`
- `POST /api/admin/news`
- `POST /api/admin/rule-changes`
- `POST /api/admin/alerts`
- `GET /api/profiles/me`
- `PUT /api/profiles/me`
- `GET /api/firms`
- `GET /api/firms/:id`
- `GET /api/discount-codes`
- `GET /api/giveaways`
- `POST /api/giveaway-entries`
- `GET /api/dashboard/accounts`
- `POST /api/dashboard/accounts`
- `DELETE /api/dashboard/accounts/:id`
- `POST /api/affiliate-clicks`

## Data storage

For this backend pass, data is stored server-side in:

```text
data/db.json
```

New users are stored in `users`, secure session records are stored in `sessions`, user preferences are stored in `profiles`, and dashboard accounts are stored in `dashboardAccounts` with a `userId`.

Passwords are hashed with Node crypto `scrypt`. Browsers are remembered with an `HttpOnly` `fundscope_session` cookie, not by trusting localStorage. Dashboard accounts and profiles are filtered by the signed-in user, so concurrent users do not see each other’s data.

`data/db.json` is blocked from public HTTP access by the Node server. Use the API routes instead.

By default, local development uses `data/db.json`.

For production, set `DATABASE_URL` and the app automatically switches to Postgres/Supabase.

## Supabase/Postgres setup

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Run [database/schema.sql](/database/schema.sql).
4. Copy your Postgres connection string.
5. Install dependencies:

```bash
npm install
```

6. Add environment variables:

```text
DATABASE_URL=postgresql://postgres.xxx:YOUR_PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres
ADMIN_EMAILS=you@yourdomain.com
```

7. Migrate the current JSON data into Postgres:

```bash
npm run db:migrate
```

8. Start the app:

```bash
npm start
```

Check storage mode:

```text
/api/health
```

It should return:

```json
{ "storage": "postgres" }
```

If `DATABASE_URL` is missing, it returns `storage: "json"` and keeps using the local JSON file.

## Admin setup

The admin dashboard is available at the in-app `Admin` route after sign-in.

Admin access works in two ways:

1. Set an environment variable before launch:

```text
ADMIN_EMAILS=you@yourdomain.com,partner@yourdomain.com
```

Then register/sign in with one of those emails.

2. First-owner setup:

If no admin exists yet and `ADMIN_EMAILS` is empty, sign in with the owner account and open `Admin`. The app will show a “Claim admin access” button. Use this only during initial setup, before public traffic.

Admin can manage:

- Prop firm listings
- Discount codes
- News posts
- Rule-change logs
- Alerts
- Feedback visibility and operating stats

## Production roadmap

1. Move `data/db.json` to a managed database before scaling beyond one server.
2. Expand admin CRUD to reviews, payout proofs, giveaways, and media uploads.
3. Add upload storage for payout proof screenshots.
4. Add affiliate redirect links with analytics.
5. Deploy API and static app to AWS/App Runner/Render/Fly.io with HTTPS.
6. Add email verification and password reset.
# PROP-FIRM-INTELLIGENCE
# PROP-FIRM-INTELLIGENCE
# PROP-FIRM-INTELLIGENCE
# PROP-FIRM-INTELLIGENCE
