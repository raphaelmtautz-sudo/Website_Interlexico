import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { SelfAssessment } from "@/components/interactive/self-assessment";
import { getDictionary } from "@/dictionaries";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMetadata({ lang, path: "/einstufung", title: dict.einstufung.metaTitle, description: dict.einstufung.text });
}

export default async function EinstufungPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.einstufung;

  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="max-w-3xl">
        <div className="animate-rise">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl mb-6 text-balance sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="mb-12 max-w-xl font-sans text-lg leading-relaxed text-paper-dim">
            {t.text}
          </p>
        </div>
        <SelfAssessment lang={lang} dict={dict} />
      </Container>
    </Section>
  );
}
