import type { Locale } from "@/lib/i18n";

/**
 * Inline-SVG statt Emoji-Flaggen (🇩🇪 etc.) — Regional-Indicator-Emoji werden
 * auf vielen Systemen (Windows, Linux ohne Farb-Emoji-Font) nicht als Flagge
 * gerendert, sondern als Buchstaben-Boxen oder gar nicht. SVG ist plattformunabhängig.
 */
function DeFlag() {
  return (
    <svg viewBox="0 0 5 3" width="18" height="12" aria-hidden="true">
      <rect width="5" height="3" fill="#FFCE00" />
      <rect width="5" height="2" fill="#DD0000" />
      <rect width="5" height="1" fill="#000000" />
    </svg>
  );
}

function GbFlag() {
  return (
    <svg viewBox="0 0 60 36" width="18" height="12" aria-hidden="true">
      <rect width="60" height="36" fill="#00247D" />
      <path d="M0 0L60 36M60 0L0 36" stroke="#FFFFFF" strokeWidth="7" />
      <path d="M0 0L60 36M60 0L0 36" stroke="#CF142B" strokeWidth="3" />
      <path d="M30 0V36M0 18H60" stroke="#FFFFFF" strokeWidth="12" />
      <path d="M30 0V36M0 18H60" stroke="#CF142B" strokeWidth="6" />
    </svg>
  );
}

function EsFlag() {
  return (
    <svg viewBox="0 0 5 3" width="18" height="12" aria-hidden="true">
      <rect width="5" height="3" fill="#AA151B" />
      <rect y="0.75" width="5" height="1.5" fill="#F1BF00" />
    </svg>
  );
}

const flags: Record<Locale, () => React.JSX.Element> = {
  de: DeFlag,
  en: GbFlag,
  es: EsFlag,
};

export function FlagIcon({ locale }: { locale: Locale }) {
  const Flag = flags[locale];
  return (
    <span className="inline-flex shrink-0 overflow-hidden rounded-[2px] border border-black/10">
      <Flag />
    </span>
  );
}
