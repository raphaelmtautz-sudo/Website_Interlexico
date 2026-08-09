import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { getDictionary } from "@/dictionaries";
import { defaultLocale, lh } from "@/lib/i18n";

/**
 * Fängt echte unbekannte URLs ab (kein notFound()-Aufruf innerhalb einer
 * Route) — anders als [lang]/not-found.tsx umgeht dies das Layout komplett,
 * daher hier eigenständig Fonts/Theme/Styles einbinden (siehe next.config.ts).
 * Ohne URL-Präfix ist die Sprache unbekannt, daher Fallback auf Standardsprache.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "404 — Interlexico",
};

export default function GlobalNotFound() {
  const lang = defaultLocale;
  const dict = getDictionary(lang);
  const t = dict.notFound;

  return (
    <html lang={lang} className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="grain min-h-full bg-ink text-paper">
        <div className="mx-auto max-w-2xl px-6 pt-28 lg:pt-40">
          <p className="font-sans text-xs tracking-[0.28em] uppercase text-gold mb-4">{t.eyebrow}</p>
          <h1 className="font-display text-6xl leading-[1.05] text-paper sm:text-7xl">{t.title}</h1>
          <p className="mt-8 max-w-lg font-sans text-lg leading-relaxed text-paper-dim">{t.text}</p>
          <div className="mt-10">
            <Link
              href={lh(lang, "/")}
              className="inline-flex items-center justify-center gap-2 border border-brand bg-brand px-7 py-3.5 font-sans text-sm tracking-[0.08em] uppercase text-on-brand transition-colors duration-300 hover:bg-brand-strong hover:border-brand-strong"
            >
              {t.home}
            </Link>
          </div>

          <div className="mt-14 mb-8 h-px bg-gold-dim" />
          <ul className="grid gap-3 pb-20 sm:grid-cols-2">
            {t.suggestions.map((s) => (
              <li key={s.href}>
                <Link
                  href={lh(lang, s.href)}
                  className="link-underline font-sans text-sm uppercase tracking-[0.08em] text-gold"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </body>
    </html>
  );
}
