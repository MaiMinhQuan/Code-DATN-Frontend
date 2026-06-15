"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { CourseForm } from "@/components/features/admin/courses/CourseForm";
import { ConfirmDialog } from "@/components/features/admin/ConfirmDialog";
import { useAdminCourse } from "@/hooks/useAdminCourses";
import { useAdminLessons, useDeleteLesson } from "@/hooks/useAdminCourses";
import { useState } from "react";
import type { Lesson } from "@/types/course.types";
import { TargetBand } from "@/types/enums";
import { UI_TEXT } from "@/constants/ui-text";

const P = UI_TEXT.ADMIN.PAGE_HEADERS;
const C = UI_TEXT.ADMIN.COMMON;

const BAND_COLORS: Record<TargetBand, string> = {
  BAND_5_0: "bg-amber-100 text-amber-700",
  BAND_6_0: "bg-sky-100 text-sky-700",
  BAND_7_PLUS: "bg-emerald-100 text-emerald-700",
};

const BAND_LABELS: Record<TargetBand, string> = {
  BAND_5_0: "Band 5.0",
  BAND_6_0: "Band 6.0",
  BAND_7_PLUS: "Band 7+",
};

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default function CourseEditPage({ params }: PageProps) {
  const { courseId } = use(params);
  const { data: course, isLoading: courseLoading } = useAdminCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading } = useAdminLessons(courseId);
  const deleteLesson = useDeleteLesson();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div>

      <div className="mb-6">
        <Link href="/admin/courses" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" /> {P.BTN_BACK_LIST}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {courseLoading ? C.LOADING : (course?.title ?? C.BTN_EDIT)}
        </h1>
      </div>

      {/* Course metadata form */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-base font-semibold text-slate-800">{P.COURSE_EDIT_INFO}</h2>
        {courseLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <CourseForm course={course} />
        )}
      </div>

      {/* Lessons list */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            {P.COURSE_LESSONS_SECTION}
            {!lessonsLoading && (
              <span className="ml-2 text-sm font-normal text-slate-400">({lessons.length})</span>
            )}
          </h2>
          <Link
            href={`/admin/courses/${courseId}/lessons/new`}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> {C.BTN_ADD}
          </Link>
        </div>

        {lessonsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : lessons.length === 0 ? (
          <div className="rounded-xl bg-slate-50 py-10 text-center text-slate-400">
            {P.COURSE_LESSONS_EMPTY}
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, idx) => (
              <LessonRow
                key={lesson._id}
                lesson={lesson}
                index={idx + 1}
                courseId={courseId}
                onDelete={() => setDeleteId(lesson._id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title={C.DIALOG_DELETE_TITLE}
        message={C.DIALOG_DELETE_MSG}
        onConfirm={() => deleteLesson.mutate(
          { id: deleteId!, courseId },
          { onSuccess: () => setDeleteId(null) }
        )}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteLesson.isPending}
      />
    </div>
  );
}

function LessonRow({
  lesson, index, courseId, onDelete,
}: {
  lesson: Lesson; index: number; courseId: string; onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
      <span className="w-6 shrink-0 text-center text-sm font-medium text-slate-400">{index}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900">{lesson.title}</p>
        <p className="text-xs text-slate-400">
          {lesson.videos.length} {UI_TEXT.ADMIN.MEDIA.TAB_VIDEOS} · {lesson.vocabularies.length} {UI_TEXT.ADMIN.MEDIA.TAB_VOCAB} · {lesson.grammars.length} {UI_TEXT.ADMIN.MEDIA.TAB_GRAMMAR}
        </p>
      </div>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${BAND_COLORS[lesson.targetBand]}`}>
        {BAND_LABELS[lesson.targetBand]}
      </span>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
        lesson.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}>
        {lesson.isPublished ? C.STATUS_PUBLISHED : C.STATUS_DRAFT}
      </span>
      <div className="flex shrink-0 gap-1">
        <Link
          href={`/admin/courses/${courseId}/lessons/${lesson._id}/edit`}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-indigo-600"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          onClick={onDelete}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
