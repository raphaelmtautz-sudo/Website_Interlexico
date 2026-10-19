import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getCourseTypes, getCourseType } from "@/lib/cms";
import { CourseTypeLanding } from "@/components/course/course-type-landing";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/dictionaries";
import { hasLocale, locales, lh } from "@/lib/i18n";

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    locales.map(async (lang) =>
      (await getCourseTypes(lang)).filter((c) => c.status === "aktiv").map((c) => ({ lang, kurstyp: c.slug })),
    ),
  );
  return perLocale.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; kurstyp: string }>;
}): Promise<Metadata> {
  const { lang, kurstyp } = await params;
  if (!hasLocale(lang)) return {};
  const course = await getCourseType(lang, kurstyp);
  if (!course) return {};
  return pageMetadata({
    lang,
    path: `/kurse/${course.slug}`,
    title: course.seo.title,
    absoluteTitle: true,
    description: course.seo.description,
  });
}

export default async function KurstypPage({
  params,
}: {
  params: Promise<{ lang: string; kurstyp: string }>;
}) {
  const { lang, kurstyp } = await params;
  if (!hasLocale(lang)) notFound();
  const course = await getCourseType(lang, kurstyp);
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
