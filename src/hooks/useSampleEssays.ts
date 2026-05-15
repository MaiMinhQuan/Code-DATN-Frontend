// React Query hooks cho sample essays và highlight annotations.

import { useQuery } from "@tanstack/react-query";
import { sampleEssaysService } from "@/services/sample-essays.service";
import type { GetSampleEssaysParams } from "@/types/sample-essay.types";

// Factory query key cho cache sample essays.
export const sampleEssayKeys = {
  all: ["sample-essays"] as const,

  lists: () => [...sampleEssayKeys.all, "list"] as const,

  // Sinh key cho danh sách sample essays theo params.
  list: (params?: GetSampleEssaysParams) =>
    [...sampleEssayKeys.lists(), params] as const,

  details: () => [...sampleEssayKeys.all, "detail"] as const,

  // Sinh key cho chi tiết một sample essay theo id.
  detail: (id: string) => [...sampleEssayKeys.details(), id] as const,
};

/*
Hook lấy danh sách sample essays, có thể filter theo params.

Input:
- params — filter params (optional).

Output:
- Kết quả useQuery chứa danh sách sample essays.
*/
export function useSampleEssays(params?: GetSampleEssaysParams) {
  return useQuery({
    queryKey: sampleEssayKeys.list(params),
    queryFn: () => sampleEssaysService.getSampleEssays(params),
    staleTime: 5 * 60 * 1000,
  });
}

/*
Hook lấy chi tiết một sample essay.

Input:
- id — sampleEssayId.

Output:
- Kết quả useQuery chứa chi tiết sample essay.
*/
export function useSampleEssay(id: string) {
  return useQuery({
    queryKey: sampleEssayKeys.detail(id),
    queryFn: () => sampleEssaysService.getSampleEssayById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
