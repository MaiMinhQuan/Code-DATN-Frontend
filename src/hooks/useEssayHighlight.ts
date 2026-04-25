import { useMemo } from "react";
import type { AIError } from "@/types/ai-result.types";

export interface TextSegment {
  text: string;
  error?: AIError;
}

// ─── Chiến lược 1: Tin vào startIndex / endIndex từ Gemini ───────────────────
function buildSegmentsByIndex(
  content: string,
  errors: AIError[]
): TextSegment[] {
  if (!content) return [];
  if (!errors.length) return [{ text: content }];

  const sorted = [...errors]
    .filter(
      (e) =>
        e.startIndex >= 0 &&
        e.endIndex <= content.length &&
        e.startIndex < e.endIndex
    )
    .sort((a, b) => a.startIndex - b.startIndex);

  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const error of sorted) {
    if (error.startIndex < cursor) continue;

    if (error.startIndex > cursor) {
      segments.push({ text: content.slice(cursor, error.startIndex) });
    }

    segments.push({ text: content.slice(error.startIndex, error.endIndex), error });
    cursor = error.endIndex;
  }

  if (cursor < content.length) {
    segments.push({ text: content.slice(cursor) });
  }

  return segments;
}

// ─── Chiến lược 2: Tìm ngược bằng originalText ───────────────────────────────
// Với mỗi lỗi, tìm tất cả vị trí xuất hiện của originalText trong bài viết.
// Nếu chỉ có 1 kết quả → dùng luôn.
// Nếu có nhiều kết quả → dùng startIndex từ Gemini làm "gợi ý" để chọn
//   vị trí gần nhất (hữu ích khi index bị lệch nhưng text đúng).
// Nếu không tìm thấy → bỏ qua lỗi đó (không highlight).
function resolveErrorPositions(
  content: string,
  errors: AIError[]
): Array<{ start: number; end: number; error: AIError }> {
  const resolved: Array<{ start: number; end: number; error: AIError }> = [];

  for (const error of errors) {
    const { originalText, startIndex } = error;
    if (!originalText) continue;

    // Tìm tất cả vị trí xuất hiện của originalText
    const occurrences: number[] = [];
    let searchFrom = 0;
    while (searchFrom < content.length) {
      const idx = content.indexOf(originalText, searchFrom);
      if (idx === -1) break;
      occurrences.push(idx);
      searchFrom = idx + 1;
    }

    if (occurrences.length === 0) continue;

    // Chọn vị trí gần startIndex nhất (dùng index từ Gemini làm gợi ý)
    const best = occurrences.reduce((prev, curr) =>
      Math.abs(curr - startIndex) < Math.abs(prev - startIndex) ? curr : prev
    );

    resolved.push({
      start: best,
      end: best + originalText.length,
      error,
    });
  }

  return resolved;
}

function buildSegmentsByText(
  content: string,
  errors: AIError[]
): TextSegment[] {
  if (!content) return [];
  if (!errors.length) return [{ text: content }];

  const resolved = resolveErrorPositions(content, errors).sort(
    (a, b) => a.start - b.start
  );

  if (!resolved.length) return [{ text: content }];

  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const { start, end, error } of resolved) {
    if (start < cursor) continue;

    if (start > cursor) {
      segments.push({ text: content.slice(cursor, start) });
    }

    segments.push({ text: content.slice(start, end), error });
    cursor = end;
  }

  if (cursor < content.length) {
    segments.push({ text: content.slice(cursor) });
  }

  return segments;
}

// ─── Hook export ──────────────────────────────────────────────────────────────
export type HighlightStrategy = "index" | "text";

export function useEssayHighlight(
  essayContent: string,
  errors: AIError[],
  strategy: HighlightStrategy = "text"
): TextSegment[] {
  return useMemo(() => {
    if (strategy === "index") {
      return buildSegmentsByIndex(essayContent, errors);
    }
    return buildSegmentsByText(essayContent, errors);
  }, [essayContent, errors, strategy]);
}
