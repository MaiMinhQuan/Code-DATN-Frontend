// Service gọi các API admin: thống kê hệ thống và quản lý users.

import { apiClient } from "./api.client";
import type { AdminStats, UpdateUserAdminDto, PaginatedResponse } from "@/types/admin.types";
import type { User } from "@/types/user.types";
import type { Submission } from "@/types/submission.types";

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await apiClient.get<AdminStats>("/admin/stats");
    return data;
  },

  getUsers: async (params?: { page?: number; limit?: number; role?: string }): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>("/users", { params });
    return data;
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  updateUser: async (id: string, dto: UpdateUserAdminDto): Promise<User> => {
    const { data } = await apiClient.patch<User>(`/users/${id}`, dto);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  getUserSubmissions: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ data: Submission[]; total: number; page: number; limit: number; totalPages: number }> => {
    const { data } = await apiClient.get(`/admin/users/${userId}/submissions`, { params });
    return data;
  },

  getSubmissionDetail: async (submissionId: string): Promise<Submission> => {
    const { data } = await apiClient.get<Submission>(`/admin/submissions/${submissionId}`);
    return data;
  },
};
