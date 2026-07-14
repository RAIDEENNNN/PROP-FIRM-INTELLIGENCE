import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";

export const metadata: Metadata = {
  title: "Careers | FundedScope",
  description: "Career and collaboration opportunities at MyFundedScope."
};

export default function CareersPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-5 sm:py-12">
      <GlassCard>
        <p className="text-sm uppercase tracking-[0.28em] text-violet">Careers</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Help build trader intelligence.</h1>
        <p className="mt-5 text-sm leading-7 text-slate-300">
          FundedScope works with people who care about verified trading data, product quality, editorial integrity, partnerships and trader education.
        </p>
        <a href="mailto:hello@myfundedscope.com?subject=Careers at FundedScope" className="mt-8 block rounded-2xl bg-white px-6 py-4 text-center font-black text-void">
          Contact careers
        </a>
      </GlassCard>
    </main>
  );
}
