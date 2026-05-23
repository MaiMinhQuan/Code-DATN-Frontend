"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminExamQuestions, useDeleteExamQuestion } from "@/hooks/useAdminExamQuestions";
import { ConfirmDialog } from "@/components/features/admin/ConfirmDialog";
import type { ExamQuestion } from "@/types/exam-question.types";

const DIFFICULTY_LABELS: Record<number, { label: string; className: string }> = {
  1: { label: "Dễ", className: "bg-emerald-100 text-emerald-700" },
  2: { label: "Trung bình", className: "bg-amber-100 text-amber-700" },
  3: { label: "Khó", className: "bg-red-100 text-red-700" },
};

export function ExamQuestionsManager() {
  const router = useRouter();
  const { data: questions = [], isLoading } = useAdminExamQuestions();
  const deleteQuestion = useDeleteExamQuestion();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Đề thi (Exam Questions)</h2>
          <p className="text-sm text-slate-500">{questions.length} đề thi</p>
        </div>
        <button
          onClick={() => router.push("/admin/exam-questions/new")}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Thêm đề thi
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-xl bg-white py-12 text-center text-slate-400 ring-1 ring-slate-200">
          Chưa có đề thi nào
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Tiêu đề</th>
                <th className="px-4 py-3 text-left">Chủ đề</th>
                <th className="px-4 py-3 text-center">Độ khó</th>
                <th className="px-4 py-3 text-center">Lượt làm</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {questions.map((q) => (
                <tr key={q._id} className="hover:bg-slate-50">
                  <td className="max-w-xs px-4 py-3">
                    <p className="font-medium text-slate-900 truncate">{q.title}</p>
                    <p className="text-xs text-slate-400 truncate">{q.questionPrompt.slice(0, 80)}...</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{q.topicId?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-center">
                    {DIFFICULTY_LABELS[q.difficultyLevel] ? (
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_LABELS[q.difficultyLevel].className}`}>
                        {DIFFICULTY_LABELS[q.difficultyLevel].label}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">{q.attemptCount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      q.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {q.isPublished ? "Xuất bản" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/exam-questions/${q._id}/edit`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(q._id)}
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
        title="Xóa đề thi"
        message="Bạn có chắc muốn xóa đề thi này?"
        onConfirm={() => deleteQuestion.mutate(deleteId!, { onSuccess: () => setDeleteId(null) })}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteQuestion.isPending}
      />
    </div>
  );
}
