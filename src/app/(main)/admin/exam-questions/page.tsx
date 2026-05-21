"use client";

import { AdminNav } from "@/components/features/admin/AdminNav";
import { ExamQuestionsManager } from "@/components/features/admin/exam-questions/ExamQuestionsManager";

export default function AdminExamQuestionsPage() {
  return (
    <div>
      <AdminNav />
      <ExamQuestionsManager />
    </div>
  );
}
