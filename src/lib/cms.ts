import { getStaticFaq, type FaqItem } from "@/content/faq";
import { getIndustries as getStaticIndustries } from "@/content/industries";
import { getAssessment as getStaticAssessment, type AssessmentQuestion } from "@/content/einstufung";
import { getCourseTypes as getStaticCourseTypes, getCourseType as getStaticCourseType } from "@/content/course-types";
import type { CourseType } from "@/types/course";
import type { Locale } from "@/lib/i18n";

export type { FaqItem };

/**
 * Anbindung an das Payload-CMS (interlexico-cms).
 * Inhalte werden serverseitig geholt (ISR, revalidate) — mit Fallback auf die
 * statischen Inhalte, damit die Website auch ohne CMS voll funktioniert.
 */
const CMS_URL = process.env.CMS_URL ?? "http://127.0.0.1:3020";
const REVALIDATE = 300; // Sekunden

interface PayloadListResponse<T> {
  docs?: T[];
}

/**
 * FAQ für die übergebene Sprache. Das CMS pflegt Fragen/Antworten je Sprache
 * (questionDe/En/Es, answerDe/En/Es). Fehlt eine Übersetzung für ein
 * einzelnes CMS-Item, wird für dieses Item auf den statischen Fallback-Text
 * an derselben Position zurückgefallen — nicht auf die komplette Liste.
 */
export async function getFaq(locale: Locale): Promise<FaqItem[]> {
  const staticFaq = getStaticFaq(locale);
  try {
    const res = await fetch(`${CMS_URL}/api/faq?limit=100&sort=order&depth=0`, {
      next: { revalidate: REVALIDATE, tags: ["faq"] },
    });
    if (!res.ok) return staticFaq;
    const data = (await res.json()) as PayloadListResponse<{
      questionDe?: string;
      answerDe?: string;
      questionEn?: string;
      answerEn?: string;
      questionEs?: string;
      answerEs?: string;
    }>;
    const docs = data.docs ?? [];
    if (!docs.length) return staticFaq;

    const byLocale = {
      de: { q: "questionDe", a: "answerDe" },
      en: { q: "questionEn", a: "answerEn" },
      es: { q: "questionEs", a: "answerEs" },
    } as const;
    const { q: qKey, a: aKey } = byLocale[locale];

    const items = docs.map((d, i) => {
      const question = d[qKey];
      const answer = d[aKey];
      if (question && answer) return { question, answer };
      // Übersetzung fehlt im CMS für dieses Item -> statischer Fallback an
      // derselben Position (falls vorhanden), sonst deutscher CMS-Text.
      return staticFaq[i] ?? { question: String(d.questionDe ?? ""), answer: String(d.answerDe ?? "") };
    });
    return items.filter((item) => item.question && item.answer);
  } catch {
    return staticFaq;
  }
}

export interface LegalData {
  companyName?: string;
  street?: string;
  zipCity?: string;
  country?: string;
  managingDirector?: string;
  registerType?: "handelsregister" | "vereinsregister" | "none";
  registerCourt?: string;
  registerNumber?: string;
  vatId?: string;
  responsiblePerson?: string;
  phone?: string;
  phoneMobile?: string;
  whatsapp?: string;
  disputeResolutionParticipation?: boolean;
  dataProtectionContact?: string;
  supervisoryAuthority?: string;
}

/**
 * Firmen-/Impressumsdaten aus dem CMS-Global "legal". Leere Felder bleiben
 * `undefined` — die Rechtsseiten zeigen dafür weiterhin ihre `<PH>`-Platzhalter,
 * damit fehlende Angaben sichtbar bleiben statt stillschweigend leer zu sein.
 */
