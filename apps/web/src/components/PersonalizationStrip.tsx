"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ViewedItem = {
  title: string;
  href: string;
  type: string;
};

export function PersonalizationStrip() {
  const [items, setItems] = useState<ViewedItem[]>([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("fundedscope:recently-viewed") ?? "[]") as ViewedItem[]);
    } catch {
      setItems([]);
    }
  }, []);

  const display = items.length
    ? items
    : [
        { title: "FTMO", href: "/prop-firms/ftmo", type: "Prop Firm" },
        { title: "FundingPips", href: "/prop-firms/funding-pips", type: "Prop Firm" },
        { title: "Exness", href: "/brokers", type: "Broker" }
      ];

  return (
    <section className="mt-8 grid gap-4 lg:grid-cols-[0.4fr_0.6fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-electric">Recently viewed</p>
        <div className="mt-4 grid gap-2">
          {display.slice(0, 4).map((item) => (
            <Link key={item.href} href={item.href} className="rounded-2xl border border-white/10 bg-black/20 p-3 transition hover:border-electric/40">
              <p className="font-black text-white">{item.title}</p>
              <p className="text-xs text-slate-500">{item.type}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm uppercase tracking-[0.28em] text-gold">Recently updated</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            ["FundingPips Rules", "Yesterday"],
            ["FTMO Pricing", "2 hours ago"],
            ["Exness Spreads", "Today"],
            ["Broker review workflow", "Today"]
          ].map(([title, time]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="font-black text-white">{title}</p>
              <p className="text-xs text-slate-500">{time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
