"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import Link from "next/link";
import { useAdminCourses, useDeleteCourse } from "@/hooks/useAdminCourses";
import { ConfirmDialog } from "@/components/features/admin/ConfirmDialog";
import { CourseFormModal } from "./CourseFormModal";
import type { Course } from "@/types/course.types";

export function CoursesManager() {
  const { data: courses = [], isLoading } = useAdminCourses();
  const deleteCourse = useDeleteCourse();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (course: Course) => { setEditingCourse(course); setModalOpen(true); };
  const handleCreate = () => { setEditingCourse(null); setModalOpen(true); };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Khóa học (Courses)</h2>
          <p className="text-sm text-slate-500">{courses.length} khóa học</p>
        </div>
        <button onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Thêm khóa học
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl bg-white py-12 text-center text-slate-400 ring-1 ring-slate-200">
          Chưa có khóa học nào
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Tên khóa học</th>
                <th className="px-4 py-3 text-left">Chủ đề</th>
                <th className="px-4 py-3 text-left">Giảng viên</th>
                <th className="px-4 py-3 text-center">Lessons</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{course.title}</td>
                  <td className="px-4 py-3 text-slate-600">{course.topicId.name}</td>
                  <td className="px-4 py-3 text-slate-500">{course.instructorName ?? "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/admin/courses/${course._id}/lessons`}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      {course.totalLessons}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {course.isPublished ? "Xuất bản" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(course)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(course._id)}
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

      <CourseFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} course={editingCourse} />
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
