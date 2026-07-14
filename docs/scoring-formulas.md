# FundedScope Intelligence System™

FundedScope should be trusted because its scores are clear, explainable and cannot be bought.

All scores should be shown as 0–100 unless explicitly stated otherwise. A score is only as strong as the data quality behind it, so each score should expose:

- score value;
- data confidence;
- last verified date;
- source status;
- whether the profile is `Verified by FundedScope™`.

No affiliate, sponsorship or featured listing payment may directly increase a FundedScope Confidence Score or recommendation score.

## 1. FundedScope Confidence Score™ for prop firms

Purpose: explain how trustworthy and trader-friendly a prop firm appears based on verified criteria.

```txt
FundedScope Confidence Score =
  Payout Reliability       * 0.20
+ Rule Transparency        * 0.15
+ Community Rating         * 0.15
+ Support Quality          * 0.10
+ Challenge Fairness       * 0.10
+ Company Reputation       * 0.10
+ Platform Reliability     * 0.10
+ Verification Status      * 0.10
+ Refund Policy            * 0.05
+ Trading Flexibility      * 0.05
```

### Prop firm score components

| Component | Weight | Meaning |
|---|---:|---|
| Payout Reliability | 20 | Payout speed, payout disputes, proof quality, consistency |
| Rule Transparency | 15 | Clear rules, official pages, fewer vague restrictions |
| Community Rating | 15 | Verified user reviews, complaints, public sentiment |
| Support Quality | 10 | Response channels, response time, support reputation |
| Challenge Fairness | 10 | Profit targets, drawdown model, fee fairness, minimum days |
| Company Reputation | 10 | Operating history, public company details, incident history |
| Platform Reliability | 10 | Platform options, uptime, execution/trading environment |
| Verification Status | 10 | Manual verification, source URLs, freshness |
| Refund Policy | 5 | Refund clarity and conditions |
| Trading Flexibility | 5 | News, weekend, EA, scalping, copy trading, strategy fit |

### Confidence Score display

```txt
FTMO
92 / 100

Verified by FundedScope™
Last checked: 10 July 2026
```

The UI must show the category breakdown so users can understand why a firm earned the score.

## 2. FundedScope Confidence Score™ for brokers

Purpose: explain broker quality for live traders, especially by regulation, execution and instrument-specific trading cost.

```txt
FundedScope Confidence Score =
  Withdrawal Reliability   * 0.20
+ Rule Transparency        * 0.15
+ Customer Support         * 0.15
+ Trading Conditions       * 0.20
+ Platform Stability       * 0.15
+ Community Trust          * 0.15
```

### Broker score components

| Component | Weight | Meaning |
|---|---:|---|
| Withdrawal Reliability | 20 | Speed, fees, dispute rate, supported withdrawal methods |
| Rule Transparency | 15 | Public fees, terms, entity clarity, account restrictions and source quality |
| Customer Support | 15 | Live chat, email, phone, WhatsApp/Telegram, hours and response quality |
| Trading Conditions | 20 | Execution, spreads, commissions, instruments, order restrictions |
| Platform Stability | 15 | MT4, MT5, cTrader, TradingView, WebTrader, mobile quality and tool coverage |
| Community Trust | 15 | Regulation, operating history, public reputation and verified review signals |

### Broker Confidence Score display

```txt
Exness
95 / 100

Withdrawal Reliability   19/20
Rule Transparency        14/15
Customer Support         14/15
Trading Conditions       19/20
Platform Stability       14/15
Community Trust          15/15
```

The UI must explain why each score was earned.

## 3. Verified by FundedScope™

Purpose: show users that FundedScope manually reviewed the profile.

This badge means:

```txt
We have manually checked this information against official or high-confidence sources.
```

It does not mean:

```txt
The company paid us.
```

### Requirements before showing badge

For prop firms:

- challenge rules checked;
- pricing checked;
- payout information checked;
- platforms checked;
- contact information checked;
- company details checked;
- source URL stored;
- verifier stored;
- last verified date stored.

For brokers:

- regulation checked;
- trading accounts checked;
- instruments/spreads checked;
- deposit/withdrawal information checked;
- platforms checked;
- support/contact checked;
- source URL stored;
- verifier stored;
- last verified date stored.

## 4. Rule History™

Purpose: make FundedScope a living intelligence source rather than a static directory.

Examples:

