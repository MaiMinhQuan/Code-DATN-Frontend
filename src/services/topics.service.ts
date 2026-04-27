import { apiClient } from "./api.client";
import type { Topic } from "@/types/topic.types";

export const topicsService = {
  getTopics: async (): Promise<Topic[]> => {
    const { data } = await apiClient.get<Topic[]>("/topics");
    return data;
  },
};
