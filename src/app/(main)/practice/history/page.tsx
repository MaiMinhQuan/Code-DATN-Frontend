// Trang lịch sử nộp bài đã hoàn thành, kèm điểm tổng và điểm từng tiêu chí.
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubmissions } from "@/hooks/useSubmission";
import { SubmissionStatus } from "@/types/enums";

/*
Chọn class màu cho badge band score theo ngưỡng điểm.

Input:
- band — điểm tổng IELTS (0-9).

Output:
- Chuỗi class Tailwind tương ứng.
*/
function getBandStyle(band: number): string {
  if (band >= 7) return "bg-emerald-100 text-emerald-700";
  if (band >= 6) return "bg-amber-100 text-amber-700";
  if (band >= 5) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

/*
Chuẩn hóa `questionId` về dạng string.

Input:
- questionId — giá trị thô từ submission (string hoặc object).

Output:
- questionId dạng chuỗi.
*/
function getQuestionId(questionId: string | { _id: string }): string {
  return typeof questionId === "object" ? questionId._id : questionId;
}

/*
Component SubmissionHistoryPage.

Output:
- Danh sách lịch sử nộp bài với loading state và empty state.
*/
export default function SubmissionHistoryPage() {
  const router = useRouter();

  // Lấy tối đa 100 bài đã hoàn thành cho trang lịch sử
  const { data, isLoading } = useSubmissions({
    status: SubmissionStatus.COMPLETED,
    limit: 100,
  });

  const submissions = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Nút quay lại */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Lịch sử làm bài</h1>
        {total > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            {total} bài đã nộp
          </p>
        )}
      </div>

      {/* Nội dung: loading / empty state / danh sách bài */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
          <FileText className="mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">Chưa có bài nộp nào</p>
          <p className="mt-1 text-xs text-muted-foreground">Bắt đầu luyện viết để xem lịch sử tại đây</p>
          <button
            onClick={() => router.push("/practice")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Luyện viết ngay
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {submissions.map((s) => {
            const band = s.aiResult?.overallBand;

            // Format thời gian nộp theo locale tiếng Việt
            const date = s.submittedAt
              ? new Date(s.submittedAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—";

            // Fallback đếm từ từ essayContent nếu thiếu wordCount metadata
            const wordCount = s.wordCount ?? s.essayContent?.trim().split(/\s+/).length ?? 0;
            const snippet = s.essayContent?.trim() ?? "";
            const qId = getQuestionId(s.questionId as any);

            return (
              <Link
                key={s._id}
                href={`/practice/${qId}/result/${s._id}`}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                {/* Badge điểm band */}
                {band !== undefined ? (
                  <span
                    className={cn(
                      "mt-0.5 shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold",
                      getBandStyle(band),
                    )}
                  >
                    {band.toFixed(1)}
                  </span>
                ) : (
                  <span className="mt-0.5 shrink-0 rounded-lg bg-muted px-2.5 py-1 text-sm text-muted-foreground">
                    —
                  </span>
                )}

                {/* Đoạn trích bài viết và metadata */}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm leading-relaxed text-foreground">
                    {snippet || "—"}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{date}</span>
                    {wordCount > 0 && <span>{wordCount} từ</span>}
                    {/* Điểm từng tiêu chí chấm */}
                    {s.aiResult && (
                      <span className="flex items-center gap-2">
                        <span>TR {s.aiResult.taskResponseScore}</span>
                        <span>CC {s.aiResult.coherenceScore}</span>
                        <span>LR {s.aiResult.lexicalScore}</span>
                        <span>GR {s.aiResult.grammarScore}</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
