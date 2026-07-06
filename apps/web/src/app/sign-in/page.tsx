import { GlassCard } from "../../components/GlassCard";

export default function SignInPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 py-12">
      <GlassCard className="w-full glow-border">
        <h1 className="text-3xl font-black text-white">Welcome back</h1>
        <p className="mt-2 text-slate-400">Sign in to your FundedScope dashboard.</p>
        <div className="mt-6 space-y-3">
          <input className="w-full rounded-2xl border border-white/10 bg-void px-4 py-3" placeholder="Email" />
          <input className="w-full rounded-2xl border border-white/10 bg-void px-4 py-3" placeholder="Password" type="password" />
          <button className="w-full rounded-2xl bg-white px-4 py-3 font-bold text-void">Sign in</button>
        </div>
      </GlassCard>
    </main>
  );
}
