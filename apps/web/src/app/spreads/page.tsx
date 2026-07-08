import type { Metadata } from "next";
import { SpreadMatrix } from "../../components/SpreadMatrix";
import { ExternalMarketChart } from "../../components/ExternalMarketChart";

export const metadata: Metadata = {
  title: "Prop Firm Spreads & Live Gold Chart | FundedScope",
  description: "Compare indicative prop firm spreads across forex, Gold, silver, indices, crypto and synthetic instruments with clear source labeling.",
  alternates: { canonical: "/spreads" },
  openGraph: {
    title: "Prop Firm Spreads & Live Gold Chart | FundedScope",
    description: "Understand spread estimates, source status and live market reference charts before trading.",
    url: "/spreads",
    siteName: "FundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Prop Firm Spreads & Live Gold Chart | FundedScope",
    description: "Understand spread estimates, source status and live market reference charts before trading.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default function SpreadsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Spread intelligence</p>
      <h1 className="mt-3 max-w-5xl text-3xl font-black text-white sm:text-4xl md:text-6xl">Spreads for every tracked firm, pair and CFD instrument.</h1>
      <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
        Forex majors, minors, exotics, metals like XAUUSD/XAGUSD, commodities, indices, crypto pairs and synthetic instruments are mapped across every prop firm. Current numbers are indicative baselines until live broker feeds are connected.
      </p>
      <div className="mt-8">
        <ExternalMarketChart title="XAUUSD / Gold live reference chart" />
      </div>
      <SpreadMatrix />
    </main>
  );
}
