// Service gọi API sample essays (bài mẫu) kèm band score và highlight annotations.

import { apiClient } from "./api.client";
import type {
  SampleEssay,
  GetSampleEssaysParams,
} from "@/types/sample-essay.types";

export const sampleEssaysService = {
  /*
  Lấy danh sách sample essays, có thể filter theo topicId/targetBand.
  Input:
  - params — filter options (optional).
  Output:
  - Danh sách SampleEssay.
  */
  getSampleEssays: async (
    params?: GetSampleEssaysParams
  ): Promise<SampleEssay[]> => {
    const { data } = await apiClient.get<SampleEssay[]>("/sample-essays", { params });
    return data;
  },

  /*
  Lấy chi tiết sample essay theo id (kèm highlight annotations).
  Input:
  - id — sampleEssayId.
  Output:
  - SampleEssay.
  */
  getSampleEssayById: async (id: string): Promise<SampleEssay> => {
    const { data } = await apiClient.get<SampleEssay>(`/sample-essays/${id}`);
    return data;
  },
};
