"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n";

const LOCALE_COOKIE = "il-locale";

/** Wechselt die Sprache unter Beibehaltung des aktuellen Pfads (nur das Präfix ändert sich). */
export function LanguageSwitcher({ lang, className = "" }: { lang: Locale; className?: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.replace(/^\/(de|en|es)/, "") || "";

  return (
    <div className={`items-center gap-1 ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="inline-flex items-center">
          {i > 0 && <span className="mx-1 text-paper-dim" aria-hidden="true">/</span>}
          <Link
            href={`/${l}${rest}`}
            hrefLang={l}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${l};max-age=${60 * 60 * 24 * 365};path=/`;
            }}
            aria-current={l === lang ? "true" : undefined}
            title={localeNames[l]}
            className={`font-sans text-xs uppercase tracking-[0.08em] transition-colors ${
              l === lang ? "text-gold" : "text-paper-dim hover:text-paper"
            }`}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
