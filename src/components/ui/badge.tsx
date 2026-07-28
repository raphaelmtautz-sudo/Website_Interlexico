import { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border border-gold-dim px-3 py-1 font-sans text-[11px] tracking-[0.18em] uppercase text-gold">
      {children}
    </span>
  );
}
