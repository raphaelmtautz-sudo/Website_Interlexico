import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDoc } from "@/components/legal/legal";
import { AgbContent } from "@/components/legal/agb-content";
import { getLegal, getLegalExtras } from "@/lib/cms";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh } from "@/lib/i18n";

// Siehe Kommentar in rechtliches/datenschutz/page.tsx: CMS-Rechtstext-Fakten
// pro Anfrage frisch laden statt beim (netzwerkisolierten) Build zu backen.
export const revalidate = 0;

const titles = {
  de: "Allgemeine Geschäftsbedingungen",
  en: "Terms and Conditions",
  es: "Términos y Condiciones",
} as const;

const descriptions = {
  de: "Allgemeine Geschäftsbedingungen für Trainingsleistungen von Interlexico.",
  en: "Terms and conditions for training services provided by Interlexico.",
  es: "Términos y condiciones para los servicios de formación de Interlexico.",
} as const;

const intros = {
  de: "Diese AGB regeln die Erbringung von Sprach- und Kompetenztrainings gegenüber Unternehmen und Selbstständigen (B2B).",
  en: "These terms govern the provision of language and skills training to businesses and self-employed professionals (B2B).",
  es: "Estos términos regulan la prestación de formación en idiomas y competencias a empresas y profesionales autónomos (B2B).",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: titles[lang],
    description: descriptions[lang],
    robots: { index: true, follow: true },
    alternates: { canonical: lh(lang, "/rechtliches/agb") },
  };
}

export default async function AgbPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [legal, extras] = await Promise.all([getLegal(), getLegalExtras()]);

  return (
    <LegalDoc title={titles[lang]} intro={intros[lang]} eyebrow={dict.legal.eyebrow} lang={lang} dict={dict}>
      <AgbContent lang={lang} legal={legal} extras={extras} />
    </LegalDoc>
  );
}
