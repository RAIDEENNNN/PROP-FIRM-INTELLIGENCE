# Supabase connection report

Date: 2026-07-10

## Project

- Supabase project: `myfundedscope-production`
- Project ref: `ybpjhzqxnmwrcrldbrag`
- Public project URL has been provided.
- Frontend publishable key has been provided.

## Completed in codebase

- Added Supabase project config:
  - `supabase/config.toml`
- Added frontend Supabase client:
  - `apps/web/src/lib/supabase/client.ts`
- Added `@supabase/supabase-js` to the web app.
- Updated environment documentation for:
  - `SUPABASE_URL`
  - `SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Kept secret/service-role key backend-only.
- Did not hard-code Supabase keys into source code.

## Existing production tables reported

- `profiles`
- `prop_firms`
- `prop_firm_challenges`
- `prop_firm_rules`

## Current migration baseline in Git

```text
supabase/
└── migrations/
    ├── 001_create_profiles.sql
    ├── 002_create_prop_firms.sql
    ├── 003_create_prop_firm_challenges.sql
    └── 004_create_prop_firm_rules.sql
```

## Not completed yet

The production schema has not yet been pulled with Supabase CLI.

Reason:

- Supabase CLI is not installed in the local environment.
- Pulling production schema requires authenticated Supabase CLI access and/or a real database connection string.
- The provided database URL still contains `[YOUR-PASSWORD]`, so it cannot be used to pull schema.

## Required private values before schema pull

Provide these through a private secure channel, not Git:

```env
SUPABASE_ACCESS_TOKEN=""
DATABASE_URL="postgresql://postgres:REAL_PASSWORD@db.ybpjhzqxnmwrcrldbrag.supabase.co:5432/postgres"
```

The service-role key is not needed for schema pull. Only provide `SUPABASE_SERVICE_ROLE_KEY` later if backend admin operations require it.

## Next technical steps

1. Install/use Supabase CLI.
2. Link the repository to project ref `ybpjhzqxnmwrcrldbrag`.
3. Pull production schema into migrations.
4. Compare generated schema against the current baseline files.
5. Confirm all four tables match production:
   - columns
   - foreign keys
   - indexes
   - check constraints
   - triggers
   - RLS enabled
   - RLS policies
6. Commit the generated migration/baseline.
7. Connect frontend auth to Supabase.
8. Test signup, login and profile creation.
9. Confirm RLS:
   - user can read their own profile
   - user can update their own profile
   - user cannot read another user's profile
   - user cannot update another user's profile

## Suggested CLI commands once credentials are available

Do not paste secrets into source files.

```bash
supabase link --project-ref ybpjhzqxnmwrcrldbrag
supabase db pull --schema public
```

If using a direct database URL:

```bash
supabase db pull --db-url "$DATABASE_URL" --schema public
```

