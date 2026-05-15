// Service gọi API topics (chủ đề) để lọc course và exam question.

import { apiClient } from "./api.client";
import type { Topic } from "@/types/topic.types";

export const topicsService = {
  /*
  Lấy danh sách topics.
  Output:
  - Danh sách Topic.
  */
  getTopics: async (): Promise<Topic[]> => {
    const { data } = await apiClient.get<Topic[]>("/topics");
    return data;
  },
};
