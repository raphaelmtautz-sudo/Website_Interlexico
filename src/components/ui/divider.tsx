export function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-line ${className}`} />;
}

export function GoldRule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-16 bg-gold ${className}`} />;
}
