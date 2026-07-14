import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";

export const metadata: Metadata = {
  title: "Affiliate Program | FundedScope",
  description: "FundedScope affiliate and commercial disclosure information."
};

export default function AffiliateProgramPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-5 sm:py-12">
      <GlassCard>
        <p className="text-sm uppercase tracking-[0.28em] text-gold">Affiliate Program</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Commercial links must stay clearly labelled.</h1>
        <p className="mt-5 text-sm leading-7 text-slate-300">
          FundedScope can earn affiliate commissions, but affiliate relationships cannot change the FundedScope Confidence Score, verification status or editorial methodology.
        </p>
        <a href="/legal/affiliate-disclosure" className="mt-8 block rounded-2xl bg-white px-6 py-4 text-center font-black text-void">
          Read affiliate disclosure
        </a>
      </GlassCard>
    </main>
  );
}
