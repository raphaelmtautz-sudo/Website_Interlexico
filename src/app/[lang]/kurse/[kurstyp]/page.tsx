import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseTypes, getCourseType } from "@/content/course-types";
import { CourseTypeLanding } from "@/components/course/course-type-landing";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/dictionaries";
import { hasLocale, locales, lh } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getCourseTypes(lang)
      .filter((c) => c.status === "aktiv")
      .map((c) => ({ lang, kurstyp: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; kurstyp: string }>;
}): Promise<Metadata> {
  const { lang, kurstyp } = await params;
  if (!hasLocale(lang)) return {};
  const course = getCourseType(lang, kurstyp);
  if (!course) return {};
  const url = lh(lang, `/kurse/${course.slug}`);
  return {
    title: { absolute: course.seo.title },
    description: course.seo.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: course.seo.title,
      description: course.seo.description,
      url,
    },
  };
}

export default async function KurstypPage({
  params,
}: {
  params: Promise<{ lang: string; kurstyp: string }>;
}) {
  const { lang, kurstyp } = await params;
  if (!hasLocale(lang)) notFound();
  const course = getCourseType(lang, kurstyp);
  if (!course || course.status !== "aktiv") notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <CourseTypeLanding course={course} lang={lang} dict={dict} />
      <CourseJsonLd course={course} lang={lang} />
      <BreadcrumbJsonLd
        items={[
          { name: dict.home.lanes.start, path: lh(lang) },
          { name: dict.kurse.title, path: lh(lang, "/kurse") },
          { name: course.name, path: lh(lang, `/kurse/${course.slug}`) },
        ]}
      />
    </>
  );
}
