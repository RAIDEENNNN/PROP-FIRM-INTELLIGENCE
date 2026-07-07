import Link from "next/link";
import { GlassCard } from "../../components/GlassCard";

const plans = [
  {
    name: "Free",
    price: "$0",
    audience: "For traders researching their first challenge.",
    promise: "Stop guessing which firms are worth your attention.",
    cta: "Start free",
    href: "/sign-up?plan=free",
    features: [
      "Global prop firm directory",
      "Basic side-by-side comparison",
      "Lot size, drawdown and profit target calculators",
      "Starter spread matrix preview",
      "Firm profile pages with rules and payout notes"
    ],
    limits: ["No saved alerts", "No personalized dashboard", "Indicative spread view only"]
  },
  {
    name: "Pro",
    price: "$19",
    badge: "Most useful for serious traders",
    audience: "For traders actively buying, passing or managing challenges.",
    promise: "Catch rule changes, spread risk and payout friction before they cost you.",
    cta: "Upgrade to Pro",
    href: "/sign-up?plan=pro",
    features: [
      "Saved firms and personal watchlist",
      "Rule-change, payout and spread alerts",
      "Compare any five firms with fit scoring",
      "Advanced filters by fee, drawdown, payout and market",
      "Trader profile recommendations",
      "Challenge and funded account dashboard",
      "Saved calculator history and payout progress"
    ],
    limits: ["No team seats", "No API access"]
  },
  {
    name: "Business",
    price: "$99",
    audience: "For affiliates, educators, communities and trading teams.",
    promise: "Turn prop firm intelligence into reports, content, leads and revenue.",
    cta: "Start business plan",
    href: "/contact?plan=business",
    features: [
      "Team seats and shared watchlists",
      "API access for firm, rule and spread data",
      "Exportable reports and analytics",
      "Featured listing and sponsorship tools",
      "Affiliate link performance tracking",
      "Priority data requests",
      "Editorial/admin collaboration workflow"
    ],
    limits: ["Custom enterprise feeds priced separately"]
  }
];

const comparisonRows: Array<[string, string, string, string]> = [
  ["Prop firm directory", "Yes", "Yes", "Yes"],
  ["Every firm profile page", "Yes", "Yes", "Yes"],
  ["Forex, metals, indices, crypto and synthetic spread matrix", "Preview", "Full", "Full + export"],
  ["Saved firms/watchlist", "No", "Yes", "Team"],
  ["Rule-change alerts", "No", "Yes", "Yes"],
  ["Payout and drawdown dashboard", "No", "Yes", "Team"],
  ["AI-style recommendations", "Basic", "Personalized", "Portfolio/team"],
  ["Affiliate tracking", "No", "No", "Yes"],
  ["API access", "No", "No", "Yes"],
  ["Reports and analytics", "No", "Limited", "Full"]
];

const reasons = [
  {
    title: "Most comparison sites stop at price.",
    copy: "FundedScope compares rules, drawdown, payout behavior, spread risk, review signals and trader fit."
  },
  {
    title: "Rules change after traders buy challenges.",
    copy: "The alert system is built around policy monitoring, so traders can react before a funded account is at risk."
  },
  {
    title: "Spreads decide whether a setup is tradable.",
    copy: "Forex, metals, indices, crypto and synthetic instruments live in one spread intelligence layer instead of scattered screenshots."
  },
  {
    title: "Affiliates need data, not just links.",
    copy: "Business turns FundedScope into a research, reporting and revenue platform for creators and communities."
  }
];

const faqs = [
  ["Is the Free plan useful?", "Yes. Free users can research firms, compare basics and use calculators. Pro is for traders who want saved intelligence and alerts."],
  ["Are spreads live?", "The platform is live-source ready. It ships with indicative baselines and connects to provider feeds as API keys are added."],
  ["Can firms pay for better scores?", "No. Featured placements and sponsorships must be disclosed separately from editorial scoring."],
  ["Who is Business for?", "Affiliates, trading educators, Discord communities, prop firm reviewers and teams that need reports, exports or API access."]
];

