import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDoc } from "@/components/legal/legal";
import { DatenschutzContent } from "@/components/legal/datenschutz-content";
import { getLegal } from "@/lib/cms";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh } from "@/lib/i18n";

const titles = {
  de: "Datenschutzerklärung",
  en: "Privacy Policy",
  es: "Política de Privacidad",
} as const;

const descriptions = {
  de: "Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO — datensparsam und ohne Tracking-Cookies.",
  en: "Information on the processing of personal data under the GDPR — data-minimising and free of tracking cookies.",
  es: "Información sobre el tratamiento de datos personales conforme al RGPD — minimización de datos y sin cookies de seguimiento.",
} as const;

const intros = {
  de: "Diese Website ist bewusst datensparsam gebaut: Sie verwendet keine Tracking-Cookies, keine Drittanbieter-Werbenetzwerke und lädt Schriftarten lokal statt von externen Servern. Nachfolgend informieren wir über die Verarbeitung personenbezogener Daten.",
  en: "This website is deliberately built to minimise data: it uses no tracking cookies, no third-party advertising networks, and loads fonts locally rather than from external servers. Below we inform you about the processing of personal data.",
  es: "Este sitio web está diseñado deliberadamente para minimizar los datos: no utiliza cookies de seguimiento, no integra redes publicitarias de terceros y carga las tipografías de forma local en lugar de desde servidores externos. A continuación, le informamos sobre el tratamiento de datos personales.",
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
    alternates: { canonical: lh(lang, "/rechtliches/datenschutz") },
  };
}

export default async function DatenschutzPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const legal = await getLegal();

  return (
    <LegalDoc title={titles[lang]} intro={intros[lang]} eyebrow={dict.legal.eyebrow} lang={lang} dict={dict}>
      <DatenschutzContent lang={lang} legal={legal} />
    </LegalDoc>
  );
}