```txt
Daily Drawdown
5%
↓
4%

Updated yesterday
```

```txt
Profit Split
80%
↓
90%

Changed 10 Jan 2026
```

Every important rule/pricing/payout change should store:

```text
entity_type
entity_id
field_name
old_value
new_value
change_summary
source_url
changed_at
verified_by
created_at
```

## 5. Broker Intelligence™

Purpose: compare brokers by instrument, not only by one generic overall score.

Example:

```txt
Gold / XAUUSD
Average Spread: 1.2 pips
Period: Last 30 days
```

```txt
EURUSD
Average Spread: 0.1 pips
Period: Last 30 days
```

Instrument-level broker comparison should support:

- average spread;
- minimum spread;
- commission;
- swap long;
- swap short;
- maximum leverage;
- execution speed;
- regulation score;
- last updated period.

## 6. Trader DNA™ Recommendation Score

Purpose: personalize recommendations based on the trader, not only the firm/broker.

Inputs:

- available capital;
- preferred markets: Gold, Forex, Crypto, Indices, Futures;
- trading style: scalper, day trader, swing, position;
- news trader or not;
- weekend holding needed or not;
- preferred platform: MT4, MT5, cTrader, TradingView, DXTrade;
- preferred evaluation type: one-step, two-step, instant funding;
- risk tolerance;
- country/restrictions;
- account size target.

```txt
Trader DNA Recommendation Score =
  Base Confidence Score    * 0.35
+ Market Match             * 0.15
+ Strategy Match           * 0.15
+ Risk Match               * 0.10
+ Platform Match           * 0.08
+ Country Eligibility      * 0.07
+ Budget Match             * 0.05
+ Preference Match         * 0.05
```

Examples:

- A Gold scalper prioritizes XAUUSD spreads, execution and scalping permission.
- A swing trader prioritizes overnight/weekend rules and swap costs.
- A beginner prioritizes support, rule clarity and refund policy.
- A news trader needs explicit news trading rules and volatility warnings.

## 7. Market Health™

Purpose: give traders a daily decision snapshot before trading.

Example:

```txt
Today's Market
Risk Level: Low
Volatility: Medium
Major News: 2
Recommended: Trade after London Open
```

Suggested score:

```txt
Market Health Score =
  News Risk          * 0.30
+ Volatility Risk    * 0.25
+ Spread Conditions  * 0.20
+ Liquidity/Session  * 0.15
+ User Risk Context  * 0.10
```

Display:

```text
0-39    High risk
40-69   Caution
70-100  Healthy
```

## 8. Legacy FundedScope Score

Purpose: overall firm quality and trader-fit signal.

```txt
FundedScope Score =
  Confidence Score * 0.35
+ Rules Score * 0.20
+ Payout Score * 0.15
+ Spread Score * 0.10
+ Pricing Score * 0.10
+ Review Score * 0.10
```

### Inputs

| Component | Meaning |
|---|---|
| Confidence Score | Operational credibility, age, transparency, incident history |
| Rules Score | Challenge clarity, drawdown fairness, trading restrictions |
| Payout Score | Frequency, proof volume, consistency, disputes |
| Spread Score | Trading cost by market and session |
| Pricing Score | Challenge fee vs account size and rules |
| Review Score | Verified user sentiment and payout proof quality |

## 9. Legacy Trust Score

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

## 10. Spread Score

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

## 11. Rules Score

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

## 12. Payout Score

```txt
Payout Score =
  Payout Frequency * 0.25
+ Verified Proof Volume * 0.25
+ Dispute Rate * 0.25
+ Processing Speed * 0.15
+ Payment Method Coverage * 0.10
```

## 13. Pricing Score

```txt
Pricing Score =
  Account Size Value * 0.35
+ Refundability * 0.15
+ Profit Split * 0.20
+ Scaling Potential * 0.15
+ Hidden Cost Adjustment * 0.15
```

## 14. Recommendation Score

Personalized score used for trader profiles.

```txt
Recommendation Score =
  FundedScope Confidence Score * 0.45
+ Strategy Match * 0.20
+ Risk Tolerance Match * 0.15
+ Market Match * 0.10
+ Budget Match * 0.10
```

Example:

- Scalper prioritizes Spread Score and execution restrictions.
- Swing trader prioritizes holding rules, weekend rules and drawdown model.
- Beginner prioritizes rule clarity, support, education and pricing.
