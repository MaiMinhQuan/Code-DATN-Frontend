"use client";

import { useState } from "react";
import { Pencil, Eye } from "lucide-react";
import Link from "next/link";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { UserEditModal } from "./UserEditModal";
import type { User } from "@/types/user.types";
import { UserRole } from "@/types/enums";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN.USERS;
const C = UI_TEXT.ADMIN.COMMON;

const ROLE_STYLES: Record<UserRole, string> = {
  [UserRole.ADMIN]: "bg-red-100 text-red-700",
  [UserRole.STUDENT]: "bg-indigo-100 text-indigo-700",
};

export function UsersManager() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers({ page, limit: 20 });

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{T.PAGE_TITLE}</h2>
          <p className="text-sm text-slate-500">{pagination?.total ?? 0} {T.UNIT}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">{T.COL_USER}</th>
                <th className="px-4 py-3 text-left">{T.COL_EMAIL}</th>
                <th className="px-4 py-3 text-center">{T.COL_ROLE}</th>
                <th className="px-4 py-3 text-center">{C.COL_STATUS}</th>
                <th className="px-4 py-3 text-left">{T.COL_CREATED_AT}</th>
                <th className="px-4 py-3 text-right">{C.COL_ACTIONS}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {user.fullName?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      <p className="font-medium text-slate-900">{user.fullName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_STYLES[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                    }`}>
                      {user.isActive ? T.STATUS_ACTIVE : T.STATUS_LOCKED}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination && pagination.totalPage > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
              <p className="text-sm text-slate-500">
                {T.PAGINATION_LABEL(pagination.page, pagination.totalPage)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50"
                >
                  {T.BTN_PREV}
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPage, p + 1))}
                  disabled={page === pagination.totalPage}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50"
                >
                  {T.BTN_NEXT}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <UserEditModal isOpen={!!editingUser} onClose={() => setEditingUser(null)} user={editingUser} />
    </div>
  );
}
