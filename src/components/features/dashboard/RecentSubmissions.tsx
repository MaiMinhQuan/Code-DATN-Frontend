// Danh sách bài nộp gần đây trên dashboard.
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";
import type { Submission } from "@/types/submission.types";

const T = UI_TEXT.DASHBOARD;

// Trả class màu badge theo mức band score.
function getBandStyle(band: number): string {
  if (band >= 7) return "bg-emerald-100 text-emerald-700";
  if (band >= 6) return "bg-amber-100 text-amber-700";
  if (band >= 5) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

interface RecentSubmissionsProps {
  // Danh sách bài nộp gần đây cần hiển thị.
  submissions: Submission[];
  // Tổng số bài nộp (dùng để quyết định hiển thị nút "Xem tất cả").
  totalCount: number;
}

/*
Component danh sách bài nộp gần đây.

Input:
- submissions — danh sách submission.
- totalCount — tổng số submission.

Output:
- Card recent submissions hoặc empty state khi chưa có dữ liệu.
*/
export function RecentSubmissions({ submissions, totalCount }: RecentSubmissionsProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm">
      {/* Header + link xem toàn bộ lịch sử */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">{T.RECENT_TITLE}</h2>
        {totalCount > 0 && (
          <Link
            href="/practice/history"
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Xem tất cả
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Nội dung: empty state hoặc danh sách bài nộp */}
      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
          <FileText className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">{T.RECENT_EMPTY}</p>
          <p className="text-xs text-muted-foreground">{T.RECENT_EMPTY_HINT}</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {submissions.map((s) => {
            const band = s.aiResult?.overallBand;

            // Format ngày nộp theo locale vi-VN
            const date = s.submittedAt
              ? new Date(s.submittedAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "—";

            // Fallback tự đếm từ khi metadata wordCount không có
            const wordCount = s.wordCount ?? s.essayContent?.trim().split(/\s+/).length ?? 0;
            const snippet = s.essayContent?.trim() ?? "";

            return (
              <Link
                key={s._id}
                href={`/practice/${typeof s.questionId === "object" ? (s.questionId as any)._id : s.questionId}/result/${s._id}`}
                className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
              >
                {/* Badge band */}
                {band !== undefined ? (
                  <span
                    className={cn(
                      "mt-0.5 shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold",
                      getBandStyle(band),
                    )}
                  >
                    {band.toFixed(1)}
                  </span>
                ) : (
                  <span className="mt-0.5 shrink-0 rounded-lg bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    —
                  </span>
                )}

                {/* Preview nội dung + metadata */}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-xs leading-relaxed text-foreground">
                    {snippet || "—"}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {date}
                    {wordCount > 0 && (
                      <span className="ml-2 text-muted-foreground/70">{wordCount} từ</span>
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
