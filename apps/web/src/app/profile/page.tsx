import Link from "next/link";
import { GlassCard } from "../../components/GlassCard";
import { ProfileDetailsForm } from "../../components/ProfileDetailsForm";
import { traderDnaProfile } from "../../lib/trader-dna";

const tradingStyles = ["Swing Trader", "Scalper", "Day Trader", "News Trader", "ICT", "SMC", "Price Action"];
const markets = ["Gold", "Forex", "Crypto", "Indices", "Stocks", "Commodities"];
const preferredPairs = ["XAUUSD", "GBPUSD", "EURUSD", "BTCUSD", "US30", "NAS100"];
const watchlist = ["FTMO", "FundingPips", "Goat Funded", "Exness", "Pepperstone"];
const savedComparisons = ["FTMO vs FundingPips", "Exness vs IC Markets", "The5ers vs FundedNext"];
const alerts = ["Gold spread alert", "FTMO rule change", "FundingPips discount", "CPI news reminder"];
const reviews = [
  ["FTMO", "Great payouts and clear rules."],
  ["Pepperstone", "Strong platform mix for active traders."]
];
const achievements = [
  ["🏅", "Explorer", "Viewed 50 prop firms"],
  ["📊", "Researcher", "Compared 100 firms"],
  ["🏦", "Broker Expert", "Compared 20 brokers"],
  ["🚀", "Founding Member", "Joined before public launch"]
];
const hubStats: Array<[string, string]> = [
  ["Profile Completion", `${traderDnaProfile.dnaScore}%`],
  ["Prop Firms Viewed", "126"],
  ["Broker Comparisons", "39"],
  ["Reviews Written", "11"],
  ["Watchlist", "8"],
  ["Alerts Active", "4"]
];

export default function ProfilePage() {
  return (
    <main className="relative mx-auto max-w-7xl overflow-hidden px-4 py-10 sm:px-5 sm:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(234,179,8,0.12),transparent_24%),radial-gradient(circle_at_50%_70%,rgba(139,92,246,0.18),transparent_30%)]" />

      <section className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-electric/10 backdrop-blur sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-electric">My Trading Hub™</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">Your trader command center.</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
              This is not a settings page. This is where FundedScope learns your markets, style, risk, watchlists, alerts, reviews and preferences so every recommendation becomes more personal.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="#trading-dna-form" className="rounded-full bg-white px-6 py-3 text-center font-black text-void shadow-glow">
                Complete Trading DNA
              </Link>
              <Link href="/dashboard" className="rounded-full border border-white/15 px-6 py-3 text-center font-black text-white">
                Open dashboard
              </Link>
            </div>
          </div>

          <GlassCard className="glow-border">
            <div className="flex items-center gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[2rem] border border-electric/30 bg-gradient-to-br from-electric to-violet text-4xl font-black text-white shadow-glow">
                AA
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">ALLIY AJADI</h2>
                <p className="mt-1 text-sm font-bold text-gold">⭐⭐ Premium Member</p>
                <p className="mt-1 text-sm text-slate-400">United Kingdom 🇬🇧 · Trader since July 2026</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Mini label="FundedScope Score" value="97" />
              <Mini label="Verified Trader" value="✔ Active" />
              <Mini label="Level" value={traderDnaProfile.level} />
              <Mini label="Next level" value={traderDnaProfile.nextLevel} />
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.64fr_0.36fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Trading Identity</p>
          <h2 className="mt-2 text-3xl font-black text-white">{traderDnaProfile.identity}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <HubGroup title="Style" items={tradingStyles} />
            <HubGroup title="Markets" items={markets} />
            <HubGroup title="Preferred pairs" items={preferredPairs} />
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Trader DNA™</p>
          <div className="mt-5 space-y-3">
            <DnaRow label="Risk appetite" value="🟡 Moderate" />
            <DnaRow label="Preferred session" value="London + New York" />
            <DnaRow label="Holding style" value="Intraday" />
            <DnaRow label="News trading" value="No high-impact entries" />
            <DnaRow label="Weekend holding" value="Only if rules allow it" />
          </div>
          <div className="mt-5 rounded-3xl border border-electric/20 bg-electric/10 p-4">
            <p className="text-sm font-black text-electric">AI insight</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Your preferences currently point toward FTMO, The5ers, Exness and Pepperstone for a Gold-focused London-session workflow.
            </p>
          </div>
        </GlassCard>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel title="My Watchlist" items={watchlist.map((item) => `⭐ ${item}`)} />
        <Panel title="Saved Comparisons" items={savedComparisons.map((item) => `${item} · Saved`)} />
        <Panel title="My Alerts" items={alerts.map((item) => `🔔 ${item}`)} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.36fr_0.32fr_0.32fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-gold">Premium</p>
          <h2 className="mt-2 text-3xl font-black text-white">FundedScope Premium</h2>
          <p className="mt-2 inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-sm font-black text-emerald-200">ACTIVE</p>
          <div className="mt-5 grid gap-3">
            <Mini label="Next billing" value="August 12" />
            <Mini label="Plan" value="Pro Trader" />
          </div>
          <button className="mt-5 w-full rounded-2xl bg-white px-5 py-3 font-black text-void">Manage subscription</button>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Security</p>
          <div className="mt-5 space-y-3">
            <DnaRow label="Email" value="Verified" />
            <DnaRow label="Phone" value="Add number" />
            <DnaRow label="2FA" value="Recommended" />
            <DnaRow label="Active devices" value="1 session" />
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Referral programme</p>
          <h2 className="mt-2 text-2xl font-black text-white">Invite traders. Earn premium months.</h2>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">Referral link</p>
            <p className="mt-1 break-all font-bold text-white">myfundedscope.com/r/alliy</p>
          </div>
          <Mini label="Referral earnings" value="0 months earned" />
        </GlassCard>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[0.55fr_0.45fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-gold">Achievements</p>
          <h2 className="mt-2 text-3xl font-black text-white">Badges that make progress visible.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {achievements.map(([icon, title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-3xl">{icon}</p>
                <h3 className="mt-3 font-black text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Statistics</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {hubStats.map(([label, value]) => (
              <Mini key={label} label={label} value={value} />
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[0.38fr_0.62fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">My Reviews</p>
          <div className="mt-5 space-y-3">
            {reviews.map(([name, copy]) => (
              <div key={name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-black text-white">⭐⭐⭐⭐⭐ {name}</p>
                <p className="mt-2 text-sm text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">Future Premium AI</p>
          <h2 className="mt-2 text-3xl font-black text-white">Personal recommendations from your trading profile.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Your trading preferences suggest FTMO, The5ers and Exness are currently your best matches. You usually trade Gold during London, so FundedScope will prioritise broker spread/execution alerts for XAUUSD and major USD news.
          </p>
        </GlassCard>
      </section>

      <section id="trading-dna-form" className="mt-5">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-electric">Personalisation</p>
          <h2 className="mt-2 text-3xl font-black text-white">Complete your Trading DNA.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            These details power recommendations, readiness checks, watchlists, alerts, dashboards, prop firm fit, broker fit and AI coaching.
          </p>
          <ProfileDetailsForm />
        </GlassCard>
      </section>
    </main>
  );
}

function HubGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-200">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <GlassCard>
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-slate-200">
            {item}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function DnaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-black text-white">{value}</span>
    </div>
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
