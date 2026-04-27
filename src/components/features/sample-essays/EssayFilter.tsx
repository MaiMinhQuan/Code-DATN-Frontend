"use client"

import { X } from "lucide-react"
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

function FilterGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
      {children}
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  )
}

export function EssayFilter({ params, onChange }: EssayFilterProps) {
  const { data: topics = [] } = useTopics()

  const hasActiveFilter = !!params.targetBand || !!params.topicId

  const setBand  = (value: TargetBand | undefined) => onChange({ ...params, targetBand: value })
  const setTopic = (value: string | undefined)     => onChange({ ...params, topicId: value })
  const reset    = () => onChange({})

  return (
    <div className="flex flex-col gap-2">

      {/* Hàng 1: Filter chủ đề */}
      <FilterGroup>
        <FilterButton active={!params.topicId} onClick={() => setTopic(undefined)}>
          {T.FILTER_TOPIC_ALL}
        </FilterButton>
        {topics.map((topic) => (
          <FilterButton
            key={topic._id}
            active={params.topicId === topic._id}
            onClick={() => setTopic(topic._id)}
          >
            {topic.name}
          </FilterButton>
        ))}
      </FilterGroup>

      {/* Hàng 2: Filter band điểm + Reset */}
      <div className="flex items-center gap-3">
        <FilterGroup>
          {BAND_OPTIONS.map((opt) => (
            <FilterButton
              key={opt.label}
              active={params.targetBand === opt.value}
              onClick={() => setBand(opt.value)}
            >
              {opt.label}
            </FilterButton>
          ))}
        </FilterGroup>

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

    </div>
  )
}
