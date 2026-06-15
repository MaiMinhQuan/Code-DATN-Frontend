"use client";

import { ExamQuestionForm } from "@/components/features/admin/exam-questions/ExamQuestionForm";
import { UI_TEXT } from "@/constants/ui-text";

const P = UI_TEXT.ADMIN.PAGE_HEADERS;

export default function NewExamQuestionPage() {
  return (
    <div>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">{P.EXAM_NEW_TITLE}</h2>
          <p className="text-sm text-slate-500">{P.EXAM_NEW_SUBTITLE}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <ExamQuestionForm />
        </div>
      </div>
    </div>
  );
}
