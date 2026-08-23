export const inputClasses =
  "w-full border border-line bg-ink px-4 py-3 pr-10 font-sans text-sm text-paper placeholder:text-paper-dim transition-[border-color,box-shadow] duration-200 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:shadow-[0_6px_24px_-10px_var(--color-brand)]";

export function Field({
  label,
  valid,
  children,
}: {
  label: string;
  valid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[10px] uppercase tracking-[0.16em] text-gold">
        {label}
      </span>
      <div className="relative">
        {children}
        {valid && (
          <svg
            className="animate-check-in pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </label>
  );
}
