// React Query hooks cho courses và lessons.
import { useQuery } from "@tanstack/react-query";
import { coursesService } from "@/services/courses.service";
import type { CourseQueryParams, LessonQueryParams } from "@/types/course.types";

// Factory query key cho cache courses.
export const courseKeys = {
  all: ["courses"] as const,

  lists: () => [...courseKeys.all, "list"] as const,

  // Sinh key cho danh sách courses theo params (nếu có).
  list: (params?: CourseQueryParams) => [...courseKeys.lists(), params] as const,

  details: () => [...courseKeys.all, "detail"] as const,

  // Sinh key cho chi tiết một course theo id.
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

// Factory query key cho cache lessons.
export const lessonKeys = {
  all: ["lessons"] as const,

  lists: () => [...lessonKeys.all, "list"] as const,

  // Sinh key cho danh sách lessons theo params (bắt buộc có courseId).
  list: (params: LessonQueryParams) => [...lessonKeys.lists(), params] as const,

  details: () => [...lessonKeys.all, "detail"] as const,

  // Sinh key cho chi tiết một lesson theo id.
  detail: (id: string) => [...lessonKeys.details(), id] as const,
};

/*
Hook lấy danh sách courses
Input:
- params — query params (optional).
Output:
- Kết quả useQuery chứa danh sách courses.
*/
export function useCourses(params?: CourseQueryParams) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => coursesService.getCourses(params),
    staleTime: 5 * 60 * 1000, // cache 5 phút
  });
}

/*
Hook lấy chi tiết một course theo id.
Input:
- id — courseId.
Output:
- Kết quả useQuery chứa chi tiết course.
*/
export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => coursesService.getCourse(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/*
Hook lấy danh sách lessons theo course.
Input:
- params — bắt buộc có courseId.
Output:
- Kết quả useQuery chứa danh sách lessons.
*/
export function useLessons(params: LessonQueryParams) {
  return useQuery({
    queryKey: lessonKeys.list(params),
    queryFn: () => coursesService.getLessons(params),
    enabled: !!params.courseId, // chỉ fetch khi đã có courseId
    staleTime: 5 * 60 * 1000,
  });
}

/*
Hook lấy chi tiết một lesson (videos, vocabularies, grammars).
Input:
- id — lessonId.
Output:
- Kết quả useQuery chứa chi tiết lesson.
*/
export function useLesson(id: string) {
  return useQuery({
    queryKey: lessonKeys.detail(id),
    queryFn: () => coursesService.getLesson(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
