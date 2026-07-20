import { GlassCard } from "../../components/GlassCard";
import { ResetPasswordForm } from "../../components/AuthForms";
import { noindexMetadata } from "../../lib/seo";

export const metadata = noindexMetadata("Reset password | FundedScope", "Set a new password for your private FundedScope account.", "/reset-password");

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 py-12">
      <GlassCard className="w-full glow-border">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Account recovery</p>
        <h1 className="mt-3 text-3xl font-black text-white">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Open this page from the reset email, then save a new password for your FundedScope account.</p>
        <ResetPasswordForm />
      </GlassCard>
    </main>
  );
}
