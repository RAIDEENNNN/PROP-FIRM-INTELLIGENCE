import { getScoreBreakdown } from "../lib/trust";
import type { PropFirm } from "../lib/data";

export function ScoreBreakdown({ firm, compact = false }: { firm: PropFirm; compact?: boolean }) {
  const breakdown = getScoreBreakdown(firm);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-electric">Why this score?</p>
          <h3 className="mt-1 text-xl font-black text-white">{breakdown.total}/100 FundedScope Score explained</h3>
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
            {!compact ? <p className="mt-2 text-xs leading-5 text-slate-500">{row.explanation}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
