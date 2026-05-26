// React Query hooks cho admin quản lý users và thống kê.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import type { UpdateUserAdminDto } from "@/types/admin.types";

export const adminStatsKeys = {
  all: ["admin", "stats"] as const,
};

export const adminUserKeys = {
  all: ["admin", "users"] as const,
  list: (params?: object) => [...adminUserKeys.all, "list", params] as const,
  detail: (id: string) => [...adminUserKeys.all, "detail", id] as const,
  submissions: (userId: string) => [...adminUserKeys.all, "submissions", userId] as const,
  submissionDetail: (submissionId: string) =>
    [...adminUserKeys.all, "submission-detail", submissionId] as const,
};

export function useAdminStats() {
  return useQuery({
    queryKey: adminStatsKeys.all,
    queryFn: () => adminService.getStats(),
    staleTime: 60 * 1000, // 1 phút
  });
}

export function useAdminUsers(params?: { page?: number; limit?: number; role?: string }) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: () => adminService.getUsers(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => adminService.getUserById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminUserSubmissions(userId: string, params?: { page?: number; limit?: number }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  return useQuery({
    queryKey: [...adminUserKeys.submissions(userId), page, limit],
    queryFn: () => adminService.getUserSubmissions(userId, { page, limit }),
    enabled: !!userId,
    staleTime: 60 * 1000,
  });
}

export function useAdminSubmissionDetail(submissionId: string) {
  return useQuery({
    queryKey: adminUserKeys.submissionDetail(submissionId),
    queryFn: () => adminService.getSubmissionDetail(submissionId),
    enabled: !!submissionId,
    staleTime: 60 * 1000,
  });
}

export function useUpdateUserAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserAdminDto }) =>
      adminService.updateUser(id, dto),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(vars.id) });
      toast.success("Cập nhật user thành công");
    },
    onError: () => toast.error("Cập nhật user thất bại"),
  });
}

export function useDeleteUserAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      toast.success("Khóa tài khoản thành công");
    },
    onError: () => toast.error("Khóa tài khoản thất bại"),
  });
}
