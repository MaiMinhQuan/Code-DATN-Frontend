"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useAdminLessons, useDeleteLesson } from "@/hooks/useAdminCourses";
import { ConfirmDialog } from "@/components/features/admin/ConfirmDialog";
import { LessonFormModal } from "./LessonFormModal";
import { LessonMediaManager } from "./LessonMediaManager";
import type { Lesson } from "@/types/course.types";
import { TargetBand } from "@/types/enums";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN.LESSONS;
const C = UI_TEXT.ADMIN.COMMON;

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

interface Props {
  courseId: string;
  courseTitle: string;
}

export function LessonsManager({ courseId, courseTitle }: Props) {
  const { data: lessons = [], isLoading } = useAdminLessons(courseId);
  const deleteLesson = useDeleteLesson();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleEdit = (lesson: Lesson) => { setEditingLesson(lesson); setModalOpen(true); };
  const handleCreate = () => { setEditingLesson(null); setModalOpen(true); };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{T.PAGE_TITLE_PREFIX}: {courseTitle}</h2>
          <p className="text-sm text-slate-500">{lessons.length} {T.UNIT}</p>
        </div>
        <button onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> {T.BTN_ADD}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <div className="rounded-xl bg-white py-12 text-center text-slate-400 ring-1 ring-slate-200">
          {T.EMPTY}
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div key={lesson._id} className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
              {/* Row bài học */}
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() => setExpandedId(expandedId === lesson._id ? null : lesson._id)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {expandedId === lesson._id
                    ? <ChevronDown className="h-4 w-4" />
                    : <ChevronRight className="h-4 w-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{lesson.title}</p>
                  <p className="text-xs text-slate-500">
                    {lesson.videos.length} {T.COUNT_VIDEO} · {lesson.vocabularies.length} {T.COUNT_VOCAB} · {lesson.grammars.length} {T.COUNT_GRAMMAR}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BAND_COLORS[lesson.targetBand]}`}>
                  {BAND_LABELS[lesson.targetBand]}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  lesson.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {lesson.isPublished ? C.STATUS_PUBLISHED : C.STATUS_DRAFT}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(lesson)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(lesson._id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expanded: Media manager */}
              {expandedId === lesson._id && (
                <div className="border-t border-slate-100 px-4 pb-4">
                  <LessonMediaManager lessonId={lesson._id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <LessonFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lesson={editingLesson}
        courseId={courseId}
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={T.DELETE_TITLE}
        message={T.DELETE_MSG}
        onConfirm={() => deleteLesson.mutate({ id: deleteTarget!, courseId }, { onSuccess: () => setDeleteTarget(null) })}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteLesson.isPending}
      />
    </div>
  );
}
