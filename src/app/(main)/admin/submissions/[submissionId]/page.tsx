"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAdminSubmissionDetail } from "@/hooks/useAdminUsers";
import { SubmissionDetailView } from "@/components/features/submissions/SubmissionDetailView";

interface PageProps {
  params: Promise<{ submissionId: string }>;
}

export default function AdminSubmissionDetailPage({ params }: PageProps) {
  const { submissionId } = use(params);
  const router = useRouter();
  const { data: submission, isLoading, isError, error } = useAdminSubmissionDetail(submissionId);

  if (isLoading) {
    return (
      <div>
        <div className="space-y-3">
          <div className="h-10 w-56 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (isError || !submission) {
    return (
      <div>
        <div className="rounded-2xl bg-red-50 p-6 ring-1 ring-red-200">
          <h2 className="text-lg font-semibold text-red-700">Không tải được chi tiết bài nộp</h2>
          <p className="mt-2 text-sm text-red-600">
            {(error as Error)?.message ?? "Vui lòng thử lại sau."}
          </p>
        </div>
      </div>
    );
  }

  const user = (submission.userId ?? {}) as any;
  const question = (submission.questionId ?? {}) as any;
  const userId = typeof user._id === "string" ? user._id : "";

  return (
    <div>

      <SubmissionDetailView
        submission={submission}
        question={{ title: question.title, questionPrompt: question.questionPrompt }}
        mode="admin"
        backLabel="Quay lại chi tiết học viên"
        onBack={() => router.push(userId ? `/admin/users/${userId}` : "/admin/users")}
        studentMeta={{ fullName: user.fullName, email: user.email }}
      />
    </div>
  );
}
