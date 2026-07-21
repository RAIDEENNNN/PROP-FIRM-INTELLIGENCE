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

type YahooQuote = {
  symbol?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
};

type YahooQuoteResponse = {
  quoteResponse?: {
    result?: YahooQuote[];
  };
};

type FrankfurterResponse = {
  rates?: Record<string, number>;
};

type GoldApiResponse = {
  price?: number;
};

type FinnhubQuote = {
  c?: number;
  dp?: number;
};

const twelveSymbols: Record<string, string[]> = {
  XAUUSD: ["XAU/USD", "XAUUSD"],
  XAGUSD: ["XAG/USD", "XAGUSD"],
  BTCUSD: ["BTC/USD", "BTCUSD"],
  ETHUSD: ["ETH/USD", "ETHUSD"],
  EURUSD: ["EUR/USD", "EURUSD"],
  GBPUSD: ["GBP/USD", "GBPUSD"],
  USDJPY: ["USD/JPY", "USDJPY"],
  GBPJPY: ["GBP/JPY", "GBPJPY"],
  NAS100: ["NDX", "IXIC", "NASDAQ100", "NAS100"],
  SPX500: ["SPX", "SPX500", "GSPC"],
  US30: ["DJI", "DJIA", "US30"],
  DXY: ["DXY", "DXY.INDX", "DX"],
  AAPL: ["AAPL"],
  TSLA: ["TSLA"],
  NVDA: ["NVDA"],
  MSFT: ["MSFT"]
};

const yahooSymbols: Record<string, string> = {
  XAUUSD: "GC=F",
  XAGUSD: "SI=F",
  EURUSD: "EURUSD=X",
  GBPUSD: "GBPUSD=X",
  USDJPY: "JPY=X",
  GBPJPY: "GBPJPY=X",
  NAS100: "NQ=F",
  SPX500: "ES=F",
  US30: "YM=F",
  DXY: "DX-Y.NYB",
  BTCUSD: "BTC-USD",
  ETHUSD: "ETH-USD",
  AAPL: "AAPL",
  TSLA: "TSLA",
  NVDA: "NVDA",
  MSFT: "MSFT"
};

const finnhubSymbols: Record<string, string> = {
  BTCUSD: "BINANCE:BTCUSDT",
  ETHUSD: "BINANCE:ETHUSDT",
  AAPL: "AAPL",
  TSLA: "TSLA",
  NVDA: "NVDA",
  MSFT: "MSFT"
};

const zeroDecimalSymbols = new Set(["BTCUSD", "ETHUSD", "NAS100", "SPX500", "US30"]);

function formatPrice(symbol: string, price: number) {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: price < 10 ? 4 : 2,
    maximumFractionDigits: zeroDecimalSymbols.has(symbol) ? 0 : price < 10 ? 4 : 2
  });
}

function applyQuote(markets: MarketSnapshot[], symbol: string, quote: TwelveQuote): MarketSnapshot[] {
  const rawPrice = Number(quote.close ?? quote.price);
  const rawChange = Number(quote.percent_change);
  if (!Number.isFinite(rawPrice)) return markets;

  return markets.map((market) =>
    market.symbol === symbol
      ? {
          ...market,
          price: formatPrice(symbol, rawPrice),
          change: Number.isFinite(rawChange) ? `${rawChange >= 0 ? "+" : ""}${rawChange.toFixed(2)}%` : market.change,
          tone: Number.isFinite(rawChange) ? (rawChange > 0 ? "up" : rawChange < 0 ? "down" : "flat") : market.tone,
          source: "Live" as const
        }
      : market
  );
}

function applyYahooQuote(markets: MarketSnapshot[], symbol: string, quote: YahooQuote): MarketSnapshot[] {
  const rawPrice = Number(quote.regularMarketPrice);
  const rawChange = Number(quote.regularMarketChangePercent);
  if (!Number.isFinite(rawPrice)) return markets;

  return markets.map((market) =>
    market.symbol === symbol
      ? {
          ...market,
          price: formatPrice(symbol, rawPrice),
          change: Number.isFinite(rawChange) ? `${rawChange >= 0 ? "+" : ""}${rawChange.toFixed(2)}%` : market.change,
          tone: Number.isFinite(rawChange) ? (rawChange > 0 ? "up" : rawChange < 0 ? "down" : "flat") : market.tone,
          source: "Live" as const
        }
      : market
  );
}

function applySimplePrice(markets: MarketSnapshot[], symbol: string, price: number): MarketSnapshot[] {
  if (!Number.isFinite(price)) return markets;

  return markets.map((market) =>
    market.symbol === symbol
      ? {
          ...market,
          price: formatPrice(symbol, price),
          source: "Live" as const
        }
      : market
  );
}

