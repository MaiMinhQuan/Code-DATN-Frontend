"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminNav } from "@/components/features/admin/AdminNav";
import { SampleEssayForm } from "@/components/features/admin/sample-essays/SampleEssayForm";

export default function NewSampleEssayPage() {
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/admin/sample-essays"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">Thêm bài mẫu mới</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Tạo bài mẫu IELTS Writing Task 2 với highlight annotations
          </p>
        </div>
        <SampleEssayForm />
      </div>
    </div>
  );
}
