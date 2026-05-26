// Trang kết quả chấm AI: bài viết annotate bên trái, bảng điểm + lỗi bên phải.
"use client"

import { useParams, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2, AlertCircle } from "lucide-react"

import { useSubmission } from "@/hooks/useSubmission"
import { useExamQuestion } from "@/hooks/useExamQuestion"
import { SubmissionDetailView } from "@/components/features/submissions/SubmissionDetailView"
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
    <SubmissionDetailView
      submission={submission}
      question={{ title: question?.title, questionPrompt: question?.questionPrompt }}
      mode="student"
      backLabel="Quay về"
      onBack={handleBackToPractice}
      onRetry={() => router.push(`/practice/${questionId}`)}
    />
  )
}
