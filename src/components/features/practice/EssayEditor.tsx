"use client";

// Trình soạn thảo bài viết Task 2 với đếm số từ realtime.
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";

interface EssayEditorProps {
  // Nội dung bài viết hiện tại.
  value: string;
  // Callback cập nhật nội dung từ editor.
  onChange: (value: string) => void;
  // Trạng thái khóa editor.
  disabled?: boolean;
}

// Tính số từ thực tế dựa trên khoảng trắng.
function getWordCount(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

// Màu hiển thị chỉ số số từ theo mức đạt yêu cầu.
function getWordCountColor(count: number): string {
  if (count === 0) return "text-[var(--muted-foreground)]";
  if (count < UI_TEXT.PRACTICE.WORD_COUNT_MIN) return "text-red-500";   // below minimum
  if (count < 300) return "text-amber-500";                              // acceptable but short
  return "text-emerald-500";                                             // good length
}

/*
Component editor bài viết.

Input:
- value — nội dung bài viết.
- onChange — hàm nhận nội dung mới.
- disabled — trạng thái khóa nhập liệu (optional).

Output:
- Textarea autosize và nhãn số từ kèm trạng thái màu.
*/
export function EssayEditor({ value, onChange, disabled = false }: EssayEditorProps) {
  const wordCount = getWordCount(value);

  return (
    <div className="flex h-full flex-col">
      <TextareaAutosize
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={UI_TEXT.PRACTICE.PLACEHOLDER_ESSAY}
        minRows={12}
        className={cn(
          "w-full flex-1 resize-none rounded-lg border border-[var(--border)] bg-[var(--card)]",
          "px-4 py-3 text-sm leading-relaxed text-[var(--foreground)]",
          "placeholder:text-[var(--muted-foreground)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "transition-colors"
        )}
      />

      {/* Footer nhắc số từ tối thiểu và bộ đếm realtime */}
      <div className="mt-2 flex items-center justify-between px-1">
        <span className="text-xs text-[var(--muted-foreground)]">
          {UI_TEXT.PRACTICE.WORD_COUNT_HINT}
        </span>
        <span className={cn("text-xs font-medium tabular-nums", getWordCountColor(wordCount))}>
          {UI_TEXT.PRACTICE.LABEL_WORD_COUNT(wordCount)}
        </span>
      </div>
    </div>
  );
}
