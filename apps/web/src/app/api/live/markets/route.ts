import { fallbackMarkets, type MarketSnapshot } from "../../../../lib/markets";

export const dynamic = "force-dynamic";

type BinanceTicker = {
  lastPrice: string;
  priceChangePercent: string;
};

type TwelveQuote = {
  symbol?: string;
  close?: string;
  price?: string;
  percent_change?: string;
  status?: string;
  message?: string;
};

const twelveSymbols: Record<string, string> = {
  XAUUSD: "XAU/USD",
  EURUSD: "EUR/USD",
  GBPUSD: "GBP/USD",
  NAS100: "IXIC",
  DXY: "DXY"
};

function applyQuote(markets: MarketSnapshot[], symbol: string, quote: TwelveQuote): MarketSnapshot[] {
  const rawPrice = Number(quote.close ?? quote.price);
  const rawChange = Number(quote.percent_change);
  if (!Number.isFinite(rawPrice)) return markets;

  return markets.map((market) =>
    market.symbol === symbol
      ? {
          ...market,
          price: rawPrice.toLocaleString("en-US", {
            minimumFractionDigits: rawPrice < 10 ? 4 : 2,
            maximumFractionDigits: rawPrice < 10 ? 4 : 2
          }),
          change: Number.isFinite(rawChange) ? `${rawChange >= 0 ? "+" : ""}${rawChange.toFixed(2)}%` : market.change,
          tone: Number.isFinite(rawChange) ? (rawChange > 0 ? "up" : rawChange < 0 ? "down" : "flat") : market.tone,
          source: "Live" as const
        }
      : market
  );
}

export async function GET() {
  let markets: MarketSnapshot[] = fallbackMarkets;

  try {
    const twelveKey = process.env.TWELVE_DATA_API_KEY?.trim();
    if (twelveKey) {
      const quotes = await Promise.all(
        Object.entries(twelveSymbols).map(async ([symbol, providerSymbol]) => {
          const url = new URL("https://api.twelvedata.com/quote");
          url.searchParams.set("symbol", providerSymbol);
          url.searchParams.set("apikey", twelveKey);
          const response = await fetch(url, { next: { revalidate: 30 } });
          if (!response.ok) return null;
          const quote = (await response.json()) as TwelveQuote;
          if (quote.status === "error") return null;
          return { symbol, quote };
        })
      );

      for (const item of quotes) {
        if (item) markets = applyQuote(markets, item.symbol, item.quote);
      }
    }

    if (process.env.BINANCE_MARKET_DATA_ENABLED !== "false") {
      const response = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT", {
        next: { revalidate: 20 }
      });

      if (response.ok) {
        const ticker = (await response.json()) as BinanceTicker;
        const price = Number(ticker.lastPrice);
        const change = Number(ticker.priceChangePercent);

        markets = markets.map((market) =>
          market.symbol === "BTCUSD"
            ? {
                ...market,
                price: price.toLocaleString("en-US", { maximumFractionDigits: 0 }),
                change: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
                tone: change > 0 ? "up" : change < 0 ? "down" : "flat",
                source: "Live"
              }
            : market
        );
      }
    }
  } catch {
    markets = fallbackMarkets;
  }

  return Response.json({
    ok: true,
    markets,
    message: markets.some((market) => market.source === "Live")
      ? "Market quotes attached where available. Always verify executable prices inside your trading platform."
      : "Market data is temporarily unavailable. Verify executable prices inside your broker or trading platform."
  });
}
