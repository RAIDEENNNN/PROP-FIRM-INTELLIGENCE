import { getScoreBreakdown } from "../lib/trust";
import type { PropFirm } from "../lib/data";

export function ScoreBreakdown({ firm, compact = false }: { firm: PropFirm; compact?: boolean }) {
  const breakdown = getScoreBreakdown(firm);
  const sourceMode = firm.verified ? "Editorial" : "Estimated";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-electric">Why this Confidence Score?</p>
          <h3 className="mt-1 text-xl font-black text-white">{breakdown.total}/100 {breakdown.label} explained</h3>
        </div>
        <p className="text-sm font-bold text-slate-300">Weights add up to 100%</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{breakdown.formula}</p>
      <div className="mt-5 space-y-3">
        {breakdown.rows.map((row) => (
          <div key={row.key}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-white">{row.label}</span>
              <span className="shrink-0 text-slate-300">
                {row.earned}/{row.max}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-success via-electric to-violet" style={{ width: `${row.percent}%` }} />
            </div>
            {!compact ? (
              <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs leading-5 text-slate-400">{row.explanation}</p>
                <div className="mt-3 grid gap-2 text-[11px] leading-5 text-slate-500 sm:grid-cols-2">
                  <p>Source type: {sourceMode} review</p>
                  <p>Last checked: {firm.lastRuleUpdate}</p>
                  <p>Calculation: weighted deduction from {row.max} pts</p>
                  <p>Evidence: official site, public profile data and FundedScope methodology</p>
                </div>
                <a href={`https://${firm.domain}`} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-black text-electric">
                  Verify official source
                </a>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
