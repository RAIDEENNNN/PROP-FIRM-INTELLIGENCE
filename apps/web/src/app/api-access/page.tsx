import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";

export const metadata: Metadata = {
  title: "API Access | FundedScope",
  description: "FundedScope API access for prop firm, broker, spread and market intelligence data."
};

export default function ApiAccessPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-5 sm:py-12">
      <GlassCard className="glow-border">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">API Access</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Data access for teams, partners and advanced traders.</h1>
        <p className="mt-5 text-sm leading-7 text-slate-300">
          API access is planned for verified prop firm data, broker intelligence, source health, spread records, rule changes and premium analytics.
        </p>
        <a href="mailto:hello@myfundedscope.com?subject=FundedScope API access" className="mt-8 block rounded-2xl bg-white px-6 py-4 text-center font-black text-void">
          Request API access
        </a>
      </GlassCard>
    </main>
  );
}
