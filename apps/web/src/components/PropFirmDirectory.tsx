"use client";

import { useMemo, useState } from "react";
import { propFirms } from "../lib/data";
import { trustPrinciples } from "../lib/trust";
import { FirmCard } from "./FirmCard";

const markets = ["All markets", "Forex", "Crypto", "Synthetic", "Futures", "Indices", "Commodities"];

export function PropFirmDirectory() {
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState("All markets");
  const [payout, setPayout] = useState("Any payout");

  const firms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return propFirms
      .filter((firm) => (market === "All markets" ? true : firm.markets.includes(market)))
      .filter((firm) => (payout === "Any payout" ? true : firm.payoutFrequency.toLowerCase().includes(payout.toLowerCase())))
      .filter((firm) =>
        q
          ? `${firm.name} ${firm.country} ${firm.markets.join(" ")} ${firm.challengeTypes.join(" ")} ${firm.tags.join(" ")} ${firm.summary}`
              .toLowerCase()
              .includes(q)
          : true
      )
      .sort((a, b) => b.score - a.score);
  }, [market, payout, query]);

  return (
    <>
      <div className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1fr_180px_180px_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded-2xl border border-white/10 bg-void px-4 py-3 text-white outline-none ring-electric/30 placeholder:text-slate-500 focus:ring-4"
          placeholder="Search firm, country, payout, rules, crypto, futures, Nigeria..."
        />
        <select value={market} onChange={(event) => setMarket(event.target.value)} className="rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
          {markets.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={payout} onChange={(event) => setPayout(event.target.value)} className="rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
          <option>Any payout</option>
          <option>Weekly</option>
          <option>Bi-weekly</option>
          <option>On demand</option>
          <option>Monthly</option>
        </select>
        <div className="rounded-2xl bg-electric px-5 py-3 text-center font-bold text-void">{firms.length} firms</div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {trustPrinciples.map((item) => (
          <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-black text-white">{item.title}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">{item.copy}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {firms.map((firm) => (
          <FirmCard key={firm.slug} firm={firm} />
        ))}
      </div>
    </>
  );
}
