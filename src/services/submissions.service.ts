// Service gọi API submissions: tạo draft, cập nhật, submit để chấm AI và lấy lịch sử.

import { apiClient } from "./api.client";
import {
  Submission,
  CreateSubmissionDto,
  UpdateSubmissionDto,
  PaginatedSubmissions,
} from "@/types/submission.types";
import { SubmissionStatus } from "@/types/enums";

// Query params cho endpoint danh sách submissions (phân trang).
export interface GetSubmissionsParams {
  page?: number;
  limit?: number;
  status?: SubmissionStatus;
  questionId?: string;
}

// Envelope response từ backend: `{ message, data }`.
interface BackendResponse<T> {
  message: string;
  data: T;
}

// Envelope response phân trang từ backend.
interface BackendListResponse {
  message: string;
  data: Submission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const submissionsService = {
  /*
  Tạo draft submission gắn với exam question.
  Input:
  - dto — payload tạo draft.
  Output:
  - Submission (đã unwrap từ envelope backend).
  */
  createDraft: async (dto: CreateSubmissionDto): Promise<Submission> => {
    const { data } = await apiClient.post<BackendResponse<Submission>>(
      "/submissions",
      dto
    );
    return data.data; // unwrap the backend envelope
  },

  /*
  Submit draft để chấm AI (backend enqueue job; kết quả trả về sau qua WebSocket).
  Input:
  - id — submissionId.
  Output:
  - { message }.
  */
  submitEssay: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>(
      `/submissions/${id}/submit`
    );
    return data;
  },

  /*
  Lấy chi tiết submission (kèm aiResult nếu đã COMPLETED).
  Input:
  - id — submissionId.
  Output:
  - Submission (đã unwrap từ envelope backend).
  */
  getSubmission: async (id: string): Promise<Submission> => {
    const { data } = await apiClient.get<BackendResponse<Submission>>(
      `/submissions/${id}`
    );
    return data.data; // unwrap the backend envelope
  },

  /*
  Lấy danh sách submissions của user hiện tại (phân trang).
  Input:
  - params — pagination/filter options (optional).
  Output:
  - PaginatedSubmissions.
  */
  getSubmissions: async (
    params?: GetSubmissionsParams
  ): Promise<PaginatedSubmissions> => {
    const { data } = await apiClient.get<BackendListResponse>(
      "/submissions",
      { params }
    );
    return {
      data: data.data,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    };
  },

  /*
  Cập nhật nội dung draft (không trigger chấm).
  Input:
  - id — submissionId.
  - dto — payload cập nhật draft.
  Output:
  - Submission (đã unwrap từ envelope backend).
  */
  updateDraft: async (
    id: string,
    dto: UpdateSubmissionDto
  ): Promise<Submission> => {
    const { data } = await apiClient.patch<BackendResponse<Submission>>(
      `/submissions/${id}`,
      dto
    );
    return data.data; // unwrap the backend envelope
  },

  /*
  Xoá vĩnh viễn draft submission (chỉ áp dụng khi status là DRAFT).
  Input:
  - id — submissionId.
  */
  deleteDraft: async (id: string): Promise<void> => {
    await apiClient.delete(`/submissions/${id}`);
  },
};
