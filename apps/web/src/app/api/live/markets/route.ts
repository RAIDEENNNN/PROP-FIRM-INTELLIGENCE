import { fallbackMarkets, type MarketSnapshot } from "../../../../lib/markets";

export const dynamic = "force-dynamic";

type BinanceTicker = {
  lastPrice: string;
  priceChangePercent: string;
};

type CoinbaseStats = {
  open?: string;
  last?: string;
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

type AlphaVantageGlobalQuote = {
  "Global Quote"?: {
    "05. price"?: string;
    "10. change percent"?: string;
  };
  Note?: string;
  Information?: string;
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

const referenceProxySymbols: Record<string, { providerSymbol: string; note: string }> = {
  NAS100: { providerSymbol: "QQQ", note: "NASDAQ 100 ETF reference" },
  SPX500: { providerSymbol: "SPY", note: "S&P 500 ETF reference" },
  US30: { providerSymbol: "DIA", note: "Dow 30 ETF reference" },
  DXY: { providerSymbol: "UUP", note: "US Dollar ETF reference" }
};

const zeroDecimalSymbols = new Set(["BTCUSD", "ETHUSD", "NAS100", "SPX500", "US30"]);
const providerTimeoutMs = 4_500;

const plausiblePriceRanges: Record<string, { min: number; max: number }> = {
  XAUUSD: { min: 500, max: 10_000 },
  XAGUSD: { min: 5, max: 200 },
  BTCUSD: { min: 1_000, max: 1_000_000 },
  ETHUSD: { min: 100, max: 100_000 },
  EURUSD: { min: 0.5, max: 2 },
  GBPUSD: { min: 0.5, max: 2.5 },
  USDJPY: { min: 50, max: 300 },
  GBPJPY: { min: 50, max: 350 },
  AAPL: { min: 1, max: 5_000 },
  TSLA: { min: 1, max: 5_000 },
  NVDA: { min: 1, max: 5_000 },
  MSFT: { min: 1, max: 5_000 },
  NAS100: { min: 100, max: 100_000 },
  SPX500: { min: 100, max: 20_000 },
  US30: { min: 1_000, max: 100_000 },
  DXY: { min: 50, max: 200 }
};

const referencePriceRanges: Record<string, { min: number; max: number }> = {
  NAS100: { min: 1, max: 5_000 },
  SPX500: { min: 1, max: 5_000 },
  US30: { min: 1, max: 5_000 },
  DXY: { min: 1, max: 5_000 }
};

function isPlausiblePrice(symbol: string, price: number) {
  const range = plausiblePriceRanges[symbol];
  return Number.isFinite(price) && price > 0 && (!range || (price >= range.min && price <= range.max));
}

function isPlausibleReferencePrice(symbol: string, price: number) {
  const range = referencePriceRanges[symbol] ?? plausiblePriceRanges[symbol];
  return Number.isFinite(price) && price > 0 && (!range || (price >= range.min && price <= range.max));
}

function formatPrice(symbol: string, price: number) {
  const usesWholeNumbers = zeroDecimalSymbols.has(symbol);

  return price.toLocaleString("en-US", {
    minimumFractionDigits: usesWholeNumbers ? 0 : price < 10 ? 4 : 2,
    maximumFractionDigits: usesWholeNumbers ? 0 : price < 10 ? 4 : 2
  });
}

async function fetchJson<T>(input: string | URL, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), providerTimeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function applyQuote(markets: MarketSnapshot[], symbol: string, quote: TwelveQuote): MarketSnapshot[] {
  const rawPrice = Number(quote.close ?? quote.price);
  const rawChange = Number(quote.percent_change);
  if (!isPlausiblePrice(symbol, rawPrice)) return markets;

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
  if (!isPlausiblePrice(symbol, rawPrice)) return markets;

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
  if (!isPlausiblePrice(symbol, price)) return markets;

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
  if (!isPlausiblePrice(symbol, rawPrice)) return markets;

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

function applyReferenceQuote(markets: MarketSnapshot[], symbol: string, quote: FinnhubQuote | YahooQuote): MarketSnapshot[] {
  const isFinnhubQuote = Object.prototype.hasOwnProperty.call(quote, "c") || Object.prototype.hasOwnProperty.call(quote, "dp");
  const rawPrice = isFinnhubQuote ? Number((quote as FinnhubQuote).c) : Number((quote as YahooQuote).regularMarketPrice);
  const rawChange = isFinnhubQuote ? Number((quote as FinnhubQuote).dp) : Number((quote as YahooQuote).regularMarketChangePercent);
  if (!isPlausibleReferencePrice(symbol, rawPrice)) return markets;

  return markets.map((market) =>
    market.symbol === symbol
      ? {
          ...market,
          price: formatPrice(symbol, rawPrice),
          change: Number.isFinite(rawChange) ? `${rawChange >= 0 ? "+" : ""}${rawChange.toFixed(2)}%` : market.change,
          tone: Number.isFinite(rawChange) ? (rawChange > 0 ? "up" : rawChange < 0 ? "down" : "flat") : market.tone,
          source: "Reference" as const
        }
      : market
  );
}

function applyAlphaVantageQuote(markets: MarketSnapshot[], symbol: string, quote: AlphaVantageGlobalQuote, source: "Live" | "Reference" = "Live"): MarketSnapshot[] {
  const globalQuote = quote["Global Quote"];
  const rawPrice = Number(globalQuote?.["05. price"]);
  const rawChange = Number(globalQuote?.["10. change percent"]?.replace("%", ""));
  const isPlausible = source === "Reference" ? isPlausibleReferencePrice(symbol, rawPrice) : isPlausiblePrice(symbol, rawPrice);
  if (!isPlausible) return markets;

  return markets.map((market) =>
    market.symbol === symbol
      ? {
          ...market,
          price: formatPrice(symbol, rawPrice),
          change: Number.isFinite(rawChange) ? `${rawChange >= 0 ? "+" : ""}${rawChange.toFixed(2)}%` : market.change,
          tone: Number.isFinite(rawChange) ? (rawChange > 0 ? "up" : rawChange < 0 ? "down" : "flat") : market.tone,
          source
        }
      : market
  );
}

function applyCoinbaseStats(markets: MarketSnapshot[], symbol: string, stats: CoinbaseStats): MarketSnapshot[] {
  const rawPrice = Number(stats.last);
  const open = Number(stats.open);
  const rawChange = Number.isFinite(rawPrice) && Number.isFinite(open) && open > 0 ? ((rawPrice - open) / open) * 100 : Number.NaN;
  if (!isPlausiblePrice(symbol, rawPrice)) return markets;

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

  const twelveKey = process.env.TWELVE_DATA_API_KEY?.trim();
  if (twelveKey) {
    const quotes = await Promise.allSettled(
      Object.entries(twelveSymbols).map(async ([symbol, providerSymbols]) => {
        for (const providerSymbol of providerSymbols) {
          const url = new URL("https://api.twelvedata.com/quote");
          url.searchParams.set("symbol", providerSymbol);
          url.searchParams.set("apikey", twelveKey);
          const quote = await fetchJson<TwelveQuote>(url, { next: { revalidate: 30 } });
          if (!quote || quote.status === "error") continue;
          const rawPrice = Number(quote.close ?? quote.price);
          if (isPlausiblePrice(symbol, rawPrice)) return { symbol, quote };
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
    const payload = await fetchJson<GoldApiResponse>(
      "https://api.gold-api.com/price/XAU",
      {
        headers: { accept: "application/json" },
        next: { revalidate: 30 }
      }
    );

    if (payload) {
      markets = applySimplePrice(markets, "XAUUSD", Number(payload.price));
    }
  }

  if (markets.some((market) => market.symbol === "XAGUSD" && market.source !== "Live")) {
    const payload = await fetchJson<GoldApiResponse>(
      "https://api.gold-api.com/price/XAG",
      {
        headers: { accept: "application/json" },
        next: { revalidate: 30 }
      }
    );

    if (payload) {
      markets = applySimplePrice(markets, "XAGUSD", Number(payload.price));
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
        const payload = await fetchJson<FrankfurterResponse>(
          `https://api.frankfurter.app/latest?from=${pair.from}&to=${pair.to}`,
          {
            headers: { accept: "application/json" },
            next: { revalidate: 300 }
          }
        );
        if (!payload) return null;
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
        const quote = await fetchJson<FinnhubQuote>(url, {
            headers: { accept: "application/json" },
            next: { revalidate: 60 }
        });
        if (!quote) return null;
        return { symbol, quote };
      })
    );

    for (const result of finnhubQuotes) {
      if (result.status === "fulfilled" && result.value) {
        markets = applyFinnhubQuote(markets, result.value.symbol, result.value.quote);
      }
    }
  }

  const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY?.trim();
  const missingAlphaSymbols = markets
    .filter((market) => market.source !== "Live" && ["AAPL", "TSLA", "NVDA", "MSFT"].includes(market.symbol))
    .map((market) => market.symbol);

  if (alphaVantageKey && missingAlphaSymbols.length) {
    const alphaQuotes = await Promise.allSettled(
      missingAlphaSymbols.map(async (symbol) => {
        const url = new URL("https://www.alphavantage.co/query");
        url.searchParams.set("function", "GLOBAL_QUOTE");
        url.searchParams.set("symbol", symbol);
        url.searchParams.set("apikey", alphaVantageKey);
        const quote = await fetchJson<AlphaVantageGlobalQuote>(url, { next: { revalidate: 60 } });
        if (!quote) return null;
        return { symbol, quote };
      })
    );

    for (const result of alphaQuotes) {
      if (result.status === "fulfilled" && result.value) {
        markets = applyAlphaVantageQuote(markets, result.value.symbol, result.value.quote);
      }
    }
  }

  const missingSymbols = markets.filter((market) => market.source !== "Live").map((market) => market.symbol);
  const missingYahooSymbols = missingSymbols.map((symbol) => yahooSymbols[symbol]).filter(Boolean);

  if (missingYahooSymbols.length) {
    const url = new URL("https://query1.finance.yahoo.com/v7/finance/quote");
    url.searchParams.set("symbols", missingYahooSymbols.join(","));
    const payload = await fetchJson<YahooQuoteResponse>(url, {
        headers: {
          accept: "application/json",
          "user-agent": "FundedScope market reference/1.0"
        },
        next: { revalidate: 30 }
    });

    if (payload) {
      const quotesByProviderSymbol = new Map((payload.quoteResponse?.result ?? []).map((quote) => [quote.symbol, quote]));

      for (const [symbol, providerSymbol] of Object.entries(yahooSymbols)) {
        if (!missingSymbols.includes(symbol)) continue;
        const quote = quotesByProviderSymbol.get(providerSymbol);
        if (quote) markets = applyYahooQuote(markets, symbol, quote);
      }
    }
  }

  const missingReferenceSymbols = markets
    .filter((market) => market.source === "Unavailable" && referenceProxySymbols[market.symbol])
    .map((market) => market.symbol);

  if (finnhubKey && missingReferenceSymbols.length) {
    const referenceQuotes = await Promise.allSettled(
      missingReferenceSymbols.map(async (symbol) => {
        const url = new URL("https://finnhub.io/api/v1/quote");
        url.searchParams.set("symbol", referenceProxySymbols[symbol]!.providerSymbol);
        url.searchParams.set("token", finnhubKey);
        const quote = await fetchJson<FinnhubQuote>(url, {
          headers: { accept: "application/json" },
          next: { revalidate: 60 }
        });
        if (!quote) return null;
        return { symbol, quote };
      })
    );

    for (const result of referenceQuotes) {
      if (result.status === "fulfilled" && result.value) {
        markets = applyReferenceQuote(markets, result.value.symbol, result.value.quote);
      }
    }
  }

  if (alphaVantageKey) {
    const stillMissingReferenceSymbols = markets
      .filter((market) => market.source === "Unavailable" && referenceProxySymbols[market.symbol])
      .map((market) => market.symbol);

    const alphaReferenceQuotes = await Promise.allSettled(
      stillMissingReferenceSymbols.map(async (symbol) => {
        const url = new URL("https://www.alphavantage.co/query");
        url.searchParams.set("function", "GLOBAL_QUOTE");
        url.searchParams.set("symbol", referenceProxySymbols[symbol]!.providerSymbol);
        url.searchParams.set("apikey", alphaVantageKey);
        const quote = await fetchJson<AlphaVantageGlobalQuote>(url, { next: { revalidate: 60 } });
        if (!quote) return null;
        return { symbol, quote };
      })
    );

    for (const result of alphaReferenceQuotes) {
      if (result.status === "fulfilled" && result.value) {
        markets = applyAlphaVantageQuote(markets, result.value.symbol, result.value.quote, "Reference");
      }
    }
  }

  if (process.env.BINANCE_MARKET_DATA_ENABLED !== "false" && markets.some((market) => market.symbol === "BTCUSD" && market.source !== "Live")) {
    const ticker = await fetchJson<BinanceTicker>(
      "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT",
      {
        next: { revalidate: 20 }
      }
    );

    if (ticker) {
      const price = Number(ticker.lastPrice);
      const change = Number(ticker.priceChangePercent);

      markets = markets.map((market) =>
        market.symbol === "BTCUSD"
          ? {
              ...market,
              price: formatPrice("BTCUSD", price),
              change: Number.isFinite(change) ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : market.change,
              tone: change > 0 ? "up" : change < 0 ? "down" : "flat",
              source: "Live"
            }
          : market
      );
    }
  }

  const missingCoinbaseSymbols = markets
    .filter((market) => market.source !== "Live" && ["BTCUSD", "ETHUSD"].includes(market.symbol))
    .map((market) => market.symbol);

  if (missingCoinbaseSymbols.length) {
    const coinbaseStats = await Promise.allSettled(
      missingCoinbaseSymbols.map(async (symbol) => {
        const productId = symbol === "BTCUSD" ? "BTC-USD" : "ETH-USD";
        const stats = await fetchJson<CoinbaseStats>(`https://api.exchange.coinbase.com/products/${productId}/stats`, {
          headers: { accept: "application/json" },
          next: { revalidate: 20 }
        });
        if (!stats) return null;
        return { symbol, stats };
      })
    );

    for (const result of coinbaseStats) {
      if (result.status === "fulfilled" && result.value) {
        markets = applyCoinbaseStats(markets, result.value.symbol, result.value.stats);
      }
    }
  }

  const liveCount = markets.filter((market) => market.source === "Live").length;
  const referenceCount = markets.filter((market) => market.source === "Reference").length;

  return Response.json({
    ok: true,
    markets,
    liveCount,
    referenceCount,
    message: liveCount || referenceCount
      ? "Market quotes attached where available. Always verify executable prices inside your trading platform."
      : "Market data is temporarily unavailable. Verify executable prices inside your broker or trading platform."
  });
}
