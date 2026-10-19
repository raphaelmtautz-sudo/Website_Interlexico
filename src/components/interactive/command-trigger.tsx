"use client";

export function CommandTrigger({
  className = "",
  label,
  ariaLabel,
}: {
  className?: string;
  label: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("il:command-open"))}
      aria-label={`${label} — ${ariaLabel}`}
      title="⌘K"
      className={`flex h-10 items-center gap-2 border border-line px-3 text-paper-dim transition-colors hover:border-brand hover:text-brand-text ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <span className="hidden font-sans text-xs xl:inline">{label}</span>
      <kbd className="hidden border border-line px-1 font-sans text-[10px] text-paper-dim xl:inline">
        ⌘K
      </kbd>
    </button>
  );
}
