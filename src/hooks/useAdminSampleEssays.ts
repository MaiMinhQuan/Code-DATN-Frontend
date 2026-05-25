// React Query hooks cho admin CRUD sample essays.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sampleEssaysService } from "@/services/sample-essays.service";
import type { CreateSampleEssayDto, UpdateSampleEssayDto } from "@/types/admin.types";

export const adminEssayKeys = {
  all: ["admin", "sample-essays"] as const,
  list: () => [...adminEssayKeys.all, "list"] as const,
  detail: (id: string) => [...adminEssayKeys.all, "detail", id] as const,
};

export function useAdminSampleEssay(id: string) {
  return useQuery({
    queryKey: adminEssayKeys.detail(id),
    queryFn: () => sampleEssaysService.getSampleEssayById(id),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useAdminSampleEssays() {
  return useQuery({
    queryKey: adminEssayKeys.list(),
    queryFn: () => sampleEssaysService.getAllSampleEssaysAdmin(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateSampleEssay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSampleEssayDto) => sampleEssaysService.createSampleEssay(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminEssayKeys.all });
      toast.success("Tạo bài mẫu thành công");
    },
    onError: () => toast.error("Tạo bài mẫu thất bại"),
  });
}

export function useUpdateSampleEssay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSampleEssayDto }) =>
      sampleEssaysService.updateSampleEssay(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminEssayKeys.all });
      toast.success("Cập nhật bài mẫu thành công");
    },
    onError: () => toast.error("Cập nhật bài mẫu thất bại"),
  });
}

export function useDeleteSampleEssay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sampleEssaysService.deleteSampleEssay(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminEssayKeys.all });
      toast.success("Xóa bài mẫu thành công");
    },
    onError: () => toast.error("Xóa bài mẫu thất bại"),
  });
}
