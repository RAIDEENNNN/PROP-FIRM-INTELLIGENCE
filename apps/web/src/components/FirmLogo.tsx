"use client";

import { useState } from "react";
import type { PropFirm } from "../lib/data";

export function FirmLogo({ firm, size = "md" }: { firm: Pick<PropFirm, "name" | "logoUrl" | "logoFallback" | "accent">; size?: "sm" | "md" | "lg" }) {
  const domain = firm.logoUrl.includes("logo.clearbit.com/") ? firm.logoUrl.split("logo.clearbit.com/")[1] : "";
  const sources = [
    firm.logoUrl,
    domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=256` : "",
    domain ? `https://www.google.com/s2/favicons?domain_url=https://${domain}&sz=256` : "",
    domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : "",
    domain ? `https://icon.horse/icon/${domain}` : ""
  ].filter(Boolean);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const dimensions = size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm";

  return (
    <div className={`${dimensions} shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br ${firm.accent} p-[2px] shadow-glow`}>
      <div className="grid h-full w-full place-items-center overflow-hidden rounded-[0.9rem] bg-[radial-gradient(circle_at_28%_22%,#ffffff_0%,#f8fafc_43%,#0f172a_72%,#020617_100%)]">
        {!failed ? (
          <img
            src={sources[sourceIndex] ?? firm.logoUrl}
            alt={`${firm.name} logo`}
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
            referrerPolicy="no-referrer"
            onError={() => {
              if (sourceIndex < sources.length - 1) {
                setSourceIndex((current) => current + 1);
                return;
              }

              setFailed(true);
            }}
          />
        ) : (
          <span className="grid h-full w-full place-items-center bg-gradient-to-br from-electric to-violet font-black tracking-tight text-white">
            {firm.logoFallback}
          </span>
        )}
      </div>
    </div>
  );
}
