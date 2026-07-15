# API Contract with Examples

Base URL:

```txt
https://api.myfundedscope.com/api
```

Local URL:

```txt
http://localhost:4000/api
```

Most application JSON responses use:

```json
{
  "ok": true,
  "data": {}
}
```

Errors use:

```json
{
  "ok": false,
  "error": "Validation error",
  "details": {}
}
```

## Health

### `GET /health`

Response:

```json
{
  "status": "ok",
  "service": "myfundedscope-api"
}
```

## Auth

### `POST /auth/sign-up`

Request:

```json
{
  "email": "trader@example.com",
  "password": "StrongPassword123!",
  "name": "Funded Trader"
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "clx_user",
      "email": "trader@example.com",
      "name": "Funded Trader",
      "role": "TRADER",
      "subscriptionStatus": "FREE",
      "emailVerified": false
    },
    "accessToken": "jwt_access",
    "refreshToken": "jwt_refresh"
  }
}
```

### `POST /auth/sign-in`

Request:

```json
{
  "email": "trader@example.com",
  "password": "StrongPassword123!"
}
```

Response: same shape as sign-up.

### `POST /auth/refresh`

Request:

```json
{
  "refreshToken": "jwt_refresh"
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "accessToken": "new_jwt_access",
    "refreshToken": "new_jwt_refresh"
  }
}
```

## Authenticated headers

Protected routes require:

```txt
Authorization: Bearer jwt_access
```

## User

### `GET /users/me`

Response:

```json
{
  "ok": true,
  "data": {
    "user": { "id": "clx_user", "email": "trader@example.com", "role": "TRADER" },
    "traderProfile": {},
    "watchlist": [],
    "alerts": [],
    "subscriptions": []
  }
}
```

### `PATCH /users/me`

Request:

```json
{
  "name": "THE PĦILOSOPHER",
  "avatarUrl": "https://example.com/avatar.png"
}
```

## Trader profile

### `PUT /trader-profile`

Request:

```json
{
  "experienceLevel": "Intermediate",
  "strategy": "London session scalping",
  "preferredMarkets": ["Forex", "Indices"],
  "preferredAccountSize": 100000,
  "riskTolerance": "MEDIUM",
  "payoutPriority": true,
  "swingTrading": false,
  "newsTrading": false,
  "eaTrading": false
}
```

## Firms

### `GET /firms?q=ftmo&limit=20`

Response:

```json
{
  "ok": true,
  "data": {
    "firms": [
      {
        "id": "firm_id",
        "name": "FTMO",
        "slug": "ftmo",
        "trustScore": "94",
        "rating": "4.8",
        "payoutFrequency": "Bi-weekly",
        "scoreBreakdown": {
          "total": 94,
          "max": 100,
          "formula": "Start from 100, then subtract weighted deductions across rules, payouts, trust, pricing, markets/spreads and freshness.",
          "rows": [
            { "key": "rules", "label": "Rule fairness", "earned": 18.8, "max": 20 },
            { "key": "payouts", "label": "Payout quality", "earned": 18.5, "max": 20 },
            { "key": "trust", "label": "Trust & reviews", "earned": 24.1, "max": 25 },
            { "key": "pricing", "label": "Pricing/value", "earned": 13.2, "max": 15 },
            { "key": "markets", "label": "Markets & spreads", "earned": 9.8, "max": 10 },
            { "key": "freshness", "label": "Transparency/freshness", "earned": 9.6, "max": 10 }
          ]
        }
      }
    ],
    "count": 1,
    "limit": 20,
    "offset": 0
  }
}
```

### `GET /firms/:slug`

Response includes:

- firm
- accounts
- rules
- moderated review signals
- scoreBreakdown

### `GET /firms/:slug/score`

Response:

```json
{
  "ok": true,
  "data": {
    "slug": "ftmo",
    "name": "FTMO",
    "trustScore": "94",
    "scoreBreakdown": {
      "total": 94,
      "max": 100,
      "weights": [
        { "key": "rules", "label": "Rule fairness", "max": 20 },
        { "key": "payouts", "label": "Payout quality", "max": 20 },
        { "key": "trust", "label": "Trust & reviews", "max": 25 },
        { "key": "pricing", "label": "Pricing/value", "max": 15 },
        { "key": "markets", "label": "Markets & spreads", "max": 10 },
        { "key": "freshness", "label": "Transparency/freshness", "max": 10 }
      ],
      "rows": []
    }
  }
}
```

