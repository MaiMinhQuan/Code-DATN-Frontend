// Service gọi API courses/lessons từ backend.

import { apiClient } from "./api.client";
import type {
  Course,
  CourseQueryParams,
  Lesson,
  LessonDetail,
  LessonQueryParams,
} from "@/types/course.types";
import type {
  CreateCourseDto,
  UpdateCourseDto,
  CreateLessonDto,
  UpdateLessonDto,
  AddVideoDto,
  UpdateVideoDto,
  AddVocabularyDto,
  UpdateVocabularyDto,
  AddGrammarDto,
  UpdateGrammarDto,
} from "@/types/admin.types";

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

  getAdminCourses: async (params?: CourseQueryParams): Promise<Course[]> => {
    const { data } = await apiClient.get<Course[]>("/courses/admin", { params });
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

  getAdminCourse: async (id: string): Promise<Course> => {
    const { data } = await apiClient.get<Course>(`/courses/admin/${id}`);
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

  getAdminLessons: async (params: LessonQueryParams): Promise<Lesson[]> => {
    const { data } = await apiClient.get<Lesson[]>("/lessons/admin", { params });
    return data;
  },

  getLesson: async (id: string): Promise<LessonDetail> => {
    const { data } = await apiClient.get<LessonDetail>(`/lessons/${id}`);
    return data;
  },

  getAdminLesson: async (id: string): Promise<LessonDetail> => {
    const { data } = await apiClient.get<LessonDetail>(`/lessons/admin/${id}`);
    return data;
  },

  // --- Admin CRUD ---
  createCourse: async (dto: CreateCourseDto): Promise<Course> => {
    const { data } = await apiClient.post<Course>("/courses", dto);
    return data;
  },

  updateCourse: async (id: string, dto: UpdateCourseDto): Promise<Course> => {
    const { data } = await apiClient.patch<Course>(`/courses/${id}`, dto);
    return data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}`);
  },

  createLesson: async (dto: CreateLessonDto): Promise<Lesson> => {
    const { data } = await apiClient.post<Lesson>("/lessons", dto);
    return data;
  },

  updateLesson: async (id: string, dto: UpdateLessonDto): Promise<Lesson> => {
    const { data } = await apiClient.patch<Lesson>(`/lessons/${id}`, dto);
    return data;
  },

  deleteLesson: async (id: string): Promise<void> => {
    await apiClient.delete(`/lessons/${id}`);
  },

  addVideo: async (lessonId: string, dto: AddVideoDto): Promise<LessonDetail> => {
    const { data } = await apiClient.post<LessonDetail>(`/lessons/${lessonId}/videos`, dto);
    return data;
  },

  updateVideo: async (lessonId: string, index: number, dto: UpdateVideoDto): Promise<LessonDetail> => {
    const { data } = await apiClient.patch<LessonDetail>(`/lessons/${lessonId}/videos/${index}`, dto);
    return data;
  },

  removeVideo: async (lessonId: string, index: number): Promise<LessonDetail> => {
    const { data } = await apiClient.delete<LessonDetail>(`/lessons/${lessonId}/videos/${index}`);
    return data;
  },

  addVocabulary: async (lessonId: string, dto: AddVocabularyDto): Promise<LessonDetail> => {
    const { data } = await apiClient.post<LessonDetail>(`/lessons/${lessonId}/vocabularies`, dto);
    return data;
  },

  updateVocabulary: async (lessonId: string, index: number, dto: UpdateVocabularyDto): Promise<LessonDetail> => {
    const { data } = await apiClient.patch<LessonDetail>(`/lessons/${lessonId}/vocabularies/${index}`, dto);
    return data;
  },

  removeVocabulary: async (lessonId: string, index: number): Promise<LessonDetail> => {
    const { data } = await apiClient.delete<LessonDetail>(`/lessons/${lessonId}/vocabularies/${index}`);
    return data;
  },

  addGrammar: async (lessonId: string, dto: AddGrammarDto): Promise<LessonDetail> => {
    const { data } = await apiClient.post<LessonDetail>(`/lessons/${lessonId}/grammars`, dto);
    return data;
  },

  updateGrammar: async (lessonId: string, index: number, dto: UpdateGrammarDto): Promise<LessonDetail> => {
    const { data } = await apiClient.patch<LessonDetail>(`/lessons/${lessonId}/grammars/${index}`, dto);
    return data;
  },

  removeGrammar: async (lessonId: string, index: number): Promise<LessonDetail> => {
    const { data } = await apiClient.delete<LessonDetail>(`/lessons/${lessonId}/grammars/${index}`);
    return data;
  },
};
