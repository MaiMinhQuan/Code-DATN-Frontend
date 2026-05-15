// Panel hiển thị đầy đủ thông tin đề bài writing hiện tại.
import { Layers, Gauge, Hash } from "lucide-react";
import { ExamQuestion } from "@/types/exam-question.types";
import { UI_TEXT } from "@/constants/ui-text";
import { cn } from "@/lib/utils";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface QuestionPanelProps {
  // Dữ liệu đề cần render.
  question: ExamQuestion;
}

const DIFFICULTY_CONFIG: Record<
  number,
  { label: string; dot: string; bg: string; text: string; ring: string }
> = {
  1: { label: "Cơ bản",    dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  2: { label: "Dễ",        dot: "bg-teal-500",    bg: "bg-teal-50",    text: "text-teal-700",    ring: "ring-teal-200"    },
  3: { label: "Trung bình",dot: "bg-amber-500",   bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200"   },
  4: { label: "Khó",       dot: "bg-orange-500",  bg: "bg-orange-50",  text: "text-orange-700",  ring: "ring-orange-200"  },
  5: { label: "Rất khó",   dot: "bg-red-500",     bg: "bg-red-50",     text: "text-red-700",     ring: "ring-red-200"     },
};

/*
Component panel đề bài.

Input:
- question — dữ liệu đề thi writing.

Output:
- Header metadata, prompt đề và phần hướng dẫn gợi ý (nếu có).
*/
export function QuestionPanel({ question }: QuestionPanelProps) {
  const difficulty = DIFFICULTY_CONFIG[question.difficultyLevel];

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-5 space-y-5">
      {/* Nhãn chủ đề + độ khó */}
      <div className="flex flex-wrap items-center gap-2">
        {question.topicId?.name && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
            <Layers className="h-3 w-3" />
            {question.topicId.name}
          </span>
        )}

        
        {difficulty && (
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
              "text-xs font-medium ring-1 ring-inset",
              difficulty.bg, difficulty.text, difficulty.ring
            )}
          >
            <Gauge className="h-3 w-3" />
            {difficulty.label}
            {/* Dot biểu diễn mức độ khó */}
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    i < question.difficultyLevel ? difficulty.dot : "bg-slate-200"
                  )}
                />
              ))}
            </span>
          </span>
        )}
      </div>

      {/* Danh sách tag của đề */}
      {question.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
            >
              <Hash className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Tiêu đề đề bài */}
      <h1 className="text-lg font-semibold leading-snug text-[var(--foreground)]">
        {question.title}
      </h1>

      {/* Prompt chính để người học viết bài */}
      <div className={cn(
        "rounded-lg border-l-4 border-indigo-500 bg-indigo-50 px-4 py-4",
        "text-sm leading-relaxed text-[var(--foreground)]"
      )}>
        {question.questionPrompt}
      </div>

      {/* Gợi ý triển khai dàn ý */}
      {question.suggestedOutline && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            {UI_TEXT.PRACTICE.TASK_INSTRUCTION}
          </p>
          <MarkdownContent content={question.suggestedOutline} />
        </div>
      )}

    </div>
  );
}
