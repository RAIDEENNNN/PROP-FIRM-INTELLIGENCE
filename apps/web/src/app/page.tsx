import Link from "next/link";
import { CommandPreview } from "../components/CommandPreview";
import { FirmCard } from "../components/FirmCard";
import { featuredFirms } from "../lib/data";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16">
      <section className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-electric">Prop firm intelligence platform</p>
          <h1 className="mt-5 text-5xl font-black leading-tight text-white md:text-7xl">
            The trader command center for funded accounts.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
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
      <section className="mt-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-violet">Featured firms</p>
            <h2 className="mt-2 text-3xl font-black text-white">Searchable, scoreable, watchable.</h2>
          </div>
          <Link href="/prop-firms" className="hidden text-sm font-bold text-electric sm:block">
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
