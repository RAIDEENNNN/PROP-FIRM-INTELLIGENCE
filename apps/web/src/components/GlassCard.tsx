import type { ReactNode } from "react";

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`glass rounded-3xl p-6 ${className}`}>{children}</section>;
}
