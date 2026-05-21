"use client";

import { use } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AdminNav } from "@/components/features/admin/AdminNav";
import { LessonsManager } from "@/components/features/admin/lessons/LessonsManager";
import { useCourse } from "@/hooks/useCourses";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default function AdminLessonsPage({ params }: PageProps) {
  const { courseId } = use(params);
  const { data: course } = useCourse(courseId);

  return (
    <div>
      <AdminNav />
      <div className="mb-4">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại Khóa học
        </Link>
      </div>
      <LessonsManager courseId={courseId} courseTitle={course?.title ?? "..."} />
    </div>
  );
}
