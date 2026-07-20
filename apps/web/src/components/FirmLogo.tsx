"use client";

import { useMemo, useState } from "react";
import type { PropFirm } from "../lib/data";

export function FirmLogo({ firm, size = "md" }: { firm: Pick<PropFirm, "name" | "domain" | "logoUrl" | "logoFallback" | "accent">; size?: "sm" | "md" | "lg" }) {
  const sources = useMemo(
    () =>
      [
        firm.logoUrl,
        `https://www.google.com/s2/favicons?domain=${firm.domain}&sz=256`,
        `https://www.google.com/s2/favicons?domain_url=https://${firm.domain}&sz=256`,
        `https://icons.duckduckgo.com/ip3/${firm.domain}.ico`,
        `https://icon.horse/icon/${firm.domain}`
      ].filter(Boolean),
    [firm.domain, firm.logoUrl]
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const dimensions = size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm";
  const currentSource = sources[sourceIndex] ?? firm.logoUrl;

  return (
    <div className={`${dimensions} shrink-0 overflow-hidden rounded-2xl border border-[#d9b96f]/20 bg-gradient-to-br from-[#d9b96f]/45 via-white/10 to-slate-700/30 p-[2px] shadow-[0_14px_34px_rgba(0,0,0,0.32)]`} title={firm.name}>
      <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-[0.9rem] bg-[#080a10]">
        <span className="absolute inset-0 grid place-items-center bg-gradient-to-br from-slate-800 via-slate-950 to-black font-black tracking-tight text-[#d9b96f]">
          {firm.logoFallback}
        </span>
        <img
          key={currentSource}
          src={currentSource}
          alt={`${firm.name} logo`}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          className={`relative h-full w-full bg-white object-contain p-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
          referrerPolicy="no-referrer"
          onLoad={(event) => {
            const image = event.currentTarget;
            if (image.naturalWidth > 1 && image.naturalHeight > 1) {
              setLoaded(true);
            }
          }}
          onError={() => {
            setLoaded(false);
            setSourceIndex((current) => (current < sources.length - 1 ? current + 1 : current));
          }}
        />
      </div>
    </div>
  );
}
