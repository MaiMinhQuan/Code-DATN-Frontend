import { apiClient } from "./api.client";
import type {
  Course,
  CourseQueryParams,
  Lesson,
  LessonDetail,
  LessonQueryParams,
} from "@/types/course.types";

export const coursesService = {
  getCourses: async (params?: CourseQueryParams): Promise<Course[]> => {
    const { data } = await apiClient.get<Course[]>("/courses", { params });
    return data;
  },

  getCourse: async (id: string): Promise<Course> => {
    const { data } = await apiClient.get<Course>(`/courses/${id}`);
    return data;
  },

  getLessons: async (params: LessonQueryParams): Promise<Lesson[]> => {
    const { data } = await apiClient.get<Lesson[]>("/lessons", { params });
    return data;
  },

  getLesson: async (id: string): Promise<LessonDetail> => {
    const { data } = await apiClient.get<LessonDetail>(`/lessons/${id}`);
    return data;
  },
};
