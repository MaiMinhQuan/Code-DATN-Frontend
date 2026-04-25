"use client";

import { ErrorCategory } from "@/types/enums";
import type { AIError } from "@/types/ai-result.types";
import { useEssayHighlight, type HighlightStrategy } from "@/hooks/useEssayHighlight";
import { ErrorTooltip } from "./ErrorTooltip";

interface AnnotatedEssayProps {
  essayContent: string;
  errors: AIError[];
  strategy?: HighlightStrategy;
}

const CATEGORY_STYLE: Record<ErrorCategory, string> = {
  [ErrorCategory.GRAMMAR]:       "bg-red-100 text-red-800 border-b-2 border-red-300",
  [ErrorCategory.SPELLING]:      "bg-orange-100 text-orange-800 border-b-2 border-orange-300",
  [ErrorCategory.VOCABULARY]:    "bg-yellow-100 text-yellow-800 border-b-2 border-yellow-300",
  [ErrorCategory.COHERENCE]:     "bg-purple-100 text-purple-800 border-b-2 border-purple-300",
  [ErrorCategory.TASK_RESPONSE]: "bg-blue-100 text-blue-800 border-b-2 border-blue-300",
  [ErrorCategory.PUNCTUATION]:   "bg-slate-100 text-slate-800 border-b-2 border-slate-300",
};

export function AnnotatedEssay({
  essayContent,
  errors,
  strategy = "text",
}: AnnotatedEssayProps) {
  const segments = useEssayHighlight(essayContent, errors, strategy);

  return (
    <div className="h-full overflow-y-auto p-6">
      <p className="whitespace-pre-wrap text-base leading-8 text-slate-800 font-serif">
        {segments.map((segment, index) => {
          if (!segment.error) {
            return <span key={index}>{segment.text}</span>;
          }

          return (
            <ErrorTooltip key={index} error={segment.error}>
              <span className={`rounded-sm px-0.5 ${CATEGORY_STYLE[segment.error.category]}`}>
                {segment.text}
              </span>
            </ErrorTooltip>
          );
        })}
      </p>
    </div>
  );
}
