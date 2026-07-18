import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../../components/JsonLd";
import { MarketIntelligenceDashboard } from "../../components/MarketIntelligenceDashboard";
import { marketEvents } from "../../lib/market-intelligence";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Market Intelligence for Traders | FundedScope",
  description: "Use FundedScope Market Intelligence to understand economic events, affected pairs, volatility, trading sessions, prop firm warnings and readiness context.",
  alternates: {
    canonical: "/market-intelligence"
  },
  openGraph: {
    title: "FundedScope Market Intelligence",
    description: "Decision context for economic news, pair impact, volatility and prop firm trading rules.",
    url: "/market-intelligence",
    siteName: "MyFundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "FundedScope Market Intelligence",
    description: "Decision context for economic news, pair impact, volatility and prop firm trading rules.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default function MarketIntelligencePage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "FundedScope Market Intelligence Events",
    url: `${siteUrl}/market-intelligence`,
    itemListElement: marketEvents.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.event,
        description: event.whyItMatters,
        startDate: `2026-07-18T${event.timeUtc}:00Z`,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: {
          "@type": "VirtualLocation",
          url: `${siteUrl}/market-intelligence`
        },
        organizer: {
          "@type": "Organization",
          name: "FundedScope",
          url: siteUrl
        }
      }
    }))
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <JsonLd id="market-intelligence-jsonld" data={itemListJsonLd} />

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_12%_10%,rgba(53,211,255,0.18),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(217,70,239,0.20),transparent_30%),rgba(255,255,255,0.035)] p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.62fr_0.38fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">FundedScope Market Intelligence™</p>
            <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight text-white sm:text-6xl">
              Economic news translated into trading decisions.
            </h1>
            <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              A calendar is useful. Context is better. See what today’s events may mean for Gold, forex, indices, prop-firm rules, session timing and your readiness to trade.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#calendar" className="rounded-2xl bg-electric px-5 py-3 text-sm font-black text-void transition hover:scale-[1.01]">
                Open calendar
              </Link>
              <Link href="/profile" className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-electric/40 hover:text-electric">
                Personalize with profile
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Today’s highest-risk window</p>
            <div className="mt-4 rounded-3xl border border-danger/30 bg-danger/10 p-5 text-center">
              <p className="text-sm font-black text-danger">USD CPI</p>
              <p className="mt-2 font-mono text-4xl font-black text-white">13:30 UTC</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Gold, EURUSD, DXY, US30 and NASDAQ can move sharply around the release.</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              {["Pair impact", "Prop warning", "News replay"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 font-bold text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div id="calendar" className="scroll-mt-36">
        <MarketIntelligenceDashboard />
      </div>
    </main>
  );
}
