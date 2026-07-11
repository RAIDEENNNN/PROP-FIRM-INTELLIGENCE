"use client";

import { useState } from "react";

type BrokerLogoProps = {
  name: string;
  domain: string;
  fallback: string;
  className?: string;
};

export function BrokerLogo({ name, domain, fallback, className = "h-10 w-10" }: BrokerLogoProps) {
  const sources = [`https://logo.clearbit.com/${domain}`, `https://www.google.com/s2/favicons?domain=${domain}&sz=256`];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`grid place-items-center rounded-2xl bg-gradient-to-br from-electric to-violet font-black text-white ${className}`} aria-label={`${name} logo fallback`}>
        {fallback}
      </span>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt={`${name} logo`}
      className={`${className} rounded-2xl object-contain`}
      loading="lazy"
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
