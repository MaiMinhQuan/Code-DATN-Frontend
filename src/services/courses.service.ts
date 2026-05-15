// Service gọi API courses/lessons từ backend.

import { apiClient } from "./api.client";
import type {
  Course,
  CourseQueryParams,
  Lesson,
  LessonDetail,
  LessonQueryParams,
} from "@/types/course.types";

export const coursesService = {
  /*
  Lấy danh sách courses, có thể filter theo topic/isPublished.
  Input:
  - params — query params (optional).
  Output:
  - Danh sách Course.
  */
  getCourses: async (params?: CourseQueryParams): Promise<Course[]> => {
    const { data } = await apiClient.get<Course[]>("/courses", { params });
    return data;
  },

  /*
  Lấy chi tiết một course theo id.
  Input:
  - id — courseId.
  Output:
  - Course.
  */
  getCourse: async (id: string): Promise<Course> => {
    const { data } = await apiClient.get<Course>(`/courses/${id}`);
    return data;
  },

  /*
  Lấy danh sách lessons của một course.
  Input:
  - params — bắt buộc có courseId.
  Output:
  - Danh sách Lesson.
  */
  getLessons: async (params: LessonQueryParams): Promise<Lesson[]> => {
    const { data } = await apiClient.get<Lesson[]>("/lessons", { params });
    return data;
  },

  /*
  Lấy chi tiết một lesson (kèm videos/vocabularies/grammars).
  Input:
  - id — lessonId.
  Output:
  - LessonDetail.
  */
  getLesson: async (id: string): Promise<LessonDetail> => {
    const { data } = await apiClient.get<LessonDetail>(`/lessons/${id}`);
    return data;
  },
};
