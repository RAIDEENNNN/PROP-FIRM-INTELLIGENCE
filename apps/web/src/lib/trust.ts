import type { PropFirm } from "./data";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC"
});

function feeNumber(fee: string) {
  const match = fee.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function percentNumber(value: string) {
  const match = value.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function checkedDate(firm: PropFirm) {
  const date = new Date(`${firm.lastRuleUpdate}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return firm.lastRuleUpdate;
  return dateFormatter.format(date);
}

function daysSinceChecked(firm: PropFirm) {
  const checked = new Date(`${firm.lastRuleUpdate}T00:00:00.000Z`).getTime();
  if (Number.isNaN(checked)) return 90;
  const now = new Date("2026-07-07T00:00:00.000Z").getTime();
  return Math.max(0, Math.round((now - checked) / 86_400_000));
}

export const scoreWeights = [
  { key: "rules", label: "Rule transparency", max: 20, explanation: "Drawdown style, challenge structure, trading restrictions and how clearly the rules are published." },
  { key: "payouts", label: "Payout reliability", max: 20, explanation: "Payout speed, payout clarity and whether the payout structure looks trader-friendly." },
  { key: "trust", label: "Community trust", max: 25, explanation: "Review volume, public reputation, verification state and broad market confidence signals." },
  { key: "pricing", label: "Trading conditions", max: 15, explanation: "Challenge fee versus account size, refund positioning, scaling and practical account conditions." },
  { key: "markets", label: "Platform stability", max: 10, explanation: "Market coverage, platform coverage and whether spread/rule intelligence exists for the firm." },
  { key: "freshness", label: "Last reviewed", max: 10, explanation: "How recently rules were checked and how clearly the profile can be sourced." }
] as const;

type ScoreKey = (typeof scoreWeights)[number]["key"];

function scoreWeaknesses(firm: PropFirm): Record<ScoreKey, number> {
  const fee = feeNumber(firm.challengeFee);
  const dailyDd = percentNumber(firm.dailyDrawdown);
  const maxDd = percentNumber(firm.maxDrawdown);
  const feeWeakness = fee === null ? 0.45 : fee <= 60 ? 0.12 : fee <= 100 ? 0.24 : fee <= 160 ? 0.38 : 0.55;
  const marketCount = firm.markets.length;
  const checkedAge = daysSinceChecked(firm);

  return {
    rules:
      0.18 +
      (/Strict/i.test(firm.tags.join(" ")) ? 0.2 : 0) +
      (/Trailing/i.test(firm.maxDrawdown) ? 0.22 : 0) +
      (/Plan based|specific/i.test(`${firm.dailyDrawdown} ${firm.maxDrawdown}`) ? 0.12 : 0) +
      (dailyDd !== null && dailyDd < 4 ? 0.14 : 0) +
      (maxDd !== null && maxDd < 8 ? 0.1 : 0),
    payouts: /on demand|weekly|fast|5 days/i.test(`${firm.payoutFrequency} ${firm.payout}`)
      ? 0.1
      : /bi-weekly|14 days|8 days/i.test(`${firm.payoutFrequency} ${firm.payout}`)
        ? 0.22
        : 0.42,
    trust:
      (firm.verified ? 0.08 : 0.5) +
      (firm.rating >= 4.6 ? 0.04 : firm.rating >= 4.2 ? 0.16 : 0.3) +
      (firm.reviewCount >= 9000 ? 0.04 : firm.reviewCount >= 3500 ? 0.12 : 0.24),
    pricing: feeWeakness + (/scaling|\$4M/i.test(`${firm.maxAccount} ${firm.tags.join(" ")}`) ? -0.08 : 0),
    markets: marketCount >= 4 ? 0.08 : marketCount === 3 ? 0.18 : marketCount === 2 ? 0.32 : 0.46,
    freshness: !firm.verified ? 0.45 : checkedAge <= 21 ? 0.08 : checkedAge <= 45 ? 0.18 : checkedAge <= 75 ? 0.3 : 0.45
  };
}

export function getScoreBreakdown(firm: PropFirm) {
  const deductionBudget = Math.max(0, 100 - firm.score);
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
  const correction = firm.score - roundedTotal;
  if (correction !== 0) {
    const largest = rows.reduce((bestIndex, row, index) => (row.max > rows[bestIndex]!.max ? index : bestIndex), 0);
    const selected = rows[largest]!;
    const corrected = Number(Math.min(selected.max, Math.max(0, selected.earned + correction)).toFixed(1));
    rows[largest] = {
      ...selected,
      earned: corrected,
      percent: Math.round((corrected / selected.max) * 100)
    };
  }

  return {
    total: firm.score,
    max: 100,
    label: "FundedScope Confidence Score™",
    formula: "Start from 100, then subtract weighted deductions across rule transparency, payout reliability, community trust, trading conditions, platform stability and last-reviewed freshness.",
    rows
  };
}

export function getFirmTrust(firm: PropFirm) {
  const fee = feeNumber(firm.challengeFee);
  const fastPayout =
    /weekly|on demand|fast|5 days/i.test(firm.payoutFrequency) || /weekly|on demand|fast|5 days/i.test(firm.payout);
  const hasCrypto = firm.markets.includes("Crypto");
  const hasFutures = firm.markets.includes("Futures");
  const hasCommodities = firm.markets.includes("Commodities");
  const hasScaling = firm.tags.some((tag) => /scaling/i.test(tag)) || /scaling|\$4M/i.test(firm.maxAccount);
  const lowEntry = fee !== null && fee <= 79;
  const localMarket = /Nigeria/i.test(firm.country) || firm.tags.some((tag) => /Nigeria|Local/i.test(tag));

  const bestFor = [
    hasFutures ? "Futures-focused traders" : null,
    hasCrypto ? "Crypto and CFD traders" : null,
    hasCommodities ? "Gold, silver and index CFD traders" : null,
    fastPayout ? "Traders who care about payout speed" : null,
    hasScaling ? "Scaling-focused traders" : null,
    lowEntry || localMarket ? "Lower-cost challenge shoppers" : null
  ].filter(Boolean) as string[];

  const cautions = [
    !firm.verified ? "Needs extra editorial verification before being treated as fully confirmed." : null,
    /Trailing/i.test(firm.maxDrawdown) ? "Trailing drawdown can be stricter than static loss limits." : null,
    /Strict/i.test(firm.tags.join(" ")) ? "Rules may be less forgiving for aggressive trading styles." : null,
    /Plan based|specific/i.test(`${firm.dailyDrawdown} ${firm.maxDrawdown}`)
      ? "Drawdown terms vary by plan, so traders should check the exact account rules."
      : null,
    firm.score < 80 ? "Lower FundedScope score means traders should compare alternatives carefully." : null
  ].filter(Boolean) as string[];

  const pros = [
    `${firm.payoutFrequency} payout positioning`,
    `${firm.markets.join(", ")} market coverage`,
    `${firm.challengeTypes.join(", ")} account structure`,
    firm.verified ? "Editorially checked profile" : "Regional/early-stage profile tracked for discovery"
  ].slice(0, 4);

  const cons = [
    cautions[0] ?? "Rules should still be checked before purchase.",
    `Challenge fee starts around ${firm.challengeFee}, which should be compared against refund and payout rules.`
  ];

  return {
    confidence: firm.verified ? "Editorial checked" : "Discovery profile",
    confidenceTone: firm.verified ? "success" : "warning",
    sourceLabel: firm.verified ? "FundedScope editorial check" : "FundedScope discovery profile",
    lastChecked: checkedDate(firm),
    bestFor: bestFor.length > 0 ? bestFor.slice(0, 3) : ["Disciplined prop firm comparison shoppers"],
    cautions: cautions.length > 0 ? cautions.slice(0, 3) : ["No major caution flag from seeded data; confirm current rules before buying."],
    pros,
    cons,
    methodology:
      "FundedScope Confidence Score starts from 100 and subtracts weighted deductions across rule transparency, payout reliability, community trust, trading conditions, platform stability and last-reviewed freshness. Affiliate relationships do not override scoring."
  };
}

export const trustPrinciples = [
  {
    title: "Scores explain the why",
    copy: "Each profile shows fit reasons, cautions and rule context instead of only a star rating."
  },
  {
    title: "Sources are visible",
    copy: "Firm pages label whether information is editorially checked, live-ready, estimated or still awaiting verification."
  },
  {
    title: "Affiliate links stay disclosed",
    copy: "Commercial links are marked clearly so traders can separate recommendations from monetization."
  }
];
