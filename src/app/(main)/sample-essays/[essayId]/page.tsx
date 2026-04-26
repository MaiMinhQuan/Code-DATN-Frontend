"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

import { useSampleEssay } from "@/hooks/useSampleEssays"
import { UI_TEXT } from "@/constants/ui-text"
import { cn } from "@/lib/utils"
import type { HighlightAnnotation, HighlightType, SampleEssay, TargetBand } from "@/types/sample-essay.types"

const T = UI_TEXT.SAMPLE_ESSAYS

// ─── Constants ────────────────────────────────────────────────────────────────

const TARGET_BAND_LABEL: Record<TargetBand, string> = {
  BAND_5_0:    "Band 5.0",
  BAND_6_0:    "Band 6.0",
  BAND_7_PLUS: "Band 7+",
}

const HIGHLIGHT_STYLE: Record<HighlightType, { bg: string; dot: string; label: string }> = {
  VOCABULARY: { bg: "bg-amber-100 text-amber-900",  dot: "bg-amber-400",  label: "Từ vựng"   },
  GRAMMAR:    { bg: "bg-red-100 text-red-900",      dot: "bg-red-400",    label: "Ngữ pháp"  },
  STRUCTURE:  { bg: "bg-blue-100 text-blue-900",    dot: "bg-blue-400",   label: "Cấu trúc"  },
  ARGUMENT:   { bg: "bg-green-100 text-green-900",  dot: "bg-green-400",  label: "Lập luận"  },
}

// ─── Essay text with inline highlights ────────────────────────────────────────

function buildSegments(text: string, annotations: HighlightAnnotation[]) {
  const sorted = [...annotations].sort((a, b) => a.startIndex - b.startIndex)
  const segments: Array<{ text: string; annotation?: HighlightAnnotation; id: number }> = []
  let cursor = 0
  let id = 0

  for (const ann of sorted) {
    if (ann.startIndex > cursor) {
      segments.push({ id: id++, text: text.slice(cursor, ann.startIndex) })
    }
    if (ann.endIndex > ann.startIndex) {
      segments.push({ id: id++, text: text.slice(ann.startIndex, ann.endIndex), annotation: ann })
    }
    cursor = Math.max(cursor, ann.endIndex)
  }

  if (cursor < text.length) {
    segments.push({ id: id++, text: text.slice(cursor) })
  }

  return segments
}

function AnnotatedSampleEssay({
  text,
  annotations,
  activeId,
  onSelect,
}: {
  text: string
  annotations: HighlightAnnotation[]
  activeId: number | null
  onSelect: (idx: number) => void
}) {
  if (annotations.length === 0) {
    return <p className="text-base leading-8 text-foreground whitespace-pre-wrap">{text}</p>
  }

  const segments = buildSegments(text, annotations)

  return (
    <p className="text-base leading-8 text-foreground whitespace-pre-wrap">
      {segments.map((seg) => {
        if (!seg.annotation) return <span key={seg.id}>{seg.text}</span>

        const annIdx = annotations.indexOf(seg.annotation)
        const style  = HIGHLIGHT_STYLE[seg.annotation.highlightType]
        const isActive = activeId === annIdx

        return (
          <mark
            key={seg.id}
            onClick={() => onSelect(annIdx)}
            className={cn(
              "cursor-pointer rounded-sm px-0.5 transition-all",
              style.bg,
              isActive && "ring-2 ring-offset-1 ring-primary"
            )}
            title={seg.annotation.explanation}
          >
            {seg.text}
          </mark>
        )
      })}
    </p>
  )
}

// ─── Right panel ──────────────────────────────────────────────────────────────

