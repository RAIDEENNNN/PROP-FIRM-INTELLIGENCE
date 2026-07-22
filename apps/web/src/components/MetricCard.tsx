export function MetricCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="glass rounded-3xl p-4 sm:p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 break-words text-2xl font-black text-white sm:text-3xl">{value}</p>
      <p className="mt-2 text-sm text-electric">{delta}</p>
    </div>
  );
}
