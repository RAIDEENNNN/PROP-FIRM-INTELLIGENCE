export type MarketSnapshot = {
  symbol: string;
  label: string;
  price: string;
  change: string;
  tone: "up" | "down" | "flat";
  source: "Live" | "Reference" | "Unavailable";
};

export const fallbackMarkets: MarketSnapshot[] = [
  { symbol: "XAUUSD", label: "Gold", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "XAGUSD", label: "Silver", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "BTCUSD", label: "BTC", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "ETHUSD", label: "ETH", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "EURUSD", label: "EUR/USD", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "GBPUSD", label: "GBP/USD", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "USDJPY", label: "USD/JPY", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "GBPJPY", label: "GBP/JPY", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "AAPL", label: "AAPL", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "TSLA", label: "TSLA", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "NVDA", label: "NVDA", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "MSFT", label: "MSFT", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "NAS100", label: "NASDAQ", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "SPX500", label: "S&P 500", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "US30", label: "US30", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" },
  { symbol: "DXY", label: "DXY", price: "Unavailable", change: "", tone: "flat", source: "Unavailable" }
];
