// Bài viết đã annotate lỗi AI, hỗ trợ click và hover từng lỗi.
"use client"

import { useEffect, useRef } from "react"
import { ErrorCategory } from "@/types/enums"
import type { AIError } from "@/types/ai-result.types"
import { useEssayHighlight, type HighlightStrategy } from "@/hooks/useEssayHighlight"
import { ErrorTooltip } from "./ErrorTooltip"
import { ERROR_CATEGORY_STYLES, getErrorId } from "@/constants/error-category"
import { cn } from "@/lib/utils"

const ACTIVE_RING: Record<ErrorCategory, string> = {
  [ErrorCategory.GRAMMAR]:       "ring-2 ring-offset-1 ring-red-400",
  [ErrorCategory.SPELLING]:      "ring-2 ring-offset-1 ring-orange-400",
  [ErrorCategory.VOCABULARY]:    "ring-2 ring-offset-1 ring-yellow-400",
  [ErrorCategory.COHERENCE]:     "ring-2 ring-offset-1 ring-purple-400",
  [ErrorCategory.TASK_RESPONSE]: "ring-2 ring-offset-1 ring-blue-400",
  [ErrorCategory.PUNCTUATION]:   "ring-2 ring-offset-1 ring-gray-400",
}

interface AnnotatedEssayProps {
  // Nội dung bài viết gốc của người học.
  text: string;
  // Danh sách lỗi AI cần highlight.
  errors: AIError[];
  // ID lỗi đang được active từ panel bên phải (optional).
  activeErrorId?: string | null;
  // Callback khi click vào đoạn lỗi (optional).
  onErrorClick?: (errorId: string) => void;
  // Chiến lược highlight segment.
  strategy?: HighlightStrategy;
}

/*
Component bài viết annotate.

Input:
- text — nội dung bài viết.
- errors — danh sách lỗi AI.
- activeErrorId — lỗi đang chọn (optional).
- onErrorClick — callback click lỗi (optional).
- strategy — chiến lược chia segment để highlight.

Output:
- Đoạn văn được highlight lỗi, kèm tooltip chi tiết cho từng segment.
*/
export function AnnotatedEssay({
  text,
  errors,
  activeErrorId,
  onErrorClick,
  strategy = "text",
}: AnnotatedEssayProps) {
  // Tách bài viết thành các segment có/không highlight.
  const { segments } = useEssayHighlight(text, errors, strategy)

  const containerRef = useRef<HTMLDivElement>(null)

  // Cuộn tới lỗi đang active để đồng bộ với panel lỗi.
  useEffect(() => {
    if (!activeErrorId || !containerRef.current) return
    const el = containerRef.current.querySelector<HTMLElement>(
      `[data-error-id="${activeErrorId}"]`
    )
    el?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [activeErrorId])

  return (
    <div ref={containerRef} className="text-base leading-8 text-foreground whitespace-pre-wrap">
      {segments.map((segment) => {
        // Segment thường: render nguyên văn không highlight
        if (!segment.isHighlighted) {
          return <span key={segment.id}>{segment.text}</span>
        }

        const primaryError = segment.errors[0]
        const categoryStyle = ERROR_CATEGORY_STYLES[primaryError.category]
        const isActive = segment.errors.some((e) => getErrorId(e) === activeErrorId)

        return (
          <ErrorTooltip key={segment.id} errors={segment.errors}>
            <span
              data-error-id={getErrorId(primaryError)}
              className={cn(
                categoryStyle.highlight,
                "rounded-sm",
                // Thêm viền nổi bật khi đây là lỗi đang active
                isActive && ACTIVE_RING[primaryError.category]
              )}
              onClick={() => onErrorClick?.(getErrorId(primaryError))}
            >
              {segment.text}
            </span>
          </ErrorTooltip>
        )
      })}
    </div>
  )
}
