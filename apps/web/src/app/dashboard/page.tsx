import { CommandPreview } from "../../components/CommandPreview";
import { MetricCard } from "../../components/MetricCard";
import { dashboardMetrics } from "../../lib/data";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.28em] text-electric">Dashboard</p>
      <h1 className="mt-3 text-4xl font-black text-white">Your funded account command center</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="mt-8">
        <CommandPreview />
      </div>
    </main>
  );
}
