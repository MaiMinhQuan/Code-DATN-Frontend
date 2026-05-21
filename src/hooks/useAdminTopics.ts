// React Query hooks cho admin CRUD topics.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { topicsService } from "@/services/topics.service";
import type { CreateTopicDto, UpdateTopicDto } from "@/types/admin.types";

export const adminTopicKeys = {
  all: ["admin", "topics"] as const,
  list: () => [...adminTopicKeys.all, "list"] as const,
};

export function useAdminTopics() {
  return useQuery({
    queryKey: adminTopicKeys.list(),
    queryFn: () => topicsService.getAllTopics(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTopicDto) => topicsService.createTopic(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTopicKeys.all });
      toast.success("Tạo topic thành công");
    },
    onError: () => toast.error("Tạo topic thất bại"),
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTopicDto }) =>
      topicsService.updateTopic(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTopicKeys.all });
      toast.success("Cập nhật topic thành công");
    },
    onError: () => toast.error("Cập nhật topic thất bại"),
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => topicsService.deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTopicKeys.all });
      toast.success("Xóa topic thành công");
    },
    onError: () => toast.error("Xóa topic thất bại"),
  });
}