function applyFinnhubQuote(markets: MarketSnapshot[], symbol: string, quote: FinnhubQuote): MarketSnapshot[] {
  const rawPrice = Number(quote.c);
  const rawChange = Number(quote.dp);
  if (!Number.isFinite(rawPrice) || rawPrice <= 0) return markets;

  return markets.map((market) =>
    market.symbol === symbol
      ? {
          ...market,
          price: formatPrice(symbol, rawPrice),
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
      const quotes = await Promise.allSettled(
        Object.entries(twelveSymbols).map(async ([symbol, providerSymbols]) => {
          for (const providerSymbol of providerSymbols) {
            const url = new URL("https://api.twelvedata.com/quote");
            url.searchParams.set("symbol", providerSymbol);
            url.searchParams.set("apikey", twelveKey);
            const response = await fetch(url, { next: { revalidate: 30 } });
            if (!response.ok) continue;
            const quote = (await response.json()) as TwelveQuote;
            if (quote.status === "error") continue;
            const rawPrice = Number(quote.close ?? quote.price);
            if (Number.isFinite(rawPrice)) return { symbol, quote };
          }

          return null;
        })
      );

      for (const result of quotes) {
        const item = result.status === "fulfilled" ? result.value : null;
        if (item) markets = applyQuote(markets, item.symbol, item.quote);
      }
    }

    if (markets.some((market) => market.symbol === "XAUUSD" && market.source !== "Live")) {
      const response = await fetch("https://api.gold-api.com/price/XAU", {
        headers: { accept: "application/json" },
        next: { revalidate: 30 }
      });

      if (response.ok) {
        const payload = (await response.json()) as GoldApiResponse;
        markets = applySimplePrice(markets, "XAUUSD", Number(payload.price));
      }
    }

    const fallbackFxPairs = [
      { symbol: "EURUSD", from: "EUR", to: "USD" },
      { symbol: "GBPUSD", from: "GBP", to: "USD" },
      { symbol: "USDJPY", from: "USD", to: "JPY" },
      { symbol: "GBPJPY", from: "GBP", to: "JPY" }
    ].filter((pair) => markets.some((market) => market.symbol === pair.symbol && market.source !== "Live"));

    if (fallbackFxPairs.length) {
      const fxRequests = await Promise.allSettled(
        fallbackFxPairs.map(async (pair) => {
          const response = await fetch(`https://api.frankfurter.app/latest?from=${pair.from}&to=${pair.to}`, {
            headers: { accept: "application/json" },
            next: { revalidate: 300 }
          });
          if (!response.ok) return null;
          const payload = (await response.json()) as FrankfurterResponse;
          return { symbol: pair.symbol, price: Number(payload.rates?.[pair.to]) };
        })
      );

      for (const result of fxRequests) {
        if (result.status === "fulfilled" && result.value) {
          markets = applySimplePrice(markets, result.value.symbol, result.value.price);
        }
      }
    }

    const finnhubKey = process.env.FINNHUB_API_KEY?.trim();
    const missingFinnhubSymbols = markets
      .filter((market) => market.source !== "Live" && finnhubSymbols[market.symbol])
      .map((market) => market.symbol);

    if (finnhubKey && missingFinnhubSymbols.length) {
      const finnhubQuotes = await Promise.allSettled(
        missingFinnhubSymbols.map(async (symbol) => {
          const url = new URL("https://finnhub.io/api/v1/quote");
          url.searchParams.set("symbol", finnhubSymbols[symbol]!);
          url.searchParams.set("token", finnhubKey);
          const response = await fetch(url, {
            headers: { accept: "application/json" },
            next: { revalidate: 60 }
          });
          if (!response.ok) return null;
          const quote = (await response.json()) as FinnhubQuote;
          return { symbol, quote };
        })
      );

      for (const result of finnhubQuotes) {
        if (result.status === "fulfilled" && result.value) {
          markets = applyFinnhubQuote(markets, result.value.symbol, result.value.quote);
        }
      }
    }

    const missingSymbols = markets.filter((market) => market.source !== "Live").map((market) => market.symbol);
    const missingYahooSymbols = missingSymbols.map((symbol) => yahooSymbols[symbol]).filter(Boolean);

    if (missingYahooSymbols.length) {
      const url = new URL("https://query1.finance.yahoo.com/v7/finance/quote");
      url.searchParams.set("symbols", missingYahooSymbols.join(","));
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "user-agent": "FundedScope market reference/1.0"
        },
        next: { revalidate: 30 }
      });

      if (response.ok) {
        const payload = (await response.json()) as YahooQuoteResponse;
        const quotesByProviderSymbol = new Map((payload.quoteResponse?.result ?? []).map((quote) => [quote.symbol, quote]));

        for (const [symbol, providerSymbol] of Object.entries(yahooSymbols)) {
          if (!missingSymbols.includes(symbol)) continue;
          const quote = quotesByProviderSymbol.get(providerSymbol);
          if (quote) markets = applyYahooQuote(markets, symbol, quote);
        }
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
    // Keep any quotes already collected instead of wiping the whole market reference strip.
  }

  return Response.json({
    ok: true,
    markets,
    message: markets.some((market) => market.source === "Live")
      ? "Market quotes attached where available. Always verify executable prices inside your trading platform."
      : "Market data is temporarily unavailable. Verify executable prices inside your broker or trading platform."
  });
}
