import { notFound } from "next/navigation";
import { getCourseTypes, getCourseFormat } from "@/content/course-types";
import { CourseFormatDetail } from "@/components/course/course-format-detail";
import { getDictionary } from "@/dictionaries";
import { hasLocale, locales } from "@/lib/i18n";

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
  return {
    title: `${result.format.name} — ${result.course.name} | Interlexico`,
    description: result.format.description,
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

  return <CourseFormatDetail course={result.course} format={result.format} lang={lang} dict={dict} />;
}
