import { propFirms, type PropFirm } from "./data";

export type InstrumentCategory = "Forex" | "Crypto" | "Synthetic";

export type Instrument = {
  symbol: string;
  name: string;
  category: InstrumentCategory;
  quoteUnit: "pips" | "points" | "bps";
  baseline: number;
  sessionRisk: "Low" | "Medium" | "High";
};

export type SpreadRecord = {
  firmSlug: string;
  firmName: string;
  symbol: string;
  instrumentName: string;
  category: InstrumentCategory;
  spread: number;
  quoteUnit: Instrument["quoteUnit"];
  source: "Indicative baseline" | "Live feed ready";
  status: "Normal" | "Watch" | "Wide";
  updatedAt: string;
};

const forexMajors: Instrument[] = [
  ["EURUSD", "Euro / US Dollar", 0.7],
  ["GBPUSD", "British Pound / US Dollar", 0.9],
  ["USDJPY", "US Dollar / Japanese Yen", 0.8],
  ["USDCHF", "US Dollar / Swiss Franc", 1.0],
  ["AUDUSD", "Australian Dollar / US Dollar", 0.8],
  ["USDCAD", "US Dollar / Canadian Dollar", 1.0],
  ["NZDUSD", "New Zealand Dollar / US Dollar", 1.1]
].map(([symbol, name, baseline]) => ({
  symbol: String(symbol),
  name: String(name),
  category: "Forex" as const,
  quoteUnit: "pips" as const,
  baseline: Number(baseline),
  sessionRisk: "Low" as const
}));

const forexMinors: Instrument[] = [
  ["EURGBP", "Euro / British Pound", 1.0],
  ["EURJPY", "Euro / Japanese Yen", 1.2],
  ["EURCHF", "Euro / Swiss Franc", 1.3],
  ["EURAUD", "Euro / Australian Dollar", 1.8],
  ["EURCAD", "Euro / Canadian Dollar", 1.8],
  ["EURNZD", "Euro / New Zealand Dollar", 2.3],
  ["GBPJPY", "British Pound / Japanese Yen", 1.8],
  ["GBPCHF", "British Pound / Swiss Franc", 2.0],
  ["GBPAUD", "British Pound / Australian Dollar", 2.2],
  ["GBPCAD", "British Pound / Canadian Dollar", 2.3],
  ["GBPNZD", "British Pound / New Zealand Dollar", 2.8],
  ["AUDJPY", "Australian Dollar / Japanese Yen", 1.4],
  ["AUDCHF", "Australian Dollar / Swiss Franc", 1.5],
  ["AUDCAD", "Australian Dollar / Canadian Dollar", 1.6],
  ["AUDNZD", "Australian Dollar / New Zealand Dollar", 1.8],
  ["CADJPY", "Canadian Dollar / Japanese Yen", 1.5],
  ["CADCHF", "Canadian Dollar / Swiss Franc", 1.6],
  ["CHFJPY", "Swiss Franc / Japanese Yen", 1.7],
  ["NZDJPY", "New Zealand Dollar / Japanese Yen", 1.7],
  ["NZDCHF", "New Zealand Dollar / Swiss Franc", 1.8],
  ["NZDCAD", "New Zealand Dollar / Canadian Dollar", 1.9]
].map(([symbol, name, baseline]) => ({
  symbol: String(symbol),
  name: String(name),
  category: "Forex" as const,
  quoteUnit: "pips" as const,
  baseline: Number(baseline),
  sessionRisk: "Medium" as const
}));

const forexExotics: Instrument[] = [
  ["USDZAR", "US Dollar / South African Rand", 80],
  ["USDTRY", "US Dollar / Turkish Lira", 120],
  ["USDMXN", "US Dollar / Mexican Peso", 45],
  ["USDSEK", "US Dollar / Swedish Krona", 35],
  ["USDNOK", "US Dollar / Norwegian Krone", 38],
  ["USDSGD", "US Dollar / Singapore Dollar", 8],
  ["USDHKD", "US Dollar / Hong Kong Dollar", 6],
  ["EURTRY", "Euro / Turkish Lira", 150],
  ["EURZAR", "Euro / South African Rand", 95],
  ["GBPZAR", "British Pound / South African Rand", 110]
].map(([symbol, name, baseline]) => ({
  symbol: String(symbol),
  name: String(name),
  category: "Forex" as const,
  quoteUnit: "pips" as const,
  baseline: Number(baseline),
  sessionRisk: "High" as const
}));

