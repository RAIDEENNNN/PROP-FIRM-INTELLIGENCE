export type MarketSnapshot = {
  symbol: string;
  label: string;
  price: string;
  change: string;
  tone: "up" | "down" | "flat";
  source: "Live" | "Indicative";
};

export const fallbackMarkets: MarketSnapshot[] = [
  { symbol: "XAUUSD", label: "Gold", price: "2,365.40", change: "+0.42%", tone: "up", source: "Indicative" },
  { symbol: "BTCUSD", label: "BTC", price: "63,820", change: "-0.18%", tone: "down", source: "Indicative" },
  { symbol: "EURUSD", label: "EUR/USD", price: "1.0842", change: "+0.06%", tone: "up", source: "Indicative" },
  { symbol: "GBPUSD", label: "GBP/USD", price: "1.2765", change: "+0.03%", tone: "up", source: "Indicative" },
  { symbol: "NAS100", label: "NASDAQ", price: "19,842", change: "-0.21%", tone: "down", source: "Indicative" },
  { symbol: "DXY", label: "DXY", price: "104.28", change: "0.00%", tone: "flat", source: "Indicative" }
];
