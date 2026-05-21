"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useCreateLesson, useUpdateLesson } from "@/hooks/useAdminCourses";
import type { Lesson } from "@/types/course.types";
import type { CreateLessonDto } from "@/types/admin.types";
import { TargetBand } from "@/types/enums";

const TARGET_BAND_LABELS: Record<TargetBand, string> = {
  BAND_5_0: "Band 5.0",
  BAND_6_0: "Band 6.0",
  BAND_7_PLUS: "Band 7+",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  courseId: string;
}

export function LessonFormModal({ isOpen, onClose, lesson, courseId }: Props) {
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateLessonDto>();

  useEffect(() => {
    if (isOpen) {
      reset(lesson ? {
        title: lesson.title,
        courseId,
        targetBand: lesson.targetBand,
        description: lesson.description ?? "",
        orderIndex: lesson.orderIndex,
        isPublished: lesson.isPublished,
        notesContent: lesson.notesContent ?? "",
      } : { courseId, targetBand: TargetBand.BAND_6_0, orderIndex: 0, isPublished: true });
    }
  }, [isOpen, lesson, courseId, reset]);

  const onSubmit = handleSubmit((values) => {
    if (lesson) {
      updateLesson.mutate({ id: lesson._id, dto: values, courseId }, { onSuccess: onClose });
    } else {
      createLesson.mutate(values, { onSuccess: onClose });
    }
  });

  const isPending = createLesson.isPending || updateLesson.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {lesson ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tên bài học <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Vui lòng nhập tên" })}
              placeholder="VD: Task Response — Cách phân tích đề"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Target Band</label>
              <select
                {...register("targetBand")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {Object.entries(TARGET_BAND_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Mô tả</label>
            <textarea
              {...register("description")}
              rows={2}
              placeholder="Mô tả bài học..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nội dung ghi chú (Markdown)</label>
            <textarea
              {...register("notesContent")}
              rows={4}
              placeholder="## Heading\n\nNội dung bài học..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Trạng thái</label>
            <select
              {...register("isPublished")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="true">Xuất bản</option>
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
              {isPending ? "Đang lưu..." : lesson ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
