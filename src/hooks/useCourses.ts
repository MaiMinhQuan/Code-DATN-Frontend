import { useQuery } from "@tanstack/react-query";
import { coursesService } from "@/services/courses.service";
import type { CourseQueryParams, LessonQueryParams } from "@/types/course.types";

// ─── Query key factory ────────────────────────────────────────────────────────

export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (params?: CourseQueryParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (params: LessonQueryParams) => [...lessonKeys.lists(), params] as const,
  details: () => [...lessonKeys.all, "detail"] as const,
  detail: (id: string) => [...lessonKeys.details(), id] as const,
};

// ─── Courses ──────────────────────────────────────────────────────────────────

export function useCourses(params?: CourseQueryParams) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => coursesService.getCourses(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => coursesService.getCourse(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export function useLessons(params: LessonQueryParams) {
  return useQuery({
    queryKey: lessonKeys.list(params),
    queryFn: () => coursesService.getLessons(params),
    enabled: !!params.courseId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: lessonKeys.detail(id),
    queryFn: () => coursesService.getLesson(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
