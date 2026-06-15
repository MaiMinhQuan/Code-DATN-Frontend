"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LessonForm } from "@/components/features/admin/lessons/LessonForm";
import { LessonMediaManager } from "@/components/features/admin/lessons/LessonMediaManager";
import { useAdminLessonDetail, useAdminCourse } from "@/hooks/useAdminCourses";

interface PageProps {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default function LessonEditPage({ params }: PageProps) {
  const { courseId, lessonId } = use(params);
  const { data: course } = useAdminCourse(courseId);
  const { data: lesson, isLoading } = useAdminLessonDetail(lessonId);

  return (
    <div>

      <div className="mb-6">
        <Link
          href={`/admin/courses/${courseId}/edit`}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
          {course ? course.title : "Quay lại khóa học"}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {isLoading ? "Đang tải..." : (lesson?.title ?? "Chỉnh sửa bài học")}
        </h1>
      </div>

      {/* Lesson metadata form */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-base font-semibold text-slate-800">Thông tin bài học</h2>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <LessonForm lesson={lesson} courseId={courseId} />
        )}
      </div>

      {/* Media content tabs */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-slate-800">Nội dung bài học</h2>
        <LessonMediaManager lessonId={lessonId} />
      </div>
    </div>
  );
}
