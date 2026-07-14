import { getBrokerConfidenceBreakdown, type Broker } from "../lib/brokers";

export function BrokerConfidenceScore({ broker, compact = false }: { broker: Broker; compact?: boolean }) {
  const breakdown = getBrokerConfidenceBreakdown(broker);

  return (
    <div className={compact ? "rounded-2xl border border-white/10 bg-white/[0.03] p-4" : "rounded-3xl border border-electric/20 bg-electric/[0.06] p-5"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-electric">Why this Confidence Score?</p>
          <h3 className="mt-2 text-lg font-black text-white">
            {breakdown.total}/{breakdown.max} {breakdown.label}
          </h3>
        </div>
        <span className="rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-black text-electric">
          {breakdown.total}/100
        </span>
      </div>

      {!compact && <p className="mt-3 text-sm leading-6 text-slate-300">{breakdown.formula}</p>}

      <div className="mt-4 space-y-3">
        {breakdown.rows.map((row) => (
          <div key={row.key}>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-300">{row.label}</span>
              <span className="font-black text-electric">
                {row.value}/{row.max}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-electric to-violet" style={{ width: `${(row.value / row.max) * 100}%` }} />
            </div>
            {!compact && <p className="mt-1 text-[11px] leading-5 text-slate-500">{row.explanation}</p>}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-warning/20 bg-warning/10 p-3 text-xs leading-5 text-warning">
        <span className="font-black">Verification note:</span> {breakdown.dataWarning}
      </div>
    </div>
  );
}
