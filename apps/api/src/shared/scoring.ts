const scoreWeights = [
  { key: "rules", label: "Rule fairness", max: 20, explanation: "Drawdown style, challenge structure, trading restrictions and rule clarity." },
  { key: "payouts", label: "Payout quality", max: 20, explanation: "Payout speed, payout frequency and payout clarity." },
  { key: "trust", label: "Trust & reviews", max: 25, explanation: "Rating, review volume, profile status and broad confidence signals." },
  { key: "pricing", label: "Pricing/value", max: 15, explanation: "Challenge fee versus account size, refund positioning and accessibility." },
  { key: "markets", label: "Markets & spreads", max: 10, explanation: "Market coverage and whether spread/rule data exists for the firm." },
  { key: "freshness", label: "Transparency/freshness", max: 10, explanation: "How recently profile/rule data was updated." }
] as const;

type ScoreKey = (typeof scoreWeights)[number]["key"];

type ScoreFirm = {
  trustScore?: unknown;
  rating?: unknown;
  reviewCount?: number | null;
  payoutFrequency?: string | null;
  status?: string | null;
  updatedAt?: Date | string | null;
  accounts?: Array<{
    challengeFee?: unknown;
    dailyDrawdown?: unknown;
    maxDrawdown?: unknown;
    challengeType?: string | null;
  }>;
  rules?: Array<{
    category?: string | null;
    currentValue?: string | null;
    impactLevel?: string | null;
    updatedAt?: Date | string | null;
  }>;
};

function numeric(value: unknown, fallback = 0) {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  if (value && typeof value === "object" && "toString" in value) {
    const parsed = Number(value.toString());
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function daysSince(value: Date | string | null | undefined) {
  const date = value ? new Date(value).getTime() : Number.NaN;
  if (Number.isNaN(date)) return 90;
  const now = new Date("2026-07-07T00:00:00.000Z").getTime();
  return Math.max(0, Math.round((now - date) / 86_400_000));
}

function average(values: number[], fallback = 0) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;
}

function scoreWeaknesses(firm: ScoreFirm): Record<ScoreKey, number> {
  const accounts = firm.accounts ?? [];
  const rules = firm.rules ?? [];
  const fees = accounts.map((account) => numeric(account.challengeFee)).filter((value) => value > 0);
  const avgFee = average(fees, 120);
  const marketsRule = rules.find((rule) => `${rule.category} ${rule.currentValue}`.toLowerCase().includes("markets"));
  const marketText = marketsRule?.currentValue ?? "";
  const marketCount = marketText ? marketText.split(",").filter(Boolean).length : 2;
  const highImpactRules = rules.filter((rule) => rule.impactLevel === "HIGH").length;
  const newestRuleAge = Math.min(daysSince(firm.updatedAt), ...rules.map((rule) => daysSince(rule.updatedAt)));

  return {
    rules: 0.15 + Math.min(0.35, highImpactRules * 0.08) + (rules.length < 4 ? 0.2 : 0),
    payouts: /on demand|weekly|fast|5 days/i.test(firm.payoutFrequency ?? "")
      ? 0.1
      : /bi-weekly|14 days|8 days/i.test(firm.payoutFrequency ?? "")
        ? 0.22
        : 0.42,
    trust:
      (firm.status === "active" ? 0.1 : 0.35) +
      (numeric(firm.rating) >= 4.6 ? 0.05 : numeric(firm.rating) >= 4.2 ? 0.16 : 0.3) +
      ((firm.reviewCount ?? 0) >= 9000 ? 0.04 : (firm.reviewCount ?? 0) >= 3500 ? 0.12 : 0.24),
    pricing: avgFee <= 60 ? 0.12 : avgFee <= 100 ? 0.24 : avgFee <= 160 ? 0.38 : 0.55,
    markets: marketCount >= 4 ? 0.08 : marketCount === 3 ? 0.18 : marketCount === 2 ? 0.32 : 0.46,
    freshness: newestRuleAge <= 21 ? 0.08 : newestRuleAge <= 45 ? 0.18 : newestRuleAge <= 75 ? 0.3 : 0.45
  };
}

export function buildScoreBreakdown(firm: ScoreFirm) {
  const total = Math.round(Math.max(0, Math.min(100, numeric(firm.trustScore))));
  const deductionBudget = Math.max(0, 100 - total);
  const weaknesses = scoreWeaknesses(firm);
  const weightedWeaknesses = scoreWeights.map((item) => ({
    ...item,
    weakness: Math.max(0.01, weaknesses[item.key]) * item.max
  }));
  const weaknessTotal = weightedWeaknesses.reduce((sum, item) => sum + item.weakness, 0);

  const rows = weightedWeaknesses.map((item) => {
    const deduction = weaknessTotal > 0 ? (deductionBudget * item.weakness) / weaknessTotal : deductionBudget / scoreWeights.length;
    const earned = Number(Math.max(0, item.max - deduction).toFixed(1));
    return {
      key: item.key,
      label: item.label,
      earned,
      max: item.max,
      explanation: item.explanation,
      percent: Math.round((earned / item.max) * 100)
    };
  });

  const roundedTotal = Math.round(rows.reduce((sum, row) => sum + row.earned, 0));
  const correction = total - roundedTotal;
  if (correction !== 0) {
    const largest = rows.reduce((bestIndex, row, index) => (row.max > rows[bestIndex]!.max ? index : bestIndex), 0);
    const corrected = Number(Math.min(rows[largest]!.max, Math.max(0, rows[largest]!.earned + correction)).toFixed(1));
    rows[largest] = {
      ...rows[largest]!,
      earned: corrected,
      percent: Math.round((corrected / rows[largest]!.max) * 100)
    };
  }

  return {
    total,
    max: 100,
    formula: "Start from 100, then subtract weighted deductions across rules, payouts, trust, pricing, markets/spreads and freshness.",
    weights: scoreWeights.map(({ key, label, max }) => ({ key, label, max })),
    rows
  };
}
