import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE } from "@/lib/site";
import { getLegal, getContact } from "@/lib/cms";
import { getDictionary } from "@/dictionaries";
import { hasLocale } from "@/lib/i18n";

// Siehe Kommentar in rechtliches/datenschutz/page.tsx: Telefonnummer aus dem
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
  return pageMetadata({ lang, path: "/kontakt", title: dict.nav.kontakt, description: dict.kontakt.text });
}

const SOCIAL_LABEL: Record<string, string> = {
  linkedin: "LinkedIn",
  xing: "Xing",
  instagram: "Instagram",
  other: "Website",
};

export default async function KontaktPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.kontakt;
  const [legal, contact] = await Promise.all([getLegal(), getContact()]);
  const phone = legal.phone ?? SITE.phone;
  const mobile = legal.phoneMobile ?? SITE.phoneMobile;
  const whatsapp = legal.whatsapp ?? SITE.whatsapp;
  const telHref = (n: string) => `tel:${n.replace(/[^+\d]/g, "")}`;
  const whatsappHref = (n: string) => `https://wa.me/${n.replace(/[^\d]/g, "")}`;

  const addressLine = [legal.street, legal.zipCity].filter(Boolean).join(", ");
  const mapsHref = addressLine
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`
    : undefined;

  return (
    <>
      <Section className="pt-24 lg:pt-32">
        <Container className="grid gap-16 lg:grid-cols-2">
          <div className="animate-rise">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h1 className="kinetic font-display text-5xl mb-6 text-balance sm:text-6xl lg:text-7xl">
              {t.title}
            </h1>
            <p className="font-sans text-lg leading-relaxed text-paper-dim mb-8">
              {t.text}
            </p>

            {/* Vertrauens-Kennzahlen */}
            <dl className="mb-10 grid grid-cols-3 gap-4 border-y border-paper/10 py-6">
              {t.trust.map((item) => (
                <div key={item.k}>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-gold mb-1">
                    {item.k}
                  </dt>
                  <dd className="font-sans text-sm leading-snug text-paper">{item.v}</dd>
                </div>
              ))}
            </dl>

            {/* Direkter Kontakt */}
            <div className="mb-10 space-y-3">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
                {t.anfragenLabel}
              </p>
              <p className="font-sans text-sm text-paper-dim">
                <a href={`mailto:${SITE.inquiryEmail}`} className="link-underline text-paper">
                  {SITE.inquiryEmail}
                </a>
              </p>
              <p className="font-sans text-sm text-paper-dim">
                <span className="text-paper-dim">{t.telefonLabel}:</span>{" "}
                <a href={telHref(phone)} className="link-underline text-paper">
                  {phone}
                </a>
                {mobile && (
                  <>
                    {" · "}
                    <span className="text-paper-dim">{t.mobilLabel}:</span>{" "}
                    <a href={telHref(mobile)} className="link-underline text-paper">
                      {mobile}
                    </a>
                  </>
                )}
              </p>
              {whatsapp && (
                <p className="font-sans text-sm text-paper-dim">
                  <span className="text-paper-dim">{t.whatsappLabel}:</span>{" "}
                  <a
                    href={whatsappHref(whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-paper"
                  >
                    {whatsapp}
                  </a>
                </p>
              )}
              {addressLine && (
                <p className="font-sans text-sm text-paper-dim">
                  <span className="text-paper-dim">{t.adresseLabel}:</span> {addressLine}
                  {mapsHref && (
                    <>
                      {" — "}
                      <a href={mapsHref} target="_blank" rel="noreferrer" className="link-underline text-paper">
                        {t.routePlanenLabel}
                      </a>
                    </>
                  )}
                </p>
              )}
              {contact.officeHours && (
                <p className="font-sans text-sm text-paper-dim">
                  <span className="text-paper-dim">{t.erreichbarkeitLabel}:</span> {contact.officeHours}
                </p>
              )}
            </div>

            {/* Ansprechpartner */}
            {contact.contactPersonName && (
              <div className="mb-10 flex items-center gap-4">
                {contact.contactPersonPhotoUrl && (
                  <Image
                    src={contact.contactPersonPhotoUrl}
                    alt={contact.contactPersonPhotoAlt || contact.contactPersonName}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
                    {t.ansprechpartnerLabel}
                  </p>
                  <p className="font-sans text-sm text-paper">
                    {contact.contactPersonName}
                    {contact.contactPersonRole && (
                      <span className="text-paper-dim"> — {contact.contactPersonRole}</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {contact.socialLinks.length > 0 && (
              <div className="mb-10">
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold mb-2">
                  {t.folgenLabel}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {contact.socialLinks.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline font-sans text-sm text-paper-dim hover:text-paper"
                    >
                      {SOCIAL_LABEL[s.platform] ?? s.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <Suspense>
              <ContactForm lang={lang} dict={dict} />
            </Suspense>
          </div>
        </Container>
      </Section>

      {/* Ablauf */}
      <Section className="pt-0">
        <Container>
          <div className="grid gap-8 border-t border-paper/10 pt-16 sm:grid-cols-3">
            {t.steps.map((step) => (
              <div key={step.n} className="animate-fade-up">
                <p className="font-display text-3xl text-brand-text mb-3">{step.n}</p>
                <p className="font-sans text-base font-semibold text-paper mb-1.5">{step.t}</p>
                <p className="font-sans text-sm leading-relaxed text-paper-dim">{step.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
