"use client";

import { useMemo, useState } from "react";
import { propFirms } from "../lib/data";
import { spreadRecords, spreadStats, type InstrumentCategory } from "../lib/spreads";
import { FirmLogo } from "./FirmLogo";
import { GlassCard } from "./GlassCard";

const categories: Array<"All" | InstrumentCategory> = ["All", "Forex", "Commodities", "Indices", "Crypto", "Synthetic"];
const modelReviewDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(spreadStats.updatedAt));

export function SpreadMatrix() {
  const [query, setQuery] = useState("");
  const [firmSlug, setFirmSlug] = useState("all");
  const [category, setCategory] = useState<"All" | InstrumentCategory>("All");
  const [showMethodology, setShowMethodology] = useState(false);

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return spreadRecords
      .filter((record) => (firmSlug === "all" ? true : record.firmSlug === firmSlug))
      .filter((record) => (category === "All" ? true : record.category === category))
      .filter((record) =>
        normalized
          ? `${record.firmName} ${record.symbol} ${record.instrumentName} ${record.category}`.toLowerCase().includes(normalized)
          : true
      )
      .slice(0, 350);
  }, [category, firmSlug, query]);

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <GlassCard>
          <p className="text-sm text-slate-400">Prop firms covered</p>
          <p className="mt-2 text-3xl font-black text-white">{spreadStats.firms}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">Instrument universe</p>
          <p className="mt-2 text-3xl font-black text-white">{spreadStats.instruments}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">Research estimate rows</p>
          <p className="mt-2 text-3xl font-black text-white">{spreadStats.records.toLocaleString()}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">Categories</p>
          <p className="mt-2 text-3xl font-black text-white">FX · Metals · Indices · Crypto · Synthetic</p>
        </GlassCard>
      </div>

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1fr_220px_180px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded-2xl border border-white/10 bg-void px-4 py-3 text-white outline-none ring-electric/30 placeholder:text-slate-500 focus:ring-4"
          placeholder="Search XAUUSD, XAGUSD, NAS100, US30, Maven Trading..."
        />
        <select value={firmSlug} onChange={(event) => setFirmSlug(event.target.value)} className="rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
          <option value="all">Every prop firm</option>
          {propFirms.map((firm) => (
            <option key={firm.slug} value={firm.slug}>
              {firm.name}
            </option>
          ))}
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value as "All" | InstrumentCategory)} className="rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-electric">Data transparency</p>
            <h2 className="mt-1 text-xl font-black text-white">These are research estimates, not live spreads.</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowMethodology((value) => !value)}
            className="rounded-full bg-white px-5 py-3 text-sm font-black text-void"
          >
            {showMethodology ? "Hide explanation" : "Explain spreads"}
          </button>
        </div>
        {showMethodology ? (
          <div className="mt-5">
            <div className="rounded-3xl border border-electric/20 bg-electric/10 p-5">
              <p className="text-lg font-black text-white">Simple version</p>
              <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-300">
                These numbers are FundedScope research estimates reviewed on {modelReviewDate}. Source: FundedScope baseline model using public firm profiles, instrument categories and risk adjustments. They are not live quotes and should never be used as executable spread values.
              </p>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-void/60 p-4">
                <p className="font-black text-white">1. Start with the pair</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Gold, EUR/USD, BTC and NAS100 all usually have different spread ranges. We start with a normal range for that instrument.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-void/60 p-4">
                <p className="font-black text-white">2. Adjust for the firm</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Some firms or account types tend to be more expensive than others, so we adjust the estimate by firm profile.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-void/60 p-4">
                <p className="font-black text-white">3. Add market risk</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Gold, crypto and news-heavy markets can widen quickly. Higher-risk instruments get a wider expected range.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-void/60 p-4">
                <p className="font-black text-white">4. Label it clearly</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Normal means expected. Medium means elevated. Wide means expensive enough that traders should double-check before entering.</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-black text-white">What is a pip?</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">A pip is the unit we use here to compare trading cost. Lower spread usually means cheaper entry and exit.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-black text-white">Why not exact live price?</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Live spreads change by broker, account type, time of day, news and liquidity. Exact live rows require provider feeds.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-black text-white">How to use this</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Compare firms, shortlist cheaper options, then confirm the live spread inside the trading platform before placing a trade.</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-electric">Firm × Pair Matrix</p>
              <h2 className="mt-2 text-2xl font-black text-white">Every tracked prop firm across forex, metals, indices, crypto and synthetic pairs</h2>
            </div>
            <p className="text-sm text-slate-400">
              Showing {filteredRecords.length.toLocaleString()} estimate rows · model reviewed {modelReviewDate}
            </p>
          </div>
        </div>
        <div className="grid max-h-[760px] gap-3 overflow-auto p-4 md:hidden">
          {filteredRecords.slice(0, 80).map((record) => {
            const firm = propFirms.find((item) => item.slug === record.firmSlug) ?? propFirms[0];
            return (
              <article key={`${record.firmSlug}-${record.symbol}-mobile`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {firm ? <FirmLogo firm={firm} size="sm" /> : null}
                    <div className="min-w-0">
                      <p className="truncate font-bold text-white">{record.firmName}</p>
                      <p className="text-xs text-slate-500">{record.category}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                      record.status === "Normal"
                        ? "bg-success/15 text-success"
                        : record.status === "Medium"
                          ? "bg-warning/15 text-warning"
                          : "bg-danger/15 text-danger"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 p-3">
                    <p className="text-xs text-slate-500">Pair</p>
                    <p className="mt-1 font-black text-white">{record.symbol}</p>
                    <p className="mt-1 text-xs text-slate-500">{record.instrumentName}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 p-3">
                    <p className="text-xs text-slate-500">Research estimate</p>
                    <p className="mt-1 font-black text-electric">
                      {record.spread} {record.quoteUnit} est.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{record.source} · {modelReviewDate}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="hidden max-h-[760px] overflow-auto md:block">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-midnight text-slate-400">
              <tr>
                <th className="p-4">Prop firm</th>
                <th className="p-4">Pair / Instrument</th>
                <th className="p-4">Category</th>
                <th className="p-4">Research estimate</th>
                <th className="p-4">Status</th>
                <th className="p-4">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const firm = propFirms.find((item) => item.slug === record.firmSlug) ?? propFirms[0];
                return (
                  <tr key={`${record.firmSlug}-${record.symbol}`} className="border-t border-white/10 transition hover:bg-white/[0.04]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {firm ? <FirmLogo firm={firm} size="sm" /> : null}
                        <span className="font-bold text-white">{record.firmName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-black text-white">{record.symbol}</p>
                      <p className="text-xs text-slate-500">{record.instrumentName}</p>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{record.category}</span>
                    </td>
                    <td className="p-4 font-black text-electric">
                      {record.spread} {record.quoteUnit} est.
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          record.status === "Normal"
                            ? "bg-success/15 text-success"
                            : record.status === "Medium"
                              ? "bg-warning/15 text-warning"
                              : "bg-danger/15 text-danger"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{record.source} · {modelReviewDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
