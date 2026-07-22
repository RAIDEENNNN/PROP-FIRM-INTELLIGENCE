"use client";

import { useEffect, useState } from "react";
import { fallbackMarkets, type MarketSnapshot } from "../lib/markets";

export function MarketReferenceGrid() {
  const [markets, setMarkets] = useState<MarketSnapshot[]>(fallbackMarkets);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMarkets() {
      try {
        const response = await fetch("/api/live/markets", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { markets?: MarketSnapshot[] };
        if (!cancelled && payload.markets?.length) setMarkets(payload.markets);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void loadMarkets();
    const interval = window.setInterval(loadMarkets, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const marketCount = markets.filter((market) => market.source === "Live" || market.source === "Reference").length;
  const sourceLabel = (source: MarketSnapshot["source"]) => {
    if (source === "Live") return "Live";
    if (source === "Reference") return "Reference";
    return "Checking";
  };

  const detailLabel = (market: MarketSnapshot) => {
    if (market.change) return market.change;
    if (market.source === "Live") return "Provider-backed";
    if (market.source === "Reference") return "Provider reference";
    return "Provider feed required";
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Market reference preview</p>
          <h2 className="mt-2 text-3xl font-black text-white">Markets to verify before trading</h2>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${marketCount ? "border-success/25 bg-success/10 text-success" : "border-white/10 text-slate-400"}`}>
          {marketCount ? `${marketCount} market references` : loaded ? "Reference feed checking" : "Loading references"}
        </span>
      </div>
      <div className="mt-6 grid gap-3 min-[520px]:grid-cols-2 xl:grid-cols-3">
        {markets.map((market) => (
          <div key={market.symbol} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-bold text-slate-400">{market.label}</p>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                  market.source === "Live" ? "bg-success/10 text-success" : market.source === "Reference" ? "bg-electric/10 text-electric" : "bg-white/[0.04] text-slate-500"
                }`}
              >
                {sourceLabel(market.source)}
              </span>
            </div>
            <p className="mt-2 min-w-0 break-words text-xl font-black text-white sm:text-2xl">{market.price}</p>
            <p className={`mt-1 text-sm font-bold ${market.tone === "up" ? "text-success" : market.tone === "down" ? "text-danger" : "text-slate-400"}`}>
              {detailLabel(market)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
