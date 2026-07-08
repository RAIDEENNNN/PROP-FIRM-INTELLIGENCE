import { GlassCard } from "../../components/GlassCard";
import { SignInForm } from "../../components/AuthForms";

export default function SignInPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 py-12">
      <GlassCard className="w-full glow-border">
        <h1 className="text-3xl font-black text-white">Welcome back</h1>
        <p className="mt-2 text-slate-400">Sign in to your FundedScope dashboard.</p>
        <SignInForm />
      </GlassCard>
    </main>
  );
}
