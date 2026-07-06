# FundedScope Scoring Formulas

All scores should be shown as 0–100. A score is only as strong as the data quality behind it, so each score should eventually expose a confidence level.

## 1. FundedScope Score

Purpose: overall firm quality and trader-fit signal.

```txt
FundedScope Score =
  Trust Score * 0.35
+ Rules Score * 0.20
+ Payout Score * 0.15
+ Spread Score * 0.10
+ Pricing Score * 0.10
+ Review Score * 0.10
```

### Inputs

| Component | Meaning |
|---|---|
| Trust Score | Operational credibility, age, transparency, incident history |
| Rules Score | Challenge clarity, drawdown fairness, trading restrictions |
| Payout Score | Frequency, proof volume, consistency, disputes |
| Spread Score | Trading cost by market and session |
| Pricing Score | Challenge fee vs account size and rules |
| Review Score | Verified user sentiment and payout proof quality |

## 2. Trust Score

```txt
Trust Score =
  Operating History * 0.20
+ Transparency * 0.20
+ Verified Reviews * 0.20
+ Payout Reliability * 0.25
+ Risk Flags Adjustment * 0.15
```

Risk flags subtract points:

- Unclear ownership: -5 to -15
- Recent payout disputes: -5 to -25
- Sudden rule changes without notice: -5 to -20
- Missing legal/contact information: -5 to -15

## 3. Spread Score

Purpose: estimate how tradable a firm/source is for active traders.

```txt
Spread Score =
  100 - min(60, Average Spread Penalty)
      - Session Volatility Penalty
      - Symbol Coverage Penalty
```

### Spread penalty

```txt
Spread Penalty per symbol =
  ((Firm Spread - Baseline Spread) / Baseline Spread) * 25
```

Then average across watched symbols.

### Session volatility penalty

| Condition | Penalty |
|---|---:|
| Stable across London/New York | 0 |
| Moderate spikes | -5 |
| Frequent spikes | -10 |
| Severe news/session widening | -20 |

## 4. Rules Score

```txt
Rules Score =
  Drawdown Fairness * 0.30
+ Profit Target Fairness * 0.20
+ Trading Freedom * 0.20
+ Rule Clarity * 0.20
+ Change Stability * 0.10
```

Examples:

- Static drawdown generally scores better than aggressive trailing drawdown.
- Clear weekend/news/EA rules score better than vague rules.
- Frequent policy changes reduce score.

## 5. Payout Score

```txt
Payout Score =
  Payout Frequency * 0.25
+ Verified Proof Volume * 0.25
+ Dispute Rate * 0.25
+ Processing Speed * 0.15
+ Payment Method Coverage * 0.10
```

## 6. Pricing Score

```txt
Pricing Score =
  Account Size Value * 0.35
+ Refundability * 0.15
+ Profit Split * 0.20
+ Scaling Potential * 0.15
+ Hidden Cost Adjustment * 0.15
```

## 7. Recommendation Score

Personalized score used for trader profiles.

```txt
Recommendation Score =
  FundedScope Score * 0.45
+ Strategy Match * 0.20
+ Risk Tolerance Match * 0.15
+ Market Match * 0.10
+ Budget Match * 0.10
```

Example:

- Scalper prioritizes Spread Score and execution restrictions.
- Swing trader prioritizes holding rules, weekend rules and drawdown model.
- Beginner prioritizes rule clarity, support, education and pricing.
