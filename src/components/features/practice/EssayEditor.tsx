"use client";

import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";

interface EssayEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function getWordCount(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function getWordCountColor(count: number): string {
  if (count === 0) return "text-[var(--muted-foreground)]";
  if (count < UI_TEXT.PRACTICE.WORD_COUNT_MIN) return "text-red-500";
  if (count < 300) return "text-amber-500";
  return "text-emerald-500";
}

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

      {/* Footer: word count + hint */}
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
