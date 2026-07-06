import { GlassCard } from "../../components/GlassCard";

const plans = [
  ["Free", "$0", "Directory, calculators and basic comparison"],
  ["Pro", "$19", "Alerts, saved dashboards, advanced filters and spread intelligence"],
  ["Business", "$99", "API access, reports, sponsorship tools and team seats"]
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Pricing</p>
      <h1 className="mt-3 text-4xl font-black text-white">Monetization ready from day one</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {plans.map(([name, price, copy]) => (
          <GlassCard key={name} className={name === "Pro" ? "glow-border" : ""}>
            <p className="text-xl font-black text-white">{name}</p>
            <p className="mt-4 text-5xl font-black text-electric">{price}</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">{copy}</p>
            <button className="mt-8 w-full rounded-2xl bg-white px-4 py-3 font-bold text-void">Choose plan</button>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
