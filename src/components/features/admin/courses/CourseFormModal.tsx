"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useCreateCourse, useUpdateCourse } from "@/hooks/useAdminCourses";
import { useTopics } from "@/hooks/useTopics";
import type { Course } from "@/types/course.types";
import type { CreateCourseDto } from "@/types/admin.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export function CourseFormModal({ isOpen, onClose, course }: Props) {
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const { data: topics = [] } = useTopics();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCourseDto>();

  useEffect(() => {
    if (isOpen) {
      reset(course ? {
        title: course.title,
        description: course.description ?? "",
        topicId: course.topicId._id,
        thumbnailUrl: course.thumbnailUrl ?? "",
        orderIndex: course.orderIndex,
        isPublished: course.isPublished,
        instructorName: course.instructorName ?? "",
      } : { orderIndex: 0, isPublished: true });
    }
  }, [isOpen, course, reset]);

  const onSubmit = handleSubmit((values) => {
    if (course) {
      updateCourse.mutate({ id: course._id, dto: values }, { onSuccess: onClose });
    } else {
      createCourse.mutate(values, { onSuccess: onClose });
    }
  });

  const isPending = createCourse.isPending || updateCourse.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {course ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tên khóa học <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Vui lòng nhập tên" })}
              placeholder="VD: IELTS Writing Band 7+"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Chủ đề <span className="text-red-500">*</span>
            </label>
            <select
              {...register("topicId", { required: "Vui lòng chọn chủ đề" })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">-- Chọn chủ đề --</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            {errors.topicId && <p className="mt-1 text-xs text-red-500">{errors.topicId.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Mô tả</label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Mô tả khóa học..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Giảng viên</label>
              <input
                {...register("instructorName")}
                placeholder="Tên giảng viên"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Thứ tự</label>
              <input
                type="number"
                {...register("orderIndex", { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">URL Thumbnail</label>
            <input
              {...register("thumbnailUrl")}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Trạng thái</label>
            <select
              {...register("isPublished")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="true">Đã xuất bản</option>
              <option value="false">Nháp</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Hủy
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              {isPending ? "Đang lưu..." : course ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