export async function getLegal(): Promise<LegalData> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/legal?depth=0`, {
      next: { revalidate: REVALIDATE, tags: ["legal"] },
    });
    if (!res.ok) return {};
    const data = (await res.json()) as LegalData;
    return data ?? {};
  } catch {
    return {};
  }
}

export interface LegalExtrasData {
  hostingProvider?: string;
  logRetentionDays?: number;
  paymentProvider?: string;
  aiBackendNote?: { de?: string; en?: string; es?: string };
  vatTreatment?: "zzgl" | "inkl";
  paymentTermDays?: number;
  cancellationHours?: number;
  liabilityClause?: { de?: string; en?: string; es?: string };
  jurisdictionOverride?: string;
  lastUpdated?: string;
}

/**
 * Konkrete Fakten für die `<PH>`-Platzhalter in AGB und Datenschutzerklärung
 * (CMS-Global "legal-extras"). Leere Felder bleiben `undefined` — die
 * Rechtsseiten zeigen dafür weiterhin ihren jeweiligen `<PH>`-Platzhalter,
 * damit fehlende Angaben sichtbar bleiben statt stillschweigend zu verschwinden.
 */
export async function getLegalExtras(): Promise<LegalExtrasData> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/legal-extras?depth=0`, {
      next: { revalidate: REVALIDATE, tags: ["legal-extras"] },
    });
    if (!res.ok) return {};
    const data = (await res.json()) as LegalExtrasData;
    return data ?? {};
  } catch {
    return {};
  }
}

export interface TestimonialData {
  quote: string;
  personName: string;
  personRole?: string;
  companyName?: string;
  photoUrl?: string;
}

/**
 * Veröffentlichte Kundenstimmen aus dem CMS ("testimonials"). Nur Einträge
 * mit `published: true` werden ausgeliefert. Leeres Array, solange keine
 * echte, freigegebene Kundenstimme im CMS gepflegt ist — die Website blendet
 * die Sektion dann komplett aus statt Platzhalter/Fake-Content zu zeigen.
 */
