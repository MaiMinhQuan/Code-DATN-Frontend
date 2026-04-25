"use client"

import { useState, useRef, useEffect } from "react"
import {
  RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts"
import type { AIResult } from "@/types/ai-result.types"
import { ErrorCategory } from "@/types/enums"
import { ERROR_CATEGORY_STYLES, getErrorId } from "@/constants/error-category"
import { UI_TEXT } from "@/constants/ui-text"
import { cn } from "@/lib/utils"

type FilterOption = ErrorCategory | "ALL"

const T = UI_TEXT.RESULT

// ─── SeverityBadge ───────────────────────────────────────────────────────────

const SEVERITY_BADGE: Record<string, string> = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low:    "bg-green-100 text-green-700",
}

function SeverityBadge({ severity }: { severity: string }) {
  const label =
    severity === "high" ? T.SEVERITY_HIGH
    : severity === "low" ? T.SEVERITY_LOW
    : T.SEVERITY_MEDIUM
  return (
    <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-xs font-medium", SEVERITY_BADGE[severity] ?? SEVERITY_BADGE.medium)}>
      {label}
    </span>
  )
}

// ─── FeedbackSection ─────────────────────────────────────────────────────────

const FEEDBACK_ACCENT: Record<string, string> = {
  green: "border-green-200 bg-green-50/50",
  amber: "border-amber-200 bg-amber-50/50",
}

function FeedbackSection({
  title,
  content,
  accent,
}: {
  title: string
  content: string
  accent?: "green" | "amber"
}) {
  return (
    <div className={cn("rounded-xl border p-4", accent ? FEEDBACK_ACCENT[accent] : "border-border bg-card")}>
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
    </div>
  )
}

// ─── BandScorePanel ───────────────────────────────────────────────────────────

const SCORE_CARDS = (r: AIResult) => [
  { label: "TR", fullLabel: T.SCORE_LABEL_TASK,      score: r.taskResponseScore },
  { label: "CC", fullLabel: T.SCORE_LABEL_COHERENCE, score: r.coherenceScore   },
  { label: "LR", fullLabel: T.SCORE_LABEL_LEXICAL,   score: r.lexicalScore     },
  { label: "GR", fullLabel: T.SCORE_LABEL_GRAMMAR,   score: r.grammarScore     },
]

const RADAR_DATA = (r: AIResult) => [
  { axis: "Task Response", score: r.taskResponseScore },
  { axis: "Coherence",     score: r.coherenceScore    },
  { axis: "Lexical",       score: r.lexicalScore      },
  { axis: "Grammar",       score: r.grammarScore      },
]

const FILTERS: FilterOption[] = ["ALL", ...Object.values(ErrorCategory)]

interface BandScorePanelProps {
  aiResult: AIResult
  activeErrorId?: string | null
  onErrorSelect?: (errorId: string) => void
}

export function BandScorePanel({ aiResult, activeErrorId, onErrorSelect }: BandScorePanelProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("ALL")
  const listRef = useRef<HTMLDivElement>(null)

  const filteredErrors =
    activeFilter === "ALL"
      ? aiResult.errors
      : aiResult.errors.filter((e) => e.category === activeFilter)

  // Tự scroll error list đến item đang active
  useEffect(() => {
    if (!activeErrorId || !listRef.current) return
    const el = listRef.current.querySelector(`[data-error-id="${activeErrorId}"]`)
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [activeErrorId])

  return (
    <div className="flex flex-col gap-4 p-4">

      {/* Overall Band + Sub-scores */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div>
          <p className="text-xs text-muted-foreground">{T.SCORE_LABEL_OVERALL}</p>
          <p className="mt-1 text-5xl font-bold leading-none text-primary">
            {aiResult.overallBand.toFixed(1)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SCORE_CARDS(aiResult).map((c) => (
            <div
              key={c.label}
              title={c.fullLabel}
              className="flex min-w-[52px] flex-col items-center rounded-lg bg-muted px-3 py-2"
            >
              <span className="text-[10px] text-muted-foreground">{c.label}</span>
              <span className="text-lg font-semibold text-foreground">{c.score.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="rounded-xl border border-border bg-card p-2">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={RADAR_DATA(aiResult)} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#64748b" }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 9]}
              tickCount={4}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />
            <Radar
              dataKey="score"
              stroke="#4f46e5"
              fill="#4f46e5"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Feedback */}
      {aiResult.generalFeedback && (
        <FeedbackSection title={T.FEEDBACK_GENERAL} content={aiResult.generalFeedback} />
      )}
      {(aiResult.strengths || aiResult.improvements) && (
        <div className="grid grid-cols-2 gap-3">
          {aiResult.strengths && (
            <FeedbackSection title={T.FEEDBACK_STRENGTHS} content={aiResult.strengths} accent="green" />
          )}
          {aiResult.improvements && (
            <FeedbackSection title={T.FEEDBACK_IMPROVEMENTS} content={aiResult.improvements} accent="amber" />
          )}
        </div>
      )}

      {/* Error List */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">{T.ERROR_LIST_TITLE}</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {aiResult.errors.length}
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1.5 border-b border-border px-3 py-2">
          {FILTERS.map((f) => {
            const isAll    = f === "ALL"
            const style    = isAll ? null : ERROR_CATEGORY_STYLES[f as ErrorCategory]
            const isActive = activeFilter === f
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-border"
                )}
              >
                {!isAll && style && <span className={cn("h-1.5 w-1.5 rounded-full", style.badge)} />}
                {isAll ? T.ERROR_FILTER_ALL : style?.label}
              </button>
            )
          })}
        </div>

        {/* Error items */}
        <div ref={listRef} className="divide-y divide-border">
          {filteredErrors.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">Không có lỗi nào</p>
          ) : (
            filteredErrors.map((error) => {
              const id       = getErrorId(error)
              const style    = ERROR_CATEGORY_STYLES[error.category]
              const isActive = id === activeErrorId
              return (
                <button
                  key={id}
                  data-error-id={id}
                  onClick={() => onErrorSelect?.(id)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors",
                    isActive ? "bg-muted" : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", style.badge)} />
                      <span className="text-xs font-semibold text-foreground">{style.label}</span>
                    </div>
                    <SeverityBadge severity={error.severity ?? "medium"} />
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 pl-3.5 text-xs">
                    <span className="font-mono text-muted-foreground">{error.originalText}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-mono font-medium text-foreground">{error.suggestion}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 pl-3.5 text-xs leading-relaxed text-muted-foreground">
                    {error.explanation}
                  </p>
                </button>
              )
            })
          )}
        </div>
      </div>

    </div>
  )
}
