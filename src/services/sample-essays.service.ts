import { apiClient } from "./api.client";
import type {
  SampleEssay,
  GetSampleEssaysParams,
} from "@/types/sample-essay.types";

export const sampleEssaysService = {
  getSampleEssays: async (
    params?: GetSampleEssaysParams
  ): Promise<SampleEssay[]> => {
    const { data } = await apiClient.get<SampleEssay[]>("/sample-essays", { params });
    return data;
  },

  getSampleEssayById: async (id: string): Promise<SampleEssay> => {
    const { data } = await apiClient.get<SampleEssay>(`/sample-essays/${id}`);
    return data;
  },
};
