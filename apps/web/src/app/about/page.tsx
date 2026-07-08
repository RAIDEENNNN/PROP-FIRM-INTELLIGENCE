import type { Metadata } from "next";
import { GlassCard } from "../../components/GlassCard";
import { trustPrinciples } from "../../lib/trust";

export const metadata: Metadata = {
  title: "About FundedScope | Trusted Trader Intelligence",
  description: "Learn why FundedScope exists, how it scores prop firms and how it aims to help traders make better decisions.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About FundedScope",
    description: "The trusted research layer between traders, prop firms, brokers and better decisions.",
    url: "/about",
    siteName: "FundedScope",
    type: "website",
    images: ["/brand/fundedscope-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "About FundedScope",
    description: "The trusted research layer between traders, prop firms, brokers and better decisions.",
    images: ["/brand/fundedscope-logo.png"]
  }
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">About the creator</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-black text-white sm:text-5xl">Built to make prop firm research cleaner, faster and fairer.</h1>
      <GlassCard className="mt-8">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
          <div>
            <h2 className="text-2xl font-black text-white">Why FundedScope exists</h2>
            <p className="mt-4 leading-8 text-slate-300">
              FundedScope is designed as a premium trader intelligence platform: comparison data, rule-change tracking, payout transparency, spread intelligence and tools that help traders avoid bad-fit challenges.
            </p>
            <p className="mt-4 leading-8 text-slate-300">
              The mission is to become the trusted research layer between traders and prop firms — clear enough for beginners, detailed enough for serious funded-account shoppers.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-electric">Company promise</p>
            <p className="mt-3 text-2xl font-black text-white">Compare first. Choose carefully. Fund smarter.</p>
          </div>
        </div>
      </GlassCard>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {trustPrinciples.map((item) => (
          <GlassCard key={item.title}>
            <h2 className="text-xl font-black text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{item.copy}</p>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
