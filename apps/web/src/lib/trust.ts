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

function checkedDate(firm: PropFirm) {
  const date = new Date(`${firm.lastRuleUpdate}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return firm.lastRuleUpdate;
  return dateFormatter.format(date);
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
    confidence: firm.verified ? "Editorial checked" : "Needs verification",
    confidenceTone: firm.verified ? "success" : "warning",
    sourceLabel: firm.verified ? "FundedScope editorial check" : "FundedScope discovery profile",
    lastChecked: checkedDate(firm),
    bestFor: bestFor.length > 0 ? bestFor.slice(0, 3) : ["Disciplined prop firm comparison shoppers"],
    cautions: cautions.length > 0 ? cautions.slice(0, 3) : ["No major caution flag from seeded data; confirm current rules before buying."],
    pros,
    cons,
    methodology:
      "Score blends rules, payout structure, pricing, market access, review volume, transparency and editorial risk flags. Affiliate relationships do not override scoring."
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
