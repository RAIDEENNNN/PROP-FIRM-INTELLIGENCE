import { spreadRecords } from "../../../../lib/spreads";

export const dynamic = "force-dynamic";

const binanceSymbols: Record<string, string> = {
  BTCUSD: "BTCUSDT",
  ETHUSD: "ETHUSDT",
  SOLUSD: "SOLUSDT",
  XRPUSD: "XRPUSDT",
  BNBUSD: "BNBUSDT",
  ADAUSD: "ADAUSDT",
  DOGEUSD: "DOGEUSDT",
  LTCUSD: "LTCUSDT",
  DOTUSD: "DOTUSDT",
  AVAXUSD: "AVAXUSDT",
  LINKUSD: "LINKUSDT",
  MATICUSD: "MATICUSDT"
};

type BinanceBookTicker = {
  symbol: string;
  bidPrice: string;
  askPrice: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const firm = searchParams.get("firm");
  const symbol = searchParams.get("symbol");

  let records = spreadRecords;
  if (category) records = records.filter((record) => record.category.toLowerCase() === category.toLowerCase());
  if (firm) records = records.filter((record) => record.firmSlug === firm);
  if (symbol) records = records.filter((record) => record.symbol === symbol.toUpperCase());

  const shouldFetchBinance = process.env.BINANCE_MARKET_DATA_ENABLED !== "false";
  let liveCryptoQuotes: Array<{ symbol: string; bid: number; ask: number; marketSpread: number }> = [];

  if (shouldFetchBinance) {
    const needed = Array.from(new Set(records.map((record) => binanceSymbols[record.symbol]).filter(Boolean)));
    liveCryptoQuotes = (
      await Promise.all(
        needed.slice(0, 20).map(async (binanceSymbol) => {
          const response = await fetch(`https://api.binance.com/api/v3/ticker/bookTicker?symbol=${binanceSymbol}`, {
            next: { revalidate: 30 }
          });
          if (!response.ok) return null;
          const ticker = (await response.json()) as BinanceBookTicker;
          const bid = Number(ticker.bidPrice);
          const ask = Number(ticker.askPrice);
          return {
            symbol: Object.keys(binanceSymbols).find((key) => binanceSymbols[key] === ticker.symbol) ?? ticker.symbol,
            bid,
            ask,
            marketSpread: Number((ask - bid).toFixed(8))
          };
        })
      )
    ).filter(Boolean) as Array<{ symbol: string; bid: number; ask: number; marketSpread: number }>;
  }

  return Response.json({
    ok: true,
    live: liveCryptoQuotes.length > 0,
    message:
      liveCryptoQuotes.length > 0
        ? "Crypto market quotes attached where public Binance symbols are available. Prop-firm-specific spreads remain provider/feed dependent."
        : "Returning FundedScope indicative spread matrix. Add provider keys for firm/broker-specific live spreads.",
    count: records.length,
    records,
    liveCryptoQuotes
  });
}
