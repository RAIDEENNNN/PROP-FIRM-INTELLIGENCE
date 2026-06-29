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

For this first backend pass, data is stored in:

```text
data/db.json
```

This is good for MVP development. For production, replace it with PostgreSQL, DynamoDB, or another managed database.

## Production roadmap

1. Add authentication for users and admins.
2. Move `data/db.json` to a real database.
3. Add admin CRUD for firms, coupons, giveaways, reviews, and payout proofs.
4. Add upload storage for payout proof screenshots.
5. Add affiliate redirect links with analytics.
6. Deploy API and static app to AWS.
# PROP-FIRM-INTELLIGENCE
# PROP-FIRM-INTELLIGENCE
# PROP-FIRM-INTELLIGENCE
# PROP-FIRM-INTELLIGENCE
