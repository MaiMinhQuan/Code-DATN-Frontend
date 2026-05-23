"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminSampleEssays, useDeleteSampleEssay } from "@/hooks/useAdminSampleEssays";
import { ConfirmDialog } from "@/components/features/admin/ConfirmDialog";
import type { SampleEssay } from "@/types/sample-essay.types";
import { TargetBand } from "@/types/enums";

const BAND_LABELS: Record<TargetBand, string> = {
  BAND_5_0: "Band 5.0",
  BAND_6_0: "Band 6.0",
  BAND_7_PLUS: "Band 7+",
};

const BAND_COLORS: Record<TargetBand, string> = {
  BAND_5_0: "bg-amber-100 text-amber-700",
  BAND_6_0: "bg-sky-100 text-sky-700",
  BAND_7_PLUS: "bg-emerald-100 text-emerald-700",
};

export function SampleEssaysManager() {
  const router = useRouter();
  const { data: essays = [], isLoading } = useAdminSampleEssays();
  const deleteEssay = useDeleteSampleEssay();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Bài mẫu (Sample Essays)</h2>
          <p className="text-sm text-slate-500">{essays.length} bài mẫu</p>
        </div>
        <button
          onClick={() => router.push("/admin/sample-essays/new")}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Thêm bài mẫu
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : essays.length === 0 ? (
        <div className="rounded-xl bg-white py-12 text-center text-slate-400 ring-1 ring-slate-200">
          Chưa có bài mẫu nào
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Tiêu đề</th>
                <th className="px-4 py-3 text-left">Chủ đề</th>
                <th className="px-4 py-3 text-center">Target Band</th>
                <th className="px-4 py-3 text-center">Band Score</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {essays.map((essay) => (
                <tr key={essay._id} className="hover:bg-slate-50">
                  <td className="max-w-xs px-4 py-3">
                    <p className="font-medium text-slate-900 truncate">{essay.title}</p>
                    {essay.authorName && (
                      <p className="text-xs text-slate-400">{essay.authorName}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{essay.topicId.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BAND_COLORS[essay.targetBand]}`}>
                      {BAND_LABELS[essay.targetBand]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700">
                    {essay.overallBandScore ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      essay.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {essay.isPublished ? "Xuất bản" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/sample-essays/${essay._id}/edit`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(essay._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Xóa bài mẫu"
        message="Bạn có chắc muốn xóa bài mẫu này?"
        onConfirm={() => deleteEssay.mutate(deleteId!, { onSuccess: () => setDeleteId(null) })}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteEssay.isPending}
      />
    </div>
  );
}
