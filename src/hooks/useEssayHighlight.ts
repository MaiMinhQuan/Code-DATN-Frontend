import { useMemo, useState } from 'react'
import type { AIError } from '@/types/ai-result.types'
import type { TextSegment } from '@/types/essay-highlight.types'

export type HighlightStrategy = 'index' | 'text'

type MergedInterval = {
  start: number
  end: number
  errors: AIError[]
}

type ResolvedError = {
  startIndex: number
  endIndex: number
  error: AIError
}

// ─── Shared: merge intervals + build segments ────────────────────────────────

function mergeAndBuild(text: string, resolved: ResolvedError[]): TextSegment[] {
  if (!resolved.length) {
    return [{ id: 'seg-0', text, startIndex: 0, isHighlighted: false, errors: [] }]
  }

  const sorted = [...resolved].sort((a, b) => a.startIndex - b.startIndex)

  const merged: MergedInterval[] = []
  for (const item of sorted) {
    const last = merged[merged.length - 1]
    if (!last || item.startIndex >= last.end) {
      merged.push({ start: item.startIndex, end: item.endIndex, errors: [item.error] })
    } else {
      last.end = Math.max(last.end, item.endIndex)
      last.errors.push(item.error)
    }
  }

  const segments: TextSegment[] = []
  let cursor = 0
  let idx = 0

  for (const interval of merged) {
    if (cursor < interval.start) {
      segments.push({
        id: `seg-${idx++}`,
        text: text.slice(cursor, interval.start),
        startIndex: cursor,
        isHighlighted: false,
        errors: [],
      })
    }

    segments.push({
      id: `seg-${idx++}`,
      text: text.slice(interval.start, interval.end),
      startIndex: interval.start,
      isHighlighted: true,
      errors: interval.errors,
    })

    cursor = interval.end
  }

  if (cursor < text.length) {
    segments.push({
      id: `seg-${idx++}`,
      text: text.slice(cursor),
      startIndex: cursor,
      isHighlighted: false,
      errors: [],
    })
  }

  return segments
}

// ─── Strategy 1: Tin vào index của Gemini ────────────────────────────────────

function buildByIndex(text: string, errors: AIError[]): TextSegment[] {
  const resolved = errors
    .filter((e) => e.startIndex >= 0 && e.endIndex > e.startIndex && e.startIndex < text.length)
    .map((e) => ({
      startIndex: e.startIndex,
      endIndex: Math.min(e.endIndex, text.length),
      error: e,
    }))

  return mergeAndBuild(text, resolved)
}

// ─── Strategy 2: Tìm vị trí từ originalText ──────────────────────────────────

function resolveByText(originalText: string, hint: number, text: string): { startIndex: number; endIndex: number } | null {
  if (!originalText) return null

  // Thu thập tất cả vị trí xuất hiện của originalText
  const occurrences: number[] = []
  let pos = text.indexOf(originalText)
  while (pos !== -1) {
    occurrences.push(pos)
    pos = text.indexOf(originalText, pos + 1)
  }

  if (!occurrences.length) return null

  // Chọn occurrence gần hint nhất (dùng Gemini index như một gợi ý)
  const best = occurrences.reduce((prev, curr) =>
    Math.abs(curr - hint) < Math.abs(prev - hint) ? curr : prev
  )

  return { startIndex: best, endIndex: best + originalText.length }
}

function buildByText(text: string, errors: AIError[]): TextSegment[] {
  const resolved = errors.flatMap((e) => {
    const pos = resolveByText(e.originalText, e.startIndex, text)
    return pos ? [{ ...pos, error: e }] : []
  })

  return mergeAndBuild(text, resolved)
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useEssayHighlight(
  text: string,
  errors: AIError[],
  strategy: HighlightStrategy = 'text'
) {
  const [activeErrorId, setActiveErrorId] = useState<string | null>(null)

  const segments = useMemo(() => {
    if (!text) return []
    if (!errors.length) {
      return [{ id: 'seg-0', text, startIndex: 0, isHighlighted: false, errors: [] as AIError[] }]
    }
    return strategy === 'index' ? buildByIndex(text, errors) : buildByText(text, errors)
  }, [text, errors, strategy])

  return { segments, activeErrorId, setActiveErrorId }
}
