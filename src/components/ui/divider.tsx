export function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-line ${className}`} />;
}

export function GoldRule({ className = "", tone = "gold" }: { className?: string; tone?: "gold" | "success" }) {
  return <div className={`h-px w-16 ${tone === "success" ? "bg-success" : "bg-gold"} ${className}`} />;
}
