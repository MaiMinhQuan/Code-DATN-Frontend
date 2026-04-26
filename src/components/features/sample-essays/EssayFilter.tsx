"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { UI_TEXT } from "@/constants/ui-text"
import type { GetSampleEssaysParams, TargetBand } from "@/types/sample-essay.types"

const T = UI_TEXT.SAMPLE_ESSAYS

const BAND_OPTIONS: { label: string; value: TargetBand | undefined }[] = [
  { label: T.FILTER_BAND_ALL,  value: undefined              },
  { label: T.FILTER_BAND_LOW,  value: "BAND_5_0"             },
  { label: T.FILTER_BAND_MID,  value: "BAND_6_0"             },
  { label: T.FILTER_BAND_HIGH, value: "BAND_7_PLUS"          },
]

interface EssayFilterProps {
  params: GetSampleEssaysParams
  onChange: (params: GetSampleEssaysParams) => void
}

export function EssayFilter({ params, onChange }: EssayFilterProps) {
  const hasActiveFilter = !!params.targetBand

  const setBand = (value: TargetBand | undefined) =>
    onChange({ ...params, targetBand: value })

  const reset = () => onChange({})

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {BAND_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setBand(opt.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              params.targetBand === opt.value
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {hasActiveFilter && (
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" />
          {T.BTN_RESET_FILTER}
        </button>
      )}
    </div>
  )
}
