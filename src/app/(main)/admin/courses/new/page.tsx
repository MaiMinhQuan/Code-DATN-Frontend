"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CourseForm } from "@/components/features/admin/courses/CourseForm";
import { UI_TEXT } from "@/constants/ui-text";

const P = UI_TEXT.ADMIN.PAGE_HEADERS;
const C = UI_TEXT.ADMIN.COMMON;

export default function NewCoursePage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/courses" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" /> {P.BTN_BACK_LIST}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{P.COURSE_NEW_TITLE}</h1>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <CourseForm />
      </div>
    </div>
  );
}
