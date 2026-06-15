"use client";

import { PipelineRunner } from "@/components/features/admin/pipeline/PipelineRunner";

export default function AdminPipelinePage() {
  return (
    <div>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900">Tạo nội dung tự động</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Tự động tìm kiếm và tổng hợp bài học, thẻ từ vựng, bài mẫu và đề thi IELTS Writing Task 2
          </p>
        </div>
        <PipelineRunner />
      </div>
    </div>
  );
}
