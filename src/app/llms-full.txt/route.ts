import { SITE } from "@/lib/site";
import { getCourseTypes, getFaq, getLegal } from "@/lib/cms";
import { getIndustries } from "@/content/industries";
import { getCourseFaq } from "@/content/course-faq";
import { getIndustryLabels, getIndustryPages } from "@/content/branchen";
import { getGuideLabels, getGuides } from "@/content/ratgeber";
import { getDictionary } from "@/dictionaries";
import { lh, type Locale } from "@/lib/i18n";

/**
 * llms-full.txt — ausführliche Klartext-Fassung zu /llms.txt: alle Kurse mit
 * Formaten, Zielgruppen, Branchen und der FAQ in einem Dokument. Ohne Preise —
 * wie auf der Website werden Trainings individuell angeboten.
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
    dauer: string;
    einheit: string;
    preis: string;
    fakten: string;
    facts: string[];
    impact: string;
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
    dauer: "Umfang",
    einheit: "Einheit",
    preis: "Preis",
    fakten: "Auf einen Blick",
    facts: [
      "Anbieter: Interlexico UG (haftungsbeschränkt), Sitz in Bayern (Adresse siehe oben)",
      "Angebot: Firmen-Sprachtraining — Business English und Deutsch als Fremdsprache (GER A1–C1)",
      "Zielgruppe: Unternehmen, Behörden und ihre Teams in Deutschland, Österreich und der Schweiz",
      "Formate: Einzelunterricht (1:1), Gruppentraining (max. 7 Personen), Klassentraining (7–16 Personen)",
      "Durchführung: online, vor Ort im Unternehmen oder hybrid",
      "Start: kostenloser Online-Einstufungstest, danach individuelle Einstufung durch Trainer:innen",
      "Preise: individuelles, unverbindliches Angebot, Antwort in der Regel innerhalb eines Werktages",
      "Reporting: Fortschritt für HR über die Plattform Interlexico ONE",
      "Nachhaltigkeit: 2 € pro Unterrichtseinheit an DAPP Namibia (Bildung) oder NABU (Wiederaufforstung)",
    ],
    impact: "Nachhaltigkeit",
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
    dauer: "Scope",
    einheit: "Session",
    preis: "Price",
    fakten: "At a glance",
    facts: [
      "Provider: Interlexico UG (haftungsbeschränkt), based in Bavaria, Germany (address above)",
      "Offering: corporate language training — Business English and German as a Foreign Language (CEFR A1–C1)",
      "For: companies, public authorities and their teams in Germany, Austria and Switzerland",
      "Formats: one-to-one, group training (max. 7 people), class training (7–16 people)",
      "Delivery: online, on-site at the company, or hybrid",
      "Getting started: free online placement test, followed by an individual assessment by a trainer",
      "Pricing: individual, non-binding quote, usually within one business day",
      "Reporting: progress for HR via the Interlexico ONE platform",
      "Sustainability: €2 per lesson to DAPP Namibia (education) or NABU (reforestation)",
    ],
    impact: "Sustainability",
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
    dauer: "Alcance",
    einheit: "Sesión",
    preis: "Precio",
    fakten: "De un vistazo",
    facts: [
      "Proveedor: Interlexico UG (haftungsbeschränkt), con sede en Baviera, Alemania (dirección arriba)",
      "Oferta: formación lingüística para empresas — Business English y alemán como lengua extranjera (MCER A1–C1)",
      "Para: empresas, administraciones y sus equipos en Alemania, Austria y Suiza",
      "Formatos: clases individuales, formación en grupo (máx. 7 personas), formación de clase (7–16 personas)",
      "Modalidad: online, presencial en la empresa o híbrida",
      "Inicio: prueba de nivel online gratuita y después evaluación individual por un formador",
      "Precios: oferta individual sin compromiso, normalmente en un día laborable",
      "Informes: progreso para RR. HH. a través de la plataforma Interlexico ONE",
      "Sostenibilidad: 2 € por sesión para DAPP Namibia (educación) o NABU (reforestación)",
    ],
    impact: "Sostenibilidad",
    gruppe: "Tamaño del grupo",
    kontakt: "Contacto y solicitudes",
    kontaktText: "Solicitud sin compromiso a través del configurador o el formulario de contacto; solemos responder en un día laborable.",
  },
};

/** Einheitenlänge aus "pro Einheit (60 Min.)" o. ä.; null, wenn nicht angegeben. */
function minutes(unit: string): string | null {
  return unit.match(/(\d+)\s*min/i)?.[1] ?? null;
}

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
    `- ${lang === "de" ? "Adresse" : lang === "en" ? "Address" : "Dirección"}: ${legal.street ?? SITE.address.street}, ${legal.zipCity ?? SITE.address.zipCity}`,
    `- Region: ${SITE.areaServed.join(", ")}`,
    "",
    `## ${t.fakten}`,
    ...t.facts.map((f) => `- ${f}`),
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
        `  ${t.dauer}: ${f.duration} · ${t.gruppe}: ${f.capacity}${minutes(f.priceUnit) ? ` · ${t.einheit}: ${minutes(f.priceUnit)} Min.` : ""} · ${t.preis}: ${dict.common.aufAnfrage}`,
      );
    }
    lines.push("");
    const courseFaq = getCourseFaq(lang, c.slug);
    if (courseFaq.length) {
      lines.push(`### ${t.faq}: ${c.name}`, "");
      for (const f of courseFaq) lines.push(`#### ${f.question}`, f.answer, "");
    }
  }

  lines.push(`## ${t.impact}`, `URL: ${url("/nachhaltigkeit")}`, "", dict.nachhaltigkeit.text, "", dict.nachhaltigkeit.calculator.text, "");

  lines.push(`## ${t.branchen}`, ...getIndustries(lang).map((i) => `- ${i}`), "", t.branchenDaf, "");

  const il = getIndustryLabels(lang);
  lines.push(`## ${il.hubTitle}`, "", il.hubText, "");
  for (const i of getIndustryPages(lang)) {
    lines.push(`### ${i.title}`, `URL: ${url(`/branchen/${i.slug}`)}`, "", i.intro, "");
    lines.push(`${il.situations}:`, ...i.situations.map((s) => `- ${s}`), "");
    lines.push(`${il.formats}: ${i.formats}`, "");
  }

  const gl = getGuideLabels(lang);
  lines.push(`## ${gl.hubTitle}`, "");
  for (const g of getGuides(lang)) {
    lines.push(`### ${g.title}`, `URL: ${url(`/ratgeber/${g.slug}`)}`, "", g.summary, "");
  }

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
