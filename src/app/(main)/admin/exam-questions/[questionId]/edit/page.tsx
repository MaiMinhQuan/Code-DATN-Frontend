"use client";

import { use } from "react";
import { ExamQuestionForm } from "@/components/features/admin/exam-questions/ExamQuestionForm";
import { useAdminExamQuestion } from "@/hooks/useAdminExamQuestions";
import { UI_TEXT } from "@/constants/ui-text";

const P = UI_TEXT.ADMIN.PAGE_HEADERS;
const C = UI_TEXT.ADMIN.COMMON;

interface Props {
  params: Promise<{ questionId: string }>;
}

export default function EditExamQuestionPage({ params }: Props) {
  const { questionId } = use(params);
  const { data: question, isLoading } = useAdminExamQuestion(questionId);

  return (
    <div>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">{P.EXAM_EDIT_TITLE}</h2>
          <p className="text-sm text-slate-500 truncate">{question?.title ?? C.LOADING}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-200" />
              ))}
            </div>
          ) : question ? (
            <ExamQuestionForm question={question} />
          ) : (
            <p className="text-sm text-slate-500">{P.EXAM_NOT_FOUND}</p>
          )}
        </div>
      </div>
    </div>
  );
}
