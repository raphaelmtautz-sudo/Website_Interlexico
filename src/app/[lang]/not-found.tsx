import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/ui/divider";
import { getDictionary } from "@/dictionaries";
import { defaultLocale, lh } from "@/lib/i18n";

/**
 * Next.js ruft not-found.tsx ohne die üblichen Route-Params auf — hier ist
 * daher keine Sprache aus der URL bekannt. Fällt auf die Standardsprache
 * zurück (besser als ein unstyled Next-Standard-404).
 */
export default function NotFound() {
  const lang = defaultLocale;
  const dict = getDictionary(lang);
  const t = dict.notFound;

  return (
    <Section className="pt-28 lg:pt-40">
      <div className="max-w-2xl">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h1 className="font-display text-6xl leading-[1.05] text-paper sm:text-7xl">
          {t.title}
        </h1>
        <p className="mt-8 max-w-lg font-sans text-lg leading-relaxed text-paper-dim">
          {t.text}
        </p>
        <div className="mt-10">
          <Button href={lh(lang, "/")}>{t.home}</Button>
        </div>

        <GoldRule className="mt-14 mb-8" />
        <ul className="grid gap-3 sm:grid-cols-2">
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
    </Section>
  );
}
