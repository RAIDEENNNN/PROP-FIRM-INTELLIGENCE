export function ExternalMarketChart({
  symbol = "OANDA:XAUUSD",
  title = "External market reference chart"
}: {
  symbol?: string;
  title?: string;
}) {
  const chartUrl = `https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(symbol)}&interval=60&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=0b1020&studies=[]&theme=dark&style=1&timezone=Etc/UTC&withdateranges=1`;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
      <div className="flex flex-col gap-2 border-b border-white/10 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-electric">External market reference</p>
          <h2 className="mt-1 text-2xl font-black text-white">{title}</h2>
        </div>
        <p className="text-xs leading-5 text-slate-500">Chart provided by TradingView embed. FundedScope does not control this market feed.</p>
      </div>
      <iframe
        title={title}
        src={chartUrl}
        className="h-[520px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