export async function getTestimonials(): Promise<TestimonialData[]> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/testimonials?where[published][equals]=true&sort=order&limit=50&depth=1`,
      { next: { revalidate: REVALIDATE, tags: ["testimonials"] } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as PayloadListResponse<{
      quote?: string;
      personName?: string;
      personRole?: string;
      companyName?: string;
      photo?: { url?: string } | null;
    }>;
    return (data.docs ?? [])
      .filter((d) => d.quote && d.personName)
      .map((d) => ({
        quote: String(d.quote),
        personName: String(d.personName),
        personRole: d.personRole || undefined,
        companyName: d.companyName || undefined,
        photoUrl: d.photo?.url
          ? mediaUrl(d.photo.url)
          : undefined,
      }));
  } catch {
    return [];
  }
}

/**
 * Offene Positionen aus dem CMS ("jobs") für die Karriereseite. Nur aktive
 * Einträge werden ausgeliefert. Leeres Array bei CMS-Ausfall — die
 * Karriereseite fällt dann auf die statischen Positionen aus dem
 * jeweiligen Sprachwörterbuch zurück.
 */
/** Aktive Stellen; `null`, wenn das CMS nicht erreichbar ist (dann lieber nichts zeigen als abgeschaltete Stellen). */
export async function getJobs(locale: Locale): Promise<string[] | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/jobs?where[active][equals]=true&sort=order&limit=100&depth=0`, {
      next: { revalidate: REVALIDATE, tags: ["jobs"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as PayloadListResponse<{
      titleDe?: string;
      titleEn?: string;
      titleEs?: string;
    }>;
    const field = locale === "en" ? "titleEn" : locale === "es" ? "titleEs" : "titleDe";
    return (data.docs ?? [])
      .map((d) => d[field])
      .filter((t): t is string => Boolean(t));
  } catch {
    return null;
  }
}

export interface CmsPageData {
  title: string;
  content: unknown; // Lexical-JSON, siehe @/lib/lexical-render
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
}

/**
 * Freie Landingpage aus dem CMS ("pages"), z. B. für Kampagnen ohne Deploy.
 * `null`, wenn kein veröffentlichter Eintrag mit diesem Slug existiert (auch
 * bei CMS-Ausfall) — die aufrufende Route liefert dann `notFound()`.
 */
export async function getPage(slug: string, locale: Locale): Promise<CmsPageData | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&where[published][equals]=true&limit=1&depth=1`,
      { next: { revalidate: REVALIDATE, tags: [`page-${slug}`] } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as PayloadListResponse<{
      titleDe?: string;
      titleEn?: string;
      titleEs?: string;
      contentDe?: unknown;
      contentEn?: unknown;
      contentEs?: unknown;
      seoTitleDe?: string;
      seoTitleEn?: string;
      seoTitleEs?: string;
      seoDescriptionDe?: string;
      seoDescriptionEn?: string;
      seoDescriptionEs?: string;
      ogImage?: { url?: string } | null;
    }>;
    const doc = data.docs?.[0];
    if (!doc) return null;
    const suffix = locale === "en" ? "En" : locale === "es" ? "Es" : "De";
    const title = doc[`title${suffix}`] ?? doc.titleDe;
    const content = doc[`content${suffix}`] ?? doc.contentDe;
    if (!title || !content) return null;
    return {
      title,
      content,
      seoTitle: doc[`seoTitle${suffix}`] || undefined,
      seoDescription: doc[`seoDescription${suffix}`] || undefined,
      ogImageUrl: doc.ogImage?.url
        ? doc.ogImage.url.startsWith("http")
          ? doc.ogImage.url
          : `${CMS_URL}${doc.ogImage.url}`
        : undefined,
    };
  } catch {
    return null;
  }
}

export interface PostSummary {
  slug: string;
  title: string;
  excerpt?: string;
  featuredImageUrl?: string;
  publishedAt?: string;
}

export interface PostData extends PostSummary {
  content: unknown; // Lexical-JSON, siehe @/lib/lexical-render
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
}

interface RawPost {
  slug?: string;
  publishedAt?: string;
  featuredImage?: { url?: string } | null;
  titleDe?: string;
  titleEn?: string;
  titleEs?: string;
  excerptDe?: string;
  excerptEn?: string;
  excerptEs?: string;
  contentDe?: unknown;
  contentEn?: unknown;
  contentEs?: unknown;
  seoTitleDe?: string;
  seoTitleEn?: string;
  seoTitleEs?: string;
  seoDescriptionDe?: string;
  seoDescriptionEn?: string;
  seoDescriptionEs?: string;
  ogImage?: { url?: string } | null;
}

/**
 * Öffentliche Bild-URL für CMS-Medien. Das CMS liegt hinter dem SSO-Login und
 * ist für Besucher nicht erreichbar — Bilder laufen deshalb über die Website
 * (/cms-media/<datei>, siehe app/cms-media/[...path]/route.ts), gleiche Domain,
 * passt zur CSP.
 */
export function mediaUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  const m = url.match(/\/api\/media\/file\/([^?#]+)/);
  if (m) return `/cms-media/${m[1]}`;
  return url.startsWith("http") ? url : undefined;
}

/** Beste verfügbare Größe eines Medien-Dokuments (card > Original). */
export function mediaSrc(media: unknown, size: "card" | "thumb" = "card"): { src?: string; alt?: string; width?: number; height?: number } {
  if (!media || typeof media !== "object") return {};
  const m = media as { url?: string; alt?: string; width?: number; height?: number; sizes?: Record<string, { url?: string; width?: number; height?: number }> };
  const sized = m.sizes?.[size];
  if (sized?.url) return { src: mediaUrl(sized.url), alt: m.alt, width: sized.width, height: sized.height };
  return { src: mediaUrl(m.url), alt: m.alt, width: m.width, height: m.height };
}

function localeSuffix(locale: Locale): "De" | "En" | "Es" {
  return locale === "en" ? "En" : locale === "es" ? "Es" : "De";
}

/**
 * Veröffentlichte Blog-/Aktuelles-Artikel (Übersicht) aus dem CMS ("posts"),
 * neueste zuerst. Leeres Array bei CMS-Ausfall — die Blog-Übersicht zeigt
 * dann nur den "noch keine Artikel"-Hinweis statt einen Fehler.
 */
export async function getPosts(locale: Locale): Promise<PostSummary[]> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/posts?where[published][equals]=true&sort=-publishedAt&limit=100&depth=1`,
      { next: { revalidate: REVALIDATE, tags: ["posts"] } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as PayloadListResponse<RawPost>;
    const suffix = localeSuffix(locale);
    return (data.docs ?? [])
      .filter((d) => d.slug && (d[`title${suffix}`] ?? d.titleDe))
      .map((d) => ({
        slug: String(d.slug),
        title: String(d[`title${suffix}`] ?? d.titleDe),
        excerpt: d[`excerpt${suffix}`] ?? d.excerptDe ?? undefined,
        featuredImageUrl: mediaUrl(d.featuredImage?.url ?? undefined),
        publishedAt: d.publishedAt,
      }));
  } catch {
    return [];
  }
}

