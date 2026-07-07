type StatRow = [label: string, value: string];

export const traderDnaProfile: {
  level: string;
  nextLevel: string;
  dnaScore: number;
  readinessScore: number;
  primaryMarket: string;
  bestSession: string;
  riskSweetSpot: string;
  dangerZone: string;
  identity: string;
  memoryStats: StatRow[];
  strengths: string[];
  weaknesses: string[];
  weeklyMentor: string[];
  personalStats: StatRow[];
} = {
  level: "Professional",
  nextLevel: "Elite",
  dnaScore: 82,
  readinessScore: 74,
  primaryMarket: "Gold / XAUUSD",
  bestSession: "London 08:00–10:30",
  riskSweetSpot: "0.5% per trade",
  dangerZone: "After two consecutive losses or before FOMC",
  identity: "FundedScope Pro Trader",
  memoryStats: [
    ["Trades remembered", "1,248"],
    ["Journal notes", "386"],
    ["Patterns detected", "42"],
    ["Rule breaks flagged", "19"]
  ],
  strengths: [
    "Best performance comes from London-session Gold continuation setups.",
    "Risk discipline improves when position size is capped at 0.5%.",
    "You wait for cleaner entries when a pre-market plan exists."
  ],
  weaknesses: [
    "Performance drops after two consecutive losses.",
    "FOMC and CPI windows create emotional re-entry risk.",
    "Friday afternoon trades have weaker follow-through."
  ],
  weeklyMentor: [
    "You respected max daily risk on 4 of 5 trading days.",
    "You overtraded after a winning streak twice.",
    "Your best RR came from waiting for the second pullback.",
    "Next week: no trades 30 minutes before red-folder USD news."
  ],
  personalStats: [
    ["Best market", "XAUUSD"],
    ["Worst hour", "13:30–14:30 UTC"],
    ["Best RR", "1:3.2"],
    ["Most emotional pair", "Gold"],
    ["Average hold time", "47m"],
    ["Best broker condition", "Low Gold spread + London liquidity"],
    ["Best prop condition", "Static drawdown + no news restriction"],
    ["Monthly profit concentration", "60% in one strong week"]
  ]
};

export const traderDnaPrinciples = [
  {
    title: "Memory beats features",
    copy: "A competitor can copy comparison tables. It cannot copy a trader’s personal history, psychology and patterns."
  },
  {
    title: "Decisions beat information",
    copy: "Trader DNA turns data into a readiness recommendation: trade, reduce risk or step away."
  },
  {
    title: "Progress creates identity",
    copy: "Levels, verified status, discipline streaks and weekly reviews make FundedScope part of the trader’s identity."
  }
];

export function readinessLabel(score: number) {
  if (score >= 80) return "Ready";
  if (score >= 65) return "Wait";
  return "Don’t Trade";
}
