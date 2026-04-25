import { useQuery } from "@tanstack/react-query";
import { sampleEssaysService } from "@/services/sample-essays.service";
import type { GetSampleEssaysParams } from "@/types/sample-essay.types";

export const sampleEssayKeys = {
  all: ["sample-essays"] as const,
  lists: () => [...sampleEssayKeys.all, "list"] as const,
  list: (params?: GetSampleEssaysParams) =>
    [...sampleEssayKeys.lists(), params] as const,
  details: () => [...sampleEssayKeys.all, "detail"] as const,
  detail: (id: string) => [...sampleEssayKeys.details(), id] as const,
};

export function useSampleEssays(params?: GetSampleEssaysParams) {
  return useQuery({
    queryKey: sampleEssayKeys.list(params),
    queryFn: () => sampleEssaysService.getSampleEssays(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSampleEssay(id: string) {
  return useQuery({
    queryKey: sampleEssayKeys.detail(id),
    queryFn: () => sampleEssaysService.getSampleEssayById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
