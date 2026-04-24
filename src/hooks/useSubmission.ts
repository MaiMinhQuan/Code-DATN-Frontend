import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  submissionsService,
  GetSubmissionsParams,
} from "@/services/submissions.service";
import {
  CreateSubmissionDto,
  UpdateSubmissionDto,
} from "@/types/submission.types";
import { SubmissionStatus } from "@/types/enums";
import { useSubmissionStore } from "@/stores/submission.store";

export const submissionKeys = {
  all: ["submissions"] as const,
  lists: () => [...submissionKeys.all, "list"] as const,
  list: (params?: GetSubmissionsParams) =>
    [...submissionKeys.lists(), params] as const,
  details: () => [...submissionKeys.all, "detail"] as const,
  detail: (id: string) => [...submissionKeys.details(), id] as const,
};

// ─── Queries ────────────────────────────────────────────────────────────────

export function useSubmission(id: string) {
  return useQuery({
    queryKey: submissionKeys.detail(id),
    queryFn: () => submissionsService.getSubmission(id),
    enabled: !!id,
  });
}

export function useSubmissions(params?: GetSubmissionsParams) {
  return useQuery({
    queryKey: submissionKeys.list(params),
    queryFn: () => submissionsService.getSubmissions(params),
  });
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useCreateDraft() {
  const { setDraft, setGradingStatus } = useSubmissionStore();

  return useMutation({
    mutationFn: (dto: CreateSubmissionDto) =>
      submissionsService.createDraft(dto),
    onSuccess: (submission) => {
      setDraft(submission);
      setGradingStatus(SubmissionStatus.DRAFT);
    },
  });
}

export function useUpdateDraft() {
  const queryClient = useQueryClient();
  const { setDraft } = useSubmissionStore();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSubmissionDto }) =>
      submissionsService.updateDraft(id, dto),
    onSuccess: (submission) => {
      setDraft(submission);
      // Cập nhật cache ngay, không cần refetch
      queryClient.setQueryData(
        submissionKeys.detail(submission._id),
        submission
      );
    },
  });
}

export function useSubmitEssay() {
  const queryClient = useQueryClient();
  const { setGradingStatus, setGradingProgress } = useSubmissionStore();

  return useMutation({
    mutationFn: (id: string) => submissionsService.submitEssay(id),
    onSuccess: (_, submissionId) => {
      // Backend trả 202 → bài đã vào queue, WebSocket sẽ cập nhật tiếp
      setGradingStatus(SubmissionStatus.SUBMITTED);
      setGradingProgress(0, "Đang chờ xử lý...");
      // Invalidate để khi WebSocket báo COMPLETED → refetch sẽ lấy được aiResult
      queryClient.invalidateQueries({
        queryKey: submissionKeys.detail(submissionId),
      });
    },
  });
}

export function useDeleteDraft() {
  const queryClient = useQueryClient();
  const { clearDraft } = useSubmissionStore();

  return useMutation({
    mutationFn: (id: string) => submissionsService.deleteDraft(id),
    onSuccess: (_, deletedId) => {
      clearDraft();
      queryClient.removeQueries({
        queryKey: submissionKeys.detail(deletedId),
      });
      queryClient.invalidateQueries({
        queryKey: submissionKeys.lists(),
      });
    },
  });
}
