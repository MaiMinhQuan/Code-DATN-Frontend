"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import type { AIError } from "@/types/ai-result.types";
import { ErrorCategory } from "@/types/enums";
import { UI_TEXT } from "@/constants/ui-text";

interface ErrorTooltipProps {
  error: AIError;
  children: React.ReactNode;
}

const SEVERITY_COLOR: Record<AIError["severity"], string> = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low:    "bg-green-100 text-green-700",
};

export function ErrorTooltip({ error, children }: ErrorTooltipProps) {
  const categoryLabel =
    UI_TEXT.ERROR_CATEGORY[error.category as keyof typeof UI_TEXT.ERROR_CATEGORY];

  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <span className="cursor-help">{children}</span>
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          align="start"
          sideOffset={6}
          className="
            z-50 w-72 rounded-lg border border-slate-200
            bg-white p-3 shadow-lg
            animate-in fade-in-0 zoom-in-95
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0
          "
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {categoryLabel}
            </span>
            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${SEVERITY_COLOR[error.severity]}`}>
              {error.severity}
            </span>
          </div>

          {error.suggestion && (
            <div className="mb-2">
              <p className="text-xs font-medium text-slate-400">{UI_TEXT.RESULT.TOOLTIP_SUGGESTION}</p>
              <p className="text-sm font-semibold text-slate-800">{error.suggestion}</p>
            </div>
          )}

          {error.explanation && (
            <div>
              <p className="text-xs font-medium text-slate-400">{UI_TEXT.RESULT.TOOLTIP_EXPLANATION}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{error.explanation}</p>
            </div>
          )}

          <Tooltip.Arrow className="fill-white drop-shadow-sm" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
