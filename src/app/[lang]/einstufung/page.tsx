import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { PlacementStart } from "@/components/interactive/placement-start";
import { PLACEMENT_TEXT } from "@/content/placement";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = PLACEMENT_TEXT[lang];
  return pageMetadata({ lang, path: "/einstufung", title: t.metaTitle, description: t.metaDescription });
}

export default async function EinstufungPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = PLACEMENT_TEXT[lang];

  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="max-w-4xl">
        <div className="animate-rise">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl mb-6 text-balance sm:text-6xl lg:text-7xl">{t.title}</h1>
          <p className="mb-12 max-w-2xl font-sans text-lg leading-relaxed text-paper-dim">{t.text}</p>
        </div>
        <PlacementStart lang={lang} t={t} />
      </Container>
    </Section>
  );
}
