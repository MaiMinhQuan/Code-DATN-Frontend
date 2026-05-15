// Thẻ preview một bài mẫu trong danh sách sample essays.
"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { UI_TEXT } from "@/constants/ui-text"
import type { SampleEssay } from "@/types/sample-essay.types"

const T = UI_TEXT.SAMPLE_ESSAYS

// Chọn style badge band score theo mức điểm.
function getBandBadgeStyle(band: number) {
  if (band >= 8)   return "bg-amber-100 text-amber-700 border border-amber-200"
  if (band >= 6.5) return "bg-emerald-100 text-emerald-700 border border-emerald-200"
  return "bg-blue-100 text-blue-700 border border-blue-200"
}

interface EssayCardProps {
  // Dữ liệu bài mẫu cần render.
  essay: SampleEssay
}

/*
Component thẻ bài mẫu.

Input:
- essay — dữ liệu bài mẫu.

Output:
- Card hiển thị band, topic, preview nội dung và link chi tiết.
*/
export function EssayCard({ essay }: EssayCardProps) {
  const bandScore = essay.overallBandScore ?? 0

  return (
    <Link
      href={`/sample-essays/${essay._id}`}
      className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Hàng metadata: band và topic */}
      <div className="flex flex-wrap items-center gap-2">
        {bandScore > 0 && (
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", getBandBadgeStyle(bandScore))}>
            Band {bandScore.toFixed(1)}
          </span>
        )}
        {essay.topicId?.name && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            {essay.topicId.name}
          </span>
        )}
      </div>

      {/* Tiêu đề bài mẫu */}
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-foreground">
        {essay.title}
      </h3>

      {/* Preview nội dung */}
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
        {essay.fullEssayContent}
      </p>

      {/* CTA đọc chi tiết */}
      <div className="mt-3 flex items-center justify-end border-t border-border pt-3">
        <div className="flex items-center gap-1 text-xs font-medium text-primary">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{T.CARD_READ_MORE}</span>
        </div>
      </div>
    </Link>
  )
}
