import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "../../components/GlassCard";
import { JsonLd } from "../../components/JsonLd";
import { NewsRadarHashScroller } from "../../components/NewsRadarHashScroller";
import { newsEvents } from "../../lib/data";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfundedscope.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Prop Firm & Market News Radar | FundedScope",
  description: "Review prop firm rule changes, payout news, Gold volatility, high-impact market events and trader decision context inside FundedScope.",
  alternates: {
    canonical: "/news-radar"
  },
  openGraph: {
    title: "Prop Firm & Market News Radar | FundedScope",
    description: "Prop firm and market news with decision context for modern traders.",
    url: "/news-radar",
    siteName: "MyFundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Prop Firm & Market News Radar | FundedScope",
    description: "Prop firm and market news with decision context for modern traders.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

const enrichedNews = newsEvents.map((event, index) => ({
  ...event,
  summary:
    index === 0
      ? "Challenge terms can change the real risk profile of an account. Review drawdown, consistency, news-trading and payout conditions before committing capital."
      : index === 1
        ? "Gold liquidity and spreads can shift quickly around session opens and USD releases. Confirm executable pricing in your trading platform before entering."
        : "Payout evidence is only useful when it is source-reviewed, time-stamped and matched to the correct firm, model and account type.",
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
    <main className="mx-auto max-w-7xl px-4 pb-80 pt-10 sm:px-5 sm:pb-96 sm:pt-12">
      <JsonLd id="news-radar-articles-jsonld" data={articleJsonLd} />
      <JsonLd id="news-radar-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <NewsRadarHashScroller />
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">News radar</p>
      <h1 className="mt-3 max-w-4xl text-3xl font-black text-white sm:text-5xl">Market and prop-firm intelligence with source context.</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
        FundedScope separates curated research from live provider headlines. When news APIs are configured, fresh headlines can be attached; until then, this page shows editorial intelligence and the checks traders should complete before taking risk.
      </p>
      <div className="mt-5 max-w-3xl rounded-3xl border border-[#d9b96f]/20 bg-[#d9b96f]/10 p-4 text-sm leading-6 text-[#f0d99f]">
        Source status: curated preview. Connect `GNEWS_API_KEY` or `NEWS_API_KEY` to publish provider-backed live news.
      </div>
      <Link href="/market-intelligence" className="mt-6 inline-flex rounded-2xl bg-electric px-5 py-3 text-sm font-black text-void transition hover:scale-[1.01]">
        Open Market Intelligence™
      </Link>
      <div className="mt-8 grid gap-4">
        {enrichedNews.map((event) => (
          <GlassCard key={event.title} id={event.href.replace("/news-radar#", "")} className="radar-target scroll-mt-40 transition">
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
