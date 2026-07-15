import { GlassCard } from "../../components/GlassCard";
import { InformationReportForm } from "../../components/InformationReportForm";
import { noindexMetadata } from "../../lib/seo";

export const metadata = noindexMetadata(
  "Report Incorrect Information | FundedScope",
  "Report incorrect prop firm, broker, spread, rule, payout or platform information to FundedScope.",
  "/report"
);

export default function ReportPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-5 sm:py-12">
      <GlassCard className="glow-border">
        <p className="text-sm uppercase tracking-[0.28em] text-warning">Report a problem</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Found incorrect information?</h1>
        <p className="mt-5 text-sm leading-7 text-slate-300">
          Submit the company/firm/broker name, the incorrect field, the correct source URL and any notes. Reports go into an admin moderation queue before changing public data.
        </p>
        <InformationReportForm />
      </GlassCard>
    </main>
  );
}
