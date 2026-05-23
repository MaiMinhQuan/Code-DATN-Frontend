// Service gọi API exam questions (IELTS Writing Task 2).

import { apiClient } from "./api.client";
import {
  ExamQuestion,
  GetExamQuestionsParams,
} from "@/types/exam-question.types";
import type { CreateExamQuestionDto, UpdateExamQuestionDto } from "@/types/admin.types";

export const examQuestionsService = {
  /*
  Lấy danh sách exam questions, có thể filter theo params.
  Input:
  - params — filter options (optional).
  Output:
  - Danh sách ExamQuestion.
  */
  getExamQuestions: async (
    params?: GetExamQuestionsParams
  ): Promise<ExamQuestion[]> => {
    const { data } = await apiClient.get<ExamQuestion[]>("/exam-questions", {
      params,
    });
    return data;
  },

  /*
  Lấy ngẫu nhiên một exam question.
  Output:
  - ExamQuestion.
  */
  getRandomQuestion: async (): Promise<ExamQuestion> => {
    const { data } = await apiClient.get<ExamQuestion>(
      "/exam-questions/random"
    );
    return data;
  },

  /*
  Lấy chi tiết exam question theo id.
  Input:
  - id — examQuestionId.
  Output:
  - ExamQuestion.
  */
  getExamQuestionById: async (id: string): Promise<ExamQuestion> => {
    const { data } = await apiClient.get<ExamQuestion>(`/exam-questions/${id}`);
    return data;
  },

  getAdminExamQuestions: async (params?: GetExamQuestionsParams): Promise<ExamQuestion[]> => {
    const { data } = await apiClient.get<ExamQuestion[]>("/exam-questions/admin", { params });
    return data;
  },

  createExamQuestion: async (dto: CreateExamQuestionDto): Promise<ExamQuestion> => {
    const { data } = await apiClient.post<ExamQuestion>("/exam-questions", dto);
    return data;
  },

  updateExamQuestion: async (id: string, dto: UpdateExamQuestionDto): Promise<ExamQuestion> => {
    const { data } = await apiClient.patch<ExamQuestion>(`/exam-questions/${id}`, dto);
    return data;
  },

  deleteExamQuestion: async (id: string): Promise<void> => {
    await apiClient.delete(`/exam-questions/${id}`);
  },
};
