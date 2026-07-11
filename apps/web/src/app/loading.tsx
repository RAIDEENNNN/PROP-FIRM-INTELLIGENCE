export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <div className="h-5 w-48 animate-pulse rounded-full bg-white/10" />
        <div className="mt-5 h-14 max-w-2xl animate-pulse rounded-2xl bg-white/10" />
        <div className="mt-4 h-5 max-w-xl animate-pulse rounded-full bg-white/10" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
          ))}
        </div>
      </div>
    </main>
  );
}
