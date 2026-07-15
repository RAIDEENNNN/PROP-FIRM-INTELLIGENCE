export type MarketSnapshot = {
  symbol: string;
  label: string;
  price: string;
  change: string;
  tone: "up" | "down" | "flat";
  source: "Live" | "Unavailable";
};

export const fallbackMarkets: MarketSnapshot[] = [
  { symbol: "XAUUSD", label: "Gold", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "BTCUSD", label: "BTC", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "EURUSD", label: "EUR/USD", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "GBPUSD", label: "GBP/USD", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "NAS100", label: "NASDAQ", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "DXY", label: "DXY", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" }
];
