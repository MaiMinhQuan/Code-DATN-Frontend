"use client";

import { useState } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { ArrowLeft } from "lucide-react";
import { AnnotatedEssay } from "@/components/features/practice/AnnotatedEssay";
import { BandScorePanel } from "@/components/features/practice/BandScorePanel";
import type { Submission } from "@/types/submission.types";

interface SubmissionQuestionInfo {
  title?: string;
  questionPrompt?: string;
}

interface SubmissionStudentMeta {
  fullName?: string;
  email?: string;
}

interface SubmissionDetailViewProps {
  submission: Submission;
  question?: SubmissionQuestionInfo;
  mode: "student" | "admin";
  backLabel: string;
  onBack: () => void;
  onRetry?: () => void;
  studentMeta?: SubmissionStudentMeta;
}

export function SubmissionDetailView({
  submission,
  question,
  mode,
  backLabel,
  onBack,
  onRetry,
  studentMeta,
}: SubmissionDetailViewProps) {
  const [activeErrorId, setActiveErrorId] = useState<string | null>(null);
  const aiResult = submission.aiResult;

  return (
    <div className={mode === "student" ? "-m-6" : ""} style={{ height: "calc(100vh - 4rem)" }}>
      {/* Chia đôi màn hình — bài viết (trái) | điểm và phản hồi (phải) */}
      <Allotment>
        {/* Cột trái — bài viết có highlight lỗi */}
        <Allotment.Pane minSize={320} preferredSize="55%">
          <div className="flex h-full flex-col overflow-hidden">
            {/* Thanh trên — quay lại, làm lại, tên đề */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-3 shrink-0">
              {/* Nút quay lại */}
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {backLabel}
              </button>

              {/* Nút làm lại — chỉ học viên */}
              {mode === "student" && onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Làm lại
                </button>
              )}

              <span className="mx-1 text-[var(--border)]">|</span>
              {/* Tiêu đề đề bài */}
              <span className="truncate text-sm font-medium text-[var(--foreground)]">
                {question?.title ?? "Kết quả bài viết"}
              </span>
            </div>

            {/* Thông tin học viên — chỉ admin */}
            {mode === "admin" && studentMeta && (
              <div className="shrink-0 border-b border-border bg-muted/30 px-5 py-2">
                <p className="text-xs text-muted-foreground">
                  Học viên: {studentMeta.fullName ?? "—"} ({studentMeta.email ?? "—"})
                </p>
              </div>
            )}

            {/* Đoạn đề bài rút gọn */}
            {question?.questionPrompt && (
              <div className="shrink-0 border-b border-border bg-muted/40 px-5 py-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Đề bài</p>
                <p className="line-clamp-3 text-sm leading-relaxed text-foreground">
                  {question.questionPrompt}
                </p>
              </div>
            )}

            {/* Nội dung bài viết — highlight lỗi */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <AnnotatedEssay
                text={submission.essayContent}
                errors={aiResult?.errors ?? []}
                activeErrorId={activeErrorId}
                onErrorClick={setActiveErrorId}
              />
            </div>
          </div>
        </Allotment.Pane>

        {/* Cột phải — điểm band và phản hồi AI */}
        <Allotment.Pane minSize={320}>
          <div className="h-full overflow-y-auto">
            {/* Có kết quả → panel điểm; chưa có → thông báo trống */}
            {aiResult ? (
              <BandScorePanel
                aiResult={aiResult}
                activeErrorId={activeErrorId}
                onErrorSelect={setActiveErrorId}
              />
            ) : (
              <div className="p-6">
                {/* Chưa có kết quả chấm */}
                <h3 className="text-base font-semibold text-foreground">Kết quả chấm AI</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Bài nộp này chưa có kết quả AI hoặc chưa hoàn thành chấm điểm.
                </p>
              </div>
            )}
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
