// Service gọi API topics (chủ đề) để lọc course và exam question.

import { apiClient } from "./api.client";
import type { Topic } from "@/types/topic.types";
import type { CreateTopicDto, UpdateTopicDto } from "@/types/admin.types";

export const topicsService = {
  getTopics: async (): Promise<Topic[]> => {
    const { data } = await apiClient.get<Topic[]>("/topics");
    return data;
  },

  getAllTopics: async (): Promise<Topic[]> => {
    const { data } = await apiClient.get<Topic[]>("/topics", { params: { showAll: true } });
    return data;
  },

  createTopic: async (dto: CreateTopicDto): Promise<Topic> => {
    const { data } = await apiClient.post<Topic>("/topics", dto);
    return data;
  },

  updateTopic: async (id: string, dto: UpdateTopicDto): Promise<Topic> => {
    const { data } = await apiClient.patch<Topic>(`/topics/${id}`, dto);
    return data;
  },

  deleteTopic: async (id: string): Promise<void> => {
    await apiClient.delete(`/topics/${id}`);
  },
};
