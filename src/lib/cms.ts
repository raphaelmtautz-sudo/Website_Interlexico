import { getStaticFaq, type FaqItem } from "@/content/faq";
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
 * FAQ für die übergebene Sprache. Das CMS pflegt aktuell nur deutschsprachige
 * Inhalte — für "de" wird es (mit Fallback auf statische Inhalte) genutzt,
 * für "en"/"es" direkt die übersetzten statischen FAQ-Inhalte.
 */
export async function getFaq(locale: Locale): Promise<FaqItem[]> {
  const staticFaq = getStaticFaq(locale);
  if (locale !== "de") return staticFaq;
  try {
    const res = await fetch(`${CMS_URL}/api/faq?limit=100&sort=order&depth=0`, {
      next: { revalidate: REVALIDATE, tags: ["faq"] },
    });
    if (!res.ok) return staticFaq;
    const data = (await res.json()) as PayloadListResponse<{
      question?: string;
      answer?: string;
    }>;
    const items = (data.docs ?? [])
      .filter((d) => d.question && d.answer)
      .map((d) => ({ question: String(d.question), answer: String(d.answer) }));
    return items.length ? items : staticFaq;
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

export interface SiteSettingsData {
  logoUrl?: string;
  logoAlt?: string;
}

/**
 * Website-weite Marken-Assets (aktuell: Logo). Ohne hochgeladenes Logo im CMS
 * bleiben die Felder leer — die aufrufenden Komponenten zeigen dann weiterhin
 * den Schriftzug "Interlexico" als Platzhalter.
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/site-settings?depth=1`, {
      next: { revalidate: REVALIDATE, tags: ["site-settings"] },
    });
    if (!res.ok) return {};
    const data = (await res.json()) as {
      logo?: { url?: string; alt?: string } | null;
    };
    if (!data.logo?.url) return {};
    const url = data.logo.url.startsWith("http") ? data.logo.url : `${CMS_URL}${data.logo.url}`;
    return { logoUrl: url, logoAlt: data.logo.alt };
  } catch (e) {
    console.error("[DEBUG getSiteSettings] CAUGHT", e);
    return {};
  }
}
