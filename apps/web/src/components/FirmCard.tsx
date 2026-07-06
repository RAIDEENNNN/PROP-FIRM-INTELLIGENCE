import Link from "next/link";
import type { PropFirm } from "../lib/data";
import { FirmLogo } from "./FirmLogo";
import { RiskMeter } from "./RiskMeter";

export function FirmCard({ firm }: { firm: PropFirm }) {
  return (
    <Link href={`/prop-firms/${firm.slug}`} className="glass glow-border group block rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <FirmLogo firm={firm} />
          <div className="min-w-0">
          <p className="text-xl font-bold text-white">{firm.name}</p>
            <p className="truncate text-sm text-slate-400">{firm.country} · {firm.rating.toFixed(1)} ★ · {firm.reviewCount.toLocaleString()} reviews</p>
          </div>
        </div>
        <span className="rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-electric">{firm.challengeFee}</span>
      </div>
      <p className="mt-5 line-clamp-2 min-h-12 text-sm leading-6 text-slate-300">{firm.summary}</p>
      <div className="mt-5">
        <RiskMeter score={firm.score} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
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
      <p className="mt-4 text-sm text-slate-400">Payout: {firm.payoutFrequency} · Last rules check: {firm.lastRuleUpdate}</p>
    </Link>
  );
}
