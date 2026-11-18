import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { ServiceLanding } from "@/components/content/service-landing";
import { getService } from "@/content/services";
import { getDictionary } from "@/dictionaries";
import { hasLocale } from "@/lib/i18n";

const SLUG = "executive-language-coaching" as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const page = getService(lang, SLUG);
  return pageMetadata({ lang, path: `/${SLUG}`, title: page.seoTitle, absoluteTitle: true, description: page.description });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <ServiceLanding page={getService(lang, SLUG)} lang={lang} dict={getDictionary(lang)} />;
}
