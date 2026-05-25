import { apiClient } from "./api.client";
import type { PipelineJob, PipelineCandidate, PipelineLessonItem } from "@/types/pipeline.types";

export const pipelineService = {
  createJob: async (dto: {
    topic: string;
    maxVideos?: number;
    maxEssays?: number;
  }): Promise<{ jobId: string }> => {
    const { data } = await apiClient.post<{ jobId: string }>("/pipeline/jobs", dto);
    return data;
  },

  getJobs: async (): Promise<PipelineJob[]> => {
    const { data } = await apiClient.get<PipelineJob[]>("/pipeline/jobs");
    return data;
  },

  getJob: async (jobId: string): Promise<PipelineJob> => {
    const { data } = await apiClient.get<PipelineJob>(`/pipeline/jobs/${jobId}`);
    return data;
  },

  getCandidates: async (jobId: string): Promise<PipelineCandidate[]> => {
    const { data } = await apiClient.get<PipelineCandidate[]>(`/pipeline/jobs/${jobId}/candidates`);
    return data;
  },

  updateCandidates: async (jobId: string, approvedIndexes: number[]): Promise<{ updated: number }> => {
    const { data } = await apiClient.patch<{ updated: number }>(
      `/pipeline/jobs/${jobId}/candidates`,
      { approvedIndexes },
    );
    return data;
  },

  getLessons: async (jobId: string): Promise<PipelineLessonItem[]> => {
    const { data } = await apiClient.get<PipelineLessonItem[]>(`/pipeline/jobs/${jobId}/lessons`);
    return data;
  },

  updateLessons: async (jobId: string, approvedIndexes: number[]): Promise<{ updated: number }> => {
    const { data } = await apiClient.patch<{ updated: number }>(
      `/pipeline/jobs/${jobId}/lessons`,
      { approvedIndexes },
    );
    return data;
  },

  analyze: async (jobId: string): Promise<{ started: boolean }> => {
    const { data } = await apiClient.post<{ started: boolean }>(`/pipeline/jobs/${jobId}/analyze`);
    return data;
  },

  seed: async (jobId: string): Promise<{ started: boolean }> => {
    const { data } = await apiClient.post<{ started: boolean }>(`/pipeline/jobs/${jobId}/seed`);
    return data;
  },
};
