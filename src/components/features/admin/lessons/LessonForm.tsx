"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateLesson, useUpdateLesson } from "@/hooks/useAdminCourses";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import type { LessonDetail } from "@/types/course.types";
import type { CreateLessonDto } from "@/types/admin.types";
import { TargetBand } from "@/types/enums";

const BAND_LABELS: Record<TargetBand, string> = {
  BAND_5_0: "Band 5.0",
  BAND_6_0: "Band 6.0",
  BAND_7_PLUS: "Band 7+",
};

interface Props {
  lesson?: LessonDetail;
  courseId: string;
}

export function LessonForm({ lesson, courseId }: Props) {
  const router = useRouter();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateLessonDto>();

  useEffect(() => {
    reset(lesson
      ? { title: lesson.title, courseId, targetBand: lesson.targetBand, isPublished: lesson.isPublished, notesContent: lesson.notesContent ?? "" }
      : { title: "", courseId, targetBand: TargetBand.BAND_6_0, isPublished: true, notesContent: "" }
    );
  }, [lesson, courseId, reset]);

  const onSubmit = handleSubmit((values) => {
    const payload = {
      ...values,
      courseId,
      isPublished: (values.isPublished as unknown as string) === "true" || values.isPublished === true,
    };
    if (lesson) {
      const { courseId: _cid, ...updateDto } = payload;
      updateLesson.mutate({ id: lesson._id, dto: updateDto, courseId });
    } else {
      createLesson.mutate(payload, {
        onSuccess: () => {
          router.push(`/admin/courses/${courseId}/edit`);
        },
      });
    }
  });

  const isPending = createLesson.isPending || updateLesson.isPending;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Tên bài học */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Tên bài học <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title", { required: "Vui lòng nhập tên bài học" })}
          placeholder="VD: Task Response — Cách phân tích đề bài"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Target Band + Trạng thái */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Target Band</label>
          <select
            {...register("targetBand")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {Object.entries(BAND_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Trạng thái</label>
          <select
            {...register("isPublished")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="true">Xuất bản</option>
            <option value="false">Nháp</option>
          </select>
        </div>
      </div>

      {/* Ghi chú bài học */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Ghi chú bài học
        </label>
        <Controller
          name="notesContent"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              minHeight="14rem"
            />
          )}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {isPending ? "Đang lưu..." : lesson ? "Lưu thay đổi" : "Tạo bài học"}
        </button>
      </div>
    </form>
  );
}
