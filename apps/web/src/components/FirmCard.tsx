import Link from "next/link";
import type { PropFirm } from "../lib/data";
import { getFirmTrust, getScoreBreakdown } from "../lib/trust";
import { FirmLogo } from "./FirmLogo";
import { RiskMeter } from "./RiskMeter";

export function FirmCard({ firm }: { firm: PropFirm }) {
  const trust = getFirmTrust(firm);
  const scoreRows = getScoreBreakdown(firm).rows.slice(0, 3);

  return (
    <article className="glass glow-border group rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <FirmLogo firm={firm} />
          <div className="min-w-0">
            <Link href={`/prop-firms/${firm.slug}`} className="text-xl font-bold text-white hover:text-electric">
              {firm.name}
            </Link>
            <p className="truncate text-sm text-slate-400">{firm.country} · {firm.rating.toFixed(1)} ★ · public review signal</p>
          </div>
        </div>
        <span className="w-fit rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-electric">{firm.challengeFee}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            trust.confidenceTone === "success" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
          }`}
        >
          {trust.confidence}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Checked {trust.lastChecked}</span>
      </div>
      <p className="mt-5 line-clamp-2 min-h-12 text-sm leading-6 text-slate-300">{firm.summary}</p>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-electric">Best fit</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {trust.bestFor.map((reason) => (
            <span key={reason} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
              {reason}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <RiskMeter score={firm.score} />
      </div>
      <div className="mt-4 grid gap-2">
        {scoreRows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs">
            <span className="truncate text-slate-400">{row.label}</span>
            <span className="font-black text-white">
              {row.earned}/{row.max}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-1 gap-2 text-xs min-[420px]:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-slate-500">Target</p>
          <p className="mt-1 font-bold text-white">{firm.profitTarget}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-slate-500">Daily DD</p>
          <p className="mt-1 font-bold text-white">{firm.dailyDrawdown}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-slate-500">Max DD</p>
          <p className="mt-1 font-bold text-white">{firm.maxDrawdown}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {firm.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-400">
        Payout: {firm.payoutFrequency} · Source: {trust.sourceLabel}
      </p>
      <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-2">
        <Link href={`/prop-firms/${firm.slug}`} className="block rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-void transition hover:scale-[1.01]">
          View full review
        </Link>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Link href={`/compare?firms=${firm.slug}`} className="rounded-2xl border border-white/10 px-3 py-2.5 text-center text-xs font-bold text-slate-200 transition hover:border-white/20 hover:text-white">
            Compare
          </Link>
          <a
            href={`https://${firm.domain}`}
            target="_blank"
            rel="noreferrer sponsored"
            className="rounded-2xl border border-electric/30 px-3 py-2.5 text-center text-xs font-bold text-electric transition hover:bg-electric/10"
          >
            Visit site
          </a>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-slate-500">Affiliate links may be used. Confidence Scores remain editorial and explainable.</p>
    </article>
  );
}
