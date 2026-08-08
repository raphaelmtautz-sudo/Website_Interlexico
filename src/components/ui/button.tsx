import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 border px-7 py-3.5 font-sans text-sm tracking-[0.08em] uppercase transition-colors duration-300";

const variants: Record<Variant, string> = {
  primary:
    "border-brand bg-brand text-on-brand hover:bg-brand-strong hover:border-brand-strong",
  secondary:
    "border-petrol text-petrol bg-transparent hover:bg-petrol hover:text-ink",
  ghost: "border-transparent text-paper hover:text-gold",
};

export function Button({
  children,
  href,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
  tabIndex,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  tabIndex?: number;
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} tabIndex={tabIndex}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} tabIndex={tabIndex}>
      {children}
    </button>
  );
}
