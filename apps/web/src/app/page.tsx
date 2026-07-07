import Link from "next/link";
import { CommandPreview } from "../components/CommandPreview";
import { FirmCard } from "../components/FirmCard";
import { featuredFirms } from "../lib/data";
import { trustPrinciples } from "../lib/trust";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-16">
      <section className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-6 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] p-2 pr-5 w-fit">
            <span className="grid h-10 w-10 overflow-hidden rounded-full bg-black">
              <img src="/brand/fundedscope-logo.png" alt="FundedScope logo" className="h-full w-full object-cover" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Compare · Choose · Fund</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.32em]">Prop firm intelligence platform</p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl md:text-7xl">
            The trader command center for funded accounts.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Compare firms, monitor rule changes, track spreads, save alerts, calculate risk and build a funded account strategy with data instead of noise.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up" className="rounded-full bg-white px-6 py-3 text-center font-bold text-void shadow-glow">
              Start free
            </Link>
            <Link href="/compare" className="rounded-full border border-white/15 px-6 py-3 text-center font-bold text-white">
              Compare firms
            </Link>
          </div>
        </div>
        <CommandPreview />
      </section>
      <section className="mt-14 sm:mt-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-electric">Why traders trust it</p>
              <h2 className="mt-2 max-w-3xl text-2xl font-black text-white sm:text-3xl">Comparison data with sources, cautions and clear commercial disclosure.</h2>
            </div>
            <Link href="/legal/how-we-score" className="w-fit rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:text-electric">
              Read scoring method →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {trustPrinciples.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-void/60 p-5">
                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-14 sm:mt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-violet">Featured firms</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Searchable, scoreable, watchable.</h2>
          </div>
          <Link href="/prop-firms" className="text-sm font-bold text-electric">
            View directory →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredFirms.map((firm) => (
            <FirmCard key={firm.slug} firm={firm} />
          ))}
        </div>
      </section>
    </main>
  );
}
