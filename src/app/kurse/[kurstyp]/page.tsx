import { notFound } from "next/navigation";
import { courseTypes, getCourseType } from "@/content/course-types";
import { CourseTypeLanding } from "@/components/course/course-type-landing";

export function generateStaticParams() {
  return courseTypes
    .filter((c) => c.status === "aktiv")
    .map((c) => ({ kurstyp: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kurstyp: string }>;
}) {
  const { kurstyp } = await params;
  const course = getCourseType(kurstyp);
  if (!course) return {};
  return { title: course.seo.title, description: course.seo.description };
}

export default async function KurstypPage({
  params,
}: {
  params: Promise<{ kurstyp: string }>;
}) {
  const { kurstyp } = await params;
  const course = getCourseType(kurstyp);
  if (!course || course.status !== "aktiv") notFound();

  return <CourseTypeLanding course={course} />;
}