const stickyFeatures = [
  ["AI that knows you", "Learns from your journal, mistakes, accounts, brokers, markets and goals."],
  ["Lifetime trading memory", "Your trading history becomes an advantage competitors cannot copy overnight."],
  ["Weekly AI mentor", "Sunday reviews for discipline, risk, psychology, market fit and improvement."],
  ["Career progress", "Novice → Intermediate → Professional → Elite → Institutional status layers."],
  ["Personal statistics", "Best session, worst hour, best broker, emotional pairs, average hold time and strategy quality."],
  ["Trader identity", "Build toward becoming a FundedScope Pro trader, not just another challenge buyer."]
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Pricing</p>
      <h1 className="mt-3 max-w-5xl text-3xl font-black text-white sm:text-5xl md:text-6xl">Choose the intelligence level that protects your next funded account.</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
        FundedScope is not just a list of prop firms. It is a decision system for avoiding bad-fit challenges, tracking rule changes and finding where your strategy has the best chance.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <GlassCard key={plan.name} className={plan.name === "Pro" ? "glow-border relative overflow-hidden" : "relative overflow-hidden"}>
            {plan.badge ? <span className="mb-5 inline-block rounded-full bg-electric/15 px-3 py-1 text-xs font-bold text-electric">{plan.badge}</span> : null}
            <p className="text-2xl font-black text-white">{plan.name}</p>
            <p className="mt-4 text-6xl font-black text-electric">{plan.price}</p>
            <p className="mt-2 text-sm text-slate-500">per month</p>
            <p className="mt-5 text-sm font-bold text-white">{plan.audience}</p>
            <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{plan.promise}</p>

            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex gap-3 text-sm text-slate-200">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-electric" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-white/10 pt-5">
              {plan.limits.map((limit) => (
                <p key={limit} className="text-xs text-slate-500">• {limit}</p>
              ))}
            </div>

            <Link href={plan.href} className="mt-8 block w-full rounded-2xl bg-white px-4 py-3 text-center font-bold text-void">
              {plan.cta}
            </Link>
          </GlassCard>
        ))}
      </div>

      <section className="mt-14">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Premium should feel impossible to replace</p>
        <h2 className="mt-3 max-w-4xl text-3xl font-black text-white">The Memory Advantage: every day FundedScope becomes smarter about that specific trader.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stickyFeatures.map(([title, copy]) => (
            <GlassCard key={title}>
              <h3 className="text-xl font-black text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="text-sm uppercase tracking-[0.28em] text-violet">Why traders upgrade</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reasons.map((reason) => (
            <GlassCard key={reason.title}>
              <h2 className="text-lg font-black text-white">{reason.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{reason.copy}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-electric">Plan differences</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">What changes when you pay?</h2>
          </div>
          <p className="text-sm text-slate-400">Built for mobile cards and desktop tables.</p>
        </div>

        <div className="mt-6 grid gap-3 md:hidden">
          {comparisonRows.map(([feature, free, pro, business]) => (
            <GlassCard key={feature}>
              <p className="font-bold text-white">{feature}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <MiniCell label="Free" value={free} />
                <MiniCell label="Pro" value={pro} />
                <MiniCell label="Business" value={business} />
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-6 hidden overflow-x-auto p-0 md:block">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="p-4">Feature</th>
                <th className="p-4">Free</th>
                <th className="p-4">Pro</th>
                <th className="p-4">Business</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(([feature, free, pro, business]) => (
                <tr key={feature} className="border-t border-white/10">
                  <td className="p-4 font-bold text-white">{feature}</td>
                  <td className="p-4 text-slate-300">{free}</td>
                  <td className="p-4 text-electric">{pro}</td>
                  <td className="p-4 text-slate-300">{business}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </section>

      <section className="mt-14 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Monetization stack</p>
          <h2 className="mt-3 text-3xl font-black text-white">Seven ways this becomes a company.</h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Pricing is only one lane. FundedScope is designed for subscriptions, affiliates, featured listings, API access, sponsorships, reports and analytics.
          </p>
        </GlassCard>
        <div className="grid gap-3 sm:grid-cols-2">
          {["Affiliate commissions", "Featured firm listings", "Premium subscriptions", "Display ads later", "API access", "Sponsorships", "Reports and analytics", "Community/team seats"].map((item) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm font-bold text-white">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="text-sm uppercase tracking-[0.28em] text-violet">FAQ</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <GlassCard key={question}>
              <h3 className="text-lg font-black text-white">{question}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{answer}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </main>
  );
}

function MiniCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  );
}
