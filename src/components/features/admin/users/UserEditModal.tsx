"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useUpdateUserAdmin } from "@/hooks/useAdminUsers";
import type { User } from "@/types/user.types";
import type { UpdateUserAdminDto } from "@/types/admin.types";
import { UserRole } from "@/types/enums";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserEditModal({ isOpen, onClose, user }: Props) {
  const updateUser = useUpdateUserAdmin();
  const { register, handleSubmit, reset } = useForm<UpdateUserAdminDto>();

  useEffect(() => {
    if (isOpen && user) {
      reset({ fullName: user.fullName, role: user.role, isActive: user.isActive });
    }
  }, [isOpen, user, reset]);

  const onSubmit = handleSubmit((dto) => {
    if (!user) return;
    updateUser.mutate({ id: user._id, dto }, { onSuccess: onClose });
  });

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Chỉnh sửa user</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-sm font-medium text-slate-700">{user.email}</p>
          <p className="text-xs text-slate-400">Email không thể thay đổi</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Họ tên</label>
            <input
              {...register("fullName")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <select
              {...register("role")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value={UserRole.STUDENT}>STUDENT</option>
              <option value={UserRole.ADMIN}>ADMIN</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Trạng thái</label>
            <select
              {...register("isActive")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="true">Đang hoạt động</option>
              <option value="false">Bị khóa</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Hủy
            </button>
            <button type="submit" disabled={updateUser.isPending}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              {updateUser.isPending ? "Đang lưu..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
