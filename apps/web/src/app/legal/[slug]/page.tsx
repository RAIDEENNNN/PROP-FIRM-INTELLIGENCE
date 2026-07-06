import { GlassCard } from "../../../components/GlassCard";

const copy: Record<string, string> = {
  "how-we-score": "FundedScope scores firms using rules, payout experience, pricing, transparency, trader fit, account conditions and verified review signals.",
  "editorial-policy": "Editorial decisions should remain independent from affiliate relationships. Sponsored placements must be clearly marked.",
  "affiliate-disclosure": "FundedScope may earn commissions when users sign up through affiliate links. This should never change scoring methodology.",
  privacy: "This page will describe how user data, alerts, account profiles and analytics are collected, stored and deleted.",
  terms: "This page will define acceptable use, disclaimers and subscription terms for FundedScope."
};

export default function LegalPage({ params }: { params: { slug: string } }) {
  const title = params.slug.replaceAll("-", " ");
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Legal</p>
      <h1 className="mt-3 capitalize text-4xl font-black text-white">{title}</h1>
      <GlassCard className="mt-8">
        <p className="leading-8 text-slate-300">{copy[params.slug] ?? "Legal content placeholder for FundedScope."}</p>
      </GlassCard>
    </main>
  );
}
