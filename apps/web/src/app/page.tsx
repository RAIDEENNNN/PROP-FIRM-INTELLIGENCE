import Link from "next/link";
import { CommandPreview } from "../components/CommandPreview";
import { FirmCard } from "../components/FirmCard";
import { GlassCard } from "../components/GlassCard";
import { featuredFirms, propFirms } from "../lib/data";
import { fallbackMarkets } from "../lib/markets";
import { spreadRecords } from "../lib/spreads";
import { scoreWeights, trustPrinciples } from "../lib/trust";

const journey = [
  {
    kicker: "Compare prop firms",
    title: "Rules, payouts, drawdowns and scores in one view.",
    copy: "See why a firm scores 94/100 instead of trusting mystery numbers. Every score has visible weighted categories."
  },
  {
    kicker: "Compare brokers",
    title: "Spread and trading-condition intelligence.",
    copy: "Broker comparison is being shaped around spreads, commissions, execution notes, assets and trader fit."
  },
  {
    kicker: "AI assistant",
    title: "Ask the questions traders actually ask.",
    copy: "Which firm suits me? Is Gold risky today? What does CPI mean for XAUUSD? How much should I risk?"
  },
  {
    kicker: "Trader DNA",
    title: "The platform gets smarter about you every week.",
    copy: "Your trades, mistakes, sessions, emotions and discipline become a personalized decision engine competitors cannot copy."
  },
  {
    kicker: "Trading tools",
    title: "Calculators, journals, alerts and market context.",
    copy: "Build a morning routine around risk, rules, news, watchlists and performance notes."
  }
];

const stats = [
  ["Prop firms tracked", String(propFirms.length)],
  ["Spread records", spreadRecords.length.toLocaleString()],
  ["Score categories", String(scoreWeights.length)],
  ["Daily market assets", String(fallbackMarkets.length)]
];

const testimonials = [
  ["Ari, funded trader", "I can compare rules and spreads before buying a challenge instead of opening ten tabs."],
  ["Daniel, Gold trader", "The XAUUSD view makes FundedScope feel like something I would open before London session."],
  ["Maya, trading community owner", "The score breakdown and affiliate disclosure make the platform feel much more trustworthy."]
];

const faqs = [
  ["What is FundedScope?", "A trading intelligence platform for comparing prop firms, brokers, spreads, rules, market risk and trader decisions."],
  ["Are the scores made up?", "No. Scores are broken into weighted categories: rules, payouts, trust, pricing, markets/spreads and data freshness."],
  ["Are market prices live?", "The market bar is live-ready. Public crypto can update immediately; other assets use indicative values until provider keys are connected."],
  ["Why would I use it every day?", "Today’s Edge combines market news, watchlist risk, prop restrictions, spreads, journal reminders and AI-style summaries."]
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-16">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.2),transparent_34%),rgba(255,255,255,0.03)] p-5 shadow-glow sm:p-8 lg:p-10">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <div className="mb-6 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/30 p-2 pr-5">
              <span className="grid h-10 w-10 overflow-hidden rounded-full bg-black">
                <img src="/brand/fundedscope-logo.png" alt="FundedScope logo" className="h-full w-full object-cover" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Today’s Edge · Trading Intelligence</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.32em]">FundedScope</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] text-white sm:text-6xl md:text-7xl">
              Trade Smarter.
              <br />
              Decide Faster.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              The intelligence platform that helps traders compare prop firms, evaluate brokers, analyze markets and make better trading decisions — all in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="rounded-full bg-white px-6 py-3 text-center font-bold text-void shadow-glow">
                Get Started
              </Link>
              <Link href="/prop-firms" className="rounded-full border border-white/15 px-6 py-3 text-center font-bold text-white">
                Compare Prop Firms
              </Link>
              <Link href="/gold" className="rounded-full border border-electric/30 px-6 py-3 text-center font-bold text-electric">
                Watch Demo
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="mt-1 text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <CommandPreview />
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-electric">Why traders trust it</p>
              <h2 className="mt-2 max-w-3xl text-2xl font-black text-white sm:text-3xl">Scores, sources and commercial disclosures are visible.</h2>
            </div>
            <Link href="/legal/how-we-score" className="w-fit rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:text-electric">
              See score formula →
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

      <section className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {journey.map((item) => (
          <GlassCard key={item.kicker}>
            <p className="text-xs uppercase tracking-[0.24em] text-electric">{item.kicker}</p>
            <h2 className="mt-3 text-xl font-black text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{item.copy}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mt-14 sm:mt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-violet">Compare prop firms</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Searchable, scoreable, explainable.</h2>
          </div>
          <Link href="/prop-firms" className="text-sm font-bold text-electric">
            View directory →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredFirms.slice(0, 4).map((firm) => (
            <FirmCard key={firm.slug} firm={firm} />
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Today’s Edge</p>
          <h2 className="mt-3 text-3xl font-black text-white">The page traders open every morning.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            AI market summary, major news, upcoming events, best prop firm offers, broker spread comparison, risk reminders and personal trading notes — built to become a daily habit.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className="rounded-full bg-white px-5 py-3 text-center font-bold text-void">
              Open dashboard
            </Link>
            <Link href="/gold" className="rounded-full border border-white/10 px-5 py-3 text-center font-bold text-white">
              View Gold command center
            </Link>
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">AI Intelligence Center</p>
          <div className="mt-5 space-y-3">
            {["Which prop firm suits me?", "Which broker is cheapest for Gold?", "Explain today’s CPI risk.", "Compare FTMO vs Funding Pips.", "Calculate my risk for XAUUSD."].map((prompt) => (
              <div key={prompt} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-white">
                Ask AI: {prompt}
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {testimonials.map(([name, quote]) => (
          <GlassCard key={name}>
            <p className="text-sm leading-7 text-slate-300">“{quote}”</p>
            <p className="mt-4 text-sm font-black text-white">{name}</p>
          </GlassCard>
        ))}
      </section>

      <section className="mt-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-electric">FAQ</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Built for traders who want fewer tabs and better decisions.</h2>
          </div>
          <Link href="/pricing" className="text-sm font-bold text-electric">
            See Premium →
          </Link>
        </div>
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
