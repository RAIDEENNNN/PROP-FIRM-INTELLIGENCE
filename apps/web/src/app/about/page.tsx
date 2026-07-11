import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "../../components/GlassCard";
import { JsonLd } from "../../components/JsonLd";
import { brand, brandSameAs } from "../../lib/brand";
import { trustPrinciples } from "../../lib/trust";

export const metadata: Metadata = {
  title: "About MyFundedScope | Company, Mission & Founder",
  description:
    "Learn about MyFundedScope, the company behind FundedScope: mission, vision, creator story, editorial standards and why the platform exists for modern traders.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About MyFundedScope",
    description: "The company behind FundedScope, a trading intelligence platform for prop firm, broker and market decisions.",
    url: "/about",
    siteName: "MyFundedScope",
    type: "profile",
    images: [brand.logoPath]
  },
  twitter: {
    card: "summary_large_image",
    title: "About MyFundedScope",
    description: "The company behind FundedScope, a trading intelligence platform for modern traders.",
    images: [brand.logoPath]
  }
};

const companyFacts = [
  ["Company", "MyFundedScope"],
  ["Product", "FundedScope"],
  ["Domain", brand.domain],
  ["Category", "Trading intelligence platform"],
  ["Audience", "Prop firm traders, forex traders, Gold traders and funded-account shoppers"],
  ["Promise", "Compare. Choose. Fund."]
];

const missionCards = [
  {
    title: "Mission",
    copy: "Help traders make better decisions by putting prop firm data, broker intelligence, market context, risk tools and personal trading memory in one place."
  },
  {
    title: "Vision",
    copy: "Become the first tab traders open every morning before checking rules, news, spreads, risk and their own trading behavior."
  },
  {
    title: "Why it exists",
    copy: "Traders waste time opening too many tabs, trusting mystery ratings and buying challenges without understanding the true rule/risk trade-off."
  }
];

const socialReservations = ["X / Twitter", "LinkedIn", "YouTube", "TikTok", "Instagram"];

export default function AboutPage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.companyName,
    alternateName: brand.productName,
    legalName: brand.legalName,
    url: brand.url,
    logo: brand.logoUrl,
    image: brand.logoUrl,
    email: brand.email,
    description: brand.description,
    sameAs: brandSameAs(),
    brand: {
      "@type": "Brand",
      name: brand.productName,
      slogan: brand.tagline
    },
    founder: {
      "@type": "Person",
      name: "Alliy",
      jobTitle: "Founder and creator"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: brand.email,
      url: `${brand.url}/contact`
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: brand.url },
      { "@type": "ListItem", position: 2, name: "About MyFundedScope", item: `${brand.url}/about` }
    ]
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <JsonLd id="about-organization-jsonld" data={organizationJsonLd} />
      <JsonLd id="about-breadcrumb-jsonld" data={breadcrumbJsonLd} />

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.18),transparent_32%),rgba(255,255,255,0.03)] p-5 sm:p-8 lg:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.32em]">About MyFundedScope</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-white sm:text-6xl">
          MyFundedScope is building the trading intelligence layer for modern traders.
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          MyFundedScope is the company behind FundedScope — a platform designed to help traders compare prop firms, evaluate brokers, understand market risk and build a personal Trading DNA that improves over time.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/prop-firms" className="rounded-full bg-white px-6 py-3 text-center font-black text-void">
            Compare prop firms
          </Link>
          <Link href="/articles/introducing-myfundedscope" className="rounded-full border border-white/15 px-6 py-3 text-center font-black text-white">
            Read the launch story
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {missionCards.map((item) => (
          <GlassCard key={item.title}>
            <p className="text-sm uppercase tracking-[0.24em] text-electric">{item.title}</p>
            <p className="mt-3 text-lg font-black leading-7 text-white">{item.copy}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.64fr_0.36fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Founder and creator</p>
          <h2 className="mt-3 text-3xl font-black text-white">Built by Alliy to make trader research cleaner, faster and more trustworthy.</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            <p>
              MyFundedScope exists because traders should not need five tabs, ten screenshots and guesswork before choosing a firm or planning risk. The platform is being built around a simple standard: every feature must save traders time, reduce risk or improve decisions.
            </p>
            <p>
              FundedScope starts with prop firm and broker comparison, but the long-term product is deeper: Trading DNA, journal memory, readiness checks, AI coaching, alerts and daily intelligence that adapts to each trader.
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Company facts</p>
          <div className="mt-5 space-y-3">
            {companyFacts.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-electric">Trust standard</p>
              <h2 className="mt-2 max-w-3xl text-2xl font-black text-white sm:text-3xl">MyFundedScope must earn trust before it earns revenue.</h2>
            </div>
            <Link href="/legal/how-we-score" className="w-fit rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:text-electric">
              View scoring method →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {trustPrinciples.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-void/60 p-5">
                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Contact</p>
          <h2 className="mt-2 text-2xl font-black text-white">Reach MyFundedScope</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            For corrections, partnerships, prop firm data, broker data, sponsorships or business inquiries, use the contact page or email {brand.email}.
          </p>
          <Link href="/contact" className="mt-5 inline-block rounded-full bg-white px-5 py-3 text-sm font-black text-void">
            Contact the company
          </Link>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Social entity building</p>
          <h2 className="mt-2 text-2xl font-black text-white">Reserve @MyFundedScope everywhere.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            After the social profiles are live, add their URLs to <span className="font-bold text-white">NEXT_PUBLIC_BRAND_SAME_AS</span> separated by commas so Organization schema points Google to the same brand entity.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {socialReservations.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm font-bold text-white">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