/**
 * Einzelner Blog-Artikel nach Slug. `null`, wenn kein veröffentlichter
 * Eintrag existiert (auch bei CMS-Ausfall) — die Route liefert dann `notFound()`.
 */
export async function getPost(slug: string, locale: Locale): Promise<PostData | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&where[published][equals]=true&limit=1&depth=1`,
      { next: { revalidate: REVALIDATE, tags: [`post-${slug}`] } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as PayloadListResponse<RawPost>;
    const doc = data.docs?.[0];
    if (!doc) return null;
    const suffix = localeSuffix(locale);
    const title = doc[`title${suffix}`] ?? doc.titleDe;
    const content = doc[`content${suffix}`] ?? doc.contentDe;
    if (!title || !content) return null;
    return {
      slug,
      title,
      excerpt: doc[`excerpt${suffix}`] ?? doc.excerptDe ?? undefined,
      content,
      featuredImageUrl: mediaUrl(doc.featuredImage?.url ?? undefined),
      publishedAt: doc.publishedAt,
      seoTitle: doc[`seoTitle${suffix}`] || undefined,
      seoDescription: doc[`seoDescription${suffix}`] || undefined,
      ogImageUrl: mediaUrl(doc.ogImage?.url ?? undefined) ?? mediaUrl(doc.featuredImage?.url ?? undefined),
    };
  } catch {
    return null;
  }
}

export interface RedirectData {
  to: string;
  permanent: boolean;
}

/**
 * Prüft, ob für einen Pfad (ohne Sprachpräfix, z. B. "/black-friday") eine
 * CMS-Weiterleitung existiert. `null`, wenn keine gefunden wurde oder das
 * CMS nicht erreichbar ist — die aufrufende Route liefert dann `notFound()`.
 */
export async function getRedirect(path: string): Promise<RedirectData | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/redirects?where[from][equals]=${encodeURIComponent(path)}&limit=1&depth=0`,
      { next: { revalidate: REVALIDATE, tags: ["redirects"] } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as PayloadListResponse<{ to?: string; type?: "permanent" | "temporary" }>;
    const doc = data.docs?.[0];
    if (!doc?.to) return null;
    return { to: doc.to, permanent: doc.type !== "temporary" };
  } catch {
    return null;
  }
}

export interface SiteSettingsData {
  logoUrl?: string;
  logoAlt?: string;
  blogEnabled: boolean;
}

/**
 * Website-weite Einstellungen (Logo, Blog-Sichtbarkeit). Bei CMS-Ausfall
 * bleibt das Logo-Feld leer (Fallback auf den Schriftzug "Interlexico") und
 * `blogEnabled` bleibt `true` — ein CMS-Ausfall soll den Blog nicht
 * überraschend verschwinden lassen.
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings?depth=1`, {
      next: { revalidate: REVALIDATE, tags: ["site-settings"] },
    });
    if (!res.ok) return { blogEnabled: true };
    const data = (await res.json()) as {
      logo?: { url?: string; alt?: string } | null;
      blogEnabled?: boolean;
    };
    const blogEnabled = data.blogEnabled !== false;
    if (!data.logo?.url) return { blogEnabled };
    const url = mediaUrl(data.logo.url);
    return { logoUrl: url, logoAlt: data.logo.alt, blogEnabled };
  } catch {
    return { blogEnabled: true };
  }
}

export interface ContactData {
  contactPersonName?: string;
  contactPersonRole?: string;
  contactPersonPhotoUrl?: string;
  contactPersonPhotoAlt?: string;
  officeHours?: string;
  socialLinks: { platform: "linkedin" | "xing" | "instagram" | "other"; url: string }[];
}

/**
 * Zusatzangaben für die Kontaktseite (Ansprechpartner, Erreichbarkeit,
 * Social-Profile) aus dem CMS-Global "contact". Fehlende Felder bleiben
 * `undefined`/leer — die aufrufenden Komponenten blenden den jeweiligen
 * Block dann einfach aus.
 */
