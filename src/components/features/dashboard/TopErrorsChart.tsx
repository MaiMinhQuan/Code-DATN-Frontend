// Biểu đồ top lỗi AI xuất hiện nhiều nhất trên dashboard.
import { AlertCircle } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import { ErrorCategory } from "@/types/enums";
import type { Submission } from "@/types/submission.types";

const T = UI_TEXT.DASHBOARD;

// Cấu hình nhãn và màu theo từng nhóm lỗi.
const CATEGORY_CONFIG: Record<ErrorCategory, { label: string; color: string; bg: string }> = {
  [ErrorCategory.GRAMMAR]:       { label: "Ngữ pháp",   color: "bg-red-500",    bg: "bg-red-50"    },
  [ErrorCategory.VOCABULARY]:    { label: "Từ vựng",    color: "bg-blue-500",   bg: "bg-blue-50"   },
  [ErrorCategory.COHERENCE]:     { label: "Liên kết",   color: "bg-violet-500", bg: "bg-violet-50" },
  [ErrorCategory.TASK_RESPONSE]: { label: "Nội dung",   color: "bg-amber-500",  bg: "bg-amber-50"  },
  [ErrorCategory.SPELLING]:      { label: "Chính tả",   color: "bg-emerald-500",bg: "bg-emerald-50"},
  [ErrorCategory.PUNCTUATION]:   { label: "Dấu câu",    color: "bg-slate-400",  bg: "bg-slate-50"  },
};

interface TopErrorsChartProps {
  // Danh sách submissions để tổng hợp lỗi.
  submissions: Submission[];
}

/*
Component biểu đồ top lỗi.

Input:
- submissions — dữ liệu bài nộp đã chấm.

Output:
- Danh sách cột ngang top lỗi hoặc empty state.
*/
export function TopErrorsChart({ submissions }: TopErrorsChartProps) {
  // Đếm số lần xuất hiện của từng loại lỗi
  const counts: Partial<Record<ErrorCategory, number>> = {};
  for (const s of submissions) {
    for (const err of s.aiResult?.errors ?? []) {
      counts[err.category] = (counts[err.category] ?? 0) + 1;
    }
  }

  // Sắp xếp giảm dần và lấy tối đa 6 nhóm lỗi
  const sorted = (Object.entries(counts) as [ErrorCategory, number][])
    .filter(([category]) => category in CATEGORY_CONFIG)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  // Dùng giá trị lớn nhất làm mốc 100% chiều dài cột
  const max = sorted[0]?.[1] ?? 1;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">{T.ERROR_CHART_TITLE}</h2>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">{T.ERROR_CHART_EMPTY}</p>
          <p className="text-xs text-muted-foreground">{T.ERROR_CHART_EMPTY_HINT}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-5">
          {sorted.map(([category, count]) => {
            const cfg = CATEGORY_CONFIG[category];
            const pct = (count / max) * 100;
            return (
              <div key={category} className="flex items-center gap-3">
                {/* Tên loại lỗi */}
                <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">
                  {cfg.label}
                </span>

                {/* Thanh biểu đồ theo tỷ lệ phần trăm */}
                <div className={`relative h-6 flex-1 overflow-hidden rounded-md ${cfg.bg}`}>
                  <div
                    className={`h-full rounded-md ${cfg.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Số lượt lỗi */}
                <span className="w-10 shrink-0 text-right text-xs font-semibold text-foreground">
                  {count}
                  <span className="ml-0.5 font-normal text-muted-foreground">
                    {" "}{T.ERROR_CHART_SUFFIX}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
