"use client";

import { AdminNav } from "@/components/features/admin/AdminNav";
import { ExamQuestionForm } from "@/components/features/admin/exam-questions/ExamQuestionForm";

export default function NewExamQuestionPage() {
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Thêm đề thi mới</h2>
          <p className="text-sm text-slate-500">Điền thông tin để tạo đề thi IELTS Writing Task 2</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <ExamQuestionForm />
        </div>
      </div>
    </div>
  );
}
