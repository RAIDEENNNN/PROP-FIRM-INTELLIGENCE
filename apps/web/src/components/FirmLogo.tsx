import type { PropFirm } from "../lib/data";
import { CompanyLogo } from "./CompanyLogo";

export function FirmLogo({ firm, size = "md" }: { firm: Pick<PropFirm, "name" | "domain" | "logoUrl" | "logoFallback" | "accent">; size?: "sm" | "md" | "lg" }) {
  const dimensions = size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm";

  return (
    <CompanyLogo name={firm.name} domain={firm.domain} fallback={firm.logoFallback} primaryUrl={firm.logoUrl} accentClass={firm.accent} className={dimensions} />
  );
}
