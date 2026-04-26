"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { toast } from "sonner";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { useExamQuestion } from "@/hooks/useExamQuestion";
import { useCreateDraft, useSubmitEssay } from "@/hooks/useSubmission";
import { useSubmissionSocket } from "@/hooks/useSubmissionSocket";
import { useSubmissionStore } from "@/stores/submission.store";
import { QuestionPanel } from "@/components/features/practice/QuestionPanel";
import { EssayEditor } from "@/components/features/practice/EssayEditor";
import { GradingProgress } from "@/components/features/practice/GradingProgress";
import { UI_TEXT } from "@/constants/ui-text";
import { SubmissionStatus } from "@/types/enums";
import { cn } from "@/lib/utils";


export default function PracticeDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const router = useRouter();

  const [essayContent, setEssayContent] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { gradingStatus, reset } = useSubmissionStore();
  const isGrading =
    gradingStatus === SubmissionStatus.SUBMITTED ||
    gradingStatus === SubmissionStatus.PROCESSING;

  const { data: question, isLoading, isError } = useExamQuestion(questionId);
  const createDraft = useCreateDraft();
  const submitEssay = useSubmitEssay();

  const isMutating = createDraft.isPending || submitEssay.isPending;
  const disabled = isGrading || isMutating;

  useSubmissionSocket(submissionId, {
    onCompleted: (id) => router.push(`/practice/${questionId}/result/${id}`),
    onFailed: (_, msg) => toast.error(msg ?? UI_TEXT.PRACTICE.GRADING_FAILED),
  });

  useEffect(() => () => reset(), [reset]);

  const handleSubmit = useCallback(async () => {
    if (!essayContent.trim()) return;
    try {
      let id = submissionId;
      if (!id) {
        const s = await createDraft.mutateAsync({ questionId, essayContent });
        id = s._id;
        setSubmissionId(id);
      }
      await submitEssay.mutateAsync(id);
    } catch {
      toast.error("Nộp bài thất bại, vui lòng thử lại.");
    }
  }, [submissionId, essayContent, questionId, createDraft, submitEssay]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (isError || !question) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-sm text-[var(--muted-foreground)]">
          Không thể tải đề thi. Vui lòng thử lại.
        </p>
      </div>
    );
  }

  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Header bar */}
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--card)] px-4">
        <button
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["submissions"] });
            router.push("/practice");
          }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5",
            "text-xs font-medium text-[var(--muted-foreground)]",
            "transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại
        </button>
        <div className="h-4 w-px bg-[var(--border)]" />
        <span className="truncate text-sm font-medium text-[var(--foreground)]">
          {question.title}
        </span>
      </div>

      {/* Split-screen editor */}
      <div className="min-h-0 flex-1">
        <Allotment>
          <Allotment.Pane minSize={300} preferredSize="42%">
            <QuestionPanel question={question} />
          </Allotment.Pane>

          <Allotment.Pane minSize={380}>
            <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
              <EssayEditor
                value={essayContent}
                onChange={setEssayContent}
                disabled={disabled}
              />

              <GradingProgress />

              <div className="pb-2">
                <button
                  onClick={handleSubmit}
                  disabled={disabled || !essayContent.trim()}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg",
                    "bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white",
                    "transition-colors hover:bg-indigo-700",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  {isMutating && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isGrading
                    ? UI_TEXT.PRACTICE.BTN_SUBMITTING
                    : UI_TEXT.PRACTICE.BTN_SUBMIT}
                </button>
              </div>
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
}
