"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

import { useExamQuestion } from "@/hooks/useExamQuestion";
import {
  useCreateDraft,
  useUpdateDraft,
  useSubmitEssay,
} from "@/hooks/useSubmission";
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
  const [draftId, setDraftId] = useState<string | null>(null);

  const { gradingStatus, reset } = useSubmissionStore();
  const isGrading =
    gradingStatus === SubmissionStatus.SUBMITTED ||
    gradingStatus === SubmissionStatus.PROCESSING;

  const { data: question, isLoading, isError } = useExamQuestion(questionId);
  const createDraft = useCreateDraft();
  const updateDraft = useUpdateDraft();
  const submitEssay = useSubmitEssay();

  const isMutating =
    createDraft.isPending || updateDraft.isPending || submitEssay.isPending;
  const disabled = isGrading || isMutating;

  // Socket luôn kết nối, filter theo draftId (null = bỏ qua tất cả events)
  useSubmissionSocket(draftId, {
    onCompleted: (id) => router.push(`/practice/${questionId}/result/${id}`),
    onFailed: (_, msg) => toast.error(msg ?? UI_TEXT.PRACTICE.GRADING_FAILED),
  });

  // Reset store khi rời trang
  useEffect(() => () => reset(), [reset]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSaveDraft = useCallback(async () => {
    if (!essayContent.trim()) return;
    try {
      if (!draftId) {
        const s = await createDraft.mutateAsync({ questionId, essayContent });
        setDraftId(s._id);
      } else {
        await updateDraft.mutateAsync({ id: draftId, dto: { essayContent } });
      }
      toast.success(UI_TEXT.PRACTICE.DRAFT_SAVED);
    } catch {
      toast.error("Lưu nháp thất bại, vui lòng thử lại.");
    }
  }, [draftId, essayContent, questionId, createDraft, updateDraft]);

  const handleSubmit = useCallback(async () => {
    if (!essayContent.trim()) return;
    try {
      let id = draftId;
      if (!id) {
        const s = await createDraft.mutateAsync({ questionId, essayContent });
        id = s._id;
        setDraftId(id);
      } else {
        await updateDraft.mutateAsync({ id, dto: { essayContent } });
      }
      await submitEssay.mutateAsync(id);
    } catch {
      toast.error("Nộp bài thất bại, vui lòng thử lại.");
    }
  }, [draftId, essayContent, questionId, createDraft, updateDraft, submitEssay]);

  // ── Loading / Error states ─────────────────────────────────────────────────

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

  // ── Main layout ────────────────────────────────────────────────────────────

  return (
    <div className="-m-6" style={{ height: "calc(100vh - 4rem)" }}>
      <Allotment>
        {/* Panel trái: Đề bài */}
        <Allotment.Pane minSize={300} preferredSize="42%">
          <QuestionPanel question={question} />
        </Allotment.Pane>

        {/* Panel phải: Editor + Actions */}
        <Allotment.Pane minSize={380}>
          <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
            <EssayEditor
              value={essayContent}
              onChange={setEssayContent}
              disabled={disabled}
            />

            <GradingProgress />

            <ActionBar
              onSave={handleSaveDraft}
              onSubmit={handleSubmit}
              isSaving={
                updateDraft.isPending ||
                (createDraft.isPending && !submitEssay.isPending)
              }
              isSubmitting={submitEssay.isPending || isGrading}
              disabled={disabled || !essayContent.trim()}
            />
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

// ── ActionBar (local component, không cần tách file) ──────────────────────────

interface ActionBarProps {
  onSave: () => void;
  onSubmit: () => void;
  isSaving: boolean;
  isSubmitting: boolean;
  disabled: boolean;
}

function ActionBar({
  onSave,
  onSubmit,
  isSaving,
  isSubmitting,
  disabled,
}: ActionBarProps) {
  return (
    <div className="flex gap-3 pb-2">
      <button
        onClick={onSave}
        disabled={disabled}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-lg",
          "border border-[var(--border)] bg-[var(--card)]",
          "px-4 py-2.5 text-sm font-medium text-[var(--foreground)]",
          "transition-colors hover:bg-[var(--muted)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSaving ? "Đang lưu..." : UI_TEXT.PRACTICE.BTN_SAVE_DRAFT}
      </button>

      <button
        onClick={onSubmit}
        disabled={disabled}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-lg",
          "bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white",
          "transition-colors hover:bg-indigo-700",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting
          ? UI_TEXT.PRACTICE.BTN_SUBMITTING
          : UI_TEXT.PRACTICE.BTN_SUBMIT}
      </button>
    </div>
  );
}
