import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import {
  LegalDoc,
  LegalH2,
  LegalP,
  PH,
  Val,
} from "@/components/legal/legal";
import { getLegal } from "@/lib/cms";
import { getDictionary } from "@/dictionaries";
import { hasLocale } from "@/lib/i18n";

// Siehe Kommentar in rechtliches/datenschutz/page.tsx: Pflichtangaben aus dem
// CMS pro Anfrage frisch laden statt beim (netzwerkisolierten) Build zu backen.
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata({ lang, path: "/rechtliches/impressum", title: dict.legal.impressum.title, description: dict.legal.impressum.metaDescription });
}

export default async function ImpressumPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.legal.impressum;
  const legal = await getLegal();

  return (
    <LegalDoc title={t.title} eyebrow={dict.legal.eyebrow} lang={lang} dict={dict}>
      <div className="space-y-3">
        <LegalH2>{t.tmgHeading}</LegalH2>
        <LegalP>
          <Val value={legal.companyName} placeholder={t.firmennameLabel} />
          <br />
          <Val value={legal.street} placeholder={t.strasseLabel} />
          <br />
          <Val value={legal.zipCity} placeholder={t.plzOrtLabel} />
          <br />
          <Val value={legal.country} placeholder={t.landLabel} />
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>{t.vertretenDurchHeading}</LegalH2>
        <LegalP>
          <Val value={legal.managingDirector} placeholder={t.vertretenDurchLabel} />
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>{t.kontaktHeading}</LegalH2>
        <LegalP>
          {t.telefonLabel}: <Val value={legal.phone} placeholder={t.telefonLabel} />
          <br />
          {t.mobilLabel}: <Val value={legal.phoneMobile} placeholder={t.mobilLabel} />
          <br />
          {t.emailLabel}: info@interlexico.com
        </LegalP>
      </div>

      {legal.registerType !== "none" && (
        <div className="space-y-3">
          <LegalH2>{t.registerHeading}</LegalH2>
          <LegalP>
            {t.eintragungPrefix}{" "}
            {legal.registerType ? t.registerTypeLabel : <PH>{t.registerTypeLabel}</PH>}
            <br />
            {t.registergerichtLabel}: <Val value={legal.registerCourt} placeholder={t.registergerichtPlaceholder} />
            <br />
            {t.registernummerLabel}: <Val value={legal.registerNumber} placeholder={t.registernummerPlaceholder} />
          </LegalP>
        </div>
      )}

      <div className="space-y-3">
        <LegalH2>{t.ustHeading}</LegalH2>
        <LegalP>
          {t.ustText} <Val value={legal.vatId} placeholder={t.ustPlaceholder} />
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>{t.verantwortlichHeading}</LegalH2>
        <LegalP>
          <Val value={legal.responsiblePerson} placeholder={t.verantwortlichPlaceholder} />
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>{t.odrHeading}</LegalH2>
        <LegalP>
          {t.odrText}{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            className="link-underline text-gold"
            rel="noopener noreferrer"
            target="_blank"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . {t.odrSuffix}
        </LegalP>
      </div>

      <div className="space-y-3">
        <LegalH2>{t.streitbeilegungHeading}</LegalH2>
        <LegalP>
          {t.streitbeilegungPre}{" "}
          {legal.disputeResolutionParticipation === true
            ? t.bereit
            : legal.disputeResolutionParticipation === false
              ? t.nichtBereit
              : <PH>{t.bereitPlaceholder}</PH>}
          {t.streitbeilegungPost}
        </LegalP>
      </div>
    </LegalDoc>
  );
}
