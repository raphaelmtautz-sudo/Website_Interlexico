import type { Locale } from "@/lib/i18n";

/**
 * Eigene Seitentitel und Meta-Beschreibungen (≤ 160 Zeichen) für Seiten, deren
 * Beschreibung bisher automatisch aus langen Einleitungstexten gekürzt wurde,
 * plus der Faktenblock „Interlexico in Kürze“ (Über uns) — knappe, prüfbare
 * Angaben, die Suchmaschinen und KI-Antworten zur Firma übernehmen.
 */
type Seo = { title: string; description: string };
type PageKey = "ueberUns" | "interlexicoOne" | "kontakt" | "karriere";

const seo: Record<Locale, Record<PageKey, Seo>> = {
  de: {
    ueberUns: { title: "Über Interlexico: Sprachakademie für Unternehmen bei München", description: "Interlexico aus Olching bei München trainiert Business English und Deutsch für Unternehmen – fachbezogen, mit Einstufung, festen Trainer:innen und Reporting." },
    interlexicoOne: { title: "Interlexico ONE: Kundenportal für Sprachtraining | Interlexico", description: "Interlexico ONE organisiert jedes Training: Einstufung, Terminplanung, Trainerzuordnung und Fortschrittsberichte für HR an einem Ort – ohne Zusatzkosten." },
    kontakt: { title: "Kontakt: Sprachtraining für Ihr Team anfragen", description: "Unverbindlich anfragen: Business English oder Deutsch für Ihr Unternehmen. Wir melden uns in der Regel innerhalb von zwei Werktagen mit einem Vorschlag." },
    karriere: { title: "Karriere: Trainer-Pool für Business English & Deutsch", description: "Bewerben Sie sich für den Interlexico-Trainer-Pool: Business English und Deutsch als Fremdsprache. Wir melden uns, sobald ein Kurs zu Ihrem Profil passt." },
  },
  en: {
    ueberUns: { title: "About Interlexico: Language Academy for Companies near Munich", description: "Interlexico, based in Olching near Munich, trains Business English and German for companies – job-focused, with assessment, dedicated trainers and reporting." },
    interlexicoOne: { title: "Interlexico ONE: Client Portal for Language Training | Interlexico", description: "Interlexico ONE organises every training: assessment, scheduling, trainer assignment and progress reports for HR in one place – at no extra cost." },
    kontakt: { title: "Contact: Request Language Training for Your Team", description: "Send a non-binding enquiry for Business English or German for your company. We usually reply within two working days with a proposal." },
    karriere: { title: "Careers: Trainer Pool for Business English & German", description: "Apply to the Interlexico trainer pool for Business English and German as a Foreign Language. We get in touch as soon as a course matches your profile." },
  },
  es: {
    ueberUns: { title: "Sobre Interlexico: academia de idiomas cerca de Múnich", description: "Interlexico, con sede en Olching cerca de Múnich, forma en Business English y alemán a empresas – con evaluación, formadores fijos e informes." },
    interlexicoOne: { title: "Interlexico ONE: portal de clientes para la formación | Interlexico", description: "Interlexico ONE organiza cada formación: evaluación, planificación, asignación de formadores e informes de progreso para RR. HH., sin coste adicional." },
    kontakt: { title: "Contacto: solicite formación de idiomas para su equipo", description: "Solicite sin compromiso Business English o alemán para su empresa. Normalmente respondemos en dos días laborables con una propuesta." },
    karriere: { title: "Empleo: bolsa de formadores de Business English y alemán", description: "Únase a la bolsa de formadores de Interlexico para Business English y alemán como lengua extranjera. Le contactamos cuando un curso encaje con su perfil." },
  },
};

export function getPageSeo(locale: Locale, page: PageKey): Seo {
  return seo[locale][page];
}

type Fact = { label: string; value: string };
const facts: Record<Locale, { title: string; items: Fact[] }> = {
  de: {
    title: "Interlexico in Kürze",
    items: [
      { label: "Unternehmen", value: "Interlexico UG (haftungsbeschränkt)" },
      { label: "Sitz", value: "Olching, Landkreis Fürstenfeldbruck – bei München" },
      { label: "Leistungen", value: "Business English, Deutsch als Fremdsprache, Executive Language Coaching und interkulturelle Kommunikation für Unternehmen" },
      { label: "Einsatzgebiet", value: "Vor Ort in ganz Deutschland, Österreich und der Schweiz (nach Verfügbarkeit, Sitz bei München), online überall" },
      { label: "Organisation", value: "Einstufung, Termine und Fortschrittsberichte im Kundenportal Interlexico ONE" },
      { label: "Engagement", value: "Pro Unterrichtseinheit fließen 2 € in ein Bildungs- oder Aufforstungsprojekt" },
    ],
  },
  en: {
    title: "Interlexico at a glance",
    items: [
      { label: "Company", value: "Interlexico UG (haftungsbeschränkt)" },
      { label: "Location", value: "Olching, district of Fürstenfeldbruck – near Munich" },
      { label: "Services", value: "Business English, German as a Foreign Language, executive language coaching and intercultural communication for companies" },
      { label: "Area served", value: "On-site anywhere in Germany, Austria and Switzerland (subject to availability, based near Munich), online everywhere" },
      { label: "Organisation", value: "Assessment, scheduling and progress reports in the Interlexico ONE client portal" },
      { label: "Commitment", value: "€2 per training unit goes to an education or reforestation project" },
    ],
  },
  es: {
    title: "Interlexico en breve",
    items: [
      { label: "Empresa", value: "Interlexico UG (haftungsbeschränkt)" },
      { label: "Sede", value: "Olching, distrito de Fürstenfeldbruck – cerca de Múnich" },
      { label: "Servicios", value: "Business English, alemán como lengua extranjera, coaching lingüístico para directivos y comunicación intercultural para empresas" },
      { label: "Ámbito", value: "Presencial en toda Alemania, Austria y Suiza (según disponibilidad, sede cerca de Múnich), online en cualquier lugar" },
      { label: "Organización", value: "Evaluación, planificación e informes de progreso en el portal de clientes Interlexico ONE" },
      { label: "Compromiso", value: "2 € por unidad de formación van a un proyecto educativo o de reforestación" },
    ],
  },
};

export function getCompanyFacts(locale: Locale) {
  return facts[locale];
}
