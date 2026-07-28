import { CourseType } from "@/types/course";
import { businessEnglish } from "./business-english";
import { deutschAlsFremdsprache } from "./deutsch-als-fremdsprache";

export const courseTypes: CourseType[] = [businessEnglish, deutschAlsFremdsprache];

export function getCourseType(slug: string): CourseType | undefined {
  return courseTypes.find((c) => c.slug === slug);
}

export function getCourseFormat(courseSlug: string, formatSlug: string) {
  const course = getCourseType(courseSlug);
  const format = course?.formats.find((f) => f.slug === formatSlug);
  return course && format ? { course, format } : undefined;
}
