import { GlassCard } from "../../components/GlassCard";

export default function SignUpPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-5 py-12">
      <GlassCard className="w-full glow-border">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Trader onboarding</p>
        <h1 className="mt-3 text-3xl font-black text-white">Build your funded profile</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <input className="rounded-2xl border border-white/10 bg-void px-4 py-3" placeholder="Name" />
          <input className="rounded-2xl border border-white/10 bg-void px-4 py-3" placeholder="Email" />
          <input className="rounded-2xl border border-white/10 bg-void px-4 py-3" placeholder="Password" type="password" />
          <select className="rounded-2xl border border-white/10 bg-void px-4 py-3">
            <option>Risk tolerance</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <button className="mt-6 w-full rounded-2xl bg-electric px-4 py-3 font-bold text-void">Create account</button>
      </GlassCard>
    </main>
  );
}
