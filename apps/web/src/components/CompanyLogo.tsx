"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CompanyLogoProps = {
  name: string;
  domain: string;
  fallback: string;
  className?: string;
  primaryUrl?: string;
  accentClass?: string;
};

const minimumUsableLogoSize = 32;

function normalizeDomain(domain: string) {
  return domain.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0]?.trim() ?? domain;
}

export function CompanyLogo({
  name,
  domain,
  fallback,
  className = "h-12 w-12",
  primaryUrl,
  accentClass = "from-electric to-violet"
}: CompanyLogoProps) {
  const sources = useMemo(() => {
    const cleanDomain = normalizeDomain(domain);
    const urls = [
      primaryUrl,
      `https://logo.clearbit.com/${cleanDomain}?size=256`,
      `https://icon.horse/icon/${cleanDomain}`
    ];

    return Array.from(new Set(urls.filter(Boolean))) as string[];
  }, [domain, primaryUrl]);

  const [sourceIndex, setSourceIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const currentSource = sources[sourceIndex];
  const imageRef = useRef<HTMLImageElement | null>(null);

  const showNextSource = useCallback(() => {
    setLoaded(false);
    setSourceIndex((current) => (current < sources.length - 1 ? current + 1 : sources.length));
  }, [sources.length]);

  useEffect(() => {
    setLoaded(false);
    const image = imageRef.current;
    if (!image || !currentSource) return;

    const timeout = window.setTimeout(() => {
      if (image.complete && (image.naturalWidth < minimumUsableLogoSize || image.naturalHeight < minimumUsableLogoSize)) {
        showNextSource();
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [currentSource, showNextSource]);

  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[#070913] p-[2px] shadow-[0_12px_30px_rgba(0,0,0,0.34)] ${className}`}
      aria-label={`${name} logo`}
      title={name}
    >
      <span className={`absolute inset-0 bg-gradient-to-br ${accentClass} opacity-75`} />
      <span className="relative grid h-full w-full place-items-center overflow-hidden rounded-[0.85rem] bg-[#090c14]">
        <span className={`absolute inset-0 bg-gradient-to-br ${accentClass} opacity-[0.16]`} />
        <span className="relative z-0 grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.18),transparent_36%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] px-1 text-center font-black tracking-tight text-white">
          {fallback}
        </span>
        {currentSource ? (
          <img
            ref={imageRef}
            key={currentSource}
            src={currentSource}
            alt=""
            width={128}
            height={128}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className={`absolute inset-0 z-10 h-full w-full bg-white object-contain p-[14%] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition-opacity duration-200 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={(event) => {
              const image = event.currentTarget;
              if (image.naturalWidth >= minimumUsableLogoSize && image.naturalHeight >= minimumUsableLogoSize) {
                setLoaded(true);
                return;
              }

              showNextSource();
            }}
            onError={showNextSource}
          />
        ) : null}
      </span>
    </span>
  );
}
