import { apiClient } from "./api.client";
import {
  Submission,
  CreateSubmissionDto,
  UpdateSubmissionDto,
  PaginatedSubmissions,
} from "@/types/submission.types";
import { SubmissionStatus } from "@/types/enums";

export interface GetSubmissionsParams {
  page?: number;
  limit?: number;
  status?: SubmissionStatus;
  questionId?: string;
}

// Backend bọc tất cả responses trong { message, data }
interface BackendResponse<T> {
  message: string;
  data: T;
}

export const submissionsService = {
  createDraft: async (dto: CreateSubmissionDto): Promise<Submission> => {
    const { data } = await apiClient.post<BackendResponse<Submission>>(
      "/submissions",
      dto
    );
    return data.data;
  },

  submitEssay: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>(
      `/submissions/${id}/submit`
    );
    return data;
  },

  getSubmission: async (id: string): Promise<Submission> => {
    const { data } = await apiClient.get<BackendResponse<Submission>>(
      `/submissions/${id}`
    );
    return data.data;
  },

  getSubmissions: async (
    params?: GetSubmissionsParams
  ): Promise<PaginatedSubmissions> => {
    const { data } = await apiClient.get<PaginatedSubmissions>(
      "/submissions",
      { params }
    );
    return data;
  },

  updateDraft: async (
    id: string,
    dto: UpdateSubmissionDto
  ): Promise<Submission> => {
    const { data } = await apiClient.patch<BackendResponse<Submission>>(
      `/submissions/${id}`,
      dto
    );
    return data.data;
  },

  deleteDraft: async (id: string): Promise<void> => {
    await apiClient.delete(`/submissions/${id}`);
  },
};
