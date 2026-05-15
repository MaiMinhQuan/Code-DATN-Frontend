// Trang kết quả chấm AI: bài viết annotate bên trái, bảng điểm + lỗi bên phải.
"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
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

/*
Component ResultPage.

Output:
- Hiển thị kết quả chấm cho submission đã hoàn thành, đồng bộ chọn lỗi giữa 2 panel.
*/
export default function ResultPage() {
  const { questionId, submissionId } = useParams<{
    questionId: string
    submissionId: string
  }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  /*
  Quay về trang practice và làm mới cache submissions.

  Output:
  - Điều hướng về `/practice` với danh sách dữ liệu đã được refresh.
  */
  const handleBackToPractice = () => {
    queryClient.invalidateQueries({ queryKey: ["submissions"] })
    router.push("/practice")
  }

  // ID lỗi đang active, đồng bộ giữa panel bài viết và panel danh sách lỗi
  const [activeErrorId, setActiveErrorId] = useState<string | null>(null)

  const { data: submission, isLoading, isError } = useSubmission(submissionId)
  const { data: question } = useExamQuestion(questionId)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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

  // Chặn trường hợp truy cập URL kết quả khi AI chưa chấm xong
  if (!submission.aiResult || submission.status !== SubmissionStatus.COMPLETED) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{T.RESULT_LOADING}</p>
      </div>
    )
  }

  return (
    <div className="-m-6" style={{ height: "calc(100vh - 4rem)" }}>
      <Allotment>

        {/* Panel trái: đề bài + bài viết đã annotate */}
        <Allotment.Pane minSize={320} preferredSize="55%">
          <div className="flex h-full flex-col overflow-hidden">

            {/* Header với điều hướng và nút làm lại */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-3 shrink-0">
              <button
                onClick={handleBackToPractice}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Quay về
              </button>
              <button
                onClick={() => router.push(`/practice/${questionId}`)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Làm lại
              </button>
              <span className="mx-1 text-[var(--border)]">|</span>
              <span className="truncate text-sm font-medium text-[var(--foreground)]">
                {question?.title ?? "Kết quả bài viết"}
              </span>
            </div>

            {/* Prompt đề bài giới hạn 3 dòng */}
            {question && (
              <div className="shrink-0 border-b border-border bg-muted/40 px-5 py-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Đề bài</p>
                <p className="line-clamp-3 text-sm leading-relaxed text-foreground">
                  {question.questionPrompt}
                </p>
              </div>
            )}

            {/* Nội dung bài viết với highlight lỗi inline */}
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

        {/* Panel phải: điểm band, radar chart và danh sách lỗi có filter */}
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
