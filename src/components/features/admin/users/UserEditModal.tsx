"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useUpdateUserAdmin } from "@/hooks/useAdminUsers";
import type { User } from "@/types/user.types";
import type { UpdateUserAdminDto } from "@/types/admin.types";
import { UserRole } from "@/types/enums";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN.USERS;
const C = UI_TEXT.ADMIN.COMMON;

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
      reset({ fullName: user.fullName, role: user.role, isActive: user.isActive ? "true" : "false" } as any);
    }
  }, [isOpen, user, reset]);

  const onSubmit = handleSubmit((formData) => {
    if (!user) return;
    const dto = {
      ...formData,
      isActive: (formData.isActive as unknown as string) === "true",
    };
    updateUser.mutate({ id: user._id, dto }, { onSuccess: onClose });
  });

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{T.MODAL_TITLE}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-sm font-medium text-slate-700">{user.email}</p>
          <p className="text-xs text-slate-400">{T.MODAL_EMAIL_HINT}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{T.MODAL_LABEL_NAME}</label>
            <input
              {...register("fullName")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{T.MODAL_LABEL_ROLE}</label>
            <select
              {...register("role")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value={UserRole.STUDENT}>STUDENT</option>
              <option value={UserRole.ADMIN}>ADMIN</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{T.MODAL_LABEL_STATUS}</label>
            <select
              {...register("isActive")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="true">{T.STATUS_ACTIVE}</option>
              <option value="false">{T.STATUS_LOCKED}</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {C.BTN_CANCEL}
            </button>
            <button type="submit" disabled={updateUser.isPending}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              {updateUser.isPending ? C.SAVING : C.BTN_UPDATE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
