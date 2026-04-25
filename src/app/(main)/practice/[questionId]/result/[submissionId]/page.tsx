"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

import { useSubmission } from "@/hooks/useSubmission"
import { useExamQuestion } from "@/hooks/useExamQuestion"
import { AnnotatedEssay } from "@/components/features/practice/AnnotatedEssay"
import { BandScorePanel } from "@/components/features/practice/BandScorePanel"
import { UI_TEXT } from "@/constants/ui-text"
import { SubmissionStatus } from "@/types/enums"

const T = UI_TEXT.RESULT

export default function ResultPage() {
  const { questionId, submissionId } = useParams<{
    questionId: string
    submissionId: string
  }>()
  const router = useRouter()

  // State bridge: sync highlight giữa 2 panel
  const [activeErrorId, setActiveErrorId] = useState<string | null>(null)

  const { data: submission, isLoading, isError } = useSubmission(submissionId)
  const { data: question } = useExamQuestion(questionId)

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────

  if (isError || !submission) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-sm text-muted-foreground">{T.RESULT_NOT_FOUND}</p>
        <button
          onClick={() => router.push(`/practice/${questionId}`)}
          className="text-sm text-primary hover:underline"
        >
          Quay lại
        </button>
      </div>
    )
  }

  // ── Chưa có kết quả AI (navigate trực tiếp khi chưa COMPLETED) ──────────────

  if (!submission.aiResult || submission.status !== SubmissionStatus.COMPLETED) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{T.RESULT_LOADING}</p>
      </div>
    )
  }

  // ── Main layout ─────────────────────────────────────────────────────────────

  return (
    <div className="-m-6" style={{ height: "calc(100vh - 4rem)" }}>
      <Allotment>

        {/* Panel trái: Đề bài + Essay có annotation */}
        <Allotment.Pane minSize={320} preferredSize="55%">
          <div className="flex h-full flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-3 shrink-0">
              <button
                onClick={() => router.push(`/practice/${questionId}`)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Làm lại
              </button>
              <span className="text-muted-foreground">·</span>
              <span className="truncate text-sm font-medium text-foreground">
                {question?.title ?? "Kết quả bài viết"}
              </span>
            </div>

            {/* Đề bài — compact, collapsible bằng line-clamp */}
            {question && (
              <div className="shrink-0 border-b border-border bg-muted/40 px-5 py-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Đề bài</p>
                <p className="line-clamp-3 text-sm leading-relaxed text-foreground">
                  {question.questionPrompt}
                </p>
              </div>
            )}

            {/* Bài viết có highlight */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <AnnotatedEssay
                text={submission.essayContent}
                errors={submission.aiResult.errors}
                activeErrorId={activeErrorId}
                onErrorClick={setActiveErrorId}
              />
            </div>

          </div>
        </Allotment.Pane>

        {/* Panel phải: Điểm số + Danh sách lỗi */}
        <Allotment.Pane minSize={320}>
          <div className="h-full overflow-y-auto">
            <BandScorePanel
              aiResult={submission.aiResult}
              activeErrorId={activeErrorId}
              onErrorSelect={setActiveErrorId}
            />
          </div>
        </Allotment.Pane>

      </Allotment>
    </div>
  )
}
