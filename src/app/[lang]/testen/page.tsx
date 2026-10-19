import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { TrialSignupForm } from "@/components/trial/trial-signup-form";
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
    title: dict.testen.metaTitle,
    description: dict.testen.text,
    alternates: { canonical: lh(lang, "/testen") },
  };
}

export default async function TestenPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.testen;

  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="mx-auto max-w-lg">
        <div className="animate-fade-up text-center">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-4xl mb-4 text-balance sm:text-5xl">{t.title}</h1>
          <p className="mx-auto max-w-md font-sans text-base leading-relaxed text-paper-dim mb-10">{t.text}</p>
        </div>
        <TrialSignupForm dict={dict} />
      </Container>
    </Section>
  );
}
