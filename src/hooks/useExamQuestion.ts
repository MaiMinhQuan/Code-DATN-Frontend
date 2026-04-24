import { useQuery } from "@tanstack/react-query";
import { examQuestionsService } from "@/services/exam-questions.service";
import { GetExamQuestionsParams } from "@/types/exam-question.types";

export const examQuestionKeys = {
  all: ["exam-questions"] as const,
  lists: () => [...examQuestionKeys.all, "list"] as const,
  list: (params?: GetExamQuestionsParams) =>
    [...examQuestionKeys.lists(), params] as const,
  details: () => [...examQuestionKeys.all, "detail"] as const,
  detail: (id: string) => [...examQuestionKeys.details(), id] as const,
  random: () => [...examQuestionKeys.all, "random"] as const,
};

export function useExamQuestion(id: string) {
  return useQuery({
    queryKey: examQuestionKeys.detail(id),
    queryFn: () => examQuestionsService.getExamQuestionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRandomQuestion() {
  return useQuery({
    queryKey: examQuestionKeys.random(),
    queryFn: () => examQuestionsService.getRandomQuestion(),
    staleTime: 0,
  });
}

export function useExamQuestions(params?: GetExamQuestionsParams) {
  return useQuery({
    queryKey: examQuestionKeys.list(params),
    queryFn: () => examQuestionsService.getExamQuestions(params),
    staleTime: 5 * 60 * 1000,
  });
}
