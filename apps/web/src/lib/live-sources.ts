export type LiveSource = {
  name: string;
  category: "News" | "Forex" | "Crypto" | "Synthetic" | "Rules" | "Reviews" | "Payments";
  status: "Live-ready" | "Key required" | "Manual review" | "Connected";
  envKeys: string[];
  description: string;
  launchUse: string;
};

export const liveSources: LiveSource[] = [
  {
    name: "Binance public market data",
    category: "Crypto",
    status: "Live-ready",
    envKeys: ["BINANCE_MARKET_DATA_ENABLED"],
    description: "Public bid/ask market data for crypto symbols where available.",
    launchUse: "Adds live market context beside crypto spread baselines."
  },
  {
    name: "Twelve Data",
    category: "Forex",
    status: "Key required",
    envKeys: ["TWELVE_DATA_API_KEY"],
    description: "FX quote provider for forex pair bid/ask snapshots.",
    launchUse: "Upgrades forex spreads from indicative baselines to provider snapshots."
  },
  {
    name: "Polygon.io",
    category: "Forex",
    status: "Key required",
    envKeys: ["POLYGON_API_KEY"],
    description: "Market data provider for FX, crypto and indices depending on plan.",
    launchUse: "Backup/secondary quote source for spread validation."
  },
  {
    name: "Deriv",
    category: "Synthetic",
    status: "Key required",
    envKeys: ["DERIV_APP_ID"],
    description: "Synthetic/volatility instrument source where supported by Deriv APIs.",
    launchUse: "Feeds synthetic index quotes for volatility, boom/crash and range-style symbols."
  },
  {
    name: "GNews",
    category: "News",
    status: "Key required",
    envKeys: ["GNEWS_API_KEY"],
    description: "News API for prop firm, broker, market and payout-related alerts.",
    launchUse: "Feeds the News Radar with fresh market and prop-firm headlines."
  },
  {
    name: "NewsAPI",
    category: "News",
    status: "Key required",
    envKeys: ["NEWS_API_KEY"],
    description: "General news provider for financial headlines and watchlist topics.",
    launchUse: "Secondary news source for rule, payout and market-impact monitoring."
  },
  {
    name: "Official firm websites",
    category: "Rules",
    status: "Manual review",
    envKeys: [],
    description: "Rule changes should be collected from official pages, then reviewed before publishing.",
    launchUse: "Protects trust: no unverified rule-change claims go live without editorial approval."
  },
  {
    name: "Verified user reviews",
    category: "Reviews",
    status: "Manual review",
    envKeys: [],
    description: "User reviews and payout proofs require moderation before becoming public.",
    launchUse: "Builds Trustpilot-style credibility while preventing spam and fake proof."
  },
  {
    name: "Stripe",
    category: "Payments",
    status: "Key required",
    envKeys: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    description: "Subscriptions, featured listings, reports and business/API access billing.",
    launchUse: "Turns FundedScope into a monetizable company website."
  }
];

export function getSourceReadiness() {
  const connected = liveSources.filter((source) => source.status === "Live-ready" || source.status === "Connected").length;
  const keyRequired = liveSources.filter((source) => source.status === "Key required").length;
  const manualReview = liveSources.filter((source) => source.status === "Manual review").length;

  return {
    total: liveSources.length,
    connected,
    keyRequired,
    manualReview
  };
}
