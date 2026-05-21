// Bộ lọc topic và target band cho danh sách bài mẫu.
"use client"

import { cn } from "@/lib/utils"
import { UI_TEXT } from "@/constants/ui-text"
import { useTopics } from "@/hooks/useTopics"
import type { GetSampleEssaysParams, TargetBand } from "@/types/sample-essay.types"

const T = UI_TEXT.SAMPLE_ESSAYS

const BAND_OPTIONS: { label: string; value: TargetBand | undefined }[] = [
  { label: T.FILTER_BAND_ALL,  value: undefined     },
  { label: T.FILTER_BAND_LOW,  value: "BAND_5_0"    },
  { label: T.FILTER_BAND_MID,  value: "BAND_6_0"    },
  { label: T.FILTER_BAND_HIGH, value: "BAND_7_PLUS" },
]

interface EssayFilterProps {
  params: GetSampleEssaysParams
  onChange: (params: GetSampleEssaysParams) => void
}

export function EssayFilter({ params, onChange }: EssayFilterProps) {
  const { data: topics = [] } = useTopics()

  const setBand  = (value: TargetBand | undefined) => onChange({ ...params, targetBand: value })
  const setTopic = (id: string | undefined) =>
    onChange({ ...params, topicId: params.topicId === id ? undefined : id })

  return (
    <div className="flex items-stretch gap-0 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Cột trái: filter chủ đề */}
      <div className="flex flex-1 flex-col gap-2 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Chủ đề
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTopic(undefined)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              !params.topicId
                ? "bg-indigo-600 text-white"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-slate-200"
            )}
          >
            {T.FILTER_TOPIC_ALL}
          </button>
          {topics.map((topic) => (
            <button
              key={topic._id}
              onClick={() => setTopic(topic._id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                params.topicId === topic._id
                  ? "bg-indigo-600 text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-slate-200"
              )}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>

      {/* Đường kẻ dọc phân cách */}
      <div className="w-px bg-[var(--border)]" />

      {/* Cột phải: filter band */}
      <div className="flex flex-1 flex-col gap-2 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Band điểm
        </span>
        <div className="flex flex-wrap gap-2">
          {BAND_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setBand(opt.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                params.targetBand === opt.value
                  ? "bg-slate-700 text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-slate-200"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
