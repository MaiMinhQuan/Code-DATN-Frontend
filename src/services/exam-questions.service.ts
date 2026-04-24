import { apiClient } from "./api.client";
import {
  ExamQuestion,
  GetExamQuestionsParams,
} from "@/types/exam-question.types";

export const examQuestionsService = {
  getExamQuestions: async (
    params?: GetExamQuestionsParams
  ): Promise<ExamQuestion[]> => {
    const { data } = await apiClient.get<ExamQuestion[]>("/exam-questions", {
      params,
    });
    return data;
  },

  getRandomQuestion: async (): Promise<ExamQuestion> => {
    const { data } = await apiClient.get<ExamQuestion>(
      "/exam-questions/random"
    );
    return data;
  },

  getExamQuestionById: async (id: string): Promise<ExamQuestion> => {
    const { data } = await apiClient.get<ExamQuestion>(
      `/exam-questions/${id}`
    );
    return data;
  },
};
