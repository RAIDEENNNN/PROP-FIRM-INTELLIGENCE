import { FirmLogo } from "../../components/FirmLogo";
import { GlassCard } from "../../components/GlassCard";
import { propFirms } from "../../lib/data";

export default function ComparePage() {
  const comparedFirms = propFirms.slice(0, 5);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Compare any five</p>
      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Side-by-side prop firm comparison</h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
        Built for mobile first: quick cards on phones, full comparison table on larger screens.
      </p>

      <div className="mt-8 grid gap-4 md:hidden">
        {comparedFirms.map((firm) => (
          <GlassCard key={firm.slug}>
            <div className="flex items-center gap-3">
              <FirmLogo firm={firm} />
              <div>
                <h2 className="text-xl font-black text-white">{firm.name}</h2>
                <p className="text-sm text-slate-400">{firm.country} · {firm.rating.toFixed(1)} ★</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Metric label="Score" value={`${firm.score}/100`} />
              <Metric label="Fee" value={firm.challengeFee} />
              <Metric label="Target" value={firm.profitTarget} />
              <Metric label="Daily DD" value={firm.dailyDrawdown} />
              <Metric label="Payout" value={firm.payout} />
              <Metric label="Max DD" value={firm.maxDrawdown} />
            </div>
            <p className="mt-4 text-sm text-slate-400">{firm.markets.join(", ")}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-8 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="p-3">Firm</th>
              <th className="p-3">Score</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Target</th>
              <th className="p-3">Daily DD</th>
              <th className="p-3">Payout</th>
              <th className="p-3">Max DD</th>
              <th className="p-3">Markets</th>
            </tr>
          </thead>
          <tbody>
            {comparedFirms.map((firm) => (
              <tr key={firm.slug} className="border-t border-white/10">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <FirmLogo firm={firm} size="sm" />
                    <span className="font-bold text-white">{firm.name}</span>
                  </div>
                </td>
                <td className="p-3 text-electric">{firm.score}/100</td>
                <td className="p-3">{firm.rating.toFixed(1)} ★</td>
                <td className="p-3">{firm.challengeFee}</td>
                <td className="p-3">{firm.profitTarget}</td>
                <td className="p-3">{firm.dailyDrawdown}</td>
                <td className="p-3">{firm.payout}</td>
                <td className="p-3">{firm.maxDrawdown}</td>
                <td className="p-3">{firm.markets.slice(0, 3).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
