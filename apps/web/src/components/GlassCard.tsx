import type { HTMLAttributes, ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
  return (
    <section {...props} className={`glass rounded-3xl p-4 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}