export async function getContact(): Promise<ContactData> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/contact?depth=1`, {
      next: { revalidate: REVALIDATE, tags: ["contact"] },
    });
    if (!res.ok) return { socialLinks: [] };
    const data = (await res.json()) as {
      contactPerson?: {
        name?: string;
        role?: string;
        photo?: { url?: string; alt?: string } | null;
      };
      officeHours?: string;
      socialLinks?: { platform: ContactData["socialLinks"][number]["platform"]; url: string }[];
    };
    const photo = data.contactPerson?.photo;
    const photoUrl = photo?.url
      ? mediaUrl(photo.url)
      : undefined;
    return {
      contactPersonName: data.contactPerson?.name || undefined,
      contactPersonRole: data.contactPerson?.role || undefined,
      contactPersonPhotoUrl: photoUrl,
      contactPersonPhotoAlt: photo?.alt,
      officeHours: data.officeHours || undefined,
      socialLinks: (data.socialLinks ?? []).filter((s) => s.url),
    };
  } catch {
    return { socialLinks: [] };
  }
}

/**
 * Branchenliste aus dem CMS ("industries") für die Business-English-Seiten
 * (Vertrauens-/Breitensignal). Fällt bei CMS-Ausfall oder leerer Liste auf
 * die statischen Inhalte aus src/content/industries.*.ts zurück.
 */
export async function getIndustries(locale: Locale): Promise<string[]> {
  const staticIndustries = getStaticIndustries(locale);
  try {
    const res = await fetch(`${CMS_URL}/api/industries?limit=100&sort=order&depth=0`, {
      next: { revalidate: REVALIDATE, tags: ["industries"] },
    });
    if (!res.ok) return staticIndustries;
    const data = (await res.json()) as PayloadListResponse<{
      nameDe?: string;
      nameEn?: string;
      nameEs?: string;
    }>;
    const docs = data.docs ?? [];
    if (!docs.length) return staticIndustries;
    const byLocale = { de: "nameDe", en: "nameEn", es: "nameEs" } as const;
    const key = byLocale[locale];
    const items = docs.map((d, i) => d[key] || staticIndustries[i] || d.nameDe || "").filter(Boolean);
    return items.length ? items : staticIndustries;
  } catch {
    return staticIndustries;
  }
}

/**
 * Fragen für den Einstufungs-Selbsttest aus dem CMS
 * ("placement-test-questions"). Antwortoptionen und Level-Auswertung
 * bleiben statisch (identisch über alle Fragen, kein Redaktionsbedarf).
 * Fällt bei CMS-Ausfall oder leerer Liste auf die statischen Fragen aus
 * src/content/einstufung.*.ts zurück.
 */
export async function getPlacementTest(locale: Locale): Promise<{
  assessmentQuestions: AssessmentQuestion[];
  answerOptions: ReturnType<typeof getStaticAssessment>["answerOptions"];
  levelForScore: ReturnType<typeof getStaticAssessment>["levelForScore"];
}> {
  const staticAssessment = getStaticAssessment(locale);
  try {
    const res = await fetch(`${CMS_URL}/api/placement-test-questions?limit=100&sort=order&depth=0`, {
      next: { revalidate: REVALIDATE, tags: ["placement-test-questions"] },
    });
    if (!res.ok) return staticAssessment;
    const data = (await res.json()) as PayloadListResponse<{
      promptDe?: string;
      promptEn?: string;
      promptEs?: string;
    }>;
    const docs = data.docs ?? [];
    if (!docs.length) return staticAssessment;
    const byLocale = { de: "promptDe", en: "promptEn", es: "promptEs" } as const;
    const key = byLocale[locale];
    const assessmentQuestions = docs.map((d, i) => ({
      prompt: d[key] || staticAssessment.assessmentQuestions[i]?.prompt || d.promptDe || "",
    })).filter((q) => q.prompt);
    if (!assessmentQuestions.length) return staticAssessment;
    return {
      assessmentQuestions,
      answerOptions: staticAssessment.answerOptions,
      levelForScore: staticAssessment.levelForScore,
    };
  } catch {
    return staticAssessment;
  }
}

interface CmsCourseTypeDoc {
  slug?: string;
  status?: CourseType["status"];
  order?: number;
  [key: string]: unknown;
}

/** Baut ein CourseType-Objekt aus einem CMS-Dokument, mit Fallback auf den statischen Kurstyp je Feld. */
function mapCmsCourseType(doc: CmsCourseTypeDoc, locale: Locale, fallback: CourseType | undefined): CourseType | undefined {
  const s = localeSuffix(locale);
  const field = <T,>(name: string, fallbackValue: T): T => {
    const value = doc[`${name}${s}`] ?? (locale !== "de" ? doc[`${name}De`] : undefined);
    return (value as T) ?? fallbackValue;
  };
  if (!doc.slug) return fallback;
  const base: CourseType = {
    slug: doc.slug,
    name: field("name", fallback?.name ?? doc.slug),
    shortName: field("shortName", fallback?.shortName ?? doc.slug),
    status: doc.status ?? fallback?.status ?? "aktiv",
    tagline: field("tagline", fallback?.tagline ?? ""),
    heroTitle: field("heroTitle", fallback?.heroTitle ?? ""),
    heroSubtitle: field("heroSubtitle", fallback?.heroSubtitle ?? ""),
    intro: field("intro", fallback?.intro ?? ""),
    audience: field("audience", fallback?.audience ?? []),
    benefits: field("benefits", fallback?.benefits ?? []),
    formats: field("formats", fallback?.formats ?? []),
    industries: field("industries", fallback?.industries),
    testimonials: field("testimonials", fallback?.testimonials ?? []),
    seo: {
      title: field("seoTitle", fallback?.seo.title ?? ""),
      description: field("seoDescription", fallback?.seo.description ?? ""),
    },
  };
  return base;
}

/**
 * Kurstypen aus dem CMS ("course-types") für die Kurstyp-Seiten. Fällt bei
 * CMS-Ausfall oder leerer Liste vollständig auf die statischen Kurstypen aus
 * src/content/course-types/*.ts zurück; fehlt ein einzelnes Feld im CMS-
 * Dokument, wird für dieses Feld auf den statischen Kurstyp mit gleichem
 * Slug zurückgefallen.
 */
export async function getCourseTypes(locale: Locale): Promise<CourseType[]> {
  const staticCourseTypes = getStaticCourseTypes(locale);
  try {
    const res = await fetch(`${CMS_URL}/api/course-types?limit=100&sort=order&depth=0`, {
      next: { revalidate: REVALIDATE, tags: ["course-types"] },
    });
    if (!res.ok) return staticCourseTypes;
    const data = (await res.json()) as PayloadListResponse<CmsCourseTypeDoc>;
    const docs = data.docs ?? [];
    if (!docs.length) return staticCourseTypes;
    const mapped = docs
      .map((doc) => mapCmsCourseType(doc, locale, staticCourseTypes.find((c) => c.slug === doc.slug)))
      .filter((c): c is CourseType => Boolean(c));
    return mapped.length ? mapped : staticCourseTypes;
  } catch {
    return staticCourseTypes;
  }
}

/** Einzelner Kurstyp per Slug — siehe {@link getCourseTypes}. */
export async function getCourseType(locale: Locale, slug: string): Promise<CourseType | undefined> {
  const courseTypes = await getCourseTypes(locale);
  return courseTypes.find((c) => c.slug === slug) ?? getStaticCourseType(locale, slug);
}


/* ---------------- Team & Trainer, Referenzen, Hinweisleiste ---------------- */

export interface TeamMember {
  id: number;
  name: string;
  kind: "management" | "trainer" | "team";
  role?: string;
  photo: { src?: string; alt?: string; width?: number; height?: number };
  languages: string[];
  courses: string[];
  qualifications?: string;
  bio?: string;
  linkedin?: string;
}

type CmsTeam = Record<string, unknown> & { id: number; name: string; kind: TeamMember["kind"]; photo?: unknown; languages?: string[]; courses?: string[]; linkedin?: string };

export function mapTeam(d: CmsTeam, locale: Locale): TeamMember {
  const s = localeSuffix(locale);
  const pick = (f: string) => (d[`${f}${s}`] as string | undefined) || (d[`${f}De`] as string | undefined) || undefined;
  return {
    id: d.id,
    name: d.name,
    kind: d.kind,
    role: pick("role"),
    photo: mediaSrc(d.photo, "thumb"),
    languages: d.languages ?? [],
    courses: d.courses ?? [],
    qualifications: pick("qualifications"),
    bio: pick("bio"),
    linkedin: typeof d.linkedin === "string" && /^https:\/\//.test(d.linkedin) ? d.linkedin : undefined,
  };
}

/** Veröffentlichte Personen (Geschäftsführung, Team, Trainer:innen). */
export async function getTeam(locale: Locale): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/team?where[published][equals]=true&sort=order&limit=100&depth=1`, {
      next: { revalidate: REVALIDATE, tags: ["team"] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as PayloadListResponse<CmsTeam>;
    return (data.docs ?? []).map((d) => mapTeam(d, locale));
  } catch {
    return [];
  }
}

