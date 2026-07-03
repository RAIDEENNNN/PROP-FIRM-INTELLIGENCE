# AWS deployment plan

Recommended MVP AWS setup:

1. Containerize the app with the included `Dockerfile`.
2. Push the image to Amazon ECR.
3. Run it on AWS App Runner or ECS Fargate.
4. Use Route 53 for the domain.
5. Use AWS Certificate Manager for HTTPS.
6. Use a persistent App Runner/ECS volume only for MVP testing, or move storage from `data/db.json` to DynamoDB or RDS PostgreSQL before serious traffic.
7. Store payout proof files in S3.
8. Put CloudFront in front of the app when traffic grows.

## App Runner path

App Runner is the fastest AWS route for this MVP because it can run the Node backend and serve the front-end from one container.

Production environment variables to add later:

```text
PORT=3000
DATABASE_URL=postgresql://...
ADMIN_EMAILS=you@yourdomain.com
S3_BUCKET=
SESSION_SECRET=
AFFILIATE_SECRET=
```

Before deploying with `DATABASE_URL`, run [../database/schema.sql](../database/schema.sql) in Supabase/Postgres, then migrate current local data:

```bash
npm install
DATABASE_URL="postgresql://..." npm run db:migrate
```

## Important note

The backend uses secure cookie sessions and server-side user records. It uses `data/db.json` locally, but automatically switches to Supabase/Postgres when `DATABASE_URL` is set.

For a real hosted public launch:

- New user accounts are stored in Postgres `app_users` when `DATABASE_URL` is set.
- Passwords are stored as `scrypt` hashes, not plaintext.
- Active browser sessions are stored in `app_sessions`.
- Returning users are remembered with an `HttpOnly` `fundscope_session` cookie.
- User preferences live in `app_profiles`, scoped by `user_id`.
- Dashboard accounts live in `app_dashboard_accounts`, scoped by `user_id`.
- `data/db.json` is blocked from public HTTP access by the server.
- Admin access is controlled by `ADMIN_EMAILS` or a database user with `role: "admin"`.
- If no admin exists, a signed-in first owner can claim admin from the Admin page. Set `ADMIN_EMAILS` before public launch to avoid accidental first-owner claims.

Before scaling to multiple containers/instances, use `DATABASE_URL` with Supabase, RDS, Neon, or another managed Postgres provider. File storage is okay for one local dev server, but not for multi-instance traffic.
