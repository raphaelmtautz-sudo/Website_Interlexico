import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
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
    title: dict.demo.metaTitle,
    description: dict.demo.text,
    alternates: { canonical: lh(lang, "/demo") },
  };
}

export default async function DemoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.demo;

  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="grid gap-16 lg:grid-cols-2">
        <div className="animate-fade-up">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl mb-6 text-balance sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="font-sans text-lg leading-relaxed text-paper-dim mb-8">{t.text}</p>

          {/* Vertrauens-Kennzahlen */}
          <dl className="mb-12 grid grid-cols-3 gap-4 border-y border-paper/10 py-6">
            {t.trust.map((item) => (
              <div key={item.k}>
                <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-gold mb-1">
                  {item.k}
                </dt>
                <dd className="font-sans text-sm leading-snug text-paper">{item.v}</dd>
              </div>
            ))}
          </dl>

          {/* Was Sie erwartet */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
              {t.whatEyebrow}
            </p>
            <h2 className="font-display text-2xl text-paper mb-6">{t.whatTitle}</h2>
            <ol className="space-y-6 border-t border-paper/10 pt-6">
              {t.what.map((item, i) => (
                <li key={item.title} className="flex gap-4">
                  <span className="font-display text-2xl text-brand shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-sans text-base font-semibold text-paper mb-1">
                      {item.title}
                    </p>
                    <p className="font-sans text-sm leading-relaxed text-paper-dim">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
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
