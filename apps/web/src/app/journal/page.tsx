import { GlassCard } from "../../components/GlassCard";
import { traderDnaProfile } from "../../lib/trader-dna";

const journalFields = ["Entry", "Exit", "Risk", "Screenshot", "Emotion", "Mistake", "Lesson", "Chart notes"];

const recentEntries = [
  ["XAUUSD London continuation", "Win", "Followed plan, exited before NY news."],
  ["Gold pre-CPI impulse", "Loss", "Entered too close to red-folder news."],
  ["NAS100 pullback", "Break-even", "Good patience, weak follow-through."]
];

export default function JournalPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <p className="text-xs uppercase tracking-[0.24em] text-electric sm:text-sm sm:tracking-[0.28em]">Journal</p>
      <h1 className="mt-3 max-w-5xl text-3xl font-black text-white sm:text-5xl">Your journal is how FundedScope learns you.</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
        Every entry becomes part of Trader DNA: performance, psychology, strategy quality, session behavior, market fit and rule discipline.
      </p>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.45fr_0.55fr]">
        <GlassCard className="glow-border">
          <p className="text-sm uppercase tracking-[0.28em] text-electric">New journal entry</p>
          <h2 className="mt-2 text-2xl font-black text-white">Capture the trade. Train the memory.</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {journalFields.map((field) => (
              <input key={field} className="rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder={field} />
            ))}
          </div>
          <button className="mt-5 w-full rounded-2xl bg-electric px-4 py-3 font-bold text-void">Save to Trader DNA</button>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.28em] text-violet">AI memory extraction</p>
          <h2 className="mt-2 text-2xl font-black text-white">What FundedScope learns from entries</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {traderDnaProfile.personalStats.slice(0, 6).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {recentEntries.map(([title, result, note]) => (
          <GlassCard key={title}>
            <span className={`rounded-full px-3 py-1 text-xs ${result === "Win" ? "bg-success/15 text-success" : result === "Loss" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"}`}>
              {result}
            </span>
            <h2 className="mt-4 text-xl font-black text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{note}</p>
          </GlassCard>
        ))}
      </section>
    </main>
  );
}
