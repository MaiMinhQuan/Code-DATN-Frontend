"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminNav } from "@/components/features/admin/AdminNav";
import { CourseForm } from "@/components/features/admin/courses/CourseForm";

export default function NewCoursePage() {
  return (
    <div>
      <AdminNav />
      <div className="mb-6">
        <Link href="/admin/courses" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" /> Quay lại danh sách
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Thêm khóa học mới</h1>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <CourseForm />
      </div>
    </div>
  );
}
