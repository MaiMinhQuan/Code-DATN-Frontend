// React Query hooks cho exam questions dùng trong phần luyện tập.

import { useQuery } from "@tanstack/react-query";
import { examQuestionsService } from "@/services/exam-questions.service";
import { GetExamQuestionsParams } from "@/types/exam-question.types";

// Factory query key cho cache exam questions.
export const examQuestionKeys = {
  all: ["exam-questions"] as const,

  lists: () => [...examQuestionKeys.all, "list"] as const,

  // Sinh key cho danh sách exam questions theo params.
  list: (params?: GetExamQuestionsParams) =>
    [...examQuestionKeys.lists(), params] as const,

  details: () => [...examQuestionKeys.all, "detail"] as const,

  // Sinh key cho chi tiết exam question theo id.
  detail: (id: string) => [...examQuestionKeys.details(), id] as const,

  // Key cho endpoint lấy đề ngẫu nhiên.
  random: () => [...examQuestionKeys.all, "random"] as const,
};

/*
Hook lấy chi tiết một exam question theo id.

Input:
- id — examQuestionId.

Output:
- Kết quả useQuery chứa chi tiết exam question.
*/
export function useExamQuestion(id: string) {
  return useQuery({
    queryKey: examQuestionKeys.detail(id),
    queryFn: () => examQuestionsService.getExamQuestionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/*
Hook lấy ngẫu nhiên một exam question.

Output:
- Kết quả useQuery chứa exam question ngẫu nhiên.
*/
export function useRandomQuestion() {
  return useQuery({
    queryKey: examQuestionKeys.random(),
    queryFn: () => examQuestionsService.getRandomQuestion(),
    staleTime: 0, // luôn fetch mới để đảm bảo tính ngẫu nhiên
  });
}

/*
Hook lấy danh sách exam questions theo bộ lọc.

Input:
- params — filter params (optional).

Output:
- Kết quả useQuery chứa danh sách exam questions.
*/
export function useExamQuestions(params?: GetExamQuestionsParams) {
  return useQuery({
    queryKey: examQuestionKeys.list(params),
    queryFn: () => examQuestionsService.getExamQuestions(params),
    staleTime: 5 * 60 * 1000,
  });
}
