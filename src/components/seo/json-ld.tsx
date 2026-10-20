import { SITE } from "@/lib/site";
import type { FaqItem } from "@/content/faq";
import type { CourseType } from "@/types/course";
import { lh, type Locale } from "@/lib/i18n";

const bcp47: Record<Locale, string> = { de: "de-DE", en: "en-US", es: "es-ES" };

/**
 * Rendert Schema.org-Daten als JSON-LD. Native <script>-Einbindung (nicht
 * next/script), da es Daten und kein ausführbarer Code sind. "<" wird escaped
 * (XSS-Schutz), wie in den Next.js-Docs empfohlen.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const COUNTRY_CODES: Record<string, string> = {
  deutschland: "DE", germany: "DE", alemania: "DE",
  österreich: "AT", austria: "AT",
  schweiz: "CH", switzerland: "CH", suiza: "CH",
};
function countryCode(country?: string): string {
  const c = country?.trim();
  if (!c) return "DE";
  return /^[A-Z]{2}$/.test(c) ? c : COUNTRY_CODES[c.toLowerCase()] ?? c;
}

const COUNTRY_NAMES: Record<string, string> = { DE: "Germany", AT: "Austria", CH: "Switzerland" };

// Unterrichtete Sprache je Kurstyp (Schema.org "inLanguage" eines Sprachkurses).
const TAUGHT_LANGUAGE: Record<string, { code: string; teaches: string }> = {
  "business-english": { code: "en", teaches: "Business English" },
  "deutsch-als-fremdsprache": { code: "de", teaches: "German as a foreign language (CEFR A1–C1)" },
};

export function OrganizationJsonLd({
  lang,
  phone = SITE.phone,
  sameAs = SITE.sameAs,
  legalName,
  address,
}: {
  lang: Locale;
  phone?: string;
  sameAs?: string[];
  legalName?: string;
  /** Aus dem CMS-Global "legal" — fehlt das CMS, entfällt die Adresse statt geraten zu werden. */
  address?: { street?: string; zipCity?: string; country?: string };
}) {
  // "82194 Gröbenzell" -> PLZ + Ort für PostalAddress.
  const zip = address?.zipCity?.match(/^\s*(\d{4,5})\s+(.+)$/);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": `${SITE.url}#organization`,
        name: SITE.name,
        legalName: legalName ?? SITE.legalName,
        url: SITE.url,
        // Google verlangt für das Organisations-Logo mind. 112×112 px.
        logo: { "@type": "ImageObject", url: `${SITE.url}/apple-icon`, width: 180, height: 180 },
        image: `${SITE.url}${lh(lang, "/opengraph-image")}`,
        ...(address?.street && address.zipCity
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: address.street,
                postalCode: zip?.[1],
                addressLocality: zip?.[2] ?? address.zipCity,
                // ISO-3166-Code statt CMS-Klartext ("Deutschland"), wie von Google empfohlen.
                addressCountry: countryCode(address.country),
              },
            }
          : {}),
        email: SITE.email,
        telephone: phone,
        description: SITE.description,
        areaServed: SITE.areaServed.map((c) => ({ "@type": "Country", identifier: c, name: COUNTRY_NAMES[c] ?? c })),
        knowsLanguage: ["de", "en", "es"],
        // Verknüpft die Organisation mit ihren Kursen — hilft Suchmaschinen und
        // KI-Systemen, "Interlexico" eindeutig als Anbieter dieser Trainings einzuordnen.
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Corporate Language Training",
          itemListElement: Object.keys(TAUGHT_LANGUAGE).map((slug) => ({
            "@type": "Offer",
            itemOffered: { "@id": `${SITE.url}${lh(lang, `/kurse/${slug}`)}#course` },
          })),
        },
        knowsAbout: [
          "Business English",
          "Deutsch als Fremdsprache",
          "Sprachtraining für Unternehmen",
          "Corporate Language Training",
          "Englisch für Verhandlungen und Präsentationen",
          "Fachsprache für Branchen",
        ],
        slogan: "Corporate Language Training · Englisch & Deutsch",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: phone,
          email: SITE.email,
          areaServed: SITE.areaServed,
          availableLanguage: ["de", "en", "es"],
        },
        ...(sameAs.length ? { sameAs } : {}),
        inLanguage: bcp47[lang],
      }}
    />
  );
}

export function WebSiteJsonLd({ lang }: { lang: Locale }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE.url}#website`,
        name: SITE.name,
        url: `${SITE.url}${lh(lang)}`,
        description: SITE.description,
        inLanguage: bcp47[lang],
        publisher: { "@id": `${SITE.url}#organization` },
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }}
    />
  );
}

export function CourseJsonLd({ course, lang }: { course: CourseType; lang: Locale }) {
  const url = `${SITE.url}${lh(lang, `/kurse/${course.slug}`)}`;
  const taught = TAUGHT_LANGUAGE[course.slug];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${url}#course`,
        name: course.name,
        description: course.seo.description,
        url,
        provider: { "@type": "EducationalOrganization", "@id": `${SITE.url}#organization`, name: SITE.name, sameAs: SITE.url },
        // Unterrichtssprache des Kurses, nicht die Sprache der Seite.
        inLanguage: taught?.code ?? bcp47[lang],
        ...(taught ? { teaches: taught.teaches } : {}),
        audience: { "@type": "BusinessAudience", audienceType: course.audience.join("; ") },
        // Bewusst ohne Preis (keine Preise auf der Website) — "Paid" + Anfrage-URL.
        offers: {
          "@type": "Offer",
          category: "Paid",
          url: `${SITE.url}${lh(lang, "/kontakt")}?kurs=${course.slug}`,
          availability: "https://schema.org/InStock",
          areaServed: SITE.areaServed,
        },
        hasCourseInstance: course.formats.map((f) => ({
          "@type": "CourseInstance",
          name: `${course.name} — ${f.name}`,
          description: f.description,
          url: `${url}/${f.slug}`,
          courseMode: ["Online", "Onsite", "Blended"],
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${SITE.url}${item.path}`,
        })),
      }}
    />
  );
}

/** Ratgeber-Artikel (Schema.org Article) mit Autor/Herausgeber = Interlexico. */
export function ArticleJsonLd({
  lang,
  path,
  headline,
  description,
  published,
  updated,
  author,
}: {
  lang: Locale;
  path: string;
  headline: string;
  description: string;
  published: string;
  updated: string;
  author: string;
}) {
  const url = `${SITE.url}${lh(lang, path)}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        headline,
        description,
        inLanguage: bcp47[lang],
        datePublished: published,
        dateModified: updated,
        image: `${SITE.url}${lh(lang, "/opengraph-image")}`,
        author: { "@type": "Organization", name: author, url: SITE.url },
        publisher: { "@id": `${SITE.url}#organization` },
      }}
    />
  );
}

/** Branchen-Landingpage als Dienstleistung des Anbieters (Schema.org Service). */
export function ServiceJsonLd({
  lang,
  path,
  name,
  description,
  serviceType,
}: {
  lang: Locale;
  path: string;
  name: string;
  description: string;
  serviceType: string;
}) {
  const url = `${SITE.url}${lh(lang, path)}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        description,
        url,
        serviceType,
        inLanguage: bcp47[lang],
        provider: { "@id": `${SITE.url}#organization` },
        areaServed: SITE.areaServed.map((c) => ({ "@type": "Country", identifier: c, name: COUNTRY_NAMES[c] ?? c })),
      }}
    />
  );
}
