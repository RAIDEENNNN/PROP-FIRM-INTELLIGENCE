import { GlassCard } from "../../components/GlassCard";
import { SignUpForm } from "../../components/AuthForms";
import { noindexMetadata } from "../../lib/seo";

export const metadata = noindexMetadata("Create account | FundedScope", "Create a private FundedScope trading profile.", "/sign-up");

export default function SignUpPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-5xl place-items-center px-4 py-10 sm:px-5 sm:py-12">
      <GlassCard className="w-full glow-border">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Create account</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">Create your FundedScope account.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Sign up with Google, GitHub, or email. Your Trading DNA, markets, profile photo and preferences all live under Profile after you get in.
        </p>
        <SignUpForm />
      </GlassCard>
    </main>
  );
}