function EssayInfoPanel({
  essay,
  activeAnnotationId,
  onAnnotationSelect,
}: {
  essay: SampleEssay
  activeAnnotationId: number | null
  onAnnotationSelect: (idx: number) => void
}) {
  const bandScore = essay.overallBandScore ?? 0
  const infoRows = [
    { label: T.DETAIL_LABEL_BAND,   value: bandScore > 0 ? bandScore.toFixed(1) : UI_TEXT.COMMON.EMPTY_VALUE },
    { label: T.DETAIL_LABEL_TASK,   value: TARGET_BAND_LABEL[essay.targetBand] },
    { label: T.DETAIL_LABEL_TOPIC,  value: essay.topicId?.name  ?? UI_TEXT.COMMON.EMPTY_VALUE },
    { label: T.DETAIL_LABEL_AUTHOR, value: essay.authorName     ?? UI_TEXT.COMMON.EMPTY_VALUE },
  ]

  const annotations = essay.highlightAnnotations ?? []

  return (
    <div className="flex flex-col gap-4 p-5">

      {/* Thông tin cơ bản */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">{T.DETAIL_LABEL_INFO}</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {infoRows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-xs font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phân tích lỗi */}
      {annotations.length === 0 ? (
        <p className="text-xs text-muted-foreground">{T.DETAIL_NO_ANNOTATION}</p>
      ) : (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Phân tích chi tiết</h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {annotations.length}
            </span>
          </div>

          {/* Legend */}
          <div className="mb-3 flex flex-wrap gap-2">
            {(Object.entries(HIGHLIGHT_STYLE) as [HighlightType, typeof HIGHLIGHT_STYLE[HighlightType]][]).map(([type, s]) => (
              <span key={type} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className={cn("h-2 w-2 rounded-full", s.dot)} />
                {s.label}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {annotations.map((ann, idx) => {
              const style    = HIGHLIGHT_STYLE[ann.highlightType]
              const isActive = activeAnnotationId === idx
              return (
                <button
                  key={idx}
                  onClick={() => onAnnotationSelect(idx)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition-all",
                    isActive
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", style.dot)} />
                    <span className="text-xs font-semibold text-foreground">{style.label}</span>
                  </div>
                  <p className="pl-3.5 text-xs leading-relaxed text-muted-foreground">
                    {ann.explanation}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SampleEssayDetailPage() {
  const { essayId } = useParams<{ essayId: string }>()
  const router = useRouter()

  const [activeAnnotationId, setActiveAnnotationId] = useState<number | null>(null)

  const { data: essay, isLoading, isError } = useSampleEssay(essayId)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !essay) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-sm text-muted-foreground">{T.DETAIL_NOT_FOUND}</p>
        <button
          onClick={() => router.push("/sample-essays")}
          className="text-sm text-primary hover:underline"
        >
          {T.DETAIL_BACK}
        </button>
      </div>
    )
  }

  return (
    <div className="-m-6" style={{ height: "calc(100vh - 4rem)" }}>
      <Allotment>

        {/* Panel trái: Đề bài + Nội dung bài viết */}
        <Allotment.Pane minSize={320} preferredSize="55%">
          <div className="flex h-full flex-col overflow-hidden">

            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-3">
              <button
                onClick={() => router.push("/sample-essays")}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {T.DETAIL_BACK}
              </button>
              <span className="text-muted-foreground">·</span>
              <span className="truncate text-sm font-medium text-foreground">
                {essay.title}
              </span>
            </div>

            {/* Đề bài */}
            <div className="shrink-0 border-b border-border bg-muted/40 px-5 py-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {T.DETAIL_LABEL_QUESTION}
              </p>
              <p className="line-clamp-3 text-sm leading-relaxed text-foreground">
                {essay.questionPrompt}
              </p>
            </div>

            {/* Nội dung bài viết */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <AnnotatedSampleEssay
                text={essay.fullEssayContent}
                annotations={essay.highlightAnnotations ?? []}
                activeId={activeAnnotationId}
                onSelect={setActiveAnnotationId}
              />
            </div>

          </div>
        </Allotment.Pane>

        {/* Panel phải: Thông tin + Phân tích */}
        <Allotment.Pane minSize={300}>
          <div className="h-full overflow-y-auto">
            <EssayInfoPanel
              essay={essay}
              activeAnnotationId={activeAnnotationId}
              onAnnotationSelect={setActiveAnnotationId}
            />
          </div>
        </Allotment.Pane>

      </Allotment>
    </div>
  )
}
