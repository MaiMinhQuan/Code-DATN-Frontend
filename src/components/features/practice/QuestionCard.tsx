"use client";

// Thẻ đề bài trong trang danh sách luyện tập writing.
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers, Users, RotateCcw, X, History } from "lucide-react";
import { format } from "date-fns";
import { ExamQuestion } from "@/types/exam-question.types";
import { Submission } from "@/types/submission.types";
import { UI_TEXT } from "@/constants/ui-text";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  
  question: ExamQuestion;
  
  userBestBand?: number;
  
  userSubmissions?: Submission[];
}

const DIFFICULTY_CONFIG: Record<
  number,
  { dot: string; text: string; bg: string; ring: string }
> = {
  1: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200" },
  2: { dot: "bg-teal-500",    text: "text-teal-700",    bg: "bg-teal-50",    ring: "ring-teal-200"    },
  3: { dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50",   ring: "ring-amber-200"   },
  4: { dot: "bg-orange-500",  text: "text-orange-700",  bg: "bg-orange-50",  ring: "ring-orange-200"  },
  5: { dot: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50",     ring: "ring-red-200"     },
};

// Màu badge điểm band theo mức điểm.
function getBandBg(band: number) {
  if (band >= 7) return "bg-emerald-500";
  if (band >= 5.5) return "bg-amber-500";
  return "bg-red-500";
}

// Màu chữ điểm band theo mức điểm.
function getBandText(band: number) {
  if (band >= 7) return "text-emerald-600";
  if (band >= 5.5) return "text-amber-600";
  return "text-red-500";
}

// Chuẩn hóa hiển thị số band (nguyên hoặc 1 chữ số thập phân).
function formatBand(band: number) {
  return band % 1 === 0 ? band.toFixed(0) : band.toFixed(1);
}

interface HistoryModalProps {
  // Đề bài đang xem lịch sử.
  question: ExamQuestion;
  // Danh sách submission theo đề.
  submissions: Submission[];
  // Callback đóng modal.
  onClose: () => void;
}

/*
Component modal lịch sử làm bài.

Input:
- question — thông tin đề bài.
- submissions — danh sách bài đã nộp.
- onClose — callback đóng modal.

Output:
- Modal chứa timeline các lần làm bài và link vào kết quả.
*/
function HistoryModal({ question, submissions, onClose }: HistoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop đóng modal */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Khung nội dung modal */}
      <div className="relative z-10 flex w-full max-w-md flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
        {/* Header modal */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 shrink-0 text-indigo-500" />
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Lịch sử làm bài
              </h3>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {submissions.length} lần
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]">
              {question.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Danh sách các lần nộp theo thứ tự mới -> cũ */}
        <div className="max-h-[240px] overflow-y-auto">
          {submissions.map((sub, idx) => {
            const band = sub.aiResult?.overallBand;
            return (
              <Link
                key={sub._id}
                href={`/practice/${question._id}/result/${sub._id}`}
                onClick={onClose}
                className={cn(
                  "group flex items-center justify-between px-5 py-3",
                  "transition-colors hover:bg-[var(--muted)]",
                  idx < submissions.length - 1 && "border-b border-[var(--border)]"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Số thứ tự attempt */}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {sub.attemptNumber}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Lần {sub.attemptNumber}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {format(new Date(sub.submittedAt ?? sub.createdAt), "dd/MM/yyyy · HH:mm")}
                      {sub.wordCount ? ` · ${sub.wordCount} từ` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {band !== undefined ? (
                    <span className={cn("text-lg font-bold tabular-nums", getBandText(band))}>
                      {formatBand(band)}
                    </span>
                  ) : (
                    <span className="text-sm text-[var(--muted-foreground)]">—</span>
                  )}
                  <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/*
Component thẻ đề luyện tập.

Input:
- question — dữ liệu đề bài.
- userBestBand — điểm tốt nhất của người dùng cho đề này (optional).
- userSubmissions — danh sách lịch sử nộp bài theo đề (optional).

Output:
- Card hiển thị metadata đề, lịch sử làm bài và nút bắt đầu/làm lại.
*/
export function QuestionCard({ question, userBestBand, userSubmissions = [] }: QuestionCardProps) {
  const [historyOpen, setHistoryOpen] = useState(false);

  const diff = DIFFICULTY_CONFIG[question.difficultyLevel];
  const label = UI_TEXT.PRACTICE_LIST.DIFFICULTY_LABELS[question.difficultyLevel];
  const hasAttempted = userBestBand !== undefined;
  const hasHistory = userSubmissions.length > 0;

  return (
    <>
      <div className="group flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-shadow hover:shadow-md">
        {/* Nhãn chủ đề + độ khó + điểm best */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {question.topicId?.name && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                <Layers className="h-3 w-3" />
                {question.topicId.name}
              </span>
            )}
            {diff && (
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", diff.bg, diff.text, diff.ring)}>
                {label}
                {/* Dot biểu diễn mức độ khó 1-5 */}
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={cn("h-1.5 w-1.5 rounded-full", i < question.difficultyLevel ? diff.dot : "bg-slate-200")} />
                  ))}
                </span>
              </span>
            )}
          </div>

          
          {hasAttempted && (
            <div className="shrink-0 text-right">
              <div className={cn("inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-white", getBandBg(userBestBand!))}>
                <span className="text-sm font-bold leading-none">
                  {formatBand(userBestBand!)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">best</p>
            </div>
          )}
        </div>

        {/* Tiêu đề đề bài */}
        <h3 className="mt-3 text-sm font-semibold leading-snug text-[var(--foreground)] line-clamp-2">
          {question.title}
        </h3>

        {/* Mô tả prompt rút gọn */}
        <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--muted-foreground)] line-clamp-3">
          {question.questionPrompt}
        </p>

        {/* Tag liên quan của đề */}
        {question.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {question.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                #{tag}
              </span>
            ))}
            {question.tags.length > 3 && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-400">
                +{question.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer hành động */}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
          <div>
            {hasHistory && (
              <button
                onClick={() => setHistoryOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                <Users className="h-3.5 w-3.5" />
                Lịch sử làm bài
              </button>
            )}
          </div>
          
          <Link
            href={`/practice/${question._id}`}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              hasAttempted
                ? "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            )}
          >
            {hasAttempted ? (
              <><RotateCcw className="h-3.5 w-3.5" /> Làm lại</>
            ) : (
              <>{UI_TEXT.PRACTICE_LIST.BTN_START} <ArrowRight className="h-3.5 w-3.5" /></>
            )}
          </Link>
        </div>
      </div>

      {/* Modal lịch sử làm bài */}
      {historyOpen && (
        <HistoryModal
          question={question}
          submissions={userSubmissions}
          onClose={() => setHistoryOpen(false)}
        />
      )}
    </>
  );
}
