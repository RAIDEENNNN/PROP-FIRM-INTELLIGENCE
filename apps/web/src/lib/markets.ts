export type MarketSnapshot = {
  symbol: string;
  label: string;
  price: string;
  change: string;
  tone: "up" | "down" | "flat";
  source: "Live" | "Reference";
};

export const fallbackMarkets: MarketSnapshot[] = [
  { symbol: "XAUUSD", label: "Gold", price: "Source check", change: "Verify quote", tone: "flat", source: "Reference" },
  { symbol: "BTCUSD", label: "BTC", price: "Source check", change: "Verify quote", tone: "flat", source: "Reference" },
  { symbol: "EURUSD", label: "EUR/USD", price: "Source check", change: "Verify quote", tone: "flat", source: "Reference" },
  { symbol: "GBPUSD", label: "GBP/USD", price: "Source check", change: "Verify quote", tone: "flat", source: "Reference" },
  { symbol: "NAS100", label: "NASDAQ", price: "Source check", change: "Verify quote", tone: "flat", source: "Reference" },
  { symbol: "DXY", label: "DXY", price: "Source check", change: "Verify quote", tone: "flat", source: "Reference" }
];
