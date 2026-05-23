"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminNav } from "@/components/features/admin/AdminNav";
import { LessonForm } from "@/components/features/admin/lessons/LessonForm";
import { useAdminCourse } from "@/hooks/useAdminCourses";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default function NewLessonPage({ params }: PageProps) {
  const { courseId } = use(params);
  const { data: course } = useAdminCourse(courseId);

  return (
    <div>
      <AdminNav />
      <div className="mb-6">
        <Link
          href={`/admin/courses/${courseId}/edit`}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
          {course ? course.title : "Quay lại khóa học"}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Thêm bài học mới</h1>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <LessonForm courseId={courseId} />
      </div>
    </div>
  );
}
