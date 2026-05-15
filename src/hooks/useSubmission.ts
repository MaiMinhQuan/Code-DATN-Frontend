// React Query hooks cho submissions và vòng đời chấm AI.

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

// Factory query key cho cache submissions.
export const submissionKeys = {
  all: ["submissions"] as const,

  lists: () => [...submissionKeys.all, "list"] as const,

  // Sinh key danh sách submissions theo params.
  list: (params?: GetSubmissionsParams) =>
    [...submissionKeys.lists(), params] as const,

  details: () => [...submissionKeys.all, "detail"] as const,

  // Sinh key chi tiết submission theo id.
  detail: (id: string) => [...submissionKeys.details(), id] as const,
};

/*
Hook lấy chi tiết một submission.

Input:
- id — submissionId.

Output:
- Kết quả useQuery chứa chi tiết submission.
*/
export function useSubmission(id: string) {
  return useQuery({
    queryKey: submissionKeys.detail(id),
    queryFn: () => submissionsService.getSubmission(id),
    enabled: !!id,
  });
}

/*
Hook lấy danh sách submissions của user hiện tại (phân trang).

Input:
- params — pagination/filter params (optional).

Output:
- Kết quả useQuery chứa danh sách submissions.
*/
export function useSubmissions(params?: GetSubmissionsParams) {
  return useQuery({
    queryKey: submissionKeys.list(params),
    queryFn: () => submissionsService.getSubmissions(params),
  });
}

/*
Hook tạo draft mới và đồng bộ vào submission store.
*/
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

/*
Hook cập nhật draft hiện tại mà không submit để chấm.
*/
export function useUpdateDraft() {
  const queryClient = useQueryClient();
  const { setDraft } = useSubmissionStore();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSubmissionDto }) =>
      submissionsService.updateDraft(id, dto),
    onSuccess: (submission) => {
      setDraft(submission);
      // Ghi thẳng vào cache để tránh refetch
      queryClient.setQueryData(
        submissionKeys.detail(submission._id),
        submission
      );
    },
  });
}

/*
Hook submit draft để chấm AI.
*/
export function useSubmitEssay() {
  const queryClient = useQueryClient();
  const { setGradingStatus, setGradingProgress } = useSubmissionStore();

  return useMutation({
    mutationFn: (id: string) => submissionsService.submitEssay(id),
    onSuccess: (_, submissionId) => {
      // Backend trả 202 nghĩa là job đã vào queue; trạng thái tiếp theo qua WebSocket
      setGradingStatus(SubmissionStatus.SUBMITTED);
      setGradingProgress(0, "Đang chờ xử lý...");
      // Invalidate trước để lần refetch sau khi COMPLETED lấy được aiResult mới
      queryClient.invalidateQueries({
        queryKey: submissionKeys.detail(submissionId),
      });
    },
  });
}

/*
Hook xóa draft, clear store và xóa cache liên quan.
*/
export function useDeleteDraft() {
  const queryClient = useQueryClient();
  const { clearDraft } = useSubmissionStore();

  return useMutation({
    mutationFn: (id: string) => submissionsService.deleteDraft(id),
    onSuccess: (_, deletedId) => {
      clearDraft();
      // Xóa cache detail ngay để tránh dữ liệu stale
      queryClient.removeQueries({
        queryKey: submissionKeys.detail(deletedId),
      });
      queryClient.invalidateQueries({
        queryKey: submissionKeys.lists(),
      });
    },
  });
}
