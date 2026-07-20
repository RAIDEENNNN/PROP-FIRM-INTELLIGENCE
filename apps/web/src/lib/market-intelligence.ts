export type NewsImpact = "High" | "Medium" | "Low";

export type MarketEvent = {
  id: string;
  timeUtc: string;
  currency: string;
  event: string;
  impact: NewsImpact;
  forecast: string;
  previous: string;
  actual: string;
  whyItMatters: string;
  scenario: {
    higher: string;
    lower: string;
  };
  affectedAssets: string[];
  traderTags: string[];
  averageMove: Array<{ asset: string; move: string; tone: "danger" | "warning" | "success" | "electric" }>;
};

export const marketEvents: MarketEvent[] = [
  {
    id: "usd-cpi",
    timeUtc: "13:30",
    currency: "USD",
    event: "US CPI Inflation",
    impact: "High",
    forecast: "3.1%",
    previous: "3.0%",
    actual: "Pending",
    whyItMatters:
      "CPI measures inflation. A hotter print can strengthen USD because markets may price in tighter Federal Reserve policy, while a softer print can weaken USD and support risk assets.",
    scenario: {
      higher: "Bullish USD, bearish Gold, bearish EURUSD, risk-off pressure for indices.",
      lower: "Bearish USD, bullish Gold, bullish EURUSD, risk-on support for indices."
    },
    affectedAssets: ["Gold", "EURUSD", "DXY", "US30", "NASDAQ"],
    traderTags: ["Gold Trader", "Scalper", "Prop Trader", "Indices"],
    averageMove: [
      { asset: "Gold", move: "42 pips", tone: "danger" },
      { asset: "EURUSD", move: "28 pips", tone: "warning" },
      { asset: "DXY", move: "0.55%", tone: "electric" }
    ]
  },
  {
    id: "boe-speech",
    timeUtc: "10:00",
    currency: "GBP",
    event: "BOE Governor Speech",
    impact: "Medium",
    forecast: "Policy tone",
    previous: "Neutral",
    actual: "Pending",
    whyItMatters:
      "Central-bank speeches can shift expectations for rates and liquidity. GBP pairs can move quickly if the tone changes from neutral to hawkish or dovish.",
    scenario: {
      higher: "Hawkish tone can support GBP and pressure GBP shorts.",
      lower: "Dovish tone can weaken GBP and reduce GBP volatility after the first impulse."
    },
    affectedAssets: ["GBPUSD", "EURGBP", "FTSE"],
    traderTags: ["Swing", "Scalper"],
    averageMove: [
      { asset: "GBPUSD", move: "31 pips", tone: "warning" },
      { asset: "EURGBP", move: "18 pips", tone: "electric" },
      { asset: "FTSE", move: "0.35%", tone: "success" }
    ]
  },
  {
    id: "oil-inventories",
    timeUtc: "15:30",
    currency: "USD",
    event: "Crude Oil Inventories",
    impact: "Medium",
    forecast: "-1.2M",
    previous: "2.1M",
    actual: "Pending",
    whyItMatters:
      "Oil inventory surprises can affect energy prices, CAD pairs, inflation expectations and intraday index sentiment.",
    scenario: {
      higher: "Larger inventory builds can pressure oil and reduce commodity-linked currency strength.",
      lower: "Larger draws can support oil and lift energy-sensitive markets."
    },
    affectedAssets: ["USOIL", "USDCAD", "DXY"],
    traderTags: ["Swing", "Indices"],
    averageMove: [
      { asset: "USOIL", move: "1.4%", tone: "warning" },
      { asset: "USDCAD", move: "22 pips", tone: "electric" },
      { asset: "DXY", move: "0.18%", tone: "success" }
    ]
  },
  {
    id: "fed-speaker",
    timeUtc: "18:00",
    currency: "USD",
    event: "Fed Member Speech",
    impact: "Low",
    forecast: "Commentary",
    previous: "Mixed",
    actual: "Pending",
    whyItMatters:
      "Fed speakers matter when they challenge current market pricing. Even low-impact speeches can move USD if liquidity is thin.",
    scenario: {
      higher: "Hawkish comments can support USD and cap Gold rallies.",
      lower: "Dovish comments can pressure USD and support metals or indices."
    },
    affectedAssets: ["DXY", "Gold", "EURUSD"],
    traderTags: ["Gold Trader", "Swing"],
    averageMove: [
      { asset: "Gold", move: "18 pips", tone: "electric" },
      { asset: "EURUSD", move: "11 pips", tone: "success" },
      { asset: "DXY", move: "0.16%", tone: "success" }
    ]
  }
];

