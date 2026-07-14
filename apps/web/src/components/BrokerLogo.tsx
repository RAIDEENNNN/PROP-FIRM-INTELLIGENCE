"use client";

import { useState } from "react";

type BrokerLogoProps = {
  name: string;
  domain: string;
  fallback: string;
  className?: string;
};

export function BrokerLogo({ name, domain, fallback, className = "h-10 w-10" }: BrokerLogoProps) {
  const sources = [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
    `https://www.google.com/s2/favicons?domain_url=https://${domain}&sz=256`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://icon.horse/icon/${domain}`
  ];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`grid place-items-center rounded-2xl bg-gradient-to-br from-electric to-violet font-black text-white shadow-glow ${className}`} aria-label={`${name} logo fallback`}>
        {fallback}
      </span>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt={`${name} logo`}
      width={128}
      height={128}
      className={`${className} rounded-2xl bg-[radial-gradient(circle_at_28%_22%,#ffffff_0%,#f8fafc_43%,#0f172a_72%,#020617_100%)] object-contain p-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (sourceIndex < sources.length - 1) {
          setSourceIndex((current) => current + 1);
          return;
        }

        setFailed(true);
      }}
    />
  );
}
