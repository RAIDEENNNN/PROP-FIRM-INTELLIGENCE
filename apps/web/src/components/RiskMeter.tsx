export function RiskMeter({ score }: { score: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Confidence Score™</span>
        <span className="font-bold text-white">{score}/100</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-success via-electric to-violet"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
