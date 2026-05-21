// React Query hooks cho admin CRUD exam questions.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { examQuestionsService } from "@/services/exam-questions.service";
import type { CreateExamQuestionDto, UpdateExamQuestionDto } from "@/types/admin.types";

export const adminQuestionKeys = {
  all: ["admin", "exam-questions"] as const,
  list: () => [...adminQuestionKeys.all, "list"] as const,
};

export function useAdminExamQuestions() {
  return useQuery({
    queryKey: adminQuestionKeys.list(),
    queryFn: () => examQuestionsService.getExamQuestions(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateExamQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateExamQuestionDto) => examQuestionsService.createExamQuestion(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQuestionKeys.all });
      toast.success("Tạo đề thi thành công");
    },
    onError: () => toast.error("Tạo đề thi thất bại"),
  });
}

export function useUpdateExamQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateExamQuestionDto }) =>
      examQuestionsService.updateExamQuestion(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQuestionKeys.all });
      toast.success("Cập nhật đề thi thành công");
    },
    onError: () => toast.error("Cập nhật đề thi thất bại"),
  });
}

export function useDeleteExamQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => examQuestionsService.deleteExamQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQuestionKeys.all });
      toast.success("Xóa đề thi thành công");
    },
    onError: () => toast.error("Xóa đề thi thất bại"),
  });
}
