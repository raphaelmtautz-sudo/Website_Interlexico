import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE } from "@/lib/site";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh } from "@/lib/i18n";

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

  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="grid gap-16 lg:grid-cols-2">
        <div className="animate-fade-up">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl mb-6 text-balance sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="font-sans text-lg leading-relaxed text-paper-dim mb-8">
            {t.text}
          </p>

          {/* Trust-Punkte */}
          <div className="mb-10 grid grid-cols-3 gap-px border border-line bg-line">
            {t.trust.map((tr) => (
              <div key={tr.k} className="bg-ink-raised p-4">
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-gold mb-1">
                  {tr.k}
                </p>
                <p className="font-sans text-sm text-paper">{tr.v}</p>
              </div>
            ))}
          </div>

          {/* Ablauf 1-2-3 */}
          <ol className="mb-10 space-y-5">
            {t.steps.map((s) => (
              <li key={s.n} className="flex gap-5">
                <span className="font-display text-2xl text-brand shrink-0">{s.n}</span>
                <div>
                  <p className="font-sans text-sm uppercase tracking-[0.06em] text-paper">
                    {s.t}
                  </p>
                  <p className="font-sans text-sm leading-relaxed text-paper-dim">
                    {s.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <dl className="space-y-4 border-t border-line pt-8 font-sans text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
                {t.anfragenLabel}
              </dt>
              <dd className="text-paper-dim">
                <a href={`mailto:${SITE.inquiryEmail}`} className="link-underline text-paper">
                  {SITE.inquiryEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
                {t.telefonLabel}
              </dt>
              <dd className="text-paper-dim">
                <a href="tel:+4981424624046" className="link-underline text-paper">
                  +49 8142 4624046
                </a>{" "}
                · {t.mobilLabel}{" "}
                <a href="tel:+4915153646471" className="link-underline text-paper">
                  +49 1515 3646471
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
          <h2 className="font-display text-3xl text-paper mb-6">{t.formTitle}</h2>
          <Suspense>
            <ContactForm lang={lang} dict={dict} />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}