### `GET /firms/:slug/rules/history`

Response includes:

- current rules
- related audit logs

## Compare

### `POST /compare`

Request:

```json
{
  "slugs": ["ftmo", "the5ers", "fundednext"]
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "firms": [
      {
        "name": "FTMO",
        "slug": "ftmo",
        "fitScore": 89,
        "scoreBreakdown": {
          "total": 94,
          "max": 100,
          "rows": []
        },
        "accounts": [],
        "rules": []
      }
    ]
  }
}
```

### `POST /compare/recommendations`

Request:

```json
{
  "markets": ["Forex", "Indices"],
  "maxFee": 150,
  "payoutPriority": true,
  "riskTolerance": "MEDIUM",
  "accountSize": 100000
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "recommendations": [
      {
        "name": "The5ers",
        "recommendationScore": 91,
        "scoreBreakdown": {
          "total": 91,
          "max": 100,
          "rows": []
        },
        "reasons": ["Fee preference matched", "Account size preference matched"]
      }
    ]
  }
}
```

## Spreads

### `GET /spreads/instruments`

Response:

```json
{
  "ok": true,
  "data": {
    "instruments": [
      {
        "symbol": "EURUSD",
        "name": "Euro / US Dollar",
        "category": "FOREX"
      }
    ]
  }
}
```

### `GET /spreads/records?symbol=EURUSD&firm=FTMO`

Response:

```json
{
  "ok": true,
  "data": {
    "records": [
      {
        "brokerOrFirm": "FTMO",
        "spreadPips": "0.8",
        "instrument": {
          "symbol": "EURUSD"
        }
      }
    ],
    "count": 1
  }
}
```

### `POST /spreads/records`

Admin only.

Request:

```json
{
  "symbol": "EURUSD",
  "name": "Euro / US Dollar",
  "category": "FOREX",
  "brokerOrFirm": "FTMO",
  "bid": 1.085,
  "ask": 1.08508,
  "spreadPips": 0.8,
  "session": "LONDON"
}
```

## News

### `GET /news`

Response:

```json
{
  "ok": true,
  "data": {
    "news": [
      {
        "title": "Spread matrix baseline added",
        "impactLevel": "MEDIUM",
        "publishedAt": "2026-07-06T10:00:00.000Z"
      }
    ]
  }
}
```

## Alerts

### `POST /alerts`

Request:

```json
{
  "firmId": "firm_id",
  "type": "RULE_CHANGE",
  "title": "FTMO rule change",
  "message": "Alert me when FTMO changes drawdown rules",
  "triggerConfig": {
    "category": "Risk"
  }
}
```

### `POST /alerts/watchlist`

Request:

```json
{
  "firmId": "firm_id",
  "notes": "Interested in k challenge"
}
```

## Reviews

### `POST /reviews`

Request:

```json
{
  "firmId": "firm_id",
  "rating": 5,
  "title": "Fast payout",
  "body": "I received my payout within the stated timeframe.",
  "payoutProofUrl": "https://example.com/proof.png"
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "message": "Review submitted for verification"
  }
}
```

## Billing

### `POST /billing/checkout`

Request:

```json
{
  "priceId": "price_123",
  "successUrl": "https://fundedscope.com/dashboard?success=true",
  "cancelUrl": "https://fundedscope.com/pricing"
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/...",
    "sessionId": "cs_test_123"
  }
}
```

## Tools

### `POST /tools/lot-size`

Request:

```json
{
  "balance": 10000,
  "riskPercent": 1,
  "stopLossPips": 20,
  "pipValue": 10
}
```

Response:

```json
{
  "ok": true,
  "data": {
    "riskAmount": 100,
    "lots": 0.5
  }
}
```

## Admin

### `GET /admin/overview`

Admin only. Returns counts for:

- users
- firms
- pending reviews
- active alerts
- active subscriptions
- news events
- spread records

### `POST /admin/firms`

Admin only. Upserts a firm and writes an audit log.
