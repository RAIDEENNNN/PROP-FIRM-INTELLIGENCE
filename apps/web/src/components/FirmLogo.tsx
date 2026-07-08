"use client";

import { useState } from "react";
import type { PropFirm } from "../lib/data";

export function FirmLogo({ firm, size = "md" }: { firm: Pick<PropFirm, "name" | "logoUrl" | "logoFallback" | "accent">; size?: "sm" | "md" | "lg" }) {
  const [failed, setFailed] = useState(false);
  const dimensions = size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm";

  return (
    <div className={`${dimensions} shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br ${firm.accent} p-[2px] shadow-glow`}>
      <div className="grid h-full w-full place-items-center overflow-hidden rounded-[0.9rem] bg-void/80">
        {!failed ? (
          <img
            src={firm.logoUrl}
            alt={`${firm.name} logo`}
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-2"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="font-black tracking-tight text-white">{firm.logoFallback}</span>
        )}
      </div>
    </div>
  );
}
