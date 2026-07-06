import { FirmLogo } from "../../../components/FirmLogo";
import { GlassCard } from "../../../components/GlassCard";
import { RiskMeter } from "../../../components/RiskMeter";
import { propFirms } from "../../../lib/data";
import { spreadRecords } from "../../../lib/spreads";

export default function FirmProfilePage({ params }: { params: { slug: string } }) {
  const firm = propFirms.find((item) => item.slug === params.slug) ?? propFirms[0];
  const firmSpreads = spreadRecords.filter((record) => record.firmSlug === firm?.slug).slice(0, 8);

  if (!firm) return null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <div className="grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
        <GlassCard className="glow-border">
          <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Firm profile</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <FirmLogo firm={firm} size="lg" />
            <div>
              <h1 className="text-3xl font-black text-white sm:text-5xl">{firm.name}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
                {firm.country} · {firm.rating.toFixed(1)} ★ · {firm.reviewCount.toLocaleString()} tracked reviews · {firm.verified ? "Verified profile" : "Needs editorial verification"}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-slate-300">{firm.summary}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-slate-400">Challenge fee</p>
              <p className="mt-2 text-2xl font-black text-white">{firm.challengeFee}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-slate-400">Profit target</p>
              <p className="mt-2 text-2xl font-black text-white">{firm.profitTarget}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-slate-400">Payout</p>
              <p className="mt-2 text-2xl font-black text-white">{firm.payout}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-slate-400">Max drawdown</p>
              <p className="mt-2 text-2xl font-black text-white">{firm.maxDrawdown}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <RiskMeter score={firm.score} />
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>
              Daily drawdown: <span className="font-bold text-white">{firm.dailyDrawdown}</span>
            </p>
            <p>
              Max account: <span className="font-bold text-white">{firm.maxAccount}</span>
            </p>
            <p>
              Last rule check: <span className="font-bold text-white">{firm.lastRuleUpdate}</span>
            </p>
          </div>
          <button className="mt-8 w-full rounded-2xl bg-white px-5 py-3 font-bold text-void">Visit firm</button>
          <button className="mt-3 w-full rounded-2xl border border-white/10 px-5 py-3 font-bold text-white">Save alert</button>
        </GlassCard>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <h2 className="text-xl font-black text-white">Rules</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>Challenge types: {firm.challengeTypes.join(", ")}</p>
            <p>Markets: {firm.markets.join(", ")}</p>
            <p>Daily drawdown: {firm.dailyDrawdown}</p>
            <p>Max drawdown: {firm.maxDrawdown}</p>
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="text-xl font-black text-white">Verified reviews</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {firm.reviewCount.toLocaleString()} review signals tracked. Verified user reviews and payout proof moderation are wired into the product roadmap.
          </p>
        </GlassCard>
        <GlassCard>
          <h2 className="text-xl font-black text-white">Payout proof</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Payout proof collection should require user account verification and admin approval before publishing.</p>
        </GlassCard>
      </div>
      <GlassCard className="mt-6 overflow-hidden p-0">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-xl font-black text-white">Spread sample for {firm.name}</h2>
          <p className="mt-2 text-sm text-slate-400">First rows from the firm × instrument spread matrix. Full searchable matrix lives under Spreads.</p>
        </div>
        <div className="grid gap-3 p-4 md:hidden">
          {firmSpreads.map((record) => (
            <article key={`${record.symbol}-mobile`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-white">{record.symbol}</p>
                  <p className="mt-1 text-xs text-slate-500">{record.instrumentName}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{record.category}</span>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 p-3">
                <span className="text-xs text-slate-500">Spread</span>
                <span className="font-black text-electric">
                  {record.spread} {record.quoteUnit}
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="p-4">Pair</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Spread</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {firmSpreads.map((record) => (
                <tr key={record.symbol} className="border-t border-white/10">
                  <td className="p-4 font-black text-white">{record.symbol}</td>
                  <td className="p-4 text-slate-300">{record.instrumentName}</td>
                  <td className="p-4">{record.category}</td>
                  <td className="p-4 text-electric">
                    {record.spread} {record.quoteUnit}
                  </td>
                  <td className="p-4">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </main>
  );
}
