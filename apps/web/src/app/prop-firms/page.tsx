import type { Metadata } from "next";
import { PropFirmDirectory } from "../../components/PropFirmDirectory";

export const metadata: Metadata = {
  title: "Compare Prop Firms Worldwide | FundedScope",
  description: "Search and compare prop firms worldwide by score, rules, fees, payout speed, drawdown, markets, reviews and spread intelligence.",
  alternates: { canonical: "/prop-firms" },
  openGraph: {
    title: "Compare Prop Firms Worldwide | FundedScope",
    description: "Search prop firm rules, payout terms, drawdown and score breakdowns in one trusted directory.",
    url: "/prop-firms",
    siteName: "FundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Prop Firms Worldwide | FundedScope",
    description: "Search prop firm rules, payout terms, drawdown and score breakdowns in one trusted directory.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default function PropFirmsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Directory</p>
      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Prop firms worldwide</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
        A growing global database with logos, scoring, payout rules, challenge conditions, searchable markets and spread intelligence readiness.
      </p>
      <PropFirmDirectory />
    </main>
  );
}
