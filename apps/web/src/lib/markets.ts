export type MarketSnapshot = {
  symbol: string;
  label: string;
  price: string;
  change: string;
  tone: "up" | "down" | "flat";
  source: "Live" | "Provider needed";
};

export const fallbackMarkets: MarketSnapshot[] = [
  { symbol: "XAUUSD", label: "Gold", price: "Feed pending", change: "Connect provider", tone: "flat", source: "Provider needed" },
  { symbol: "BTCUSD", label: "BTC", price: "Feed pending", change: "Connect provider", tone: "flat", source: "Provider needed" },
  { symbol: "EURUSD", label: "EUR/USD", price: "Feed pending", change: "Connect provider", tone: "flat", source: "Provider needed" },
  { symbol: "GBPUSD", label: "GBP/USD", price: "Feed pending", change: "Connect provider", tone: "flat", source: "Provider needed" },
  { symbol: "NAS100", label: "NASDAQ", price: "Feed pending", change: "Connect provider", tone: "flat", source: "Provider needed" },
  { symbol: "DXY", label: "DXY", price: "Feed pending", change: "Connect provider", tone: "flat", source: "Provider needed" }
];
