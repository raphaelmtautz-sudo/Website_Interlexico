import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 border px-7 py-3.5 font-sans text-sm tracking-[0.08em] uppercase transition-colors duration-300";

const variants: Record<Variant, string> = {
  primary:
    "border-gold bg-gold text-ink hover:bg-transparent hover:text-gold",
  secondary:
    "border-gold/60 text-paper hover:border-gold hover:text-gold bg-transparent",
  ghost: "border-transparent text-paper hover:text-gold",
};

export function Button({
  children,
  href,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
