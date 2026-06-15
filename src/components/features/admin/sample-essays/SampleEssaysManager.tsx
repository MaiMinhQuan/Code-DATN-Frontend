"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminSampleEssays, useDeleteSampleEssay } from "@/hooks/useAdminSampleEssays";
import { useTopics } from "@/hooks/useTopics";
import { ConfirmDialog } from "@/components/features/admin/ConfirmDialog";
import { formatBandScore, getBandBadgeStyle } from "@/lib/sample-essay-band";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN.SAMPLE_ESSAYS;
const C = UI_TEXT.ADMIN.COMMON;

export function SampleEssaysManager() {
  const router = useRouter();
  const { data: essays = [], isLoading } = useAdminSampleEssays();
  const { data: topics = [] } = useTopics();
  const deleteEssay = useDeleteSampleEssay();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState("");

  const filtered = useMemo(
    () => topicFilter ? essays.filter((e) => e.topicId._id === topicFilter) : essays,
    [essays, topicFilter],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{T.PAGE_TITLE}</h2>
          <p className="text-sm text-slate-500">
            {filtered.length}{topicFilter ? `/${essays.length}` : ""} {T.UNIT}
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
            onClick={() => router.push("/admin/sample-essays/new")}
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
                <th className="px-4 py-3 text-center">{T.COL_BAND}</th>
                <th className="px-4 py-3 text-center">{C.COL_STATUS}</th>
                <th className="px-4 py-3 text-right">{C.COL_ACTIONS}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((essay) => (
                <tr key={essay._id} className="hover:bg-slate-50">
                  <td className="max-w-xs px-4 py-3">
                    <p className="font-medium text-slate-900 truncate">{essay.title}</p>
                    {essay.authorName && (
                      <p className="text-xs text-slate-400">{essay.authorName}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{essay.topicId.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                        getBandBadgeStyle(essay.overallBandScore ?? 0),
                      )}
                    >
                      {formatBandScore(essay.overallBandScore)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      essay.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {essay.isPublished ? C.STATUS_PUBLISHED : C.STATUS_DRAFT}
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
        title={T.DELETE_TITLE}
        message={T.DELETE_MSG}
        onConfirm={() => deleteEssay.mutate(deleteId!, { onSuccess: () => setDeleteId(null) })}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteEssay.isPending}
      />
    </div>
  );
}
