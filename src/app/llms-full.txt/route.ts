import { SITE } from "@/lib/site";
import { getCourseTypes, getFaq, getLegal } from "@/lib/cms";
import { getIndustries } from "@/content/industries";
import { getDictionary } from "@/dictionaries";
import { lh, type Locale } from "@/lib/i18n";

/**
 * llms-full.txt — ausführliche Klartext-Fassung zu /llms.txt: alle Kurse mit
 * Formaten, Richtpreisen, Zielgruppen, Branchen und der FAQ in einem Dokument.
 * Answer-Engines (ChatGPT, Perplexity, Claude, Gemini) zitieren bevorzugt
 * solche kompakten, faktendichten Quellen statt JS-lastiger HTML-Seiten.
 *
 * Sprachvarianten: /llms-full.txt (Deutsch), /en/llms-full.txt, /es/llms-full.txt.
 */
const L: Record<
  Locale,
  {
    zielgruppe: string;
    nutzen: string;
    formate: string;
    branchen: string;
    branchenDaf: string;
    faq: string;
    ab: string;
    dauer: string;
    gruppe: string;
    kontakt: string;
    kontaktText: string;
  }
> = {
  de: {
    zielgruppe: "Zielgruppe",
    nutzen: "Nutzen",
    formate: "Formate",
    branchen: "Kernbranchen (Business English)",
    branchenDaf: "Deutsch als Fremdsprache wird branchenübergreifend für jede Rolle angeboten.",
    faq: "Häufige Fragen",
    ab: "ab",
    dauer: "Umfang",
    gruppe: "Gruppengröße",
    kontakt: "Kontakt & Anfrage",
    kontaktText: "Unverbindliche Anfrage über den Konfigurator oder das Kontaktformular; Antwort in der Regel innerhalb eines Werktages.",
  },
  en: {
    zielgruppe: "Audience",
    nutzen: "Benefits",
    formate: "Formats",
    branchen: "Core industries (Business English)",
    branchenDaf: "German as a Foreign Language is offered across all industries and roles.",
    faq: "Frequently asked questions",
    ab: "from",
    dauer: "Scope",
    gruppe: "Group size",
    kontakt: "Contact & enquiries",
    kontaktText: "Non-binding enquiry via the configurator or contact form; we usually reply within one business day.",
  },
  es: {
    zielgruppe: "Público objetivo",
    nutzen: "Ventajas",
    formate: "Formatos",
    branchen: "Sectores principales (inglés de negocios)",
    branchenDaf: "El alemán como lengua extranjera se ofrece para todos los sectores y funciones.",
    faq: "Preguntas frecuentes",
    ab: "desde",
    dauer: "Alcance",
    gruppe: "Tamaño del grupo",
    kontakt: "Contacto y solicitudes",
    kontaktText: "Solicitud sin compromiso a través del configurador o el formulario de contacto; solemos responder en un día laborable.",
  },
};

export async function buildLlmsFullTxt(lang: Locale): Promise<string> {
  const dict = getDictionary(lang);
  const t = L[lang];
  const [courses, faq, legal] = await Promise.all([getCourseTypes(lang), getFaq(lang), getLegal()]);
  const url = (path: string) => `${SITE.url}${lh(lang, path)}`;

  const lines: string[] = [
    `# ${SITE.name}`,
    "",
    `> ${dict.meta.description}`,
    "",
    dict.home.heroSubtitle,
    "",
    `- Website: ${url("")}`,
    `- E-Mail: ${SITE.email}`,
    `- Tel.: ${legal.phone ?? SITE.phone}`,
    ...(legal.street && legal.zipCity ? [`- ${lang === "de" ? "Adresse" : lang === "en" ? "Address" : "Dirección"}: ${legal.street}, ${legal.zipCity}`] : []),
    `- Region: ${SITE.areaServed.join(", ")}`,
    "",
  ];

  for (const c of courses.filter((c) => c.status === "aktiv")) {
    lines.push(`## ${c.name}`, "", `URL: ${url(`/kurse/${c.slug}`)}`, "", c.intro, "");
    if (c.audience.length) lines.push(`### ${t.zielgruppe}`, ...c.audience.map((a) => `- ${a}`), "");
    if (c.benefits.length) lines.push(`### ${t.nutzen}`, ...c.benefits.map((b) => `- **${b.title}:** ${b.description}`), "");
    lines.push(`### ${t.formate}`);
    for (const f of c.formats) {
      lines.push(
        `- **[${f.name}](${url(`/kurse/${c.slug}/${f.slug}`)})** — ${f.description}`,
        `  ${t.dauer}: ${f.duration} · ${t.gruppe}: ${f.capacity} · ${t.ab} ${f.priceFrom} € ${f.priceUnit}`,
      );
    }
    lines.push("");
  }

  lines.push(`## ${t.branchen}`, ...getIndustries(lang).map((i) => `- ${i}`), "", t.branchenDaf, "");

  if (faq.length) {
    lines.push(`## ${t.faq}`, "");
    for (const f of faq) lines.push(`### ${f.question}`, f.answer, "");
  }

  lines.push(`## ${t.kontakt}`, t.kontaktText, `- ${url("/kontakt")}`, `- ${url("/einstufung")}`, "");
  return lines.join("\n");
}

export async function GET() {
  return new Response(await buildLlmsFullTxt("de"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
