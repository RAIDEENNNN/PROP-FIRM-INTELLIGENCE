"use client";

import { useEffect, useState } from "react";
import { fallbackMarkets, type MarketSnapshot } from "../lib/markets";

export function LiveMarketBar() {
  const [markets, setMarkets] = useState<MarketSnapshot[]>(fallbackMarkets);
  const [message, setMessage] = useState("Market data is temporarily unavailable. Verify executable prices inside your trading platform before placing trades.");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMarkets() {
      try {
        const response = await fetch("/api/live/markets", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { markets?: MarketSnapshot[]; message?: string };
        if (!cancelled && payload.markets?.length) {
          setMarkets(payload.markets);
          setMessage(payload.message ?? "Market data loaded.");
        }
      } catch {
        if (!cancelled) setMessage("Market data is temporarily unavailable. Verify executable quotes inside your broker or prop-firm platform.");
      }
    }

    void loadMarkets();
    const interval = window.setInterval(loadMarkets, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const hasLiveQuotes = markets.some((market) => market.source === "Live");

  if (!hasLiveQuotes) {
    if (dismissed) return null;

    return (
      <section className="border-y border-warning/15 bg-warning/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-5">
          <p className="text-xs font-semibold leading-5 text-warning">
            Market reference data is currently unavailable. Verify executable prices in your trading platform.
          </p>
          <button type="button" onClick={() => setDismissed(true)} className="shrink-0 rounded-full border border-warning/25 px-3 py-1 text-xs font-black text-warning">
            Dismiss
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden border-y border-white/10 bg-white/[0.03]">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-5">
        <div className={`z-10 shrink-0 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${hasLiveQuotes ? "border-electric/30 bg-void text-electric" : "border-warning/30 bg-warning/10 text-warning"}`}>
          Market reference
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="truncate text-xs font-semibold text-slate-400 sm:hidden">{message}</p>
          <div className="market-marquee hidden items-center gap-4 sm:flex">
            {[...markets, ...markets].map((market, index) => (
              <div key={`${market.symbol}-${index}`} className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-void/70 px-4 py-2">
                <span className="text-xs font-bold text-slate-400">{market.label}</span>
                <span className="text-sm font-black text-white">{market.price}</span>
                {market.change ? (
                  <span className={`text-xs font-bold ${market.tone === "up" ? "text-success" : market.tone === "down" ? "text-danger" : "text-slate-400"}`}>
                    {market.change}
                  </span>
                ) : null}
                <span className="text-[10px] uppercase tracking-[0.16em] text-slate-600">{market.source}</span>
              </div>
            ))}
            <p className="w-[min(360px,80vw)] shrink-0 text-xs text-slate-500">{message}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
