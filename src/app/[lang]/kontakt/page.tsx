import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE } from "@/lib/site";
import { getLegal } from "@/lib/cms";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh } from "@/lib/i18n";

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
  return {
    title: dict.nav.kontakt,
    description: dict.kontakt.text,
    alternates: { canonical: lh(lang, "/kontakt") },
  };
}

export default async function KontaktPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.kontakt;
  const legal = await getLegal();
  const phone = legal.phone ?? SITE.phone;
  const telHref = (n: string) => `tel:${n.replace(/[^+\d]/g, "")}`;

  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="grid gap-16 lg:grid-cols-2">
        <div className="animate-fade-up">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl mb-6 text-balance sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="font-sans text-lg leading-relaxed text-paper-dim mb-2">
            {t.text}
          </p>
          <p className="font-sans text-sm text-paper-dim">
            <a href={`mailto:${SITE.inquiryEmail}`} className="link-underline text-paper">
              {SITE.inquiryEmail}
            </a>{" "}
            ·{" "}
            <a href={telHref(phone)} className="link-underline text-paper">
              {phone}
            </a>
          </p>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
          <Suspense>
            <ContactForm lang={lang} dict={dict} />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}
