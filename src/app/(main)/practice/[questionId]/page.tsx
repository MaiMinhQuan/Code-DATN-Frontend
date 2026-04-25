"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

import { useSubmission } from "@/hooks/useSubmission";
import { AnnotatedEssay } from "@/components/features/practice/AnnotatedEssay";
import { BandScorePanel } from "@/components/features/practice/BandScorePanel";
import { SubmissionStatus } from "@/types/enums";
import { UI_TEXT } from "@/constants/ui-text";
import type { HighlightStrategy } from "@/hooks/useEssayHighlight";

const T = UI_TEXT.RESULT;

function LoadingState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      <p className="text-sm text-slate-500">{T.LOADING}</p>
    </div>
  );
}

function ErrorState({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="h-10 w-10 text-red-400" />
      <p className="text-sm text-slate-500">{message}</p>
      <button
        onClick={onBack}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {T.BTN_BACK}
      </button>
    </div>
  );
}

export default function ResultPage() {
  const { questionId, submissionId } = useParams<{
    questionId: string;
    submissionId: string;
  }>();
  const router = useRouter();

  const [strategy, setStrategy] = useState<HighlightStrategy>("text");

  const { data: submission, isLoading, isError } = useSubmission(submissionId);

  const handleBack = () => router.push(`/practice/${questionId}`);

  if (isLoading) return <LoadingState />;

  if (isError || !submission) {
    return <ErrorState message={T.ERROR_LOAD} onBack={handleBack} />;
  }

  if (submission.status === SubmissionStatus.FAILED) {
    return (
      <ErrorState
        message={submission.errorMessage ?? T.ERROR_FAILED}
        onBack={handleBack}
      />
    );
  }

  if (submission.status !== SubmissionStatus.COMPLETED || !submission.aiResult) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-slate-500">{T.PROCESSING}</p>
      </div>
    );
  }

  const { essayContent, aiResult } = submission;

  return (
    <div className="-m-6" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="absolute right-4 top-2 z-10 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
        <span className="text-xs text-slate-400">{T.STRATEGY_LABEL}</span>
        {(["text", "index"] as HighlightStrategy[]).map((s) => (
          <button
            key={s}
            onClick={() => setStrategy(s)}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
              strategy === s
                ? "bg-indigo-600 text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Allotment>
        <Allotment.Pane minSize={320} preferredSize="50%">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {T.BTN_NEW_PRACTICE}
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-sm font-medium text-slate-700">{T.PANEL_ESSAY}</span>
            </div>

            <div className="min-h-0 flex-1">
              <AnnotatedEssay
                essayContent={essayContent}
                errors={aiResult.errors}
                strategy={strategy}
              />
            </div>
          </div>
        </Allotment.Pane>

        <Allotment.Pane minSize={340}>
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200 px-5 py-3">
              <span className="text-sm font-medium text-slate-700">{T.PANEL_RESULT}</span>
            </div>

            <div className="min-h-0 flex-1">
              <BandScorePanel result={aiResult} />
            </div>
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
