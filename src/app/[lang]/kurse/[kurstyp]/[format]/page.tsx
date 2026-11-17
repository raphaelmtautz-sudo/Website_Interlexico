import { notFound } from "next/navigation";
import { getCourseTypes, getCourseType } from "@/lib/cms";
import { getFormatDetail } from "@/content/course-details";
import { CourseFormatDetail } from "@/components/course/course-format-detail";
import { CourseJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/dictionaries";
import { hasLocale, locales, lh, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

/** Analog zu content/course-types#getCourseFormat, aber über die CMS-gestützten getCourseType(s). */
async function getCourseFormat(lang: Locale, courseSlug: string, formatSlug: string) {
  const course = await getCourseType(lang, courseSlug);
  const format = course?.formats.find((f) => f.slug === formatSlug);
  return course && format ? { course, format } : undefined;
}

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    locales.map(async (lang) =>
      (await getCourseTypes(lang))
        .filter((c) => c.status === "aktiv")
        .flatMap((c) => c.formats.map((f) => ({ lang, kurstyp: c.slug, format: f.slug }))),
    ),
  );
  return perLocale.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; kurstyp: string; format: string }>;
}) {
  const { lang, kurstyp, format } = await params;
  if (!hasLocale(lang)) return {};
  const result = await getCourseFormat(lang, kurstyp, format);
  if (!result) return {};
  const detail = getFormatDetail(lang, result.format.kind, result.course.name, result.course.shortName);
  return pageMetadata({
    lang,
    path: `/kurse/${result.course.slug}/${result.format.slug}`,
    title: detail.seoTitle,
    absoluteTitle: true,
    description: detail.seoDescription,
  });
}

export default async function CourseFormatPage({
  params,
}: {
  params: Promise<{ lang: string; kurstyp: string; format: string }>;
}) {
  const { lang, kurstyp, format } = await params;
  if (!hasLocale(lang)) notFound();
  const result = await getCourseFormat(lang, kurstyp, format);
  if (!result) notFound();
  const dict = getDictionary(lang);
  const { course, format: fmt } = result;
  const detail = getFormatDetail(lang, fmt.kind, course.name, course.shortName);

  return (
    <>
      <CourseFormatDetail course={course} format={fmt} detail={detail} lang={lang} dict={dict} />
      <FaqJsonLd items={detail.faq} />
      <CourseJsonLd course={course} lang={lang} />
      <BreadcrumbJsonLd
        items={[
          { name: dict.home.lanes.start, path: lh(lang) },
          { name: dict.kurse.title, path: lh(lang, "/kurse") },
          { name: course.name, path: lh(lang, `/kurse/${course.slug}`) },
          { name: fmt.name, path: lh(lang, `/kurse/${course.slug}/${fmt.slug}`) },
        ]}
      />
    </>
  );
}
