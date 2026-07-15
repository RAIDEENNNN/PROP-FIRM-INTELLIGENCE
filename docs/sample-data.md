# Real Sample Data

The app includes realistic launch sample data in:

- `apps/web/src/lib/data.ts`
- `apps/web/src/lib/spreads.ts`
- `prisma/seed.ts`

## Prop firm sample fields

Each firm includes:

- name
- slug
- domain
- logo URL/fallback
- country
- score
- rating
- review count
- payout frequency
- max drawdown
- daily drawdown
- profit target
- challenge fee
- max account
- markets
- challenge types
- tags
- summary

Example:

```json
{
  "name": "FTMO",
  "slug": "ftmo",
  "country": "Czech Republic",
  "score": 94,
  "rating": 4.8,
  "payoutFrequency": "Bi-weekly",
  "maxDrawdown": "10%",
  "dailyDrawdown": "5%",
  "profitTarget": "10% / 5%",
  "challengeFee": "$199",
  "markets": ["Forex", "Indices", "Commodities", "Crypto"]
}
```

## Research spread estimate categories

- Forex majors
- Forex minors
- Forex exotics
- Metals and commodities, including XAUUSD and XAGUSD
- Index CFDs, including NAS100 and US30
- Crypto pairs
- Synthetic/volatility-style instruments

Examples:

```json
[
  { "symbol": "EURUSD", "category": "Forex", "baseline": 0.7 },
  { "symbol": "XAUUSD", "category": "Commodities", "baseline": 28 },
  { "symbol": "XAGUSD", "category": "Commodities", "baseline": 2.8 },
  { "symbol": "NAS100", "category": "Indices", "baseline": 1.5 },
  { "symbol": "US30", "category": "Indices", "baseline": 3.2 },
  { "symbol": "BTCUSD", "category": "Crypto", "baseline": 18 },
  { "symbol": "VIX75", "category": "Synthetic", "baseline": 0.85 }
]
```

## News sample data

Seed includes launch news events for:

- source registry launch
- spread matrix baseline
- rule/news/spread monitoring

## Data honesty rule

Until provider keys are connected, spread data must be labeled as:

```txt
FundedScope research estimate
```

Do not present indicative values as broker-confirmed live spreads.
