# Supabase migrations

This folder is the Git record for the `myfundedscope-production` Supabase database.

Important:

- `001_create_profiles.sql` documents the `public.profiles` table that was already created manually in the Supabase SQL Editor.
- `002_create_prop_firms.sql`, `003_create_prop_firm_challenges.sql` and `004_create_prop_firm_rules.sql` document existing production tables reported as already created.
- Do not rerun baseline migrations against production unless you intentionally recreate or repair the database.
- Future database changes should be added as new numbered migration files in this folder before being applied.
- Tables exposed through Supabase must explicitly enable Row Level Security.
- Never commit Supabase service-role keys or database passwords.

Expected structure:

```text
supabase/
└── migrations/
    ├── 001_create_profiles.sql
    ├── 002_create_prop_firms.sql
    ├── 003_create_prop_firm_challenges.sql
    ├── 004_create_prop_firm_rules.sql
    └── ...
```

There are two copies of the SQL:

1. The copy already applied inside Supabase.
2. The copy stored here in Git for developers and future migrations.

The migration files are database records, not code to paste into `server.js`, `app.js`, or frontend components.
