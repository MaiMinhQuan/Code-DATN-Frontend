"use client"

import Link from "next/link"
import { BookOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { UI_TEXT } from "@/constants/ui-text"
import type { SampleEssay, TargetBand } from "@/types/sample-essay.types"

const T = UI_TEXT.SAMPLE_ESSAYS

function getBandBadgeStyle(band: number) {
  if (band >= 8)   return "bg-amber-100 text-amber-700 border border-amber-200"
  if (band >= 6.5) return "bg-emerald-100 text-emerald-700 border border-emerald-200"
  return "bg-blue-100 text-blue-700 border border-blue-200"
}

const TARGET_BAND_LABEL: Record<TargetBand, string> = {
  BAND_5_0:    "Band 5.0",
  BAND_6_0:    "Band 6.0",
  BAND_7_PLUS: "Band 7+",
}

interface EssayCardProps {
  essay: SampleEssay
}

export function EssayCard({ essay }: EssayCardProps) {
  const bandScore = essay.overallBandScore ?? 0

  return (
    <Link
      href={`/sample-essays/${essay._id}`}
      className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {bandScore > 0 && (
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", getBandBadgeStyle(bandScore))}>
            Band {bandScore.toFixed(1)}
          </span>
        )}
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
          {TARGET_BAND_LABEL[essay.targetBand]}
        </span>
        {essay.topicId?.name && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            {essay.topicId.name}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-foreground">
        {essay.title}
      </h3>

      {/* Preview */}
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
        {essay.fullEssayContent}
      </p>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        {essay.authorName ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{essay.authorName}</span>
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1 text-xs font-medium text-primary">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{T.CARD_READ_MORE}</span>
        </div>
      </div>
    </Link>
  )
}
