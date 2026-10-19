"use client";

import { useRef } from "react";

export const inputClasses =
  "w-full border border-line bg-ink px-4 py-3 pr-10 font-sans text-sm text-paper placeholder:text-paper-dim transition-[border-color,box-shadow] duration-200 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:shadow-[0_6px_24px_-10px_var(--color-brand)]";

const errorInputClasses =
  "w-full border border-error bg-ink px-4 py-3 pr-10 font-sans text-sm text-paper placeholder:text-paper-dim transition-[border-color,box-shadow] duration-200 focus:border-error focus:outline-none focus:ring-1 focus:ring-error";

export function Field({
  label,
  valid,
  error,
  children,
}: {
  label: string;
  valid?: boolean;
  /** Fehlermeldung — wenn gesetzt, wird das Feld rot hervorgehoben. */
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[10px] uppercase tracking-[0.16em] text-gold">
        {label}
      </span>
      <div className="relative">
        {children}
        {valid && !error && (
          <svg
            className="animate-check-in pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text"
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
      {error && (
        <p role="alert" className="mt-1.5 font-sans text-xs text-error">
          {error}
        </p>
      )}
    </label>
  );
}

/** Gibt die passenden Input-Klassen zurück — rot umrandet, wenn ein Fehler vorliegt. */
export function fieldInputClasses(hasError?: boolean) {
  return hasError ? errorInputClasses : inputClasses;
}

export function FileField({
  label,
  hint,
  file,
  onChange,
  chooseLabel,
  accept,
}: {
  label: string;
  hint?: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  chooseLabel: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="block">
      <span className="mb-2 block font-sans text-[10px] uppercase tracking-[0.16em] text-gold">{label}</span>
      {/* Nativer Datei-Dialog-Button ist vom Browser lokalisiert, nicht von
          unserer App — daher visuell versteckt und durch einen eigenen,
          übersetzten Button ersetzt (Klick delegiert an das Input). */}
      <input ref={inputRef} type="file" aria-label={label} accept={accept} onChange={onChange} className="sr-only" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center gap-2 border border-line bg-ink px-4 py-2.5 font-sans text-sm text-paper-dim transition-colors hover:border-brand hover:text-paper"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
          <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="truncate">{file ? file.name : chooseLabel}</span>
      </button>
      {hint && <p className="mt-1.5 font-sans text-[11px] text-paper-dim">{hint}</p>}
    </div>
  );
}

/** Eigens gestaltete Checkbox (native Checkbox bleibt für Tastatur/Screenreader erhalten, nur visuell ersetzt). */
export function Checkbox({
  checked,
  onChange,
  children,
  required,
  invalid,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  required?: boolean;
  invalid?: boolean;
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 h-[18px] w-[18px] shrink-0">
        <input
          type="checkbox"
          required={required}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`pointer-events-none absolute inset-0 border transition-colors duration-150 ${
            invalid ? "border-error" : "border-line group-hover:border-brand"
          } peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:ring-1 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink`}
        />
        <svg
          className={`pointer-events-none absolute inset-0 m-auto text-on-brand transition-opacity duration-150 ${
            checked ? "opacity-100" : "opacity-0"
          }`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-sans text-xs leading-relaxed text-paper-dim">{children}</span>
    </label>
  );
}
