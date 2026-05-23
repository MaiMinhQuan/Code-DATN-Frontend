"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAdminCourses, useDeleteCourse } from "@/hooks/useAdminCourses";
import { useTopics } from "@/hooks/useTopics";
import { ConfirmDialog } from "@/components/features/admin/ConfirmDialog";
import type { Course } from "@/types/course.types";

export function CoursesManager() {
  const { data: courses = [], isLoading } = useAdminCourses();
  const { data: topics = [] } = useTopics();
  const deleteCourse = useDeleteCourse();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");

  const filtered = useMemo(() => {
    if (!selectedTopicId) return courses;
    return courses.filter((c) => c.topicId._id === selectedTopicId);
  }, [courses, selectedTopicId]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Khóa học (Courses)</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {isLoading ? "Đang tải..." : `${filtered.length} khóa học`}
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Thêm khóa học
        </Link>
      </div>

      {/* Bộ lọc chủ đề */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTopicId("")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            !selectedTopicId
              ? "bg-slate-700 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tất cả
        </button>
        {topics.map((t) => (
          <button
            key={t._id}
            onClick={() => setSelectedTopicId(selectedTopicId === t._id ? "" : t._id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              selectedTopicId === t._id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-white py-16 text-center ring-1 ring-slate-200">
          <p className="font-medium text-slate-500">
            {selectedTopicId ? "Không có khóa học nào thuộc chủ đề này" : "Chưa có khóa học nào"}
          </p>
          {!selectedTopicId && (
            <p className="mt-1 text-sm text-slate-400">Nhấn "Thêm khóa học" để bắt đầu</p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Tên khóa học</th>
                <th className="px-4 py-3 text-left">Chủ đề</th>
                <th className="px-4 py-3 text-center">Bài học</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((course) => (
                <CourseRow
                  key={course._id}
                  course={course}
                  onDelete={() => setDeleteId(course._id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Xóa khóa học"
        message="Bạn có chắc muốn xóa khóa học này?"
        onConfirm={() => deleteCourse.mutate(deleteId!, { onSuccess: () => setDeleteId(null) })}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteCourse.isPending}
      />
    </div>
  );
}

function CourseRow({ course, onDelete }: { course: Course; onDelete: () => void }) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3 font-medium text-slate-900">{course.title}</td>
      <td className="px-4 py-3 text-slate-500">{course.topicId.name}</td>
      <td className="px-4 py-3 text-center text-slate-600">{course.totalLessons}</td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
          course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
        }`}>
          {course.isPublished ? "Xuất bản" : "Nháp"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1">
          <Link
            href={`/admin/courses/${course._id}/edit`}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={onDelete}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
