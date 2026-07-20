import type { Metadata } from "next";
import Link from "next/link";
import { PropFirmDirectory } from "../../components/PropFirmDirectory";
import { FirmLogo } from "../../components/FirmLogo";
import { propFirms } from "../../lib/data";
import { marketEvents, propFirmWarnings } from "../../lib/market-intelligence";
import { getFirmTrust } from "../../lib/trust";

export const metadata: Metadata = {
  title: "Compare Prop Firms Worldwide | FundedScope",
  description: "Search and compare prop firms worldwide by score, rules, fees, payout speed, drawdown, markets, reviews and spread intelligence.",
  alternates: { canonical: "/prop-firms" },
  openGraph: {
    title: "Compare Prop Firms Worldwide | FundedScope",
    description: "Search prop firm rules, payout terms, drawdown and score breakdowns in one trusted directory.",
    url: "/prop-firms",
    siteName: "MyFundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Prop Firms Worldwide | FundedScope",
    description: "Search prop firm rules, payout terms, drawdown and score breakdowns in one trusted directory.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default function PropFirmsPage() {
  const featuredOffers = propFirms.slice(0, 6);
  const futuresFirms = propFirms.filter((firm) => firm.markets.includes("Futures")).slice(0, 3);
  const topScalper = propFirms.find((firm) => firm.markets.includes("Forex")) ?? propFirms[0]!;
  const topSwing = propFirms.find((firm) => firm.tags.includes("Swing")) ?? propFirms[1]!;
  const payoutPick = [...propFirms].sort((a, b) => {
    const rank = (value: string) => (/on demand|5 days/i.test(value) ? 0 : /weekly|bi-weekly|14 days/i.test(value) ? 1 : 2);
    return rank(a.payoutFrequency) - rank(b.payoutFrequency);
  })[0]!;
  const highImpactEvent = marketEvents.find((event) => event.impact === "High") ?? marketEvents[0]!;

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-5 sm:py-10">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(5,7,18,0.96),rgba(15,23,42,0.92)_42%,rgba(53,16,79,0.72)),radial-gradient(circle_at_85%_8%,rgba(53,211,255,0.22),transparent_30%)] p-4 shadow-[0_0_80px_rgba(53,211,255,0.08)] sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[0.46fr_0.54fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Prop firm command center</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.98] text-white sm:text-6xl">
              Choose the firm that fits how you trade.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Compare rules, payout speed, drawdown style, market access, trust signals and news risk before you pay for another challenge.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                [String(propFirms.length), "reviewed profiles"],
                ["Explainable", "confidence scores"],
                ["Public", "source policy"],
                [highImpactEvent.timeUtc, `${highImpactEvent.currency} risk window`]
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="#directory" className="rounded-2xl bg-electric px-5 py-3 text-center font-black text-void">
                Browse firms
              </Link>
              <Link href="/compare" className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white transition hover:border-electric/40 hover:text-electric">
                Compare side by side
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.62fr_0.38fr]">
            <div className="professional-panel rounded-[1.5rem] border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                <p className="professional-accent text-xs uppercase tracking-[0.22em]">Example shortlist</p>
                  <h2 className="mt-1 text-2xl font-black text-white">Decision picks</h2>
                </div>
                <Link href="/market-intelligence" className="professional-pill rounded-full border px-4 py-2 text-xs font-black">
                  News risk
                </Link>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  ["Scalper fit", topScalper],
                  ["Swing fit", topSwing],
                  ["Payout fit", payoutPick]
                ].map(([label, firm]) => {
                  const item = firm as (typeof propFirms)[number];
                  return (
                    <Link key={`${label}-${item.slug}`} href={`/prop-firms/${item.slug}`} className="professional-card rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:border-[#d9b96f]/35">
                      <FirmLogo firm={item} size="sm" />
                      <p className="professional-accent mt-3 text-xs font-black uppercase tracking-[0.16em]">{label as string}</p>
                      <p className="mt-1 truncate text-lg font-black text-white">{item.name}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <Mini label="Score" value={`${item.score}`} />
                        <Mini label="Fee" value={item.challengeFee} />
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 rounded-2xl border border-warning/20 bg-warning/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-warning">High-impact check</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Example calendar item: {highImpactEvent.event} at {highImpactEvent.timeUtc} UTC can affect spreads, slippage and prop-firm news rules. Verify a live calendar before treating this as today&apos;s event.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-violet">Rule watch</p>
              <h2 className="mt-1 text-2xl font-black text-white">Firms to verify first</h2>
              <div className="mt-4 space-y-3">
                {propFirmWarnings.slice(0, 4).map((warning) => {
                  const firm = propFirms.find((item) => item.name.toLowerCase().includes(warning.firm.toLowerCase()) || warning.firm.toLowerCase().includes(item.name.toLowerCase())) ?? propFirms[0]!;
                  return (
                    <Link key={warning.firm} href={`/prop-firms/${firm.slug}`} className="block rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-violet/40">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-white">{warning.firm}</p>
                        <p className="text-xs font-black uppercase text-warning">{warning.status}</p>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{warning.rule}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[0.68fr_0.32fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-300">Featured firms</p>
                <h2 className="mt-1 text-xl font-black text-white">Fast comparison rows</h2>
              </div>
              <Link href="/compare" className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white hover:border-fuchsia-300/50">
                Compare firms
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {featuredOffers.map((firm) => {
                const trust = getFirmTrust(firm);
                return (
                  <Link key={firm.slug} href={`/prop-firms/${firm.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:-translate-y-0.5 hover:border-fuchsia-300/50">
                    <div className="flex items-center gap-3">
                      <FirmLogo firm={firm} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-black text-white">{firm.name}</p>
                        <p className="text-xs text-slate-400">{firm.rating.toFixed(1)} rating · {trust.confidence}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <Mini label="Fee" value={firm.challengeFee} />
                      <Mini label="Payout" value={firm.payoutFrequency} />
                      <Mini label="Score" value={`${firm.score}`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Most watched futures firms</p>
            <h2 className="mt-1 text-xl font-black text-white">Futures leaderboard</h2>
            <div className="mt-4 grid gap-3">
              {(futuresFirms.length ? futuresFirms : propFirms.slice(0, 3)).map((firm, index) => (
                <Link key={firm.slug} href={`/prop-firms/${firm.slug}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 hover:border-gold/40">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-black text-gold">#{index + 1}</span>
                    <FirmLogo firm={firm} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-black text-white">{firm.name}</p>
                      <p className="text-xs text-slate-400">{firm.rating.toFixed(1)} rating · {firm.challengeFee}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-void">View</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="directory" className="scroll-mt-32">
        <PropFirmDirectory />
      </section>
    </main>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 truncate font-black text-white">{value}</p>
    </div>
  );
}
