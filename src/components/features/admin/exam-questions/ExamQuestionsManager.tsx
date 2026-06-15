"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminExamQuestions, useDeleteExamQuestion } from "@/hooks/useAdminExamQuestions";
import { useTopics } from "@/hooks/useTopics";
import { ConfirmDialog } from "@/components/features/admin/ConfirmDialog";
import type { ExamQuestion } from "@/types/exam-question.types";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN.EXAM_QUESTIONS;
const C = UI_TEXT.ADMIN.COMMON;

const DIFFICULTY_LABELS: Record<number, { label: string; className: string }> = {
  1: { label: T.DIFF_EASY,   className: "bg-emerald-100 text-emerald-700" },
  2: { label: T.DIFF_MEDIUM, className: "bg-amber-100 text-amber-700" },
  3: { label: T.DIFF_HARD,   className: "bg-red-100 text-red-700" },
};

export function ExamQuestionsManager() {
  const router = useRouter();
  const { data: questions = [], isLoading } = useAdminExamQuestions();
  const { data: topics = [] } = useTopics();
  const deleteQuestion = useDeleteExamQuestion();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState("");

  const filtered = useMemo(
    () => topicFilter ? questions.filter((q) => q.topicId?._id === topicFilter) : questions,
    [questions, topicFilter],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{T.PAGE_TITLE}</h2>
          <p className="text-sm text-slate-500">
            {filtered.length}{topicFilter ? `/${questions.length}` : ""} {T.UNIT}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">{C.FILTER_ALL_TOPICS}</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
          <button
            onClick={() => router.push("/admin/exam-questions/new")}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> {T.BTN_ADD}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-white py-12 text-center text-slate-400 ring-1 ring-slate-200">
          {topicFilter ? T.EMPTY_FILTER : T.EMPTY}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">{C.COL_TITLE}</th>
                <th className="px-4 py-3 text-left">{C.COL_TOPIC}</th>
                <th className="px-4 py-3 text-center">{T.COL_DIFFICULTY}</th>
                <th className="px-4 py-3 text-center">{T.COL_ATTEMPTS}</th>
                <th className="px-4 py-3 text-center">{C.COL_STATUS}</th>
                <th className="px-4 py-3 text-right">{C.COL_ACTIONS}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((q) => (
                <tr key={q._id} className="hover:bg-slate-50">
                  <td className="max-w-xs px-4 py-3">
                    <p className="font-medium text-slate-900 truncate">{q.title}</p>
                    <p className="text-xs text-slate-400 truncate">{q.questionPrompt.slice(0, 80)}...</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{q.topicId?.name ?? "N/A"}</td>
                  <td className="px-4 py-3 text-center">
                    {DIFFICULTY_LABELS[q.difficultyLevel] ? (
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_LABELS[q.difficultyLevel].className}`}>
                        {DIFFICULTY_LABELS[q.difficultyLevel].label}
                      </span>
                    ) : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">{q.attemptCount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      q.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {q.isPublished ? C.STATUS_PUBLISHED : C.STATUS_DRAFT}
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
        title={T.DELETE_TITLE}
        message={T.DELETE_MSG}
        onConfirm={() => deleteQuestion.mutate(deleteId!, { onSuccess: () => setDeleteId(null) })}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteQuestion.isPending}
      />
    </div>
  );
}
