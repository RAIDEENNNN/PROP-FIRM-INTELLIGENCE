import { GlassCard } from "../../components/GlassCard";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Contact</p>
      <h1 className="mt-3 text-4xl font-black text-white">Talk to FundedScope</h1>
      <GlassCard className="mt-8">
        <p className="text-slate-300">Add your real support email, creator socials and business inquiry form here.</p>
      </GlassCard>
    </main>
  );
}