export interface ReferenceItem {
  company: string;
  industry?: string;
  logo: { src?: string; alt?: string; width?: number; height?: number };
  caseStudy?: { title: string; situation?: string; solution?: string; result: string };
}

/** Freigegebene, veröffentlichte Referenzen (das CMS liefert öffentlich nur diese). */
export async function getReferences(locale: Locale): Promise<ReferenceItem[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/references?where[published][equals]=true&where[approved][equals]=true&sort=order&limit=100&depth=1`, {
      next: { revalidate: REVALIDATE, tags: ["references"] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as PayloadListResponse<Record<string, unknown> & { company: string; logo?: unknown }>;
    const s = localeSuffix(locale);
    return (data.docs ?? []).map((d) => {
      const pick = (f: string) => (d[`${f}${s}`] as string | undefined) || (d[`${f}De`] as string | undefined) || undefined;
      const title = pick("caseTitle");
      const result = pick("caseResult");
      return {
        company: d.company,
        industry: pick("industry"),
        logo: mediaSrc(d.logo, "thumb"),
        caseStudy: title && result ? { title, situation: pick("caseSituation"), solution: pick("caseSolution"), result } : undefined,
      };
    });
  } catch {
    return [];
  }
}

export interface AnnouncementData {
  text: string;
  link?: { href: string; label: string };
  tone: "info" | "highlight";
}

/** Hinweisleiste — nur wenn eingeschaltet und im Zeitraum. */
export async function getAnnouncement(locale: Locale): Promise<AnnouncementData | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/announcement?depth=0`, { next: { revalidate: REVALIDATE, tags: ["announcement"] } });
    if (!res.ok) return null;
    const d = (await res.json()) as Record<string, unknown> & { enabled?: boolean; startsAt?: string; endsAt?: string; linkUrl?: string; tone?: string };
    if (!d.enabled) return null;
    const now = Date.now();
    if (d.startsAt && Date.parse(d.startsAt) > now) return null;
    if (d.endsAt && Date.parse(d.endsAt) < now) return null;
    const s = localeSuffix(locale);
    const text = (d[`text${s}`] as string) || (d.textDe as string);
    if (!text) return null;
    const label = (d[`linkLabel${s}`] as string) || (d.linkLabelDe as string);
    const url = typeof d.linkUrl === "string" ? d.linkUrl.trim() : "";
    const href = !url ? "" : /^https:\/\//.test(url) ? url : url.startsWith("/") ? `/${locale}${url === "/" ? "" : url}` : "";
    return { text, link: href && label ? { href, label } : undefined, tone: d.tone === "highlight" ? "highlight" : "info" };
  } catch {
    return null;
  }
}
