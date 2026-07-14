import type { Metadata } from "next";
import Link from "next/link";
import { PropFirmDirectory } from "../../components/PropFirmDirectory";
import { FirmLogo } from "../../components/FirmLogo";
import { propFirms } from "../../lib/data";

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
  const featuredOffers = propFirms.slice(1, 7);
  const futuresFirms = propFirms.filter((firm) => firm.markets.includes("Futures")).slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_0%_30%,rgba(124,58,237,0.35),transparent_28%),radial-gradient(circle_at_100%_15%,rgba(217,70,239,0.28),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] p-5 sm:p-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Prop firm intelligence</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Compare the best prop trading firms of 2026.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-lg sm:leading-8">
            Research challenge fees, rules, payouts, drawdown, markets, trust signals and FundedScope confidence scores before choosing your next evaluation.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              ["60+", "tracked firms"],
              ["1,500+", "challenge references"],
              ["24/7", "source monitoring"],
              ["2026", "research standard"]
            ].map(([value, label]) => (
              <span key={label} className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-bold text-slate-200">
                <span className="text-electric">{value}</span> {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-[0.68fr_0.32fr]">
          <div className="rounded-[1.6rem] border border-fuchsia-400/35 bg-black/30 p-4 shadow-[0_0_60px_rgba(217,70,239,0.18)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-black text-white"><span className="text-fuchsia-300">Featured</span> prop firm offers</p>
              <Link href="/compare" className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white hover:border-fuchsia-300/50">
                Compare firms →
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {featuredOffers.map((firm) => (
                <Link key={firm.slug} href={`/prop-firms/${firm.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:-translate-y-0.5 hover:border-fuchsia-300/50">
                  <div className="flex items-center gap-3">
                    <FirmLogo firm={firm} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-black text-white">{firm.name}</p>
                      <p className="text-xs text-fuchsia-200">{firm.rating.toFixed(1)} ★ · from {firm.challengeFee}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                    <span className="rounded-full bg-fuchsia-400/15 px-3 py-1 font-bold text-fuchsia-200">{firm.payoutFrequency}</span>
                    <span className="font-black text-white">{firm.score}/100</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-orange-400/35 bg-orange-950/20 p-4">
            <p className="font-black text-white">Most watched futures firms 🏆</p>
            <div className="mt-4 grid gap-3">
              {(futuresFirms.length ? futuresFirms : propFirms.slice(0, 3)).map((firm, index) => (
                <Link key={firm.slug} href={`/prop-firms/${firm.slug}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 hover:border-orange-300/50">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-lg">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</span>
                    <FirmLogo firm={firm} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-black text-white">{firm.name}</p>
                      <p className="text-xs text-slate-400">{firm.rating.toFixed(1)} rating</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-gradient-to-r from-orange-500 to-fuchsia-500 px-3 py-1 text-xs font-black text-white">View</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PropFirmDirectory />
    </main>
  );
}