export const volatilityMeters = [
  { asset: "Gold", score: 88, stars: 4, reason: "USD CPI and Fed commentary increase two-way risk." },
  { asset: "EURUSD", score: 74, stars: 3, reason: "USD calendar examples dominate the pair in this preview." },
  { asset: "GBPUSD", score: 82, stars: 4, reason: "BOE speech plus USD data can widen the range." },
  { asset: "US30", score: 69, stars: 3, reason: "Inflation data can shift rate-sensitive index flows." }
];

export const currencyHeat = [
  { currency: "USD", heat: 5, summary: "CPI, Fed speech and oil data" },
  { currency: "GBP", heat: 3, summary: "BOE policy comments" },
  { currency: "CAD", heat: 2, summary: "Oil inventory sensitivity" },
  { currency: "EUR", heat: 1, summary: "Secondary USD-driven risk" },
  { currency: "JPY", heat: 1, summary: "Low direct event pressure" }
];

export const tradingSessions = [
  { name: "Sydney", status: "Closed", focus: "Low liquidity handoff" },
  { name: "Tokyo", status: "Closed", focus: "JPY and Asia equity context" },
  { name: "London", status: "Open", focus: "Forex liquidity and Gold setup quality" },
  { name: "New York", status: "Opens soon", focus: "USD data, indices and metals volatility" }
];

export const pairImpacts = [
  {
    pair: "Gold",
    overall: "High volatility expected",
    events: ["US CPI Inflation", "Fed Member Speech"],
    note: "Avoid entries immediately before 13:30 UTC unless your plan specifically handles news spreads."
  },
  {
    pair: "EURUSD",
    overall: "High USD-driven volatility",
    events: ["US CPI Inflation", "Fed Member Speech"],
    note: "Direction depends mostly on USD surprise versus forecast."
  },
  {
    pair: "GBPUSD",
    overall: "Medium-high volatility",
    events: ["BOE Governor Speech", "US CPI Inflation"],
    note: "Two currencies have catalysts, so fake breaks are more likely."
  },
  {
    pair: "US30",
    overall: "Medium volatility",
    events: ["US CPI Inflation"],
    note: "Watch bond-yield reaction before trusting the first index move."
  }
];

export const propFirmWarnings = [
  { firm: "FTMO", rule: "News trading restricted around selected releases", status: "Restricted", tone: "danger" },
  { firm: "FundedNext", rule: "News rules vary by model and account phase", status: "Check plan", tone: "warning" },
  { firm: "Topstep", rule: "Futures rule checks required around major releases", status: "Check rules", tone: "warning" },
  { firm: "The5ers", rule: "Review holding and news conditions before event risk", status: "Review", tone: "electric" }
];

export const newsReplay = {
  event: "Yesterday: US ISM Services PMI",
  expected: "52.5",
  actual: "54.1",
  moves: [
    ["Gold", "-83 pips"],
    ["EURUSD", "-51 pips"],
    ["NASDAQ", "+1.2%"]
  ]
};

export const traderFilters = ["All", "Scalper", "Swing", "Prop Trader", "Gold Trader", "Indices", "Crypto"];

export function getMarketReadiness(tag: string) {
  const relevantEvents = tag === "All" ? marketEvents : marketEvents.filter((event) => event.traderTags.includes(tag));
  const highImpactCount = relevantEvents.filter((event) => event.impact === "High").length;
  const score = Math.max(58, 94 - highImpactCount * 9 - relevantEvents.length * 3);
  const avoidTime = relevantEvents.find((event) => event.impact === "High")?.timeUtc ?? "None flagged";

  return {
    score,
    avoidTime,
    reasons: [
      "London liquidity is active",
      "Market context is mapped by asset",
      `${relevantEvents.length} relevant event${relevantEvents.length === 1 ? "" : "s"} for this filter`,
      highImpactCount ? `${highImpactCount} high-impact release${highImpactCount === 1 ? "" : "s"} require caution` : "No high-impact events in this filter"
    ]
  };
}
