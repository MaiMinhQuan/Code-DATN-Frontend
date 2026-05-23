"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateCourse, useUpdateCourse } from "@/hooks/useAdminCourses";
import { useTopics } from "@/hooks/useTopics";
import type { Course } from "@/types/course.types";
import type { CreateCourseDto } from "@/types/admin.types";

interface Props {
  course?: Course;
}

export function CourseForm({ course }: Props) {
  const router = useRouter();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const { data: topics = [] } = useTopics();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateCourseDto>();

  useEffect(() => {
    reset(course
      ? { title: course.title, description: course.description ?? "", topicId: course.topicId._id, isPublished: course.isPublished }
      : { title: "", description: "", isPublished: true }
    );
  }, [course, reset]);

  useEffect(() => {
    if (course && topics.length > 0) {
      setValue("topicId", course.topicId._id, { shouldDirty: false });
    }
  }, [course, topics, setValue]);

  const onSubmit = handleSubmit((values) => {
    const payload = {
      ...values,
      isPublished: (values.isPublished as unknown as string) === "true" || values.isPublished === true,
    };
    if (course) {
      updateCourse.mutate({ id: course._id, dto: payload });
    } else {
      createCourse.mutate(payload, {
        onSuccess: (created) => router.push(`/admin/courses/${created._id}/edit`),
      });
    }
  });

  const isPending = createCourse.isPending || updateCourse.isPending;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Tên khóa học */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Tên khóa học <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title", { required: "Vui lòng nhập tên khóa học" })}
          placeholder="VD: IELTS Writing Task 2 — Technology and Society"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Chủ đề + Trạng thái */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Chủ đề <span className="text-red-500">*</span>
          </label>
          <select
            {...register("topicId", { required: "Vui lòng chọn chủ đề" })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">-- Chọn chủ đề --</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
          {errors.topicId && <p className="mt-1.5 text-xs text-red-500">{errors.topicId.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Trạng thái</label>
          <select
            {...register("isPublished")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="true">Đã xuất bản</option>
            <option value="false">Nháp</option>
          </select>
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Mô tả</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Mô tả ngắn về khóa học..."
          className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {isPending ? "Đang lưu..." : course ? "Lưu thay đổi" : "Tạo khóa học"}
        </button>
      </div>
    </form>
  );
}
