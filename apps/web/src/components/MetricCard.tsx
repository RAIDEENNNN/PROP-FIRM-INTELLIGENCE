export function MetricCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm text-electric">{delta}</p>
    </div>
  );
}
