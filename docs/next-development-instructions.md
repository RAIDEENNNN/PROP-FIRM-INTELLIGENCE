# FundedScope – Next Development Instructions

This brief defines the next backend, database and platform work for FundedScope / MyFundedScope.

The goal is to make FundedScope a professional trader intelligence platform, not just a comparison website. Everything should support future expansion across prop firm intelligence, broker intelligence, market data, trading news, economic calendar, premium subscriptions, trader profiles, alerts and analytics.

Detailed prop firm and broker verification requirements live in:

```text
docs/verified-intelligence-database-blueprint.md
```

## 1. Supabase

A production Supabase project already exists:

- Project name: `myfundedscope-production`

Current production database tables already created:

- `profiles`
- `prop_firms`
- `prop_firm_challenges`
- `prop_firm_rules`

These tables already have Row Level Security enabled.

Connect the project to the codebase and use it as the production database.

Important:

- Do not hard-code Supabase keys.
- Use environment variables only.
- Keep service-role keys backend-only.
- Never expose service-role keys to the frontend.

Relevant environment variables:

```env
DATABASE_URL=""
SUPABASE_URL=""
SUPABASE_PUBLISHABLE_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""
```

## 2. Database and migrations

Inspect the existing Supabase schema and pull the exact production schema into proper migration files.

Do not recreate, drop or delete the existing production tables.

The repository should contain:

```text
supabase/
└── migrations/
    ├── 001_create_profiles.sql
    ├── 002_create_prop_firms.sql
    ├── 003_create_prop_firm_challenges.sql
    ├── 004_create_prop_firm_rules.sql
    └── ...
```

Important distinction:

- One copy of the SQL has already been applied inside Supabase.
- One copy is stored in GitHub for developers and future migrations.

The migration file in GitHub is the record of what the database contains. It is not pasted into `server.js`, `app.js`, route handlers or frontend components.

Because tables are being created through raw SQL, Row Level Security must be enabled explicitly on every exposed table.

Remaining database tables should be built in dependency order.

### Prop firms

- `prop_firm_rule_history`
- `prop_firm_payment_methods`
- `prop_firm_platforms`
- `prop_firm_support_channels`

### Brokers

- `brokers`
- `broker_accounts`
- `broker_instruments`
- `broker_regulations`
- `broker_spread_history`
- `broker_deposit_methods`
- `broker_withdrawal_methods`
- `broker_platforms`
- `broker_features`
- `broker_support_channels`
- `broker_history`
- `broker_performance_metrics`

### Users

- `saved_firms`
- `saved_brokers`
- `watchlists`
- `alerts`
- `notifications`

### Community

- `reviews`
- `review_votes`

### Premium

- `subscriptions`
- `payments`

### Administration

- `admin_logs`

## 3. Backend

Continue building the Node.js backend using Express.

The backend should expose REST APIs for:

- Authentication
- User profiles
- Prop firms
- Broker comparison
- Reviews
- Saved comparisons
- Watchlists
- Alerts
- Premium subscriptions
- Admin dashboard

## 4. Authentication

Use Supabase Authentication.

Implement:

- Sign up
- Login
- Password reset
- Email verification
- Secure sessions
- Role-based access: User / Editor / Admin

## 5. Admin dashboard

Build a complete admin dashboard.

Admins should be able to:

- Add prop firms
- Edit prop firms
- Upload/update logos
- Add broker information
- Update challenge rules
- Update spreads
- Record source URLs
- Record verified by
- Record last verification date
- Publish/unpublish profiles
- Approve/reject reviews
- Manage subscriptions
- Send notifications
- Manage users
- View analytics

Nothing should be hard-coded. Everything should be manageable from the admin panel.

The admin panel must support a `Public-info checked by FundedScope` workflow. The badge should only appear after challenge rules, pricing, payouts, platforms, contact information and company details have been manually checked.

## 6. External APIs

Prepare backend integration for:

- Twelve Data: market data
- GNews: news
- Stripe: subscriptions
- Resend: emails

Use environment variables only.

## 7. Frontend

Connect the frontend to the backend instead of using mock data.

Replace dummy data with live database data in a safe sequence:

1. Prop firms
2. Prop firm profiles
3. Challenges/rules
4. Broker comparison
5. Spreads
6. Reviews
7. Saved firms/watchlists/alerts
8. Premium/subscriptions
9. Admin dashboard

## 8. Security

Implement:

- Row Level Security
- Input validation
- Rate limiting
- JWT/session validation
- Secure environment variables
- Proper error handling
- Backend-only service-role access
- Role-based permissions

## 9. Performance

Implement:

- API caching where appropriate
- Pagination
- Database indexes
- Optimized queries
- Lazy loading where useful

## 10. Codebase organization

Keep the project clean and maintainable.

Suggested long-term structure:

```text
frontend/
backend/
supabase/
api/
services/
controllers/
routes/
middleware/
database/
utils/
```

The current repo may already use a monorepo structure. Do not reorganize everything blindly. First review the existing architecture and propose changes before doing large moves.

## 11. Technical debt review

Before building new features, review the existing codebase and identify:

- Technical debt
- Duplicated logic
- Hard-coded values
- Security issues
- Architectural improvements
- Mock data that should become database-backed
- Missing indexes or RLS policies
- Places where frontend code depends on backend secrets

If a better approach exists than the current implementation, recommend it before proceeding.

The standard is production quality, not simply adding features.
