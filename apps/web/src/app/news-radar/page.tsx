import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";
import { JsonLd } from "../../components/JsonLd";
import { newsEvents } from "../../lib/data";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Live Prop Firm & Market News Radar | FundedScope",
  description: "Track prop firm rule changes, payout news, Gold volatility, high-impact market events and trader decision context inside FundedScope.",
  alternates: {
    canonical: "/news-radar"
  },
  openGraph: {
    title: "Live Prop Firm & Market News Radar | FundedScope",
    description: "Prop firm and market news with decision context for modern traders.",
    url: "/news-radar",
    siteName: "MyFundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Prop Firm & Market News Radar | FundedScope",
    description: "Prop firm and market news with decision context for modern traders.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

const enrichedNews = newsEvents.map((event, index) => ({
  ...event,
  summary:
    index === 0
      ? "Rule tightening can change whether a challenge is still a good fit. Traders should re-check daily loss and consistency rules before purchase."
      : index === 1
        ? "Gold spread expansion often appears around New York open or USD news. Reduce size or wait for spread normalization."
        : "Rising payout proof can support trust, but payout proof should still be moderated and tied to account type.",
  assets: index === 1 ? ["XAUUSD", "DXY", "USD pairs"] : index === 0 ? ["Prop firms", "Challenges"] : ["Payouts", "Reviews"],
  bias: index === 1 ? "Volatility risk" : index === 0 ? "Rules risk" : "Trust signal",
  volatility: index === 1 ? 86 : index === 0 ? 72 : 44
}));

export default function NewsRadarPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "FundedScope News Radar",
    url: `${siteUrl}/news-radar`,
    itemListElement: enrichedNews.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: event.title,
        description: event.summary,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        author: {
          "@type": "Organization",
          name: "FundedScope"
        },
        publisher: {
          "@type": "Organization",
          name: "FundedScope",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/brand/fundedscope-logo.png`
          }
        },
        mainEntityOfPage: `${siteUrl}/news-radar`
      }
    }))
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "News Radar",
        item: `${siteUrl}/news-radar`
      }
    ]
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <JsonLd id="news-radar-articles-jsonld" data={articleJsonLd} />
      <JsonLd id="news-radar-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">News radar</p>
      <h1 className="mt-3 max-w-4xl text-3xl font-black text-white sm:text-5xl">Market and prop firm news with decision context.</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
        FundedScope news is designed to explain what changed, which assets or firms are affected, and what traders should check before risking capital.
      </p>
      <div className="mt-8 grid gap-4">
        {enrichedNews.map((event) => (
          <GlassCard key={event.title}>
            <div className="grid gap-5 lg:grid-cols-[0.7fr_0.3fr]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-violet/15 px-3 py-1 text-xs text-violet">{event.impact} impact</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{event.bias}</span>
                  <span className="text-xs text-slate-500">{event.time}</span>
                </div>
                <h2 className="mt-4 text-2xl font-black text-white">{event.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{event.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.assets.map((asset) => (
                    <span key={asset} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-slate-400">Volatility score</p>
                <p className="mt-2 text-4xl font-black text-electric">{event.volatility}/100</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-success via-warning to-danger" style={{ width: `${event.volatility}%` }} />
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
