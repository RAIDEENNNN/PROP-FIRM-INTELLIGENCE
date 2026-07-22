export type LiveSource = {
  name: string;
  category: "News" | "Forex" | "Crypto" | "Stocks" | "Indices" | "Synthetic" | "Rules" | "Reviews" | "Payments";
  status: "Active" | "Provider-backed" | "Editorial review" | "Connected";
  envKeys: string[];
  description: string;
  launchUse: string;
};

export const liveSources: LiveSource[] = [
  {
    name: "Binance public market data",
    category: "Crypto",
    status: "Provider-backed",
    envKeys: ["BINANCE_MARKET_DATA_ENABLED"],
    description: "Public bid/ask market data for crypto symbols where available.",
    launchUse: "Adds market context beside crypto spread research."
  },
  {
    name: "Twelve Data",
    category: "Forex",
    status: "Provider-backed",
    envKeys: ["TWELVE_DATA_API_KEY"],
    description: "Market quote provider for FX, metals, crypto, equities and index symbols depending on plan.",
    launchUse: "Supports provider-backed quote validation across the market reference strip."
  },
  {
    name: "Finnhub",
    category: "Stocks",
    status: "Provider-backed",
    envKeys: ["FINNHUB_API_KEY"],
    description: "Equity and crypto quote provider for stock cards and digital asset backup quotes.",
    launchUse: "Feeds AAPL, TSLA, NVDA, MSFT and crypto backups when configured."
  },
  {
    name: "Alpha Vantage",
    category: "Stocks",
    status: "Provider-backed",
    envKeys: ["ALPHA_VANTAGE_API_KEY"],
    description: "Backup equity quote provider for stock cards.",
    launchUse: "Backs up AAPL, TSLA, NVDA and MSFT when configured."
  },
  {
    name: "Yahoo Finance public chart",
    category: "Indices",
    status: "Connected",
    envKeys: [],
    description: "Public chart data fallback for major index futures and DXY where available.",
    launchUse: "Keeps NASDAQ, S&P 500, US30 and DXY market references from showing fake proxy values."
  },
  {
    name: "Coinbase public market data",
    category: "Crypto",
    status: "Connected",
    envKeys: [],
    description: "Public crypto stats used as a no-key fallback when Binance or Twelve Data are unavailable.",
    launchUse: "Keeps BTC and ETH reference prices available without exposing API keys."
  },
  {
    name: "Polygon.io",
    category: "Forex",
    status: "Provider-backed",
    envKeys: ["POLYGON_API_KEY"],
    description: "Market data provider for FX, crypto and indices depending on plan.",
    launchUse: "Backup/secondary quote source for spread validation."
  },
  {
    name: "Deriv",
    category: "Synthetic",
    status: "Provider-backed",
    envKeys: ["DERIV_APP_ID"],
    description: "Synthetic/volatility instrument source where supported by Deriv APIs.",
    launchUse: "Feeds synthetic index quotes for volatility, boom/crash and range-style symbols."
  },
  {
    name: "GNews",
    category: "News",
    status: "Provider-backed",
    envKeys: ["GNEWS_API_KEY"],
    description: "News API for prop firm, broker, market and payout-related alerts.",
    launchUse: "Feeds the News Radar with fresh market and prop-firm headlines."
  },
  {
    name: "NewsAPI",
    category: "News",
    status: "Provider-backed",
    envKeys: ["NEWS_API_KEY"],
    description: "General news provider for financial headlines and watchlist topics.",
    launchUse: "Secondary news source for rule, payout and market-impact monitoring."
  },
  {
    name: "Official firm websites",
    category: "Rules",
    status: "Editorial review",
    envKeys: [],
    description: "Rule changes should be collected from official pages, then reviewed before publishing.",
    launchUse: "Protects trust: no unverified rule-change claims go live without editorial approval."
  },
  {
    name: "Verified user reviews",
    category: "Reviews",
    status: "Editorial review",
    envKeys: [],
    description: "User reviews and payout proofs require moderation before becoming public.",
    launchUse: "Builds Trustpilot-style credibility while preventing spam and fake proof."
  },
  {
    name: "Stripe",
    category: "Payments",
    status: "Provider-backed",
    envKeys: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    description: "Subscriptions, featured listings, reports and business/API access billing.",
    launchUse: "Supports subscriptions, commercial access and partner billing."
  }
];

export function getSourceReadiness() {
  const connected = liveSources.filter((source) => source.status === "Active" || source.status === "Connected").length;
  const keyRequired = liveSources.filter((source) => source.status === "Provider-backed").length;
  const manualReview = liveSources.filter((source) => source.status === "Editorial review").length;

  return {
    total: liveSources.length,
    connected,
    keyRequired,
    manualReview
  };
}
