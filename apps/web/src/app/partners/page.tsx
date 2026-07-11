import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";

export const metadata: Metadata = {
  title: "Become a Partner | FundedScope",
  description: "Partner with FundedScope for verified listings, data corrections, sponsorships and trader intelligence opportunities."
};

export default function PartnersPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-5 sm:py-12">
      <GlassCard className="glow-border">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Become a partner</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Work with FundedScope without buying the score.</h1>
        <p className="mt-5 text-sm leading-7 text-slate-300">
          Partners can request listing reviews, corrections, sponsorship conversations and data integrations. Editorial scoring remains independent.
        </p>
        <a href="mailto:hello@myfundedscope.com?subject=FundedScope partnership" className="mt-8 block rounded-2xl bg-white px-6 py-4 text-center font-black text-void">
          Contact partnerships
        </a>
      </GlassCard>
    </main>
  );
}
