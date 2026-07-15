# FundedScope UI Wireframes

These wireframes define the intended layout for desktop and mobile. They are implementation guidance, not final visual art.

## Global layout

### Desktop

```txt
┌─────────────────────────────────────────────────────────────────────────────┐
│ Logo + Brand      Dashboard Firms Compare Spreads News Sources Tools Pricing│
│                                                        Sign in  Start free  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Page content                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ Footer: Company · How we score · Editorial · Contact · Affiliate · Legal    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```txt
┌──────────────────────────────┐
│ Logo + FundedScope     Menu  │
├──────────────────────────────┤
│ Menu open:                   │
│ Dashboard                    │
│ Prop Firms                   │
│ Compare                      │
│ Spreads                      │
│ News Radar                   │
│ Sources                      │
│ Tools                        │
│ Pricing                      │
│ Sign in | Start free         │
└──────────────────────────────┘
```

## Home

### Desktop

```txt
┌───────────────────────────┬───────────────────────────────────────────────┐
│ Logo pill                 │ Command preview card                          │
│ Eyebrow                   │ ┌ Metrics ──────────────────────────────────┐ │
│ H1                        │ │ tracked firms | rule changes | alerts      │ │
│ Supporting copy           │ └────────────────────────────────────────────┘ │
│ CTA: Start free Compare   │ Live comparison rows + news radar             │
└───────────────────────────┴───────────────────────────────────────────────┘
┌ Featured firms grid: cards with logo, score, rules, payout, summary          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```txt
Logo pill
H1
Copy
CTA stack
Command preview
Featured firm cards one per row
```

## Prop firm directory

```txt
Title + value proposition
┌ Search input ┬ Market filter ┬ Payout filter ┬ Result count ┐
└──────────────────────────────────────────────────────────────┘
Firm cards grid:
  logo, name, country, rating, summary, score, target, DD, payout
```

Mobile: filters stack vertically; cards become single column.

## Firm profile

```txt
┌ Hero profile card ───────────────────────────────┬ Score/action card ┐
│ Logo, firm name, rating, country, summary         │ Score meter        │
│ Fee | Target | Payout | Max DD                    │ Visit / Save alert │
└───────────────────────────────────────────────────┴───────────────────┘
┌ Rules ┐ ┌ Reviews ┐ ┌ Payout proof ┐
┌ Research spread estimate table/cards ┐
```

## Compare

Desktop:

```txt
Title + helper copy
┌ Firm │ Score │ Rating │ Fee │ Target │ Daily DD │ Payout │ Max DD │ Markets ┐
```

Mobile:

```txt
Firm card
  Score | Fee
  Target | Daily DD
  Payout | Max DD
  Markets
```

## Spreads

```txt
Title + caveat about live provider feeds
Metric cards: firms, instruments, records, categories
Search/filter bar
Desktop table:
  Prop firm | Pair | Category | Spread | Status | Source
Mobile cards:
  Firm + status
  Pair/name
  Spread/source
```

## Sources

```txt
Title + source-readiness explanation
Readiness metrics
Source cards: provider, status, env keys, launch use
```

## Pricing

```txt
Hero: "Choose the intelligence level..."
3 plan cards:
  price, audience, promise, features, limits, CTA
Why traders upgrade cards
Plan difference matrix/cards
Monetization stack
FAQ
```

## Dashboard

```txt
Authenticated page:
Metrics: saved firms, active alerts, challenges, payout progress
Watchlist
Challenge/funded account tracker
Triggered alerts
Recommended firms
```

## Admin

```txt
Admin metrics
Cards/sections:
Users | Firms | Spreads | News | Reviews | Payments | KYC | Audit logs
Each module should support list, create/edit, approve/reject, and audit trail.
```
