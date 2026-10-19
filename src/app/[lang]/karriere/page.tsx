import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { CareerForm } from "@/components/career/career-form";
import { SITE } from "@/lib/site";
import { getLegal, getJobs } from "@/lib/cms";
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
  return pageMetadata({ lang, path: "/karriere", title: dict.nav.karriere, description: dict.karriere.text });
}

export default async function KarrierePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.karriere;
  const legal = await getLegal();
  const cmsJobs = await getJobs(lang);
  const positions = cmsJobs.length ? cmsJobs : t.positions;
  const phone = legal.phone ?? SITE.phone;
  const telHref = `tel:${phone.replace(/[^+\d]/g, "")}`;

  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="grid gap-16 lg:grid-cols-2">
        <div className="animate-rise">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl mb-6 text-balance sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="font-sans text-lg leading-relaxed text-paper-dim mb-8">{t.text}</p>

          {/* Perks */}
          <div className="mb-10 grid grid-cols-2 gap-px border border-line bg-line">
            {t.perks.map((p) => (
              <div key={p.title} className="bg-ink-raised p-4">
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-gold mb-1">{p.title}</p>
                <p className="font-sans text-sm text-paper">{p.text}</p>
              </div>
            ))}
          </div>

          {/* Offene Positionen */}
          <div className="border-t border-line pt-8">
            <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.16em] text-gold">
              {t.positionenEyebrow}
            </p>
            <ul className="space-y-2 font-sans text-sm text-paper-dim">
              {positions.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-brand" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Direktkontakt als Alternative zum Formular */}
          <dl className="mt-8 space-y-4 border-t border-line pt-8 font-sans text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
                {t.direktKontaktLabel}
              </dt>
              <dd className="text-paper-dim">
                {t.emailLabel}:{" "}
                <a href={`mailto:${SITE.careerEmail}`} className="link-underline text-paper">
                  {SITE.careerEmail}
                </a>
                {" · "}
                <a href={telHref} className="link-underline text-paper">
                  {phone}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="animate-rise" style={{ animationDelay: "120ms" }}>
          <Suspense>
            <CareerForm lang={lang} dict={dict} />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}
