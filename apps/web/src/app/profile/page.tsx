import Link from "next/link";
import { GlassCard } from "../../components/GlassCard";
import { ProfileDetailsForm } from "../../components/ProfileDetailsForm";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { noindexMetadata } from "../../lib/seo";

export const metadata = noindexMetadata("Set up your profile | FundedScope", "Start a private FundedScope profile from a blank account.", "/profile");

const setupSteps = [
  ["1", "Choose your trader identity", "Add your style, experience level, session, markets and risk tolerance."],
  ["2", "Build your watchlist", "Save the prop firms, brokers and pairs you want FundedScope to monitor."],
  ["3", "Turn on useful alerts", "Get rule-change, payout, spread and high-impact news reminders after your preferences exist."],
  ["4", "Unlock personal intelligence", "Trading Readiness, My News and recommendations improve as your profile becomes more complete."]
];

const emptyPanels: Array<[string, string, string, string]> = [
  ["Watchlist", "No saved firms or brokers yet.", "/prop-firms", "Browse firms"],
  ["Saved comparisons", "No comparison sets saved yet.", "/compare", "Compare firms"],
  ["Alerts", "No active alerts yet.", "/alerts", "Set alerts"],
  ["Trading DNA", "No profile answers submitted yet.", "#trading-dna-form", "Start setup"]
];

const privacyNotes = [
  "New accounts start blank by default.",
  "FundedScope should not invent country, capital, style, broker or prop-firm data.",
  "Personal recommendations only become specific after the user gives profile inputs.",
  "Admin notes and moderation data are not part of the user profile."
];

export default function ProfilePage() {
  return (
    <ProtectedRoute label="profile">
    <main className="relative mx-auto max-w-7xl overflow-hidden px-4 py-10 sm:px-5 sm:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.14),transparent_24%)]" />

      <section className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/75 p-5 shadow-2xl shadow-electric/10 backdrop-blur sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-electric">New account setup</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">Your FundedScope profile starts empty.</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
              No fake trading history. No guessed country. No assumed capital. Tell FundedScope what matters to you, then the dashboard becomes personal.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="#trading-dna-form" className="rounded-full bg-electric px-6 py-3 text-center font-black text-void shadow-glow">
                Start Trading DNA
              </Link>
              <Link href="/market-intelligence" className="rounded-full border border-white/15 px-6 py-3 text-center font-black text-white">
                View public intelligence
              </Link>
            </div>
          </div>

          <GlassCard className="glow-border">
            <div className="flex items-center gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[2rem] border border-electric/30 bg-gradient-to-br from-slate-900 to-slate-700 text-4xl font-black text-white shadow-glow">
                ?
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Unnamed trader</h2>
                <p className="mt-1 text-sm font-bold text-slate-400">Blank profile</p>
                <p className="mt-1 text-sm text-slate-500">Created account. Profile setup pending.</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Mini label="Completion" value="0%" />
              <Mini label="Watchlist" value="Empty" />
              <Mini label="Alerts" value="Off" />
              <Mini label="Personal AI" value="Locked" />
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.62fr_0.38fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">First-run checklist</p>
          <h2 className="mt-2 text-3xl font-black text-white">What a new user should do next</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {setupSteps.map(([number, title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-electric font-black text-void">{number}</span>
                <h3 className="mt-4 font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Privacy boundary</p>
          <h2 className="mt-2 text-2xl font-black text-white">We only personalize after you give data.</h2>
          <div className="mt-5 space-y-3">
            {privacyNotes.map((note) => (
              <div key={note} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300">
                {note}
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {emptyPanels.map(([title, copy, href, action]) => (
          <GlassCard key={title}>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{title}</p>
            <h2 className="mt-3 text-xl font-black text-white">{copy}</h2>
            <Link href={href} className="mt-5 block rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-black text-white transition hover:border-electric/40 hover:text-electric">
              {action}
            </Link>
          </GlassCard>
        ))}
      </section>

      <section id="trading-dna-form" className="mt-5">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Optional profile setup</p>
          <h2 className="mt-2 text-3xl font-black text-white">Complete your Trading DNA when you are ready.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            These answers power recommendations, readiness checks, watchlists, alerts, prop firm fit, broker fit and AI coaching. A user can skip anything they do not know yet.
          </p>
          <ProfileDetailsForm />
        </GlassCard>
      </section>
    </main>
    </ProtectedRoute>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
