import { notFound } from "next/navigation";
import { getCourseTypes, getCourseFormat } from "@/content/course-types";
import { CourseFormatDetail } from "@/components/course/course-format-detail";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/dictionaries";
import { hasLocale, locales, lh } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getCourseTypes(lang)
      .filter((c) => c.status === "aktiv")
      .flatMap((c) => c.formats.map((f) => ({ lang, kurstyp: c.slug, format: f.slug }))),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; kurstyp: string; format: string }>;
}) {
  const { lang, kurstyp, format } = await params;
  if (!hasLocale(lang)) return {};
  const result = getCourseFormat(lang, kurstyp, format);
  if (!result) return {};
  const title = `${result.format.name} — ${result.course.name} | Interlexico`;
  const url = lh(lang, `/kurse/${result.course.slug}/${result.format.slug}`);
  return {
    title: { absolute: title },
    description: result.format.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description: result.format.description,
      url,
    },
  };
}

export default async function CourseFormatPage({
  params,
}: {
  params: Promise<{ lang: string; kurstyp: string; format: string }>;
}) {
  const { lang, kurstyp, format } = await params;
  if (!hasLocale(lang)) notFound();
  const result = getCourseFormat(lang, kurstyp, format);
  if (!result) notFound();
  const dict = getDictionary(lang);
  const { course, format: fmt } = result;

  return (
    <>
      <CourseFormatDetail course={course} format={fmt} lang={lang} dict={dict} />
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
