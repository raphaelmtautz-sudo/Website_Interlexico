import { ReactNode } from "react";
import { Container } from "./container";

export function Section({
  children,
  className = "",
  containerClassName = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 lg:py-28 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "success" }) {
  return (
    <p
      className={`font-sans text-xs tracking-[0.28em] uppercase mb-4 ${
        tone === "success" ? "text-success" : "text-gold"
      }`}
    >
      {children}
    </p>
  );
}
