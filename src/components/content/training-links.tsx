import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/interactive/reveal";
import { lh, type Locale } from "@/lib/i18n";

/**
 * „Passende Trainingsformen“ – interne Links von Ratgebern und Branchenseiten auf die Kurs-Unterseiten,
 * Demo und Einstufungstest (seit 20.11.2026, Search Console: diese Seiten waren „gefunden, nicht indexiert“,
 * weil kaum eine stark rankende Seite auf sie verlinkte).
 */
const L = {
  de: {
    eyebrow: "Passende Trainingsformen",
    be: "Business English", daf: "Deutsch als Fremdsprache",
    f: { einzelunterricht: "Einzeltraining", gruppentraining: "Gruppentraining", klassentraining: "Klassentraining" },
    demo: "Kostenloses Demo-Gespräch", test: "Sprachniveau testen (Einstufungstest)",
  },
  en: {
    eyebrow: "Matching training formats",
    be: "Business English", daf: "German as a Foreign Language",
    f: { einzelunterricht: "One-to-one training", gruppentraining: "Group training", klassentraining: "Class training" },
    demo: "Free demo call", test: "Check your language level (placement test)",
  },
  es: {
    eyebrow: "Formatos de formación",
    be: "Inglés de negocios", daf: "Alemán como lengua extranjera",
    f: { einzelunterricht: "Formación individual", gruppentraining: "Formación en grupo", klassentraining: "Formación en clase" },
    demo: "Llamada de demostración gratuita", test: "Compruebe su nivel (prueba de nivel)",
  },
} as const;

const FORMATS = ["einzelunterricht", "gruppentraining", "klassentraining"] as const;

export function TrainingLinks({ lang, focus }: { lang: Locale; focus?: "business-english" | "deutsch-als-fremdsprache" }) {
  const t = L[lang] ?? L.de;
  const courses = ([["business-english", t.be], ["deutsch-als-fremdsprache", t.daf]] as const)
    .slice()
    .sort((a) => (a[0] === focus ? -1 : 0));
  return (
    <Reveal as="section" className="border-t border-line">
      <Section>
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <div className="grid gap-10 md:grid-cols-3">
          {courses.map(([slug, name]) => (
            <div key={slug}>
              <Link href={lh(lang, `/kurse/${slug}`)} className="link-underline font-display text-2xl text-paper">{name}</Link>
              <ul className="mt-3 space-y-2">
                {FORMATS.map((f) => (
                  <li key={f}>
                    <Link href={lh(lang, `/kurse/${slug}/${f}`)} className="link-underline font-sans text-paper-dim hover:text-paper">
                      {name} – {t.f[f]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <ul className="space-y-3 self-start">
            <li><Link href={lh(lang, "/demo")} className="link-underline font-display text-2xl text-paper">{t.demo}</Link></li>
            <li><Link href={lh(lang, "/einstufung")} className="link-underline font-sans text-paper-dim hover:text-paper">{t.test}</Link></li>
          </ul>
        </div>
      </Section>
    </Reveal>
  );
}
