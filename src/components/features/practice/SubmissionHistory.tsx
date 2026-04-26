"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, History, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { useSubmissions } from "@/hooks/useSubmission";
import { SubmissionStatus } from "@/types/enums";
import { cn } from "@/lib/utils";

interface SubmissionHistoryProps {
  questionId: string;
}

export function SubmissionHistory({ questionId }: SubmissionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useSubmissions({
    questionId,
    status: SubmissionStatus.COMPLETED,
    limit: 10,
  });

  const submissions = data?.data ?? [];
  const total = data?.total ?? 0;

  // Ẩn hoàn toàn nếu chưa có lần nộp nào
  if (!isLoading && total === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">

      {/* Toggle header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--muted)]"
      >
        <span className="flex items-center gap-2">
          <History className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-medium text-[var(--foreground)]">
            Lịch sử nộp bài
          </span>
          {total > 0 && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {total} lần
            </span>
          )}
        </span>
        {isOpen
          ? <ChevronUp className="h-4 w-4 text-[var(--muted-foreground)]" />
          : <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />
        }
      </button>

      {/* List */}
      {isOpen && (
        <div className="border-t border-[var(--border)]">
          {isLoading ? (
            <div className="py-4 text-center text-xs text-[var(--muted-foreground)]">
              Đang tải...
            </div>
          ) : (
            submissions.map((sub) => (
              <Link
                key={sub._id}
                href={`/practice/${questionId}/result/${sub._id}`}
                className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--muted)] border-b border-[var(--border)] last:border-b-0"
              >
                {/* Left: attempt + date */}
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
                    #{sub.attemptNumber}
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-[var(--foreground)]">
                      {format(
                        new Date(sub.submittedAt ?? sub.createdAt),
                        "dd/MM/yyyy · HH:mm"
                      )}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {sub.wordCount ? `${sub.wordCount} từ` : "—"}
                    </p>
                  </div>
                </div>

                {/* Right: band score + icon */}
                <div className="flex items-center gap-2">
                  {sub.aiResult?.overallBand !== undefined && (
                    <div className="text-right">
                      <span className={cn(
                        "text-lg font-bold",
                        sub.aiResult.overallBand >= 7 ? "text-emerald-600"
                          : sub.aiResult.overallBand >= 5.5 ? "text-amber-600"
                          : "text-red-500"
                      )}>
                        {sub.aiResult.overallBand % 1 === 0
                          ? sub.aiResult.overallBand.toFixed(0)
                          : sub.aiResult.overallBand.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <ArrowUpRight className="h-3.5 w-3.5 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
