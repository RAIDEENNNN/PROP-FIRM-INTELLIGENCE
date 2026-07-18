"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { brandArticles } from "../lib/articles";
import { brokers } from "../lib/brokers";
import { newsEvents, propFirms, routes } from "../lib/data";
import { marketEvents, pairImpacts } from "../lib/market-intelligence";

type Result = {
  title: string;
  category: string;
  href: string;
  detail: string;
  keywords: string;
};

const searchIndex: Result[] = [
  ...propFirms.map((firm) => ({
    title: firm.name,
    category: "Prop Firm",
    href: `/prop-firms/${firm.slug}`,
    detail: `${firm.score}/100 · ${firm.country} · ${firm.markets.join(", ")} · ${firm.challengeTypes.join(", ")}`,
    keywords: `${firm.name} ${firm.country} ${firm.markets.join(" ")} ${firm.challengeTypes.join(" ")} ${firm.tags.join(" ")} MT4 MT5 payout drawdown rules`
  })),
  ...brokers.map((broker) => ({
    title: broker.name,
    category: "Broker",
    href: "/brokers",
    detail: `${broker.trustScore}/100 · ${broker.regulators.slice(0, 3).join(", ")} · ${broker.platforms.slice(0, 3).join(", ")}`,
    keywords: `${broker.name} ${broker.markets.join(" ")} ${broker.platforms.join(" ")} ${broker.regulators.join(" ")} ${broker.accountTypes.join(" ")} ${broker.deposits.join(" ")} ${broker.withdrawals.join(" ")}`
  })),
  ...brandArticles.map((article) => ({
    title: article.title,
    category: "Article",
    href: `/articles/${article.slug}`,
    detail: article.description,
    keywords: `${article.title} ${article.description} ${article.sections.map((section) => `${section.heading} ${section.body}`).join(" ")}`
  })),
  ...newsEvents.map((event) => ({
    title: event.title,
    category: "News",
    href: event.href,
    detail: `${event.impact} impact · ${event.time}`,
    keywords: `${event.title} ${event.impact} news rule spread payout gold`
  })),
  ...marketEvents.map((event) => ({
    title: event.event,
    category: "Market Intel",
    href: "/market-intelligence#calendar",
    detail: `${event.timeUtc} UTC · ${event.currency} · ${event.impact} impact`,
    keywords: `${event.event} ${event.currency} ${event.affectedAssets.join(" ")} ${event.traderTags.join(" ")} calendar volatility CPI FOMC news`
  })),
  ...pairImpacts.map((pair) => ({
    title: `${pair.pair} news impact`,
    category: "Market Intel",
    href: "/market-intelligence#calendar",
    detail: pair.overall,
    keywords: `${pair.pair} ${pair.events.join(" ")} volatility readiness news impact`
  })),
  ...routes.map((route) => ({
    title: route.label,
    category: "Page",
    href: route.href,
    detail: "FundedScope platform page",
    keywords: `${route.label} ${route.href.replace(/[/-]/g, " ")}`
  }))
];

export function UniversalSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return searchIndex.slice(0, compact ? 5 : 8);

    return searchIndex
      .map((item) => {
        const haystack = `${item.title} ${item.category} ${item.detail} ${item.keywords}`.toLowerCase();
        const titleHit = item.title.toLowerCase().includes(clean) ? 4 : 0;
        const categoryHit = item.category.toLowerCase().includes(clean) ? 2 : 0;
        const keywordHit = haystack.includes(clean) ? 1 : 0;
        return { item, score: titleHit + categoryHit + keywordHit };
      })
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, compact ? 6 : 10)
      .map((row) => row.item);
  }, [compact, query]);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-3 shadow-glow backdrop-blur">
      <label className="sr-only" htmlFor="fundedscope-universal-search">
        Search FundedScope
      </label>
      <input
        id="fundedscope-universal-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search prop firms, brokers, MT5, Gold, rules, countries..."
        className="w-full rounded-2xl border border-white/10 bg-void px-4 py-4 text-base font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-electric/60"
      />
      <div className="mt-3 grid gap-2">
        {results.map((result) => (
          <Link key={`${result.category}-${result.title}`} href={result.href} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-electric/40 hover:bg-white/[0.06]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-white">{result.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{result.detail}</p>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-electric">
                {result.category}
              </span>
            </div>
          </Link>
        ))}
        {results.length === 0 ? <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">No result yet. Try “MT5”, “Gold”, “Nigeria”, “FTMO”, “Pepperstone” or “payout”.</p> : null}
      </div>
    </div>
  );
}
