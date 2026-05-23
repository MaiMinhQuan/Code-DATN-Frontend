"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminNav } from "@/components/features/admin/AdminNav";
import { SampleEssayForm } from "@/components/features/admin/sample-essays/SampleEssayForm";
import { useAdminSampleEssay } from "@/hooks/useAdminSampleEssays";

export default function EditSampleEssayPage({
  params,
}: {
  params: Promise<{ essayId: string }>;
}) {
  const { essayId } = use(params);
  const { data: essay, isLoading } = useAdminSampleEssay(essayId);

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
          <h1 className="text-xl font-semibold text-slate-900">
            {isLoading ? "Đang tải..." : `Chỉnh sửa: ${essay?.title ?? ""}`}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Chỉnh sửa nội dung và highlight annotations
          </p>
        </div>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : essay ? (
          <SampleEssayForm essay={essay} />
        ) : null}
      </div>
    </div>
  );
}
