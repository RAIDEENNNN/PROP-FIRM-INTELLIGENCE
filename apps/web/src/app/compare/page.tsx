import { FirmLogo } from "../../components/FirmLogo";
import { GlassCard } from "../../components/GlassCard";
import { propFirms } from "../../lib/data";

export default function ComparePage() {
  const comparedFirms = propFirms.slice(0, 5);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Compare any five</p>
      <h1 className="mt-3 text-4xl font-black text-white">Side-by-side prop firm comparison</h1>
      <p className="mt-4 max-w-3xl text-slate-300">
        Launch comparison set uses the top five scored firms. The next step is drag-and-drop firm selection, saved comparison presets and authenticated watchlists.
      </p>
      <GlassCard className="mt-8 overflow-x-auto">
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