const cryptoPairs: Instrument[] = [
  ["BTCUSD", "Bitcoin / US Dollar", 18],
  ["ETHUSD", "Ethereum / US Dollar", 2.2],
  ["SOLUSD", "Solana / US Dollar", 0.18],
  ["XRPUSD", "XRP / US Dollar", 0.0018],
  ["BNBUSD", "BNB / US Dollar", 0.85],
  ["ADAUSD", "Cardano / US Dollar", 0.0025],
  ["DOGEUSD", "Dogecoin / US Dollar", 0.00045],
  ["LTCUSD", "Litecoin / US Dollar", 0.16],
  ["DOTUSD", "Polkadot / US Dollar", 0.025],
  ["AVAXUSD", "Avalanche / US Dollar", 0.055],
  ["LINKUSD", "Chainlink / US Dollar", 0.04],
  ["MATICUSD", "Polygon / US Dollar", 0.0022]
].map(([symbol, name, baseline]) => ({
  symbol: String(symbol),
  name: String(name),
  category: "Crypto" as const,
  quoteUnit: "points" as const,
  baseline: Number(baseline),
  sessionRisk: "High" as const
}));

const syntheticPairs: Instrument[] = [
  ["VIX10", "Volatility 10 Index", 0.35],
  ["VIX25", "Volatility 25 Index", 0.45],
  ["VIX50", "Volatility 50 Index", 0.65],
  ["VIX75", "Volatility 75 Index", 0.85],
  ["VIX100", "Volatility 100 Index", 1.05],
  ["BOOM500", "Boom 500 Index", 1.2],
  ["BOOM1000", "Boom 1000 Index", 1.8],
  ["CRASH500", "Crash 500 Index", 1.2],
  ["CRASH1000", "Crash 1000 Index", 1.8],
  ["STEPINDEX", "Step Index", 0.15],
  ["JUMP10", "Jump 10 Index", 0.4],
  ["JUMP25", "Jump 25 Index", 0.55],
  ["RANGE100", "Range Break 100", 0.75],
  ["RANGE200", "Range Break 200", 0.95]
].map(([symbol, name, baseline]) => ({
  symbol: String(symbol),
  name: String(name),
  category: "Synthetic" as const,
  quoteUnit: "points" as const,
  baseline: Number(baseline),
  sessionRisk: "High" as const
}));

export const instruments = [...forexMajors, ...forexMinors, ...forexExotics, ...cryptoPairs, ...syntheticPairs];

function firmSpreadFactor(firm: PropFirm) {
  const scoreFactor = 1 + (90 - firm.score) / 140;
  const futuresPenalty = firm.markets.includes("Futures") ? 1.25 : 1;
  const cryptoPenalty = firm.markets.includes("Crypto") ? 0.98 : 1.12;
  return Math.max(0.82, scoreFactor * futuresPenalty * cryptoPenalty);
}

function deterministicNudge(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  return 0.92 + (hash % 18) / 100;
}

function statusFor(spread: number, baseline: number): SpreadRecord["status"] {
  if (spread > baseline * 1.45) return "Wide";
  if (spread > baseline * 1.2) return "Watch";
  return "Normal";
}

export function buildSpreadRecords() {
  const updatedAt = "2026-07-06T06:00:00.000Z";

  return propFirms.flatMap((firm) =>
    instruments.map((instrument) => {
      const categoryPenalty =
        instrument.category === "Synthetic" ? 1.35 : instrument.category === "Crypto" ? 1.2 : instrument.sessionRisk === "High" ? 1.18 : 1;
      const spread = Number((instrument.baseline * firmSpreadFactor(firm) * categoryPenalty * deterministicNudge(`${firm.slug}-${instrument.symbol}`)).toFixed(instrument.baseline < 1 ? 3 : 2));

      return {
        firmSlug: firm.slug,
        firmName: firm.name,
        symbol: instrument.symbol,
        instrumentName: instrument.name,
        category: instrument.category,
        spread,
        quoteUnit: instrument.quoteUnit,
        source: "Indicative baseline" as const,
        status: statusFor(spread, instrument.baseline),
        updatedAt
      };
    })
  );
}

export const spreadRecords = buildSpreadRecords();

export const spreadStats = {
  firms: propFirms.length,
  instruments: instruments.length,
  records: spreadRecords.length,
  forexPairs: instruments.filter((item) => item.category === "Forex").length,
  cryptoPairs: instruments.filter((item) => item.category === "Crypto").length,
  syntheticPairs: instruments.filter((item) => item.category === "Synthetic").length
};
