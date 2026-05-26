"use client";

import { use } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AdminNav } from "@/components/features/admin/AdminNav";
import { useAdminUser, useAdminUserSubmissions } from "@/hooks/useAdminUsers";
import { UserRole } from "@/types/enums";
import { SubmissionStatus } from "@/types/enums";

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  [SubmissionStatus.DRAFT]: "bg-slate-100 text-slate-600",
  [SubmissionStatus.SUBMITTED]: "bg-yellow-100 text-yellow-700",
  [SubmissionStatus.PROCESSING]: "bg-blue-100 text-blue-700",
  [SubmissionStatus.COMPLETED]: "bg-emerald-100 text-emerald-700",
  [SubmissionStatus.FAILED]: "bg-red-100 text-red-600",
};

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  [SubmissionStatus.DRAFT]: "Nháp",
  [SubmissionStatus.SUBMITTED]: "Đã nộp",
  [SubmissionStatus.PROCESSING]: "Đang chấm",
  [SubmissionStatus.COMPLETED]: "Hoàn thành",
  [SubmissionStatus.FAILED]: "Lỗi",
};

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function AdminUserDetailPage({ params }: PageProps) {
  const { userId } = use(params);
  const { data: user, isLoading: userLoading } = useAdminUser(userId);
  const {
    data: submissionsData,
    isLoading: subsLoading,
    isError: subsError,
    error: subsErrorDetail,
  } = useAdminUserSubmissions(userId);

  const submissions = submissionsData?.data ?? [];

  return (
    <div>
      <AdminNav />

      <div className="mb-4">
        <Link href="/admin/users"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" />
          Quay lại Người dùng
        </Link>
      </div>

      {/* User info card */}
      {userLoading ? (
        <div className="mb-6 h-32 animate-pulse rounded-2xl bg-slate-200" />
      ) : user && (
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
              {user.fullName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">{user.fullName}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
              <div className="mt-2 flex gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user.role === UserRole.ADMIN ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {user.role}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                }`}>
                  {user.isActive ? "Đang hoạt động" : "Bị khóa"}
                </span>
              </div>
            </div>
            <div className="text-right text-sm text-slate-400">
              <p>Ngày tạo: {new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
              {user.lastLoginAt && (
                <p>Đăng nhập: {new Date(user.lastLoginAt).toLocaleDateString("vi-VN")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submissions */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-slate-900">
          Lịch sử bài nộp ({submissionsData?.total ?? 0})
        </h3>

        {subsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : subsError ? (
          <div className="rounded-xl bg-red-50 py-12 text-center ring-1 ring-red-200">
            <p className="font-medium text-red-700">Không tải được lịch sử bài nộp</p>
            <p className="mt-1 text-sm text-red-600">
              {(subsErrorDetail as Error)?.message ?? "Vui lòng thử tải lại trang."}
            </p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-xl bg-white py-12 text-center text-slate-400 ring-1 ring-slate-200">
            Người dùng chưa nộp bài nào
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Đề thi</th>
                  <th className="px-4 py-3 text-center">Lần thứ</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3 text-center">Band Score</th>
                  <th className="px-4 py-3 text-center">Số từ</th>
                  <th className="px-4 py-3 text-left">Ngày nộp</th>
                  <th className="px-4 py-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50">
                    <td className="max-w-xs px-4 py-3">
                      <p className="font-medium text-slate-900 truncate">
                        {typeof sub.questionId === "object"
                          ? (sub.questionId as any).title ?? "—"
                          : sub.questionId}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">#{sub.attemptNumber}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[sub.status]}`}>
                        {STATUS_LABELS[sub.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-700">
                      {sub.aiResult?.overallBand ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">{sub.wordCount ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(sub.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/submissions/${sub._id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
