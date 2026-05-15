// Tooltip hiển thị chi tiết lỗi AI cho đoạn text được highlight.
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import type { AIError } from "@/types/ai-result.types";
import { ERROR_CATEGORY_STYLES } from "@/constants/error-category";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.RESULT;

const SEVERITY_STYLES: Record<
  "low" | "medium" | "high",
  { label: string; classes: string }
> = {
  high:   { label: T.SEVERITY_HIGH,   classes: "bg-red-100 text-red-700"   },
  medium: { label: T.SEVERITY_MEDIUM, classes: "bg-amber-100 text-amber-700" },
  low:    { label: T.SEVERITY_LOW,    classes: "bg-green-100 text-green-700" },
};

interface ErrorTooltipProps {
  // Danh sách lỗi gắn với đoạn highlight.
  errors: AIError[];
  // Nội dung trigger tooltip.
  children: React.ReactNode;
}

/*
Component tooltip lỗi AI.

Input:
- errors — các lỗi AI của đoạn đang hover.
- children — node trigger để hiển thị tooltip.

Output:
- Popup chứa category, severity, suggestion và explanation của lỗi.
*/
export function ErrorTooltip({ errors, children }: ErrorTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      <TooltipContent
        side="top"
        sideOffset={6}
        className="z-50 w-72 rounded-lg border border-border bg-card p-0 shadow-lg"
      >
        {errors.map((error, i) => {
          const categoryStyle = ERROR_CATEGORY_STYLES[error.category];
          const severity      = SEVERITY_STYLES[error.severity ?? "medium"];

          return (
            <div key={i}>
              {/* Ngăn cách khi có nhiều lỗi trên cùng một segment */}
              {i > 0 && <div className="border-t border-border" />}

              <div className="p-3 space-y-2">
                {/* Header: category + severity */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{T.TOOLTIP_CATEGORY_LABEL}:</span>
                    <span className={`h-2 w-2 rounded-full ${categoryStyle.badge}`} />
                    <span className="text-xs font-semibold text-foreground">{categoryStyle.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{T.TOOLTIP_SEVERITY_LABEL}:</span>
                    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${severity.classes}`}>
                      {severity.label}
                    </span>
                  </div>
                </div>

                {/* Suggestion thay thế đoạn lỗi */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground">{T.TOOLTIP_SUGGESTION_LABEL}:</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono font-medium text-foreground">
                    {error.suggestion}
                  </span>
                </div>

                {/* Giải thích lỗi */}
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {error.explanation}
                </p>

              </div>
            </div>
          )

        })}
      </TooltipContent>
    </Tooltip>
  );
}
