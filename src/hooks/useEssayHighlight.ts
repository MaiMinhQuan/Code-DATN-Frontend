// Hook và utility để tách bài viết thành segment, phục vụ highlight lỗi AI inline.

import { useMemo, useState } from 'react'
import type { AIError } from '@/types/ai-result.types'
import type { TextSegment } from '@/types/essay-highlight.types'

// Chiến lược xác định vị trí lỗi trong bài viết.
export type HighlightStrategy = 'index' | 'text'

// Interval highlight sau khi merge các lỗi bị overlap.
type MergedInterval = {
  start: number
  end: number
  errors: AIError[]
}

// Lỗi đã resolve được vị trí ký tự trong bài viết thực tế.
type ResolvedError = {
  startIndex: number
  endIndex: number
  error: AIError
}

/*
Merge các error intervals bị overlap và tách text thành danh sách TextSegment.

Input:
- text — toàn bộ nội dung bài viết.
- resolved — danh sách lỗi đã resolve vị trí.

Output:
- Mảng TextSegment để render.
*/
function mergeAndBuild(text: string, resolved: ResolvedError[]): TextSegment[] {
  if (!resolved.length) {
    // Không có lỗi thì trả về một segment thường duy nhất
    return [{ id: 'seg-0', text, startIndex: 0, isHighlighted: false, errors: [] }]
  }

  // Sort theo vị trí bắt đầu để merge một lượt từ trái sang phải
  const sorted = [...resolved].sort((a, b) => a.startIndex - b.startIndex)

  // Merge các interval overlap và gom lỗi vào cùng một span
  const merged: MergedInterval[] = []
  for (const item of sorted) {
    const last = merged[merged.length - 1]
    if (!last || item.startIndex >= last.end) {
      merged.push({ start: item.startIndex, end: item.endIndex, errors: [item.error] })
    } else {
      // Mở rộng interval hiện tại và thêm lỗi mới vào span
      last.end = Math.max(last.end, item.endIndex)
      last.errors.push(item.error)
    }
  }

  const segments: TextSegment[] = []
  let cursor = 0 // vị trí đã xử lý tới trong text
  let idx = 0    // counter tăng dần để tạo segment id

  for (const interval of merged) {
    // Tạo segment thường cho phần text trước highlight
    if (cursor < interval.start) {
      segments.push({
        id: `seg-${idx++}`,
        text: text.slice(cursor, interval.start),
        startIndex: cursor,
        isHighlighted: false,
        errors: [],
      })
    }

    // Tạo segment highlight
    segments.push({
      id: `seg-${idx++}`,
      text: text.slice(interval.start, interval.end),
      startIndex: interval.start,
      isHighlighted: true,
      errors: interval.errors,
    })

    cursor = interval.end
  }

  // Tạo segment thường cho phần text còn lại sau highlight cuối
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

/*
Strategy "index": dùng trực tiếp start/end index AI trả về.

Input:
- text — toàn bộ nội dung bài viết.
- errors — danh sách lỗi AI có startIndex/endIndex.

Output:
- Mảng TextSegment.
*/
function buildByIndex(text: string, errors: AIError[]): TextSegment[] {
  const resolved = errors
    .filter((e) => e.startIndex >= 0 && e.endIndex > e.startIndex && e.startIndex < text.length)
    .map((e) => ({
      startIndex: e.startIndex,
      endIndex: Math.min(e.endIndex, text.length), // chặn giá trị để không slice vượt biên
      error: e,
    }))

  return mergeAndBuild(text, resolved)
}

/*
Tìm vị trí originalText trong bài và chọn occurrence gần hint nhất.

Input:
- originalText — đoạn text lỗi cần tìm.
- hint — vị trí gợi ý từ AI.
- text — toàn bộ bài viết.

Output:
- { startIndex, endIndex } hoặc null nếu không tìm thấy.
*/
function resolveByText(originalText: string, hint: number, text: string): { startIndex: number; endIndex: number } | null {
  if (!originalText) return null

  // Thu thập tất cả vị trí xuất hiện của cụm từ cần tìm
  const occurrences: number[] = []
  let pos = text.indexOf(originalText)
  while (pos !== -1) {
    occurrences.push(pos)
    pos = text.indexOf(originalText, pos + 1)
  }

  if (!occurrences.length) return null

  // Chọn occurrence có vị trí gần hint nhất
  const best = occurrences.reduce((prev, curr) =>
    Math.abs(curr - hint) < Math.abs(prev - hint) ? curr : prev
  )

  return { startIndex: best, endIndex: best + originalText.length }
}

/*
Strategy "text": tìm lỗi theo originalText, dùng index AI làm gợi ý.

Input:
- text — toàn bộ bài viết.
- errors — danh sách lỗi AI.

Output:
- Mảng TextSegment.
*/
function buildByText(text: string, errors: AIError[]): TextSegment[] {
  const resolved = errors.flatMap((e) => {
    const pos = resolveByText(e.originalText, e.startIndex, text)
    return pos ? [{ ...pos, error: e }] : [] // bỏ qua lỗi không tìm thấy text tương ứng
  })

  return mergeAndBuild(text, resolved)
}

/*
Hook tách text thành segment thường/highlight và quản lý error đang active.

Input:
- text — nội dung bài viết.
- errors — danh sách lỗi AI.
- strategy — chiến lược resolve vị trí lỗi (text hoặc index).

Output:
- { segments, activeErrorId, setActiveErrorId }.
*/
export function useEssayHighlight(
  text: string,
  errors: AIError[],
  strategy: HighlightStrategy = 'text'
) {
  const [activeErrorId, setActiveErrorId] = useState<string | null>(null)

  const segments = useMemo(() => {
    if (!text) return []
    if (!errors.length) {
      // Không có lỗi thì trả về một segment thường duy nhất
      return [{ id: 'seg-0', text, startIndex: 0, isHighlighted: false, errors: [] as AIError[] }]
    }
    return strategy === 'index' ? buildByIndex(text, errors) : buildByText(text, errors)
  }, [text, errors, strategy])

  return { segments, activeErrorId, setActiveErrorId }
}
