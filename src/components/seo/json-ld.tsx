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

export function OrganizationJsonLd({ lang, phone = SITE.phone }: { lang: Locale; phone?: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": `${SITE.url}#organization`,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        email: SITE.email,
        telephone: phone,
        description: SITE.description,
        areaServed: SITE.areaServed,
        knowsLanguage: ["de", "en", "es"],
        knowsAbout: [
          "Business English",
          "Deutsch als Fremdsprache",
          "Sprachtraining für Unternehmen",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: phone,
          email: SITE.email,
          areaServed: SITE.areaServed,
          availableLanguage: ["de", "en", "es"],
        },
        ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
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
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.name,
        description: course.seo.description,
        url: `${SITE.url}${lh(lang, `/kurse/${course.slug}`)}`,
        provider: { "@id": `${SITE.url}#organization` },
        inLanguage: bcp47[lang],
        // Bewusst ohne Preis-/Offer-Angaben (keine Preise auf der Website).
        hasCourseInstance: course.formats.map((f) => ({
          "@type": "CourseInstance",
          name: `${course.name} — ${f.name}`,
          description: f.description,
          courseMode: "blended",
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
