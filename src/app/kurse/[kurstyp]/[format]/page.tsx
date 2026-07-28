import { notFound } from "next/navigation";
import { courseTypes, getCourseFormat } from "@/content/course-types";
import { CourseFormatDetail } from "@/components/course/course-format-detail";

export function generateStaticParams() {
  return courseTypes
    .filter((c) => c.status === "aktiv")
    .flatMap((c) => c.formats.map((f) => ({ kurstyp: c.slug, format: f.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kurstyp: string; format: string }>;
}) {
  const { kurstyp, format } = await params;
  const result = getCourseFormat(kurstyp, format);
  if (!result) return {};
  return {
    title: `${result.format.name} — ${result.course.name} | Interlexico`,
    description: result.format.description,
  };
}

export default async function CourseFormatPage({
  params,
}: {
  params: Promise<{ kurstyp: string; format: string }>;
}) {
  const { kurstyp, format } = await params;
  const result = getCourseFormat(kurstyp, format);
  if (!result) notFound();

  return <CourseFormatDetail course={result.course} format={result.format} />;
}
