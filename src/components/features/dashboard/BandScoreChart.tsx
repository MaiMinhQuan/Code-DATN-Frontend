// Biểu đồ phân bổ số lượng bài nộp theo từng band score.
import { BarChart2 } from "lucide-react";
import type { Submission } from "@/types/submission.types";

interface BandScoreChartProps {
  submissions: Submission[];
}

// Màu sắc theo mức band.
function getBandColor(band: number): { bar: string; bg: string; badge: string } {
  if (band >= 7)   return { bar: "bg-emerald-500", bg: "bg-emerald-50",  badge: "bg-emerald-100 text-emerald-700" };
  if (band >= 6)   return { bar: "bg-blue-500",    bg: "bg-blue-50",     badge: "bg-blue-100 text-blue-700"       };
  if (band >= 5)   return { bar: "bg-amber-500",   bg: "bg-amber-50",    badge: "bg-amber-100 text-amber-700"     };
  return             { bar: "bg-red-500",     bg: "bg-red-50",      badge: "bg-red-100 text-red-700"         };
}

export function BandScoreChart({ submissions }: BandScoreChartProps) {
  // Đếm số bài theo từng band (làm tròn 1 chữ số thập phân)
  const countMap = new Map<number, number>();
  for (const s of submissions) {
    const band = s.aiResult?.overallBand;
    if (band === undefined) continue;
    const key = Math.round(band * 2) / 2; // làm tròn về bội số 0.5
    countMap.set(key, (countMap.get(key) ?? 0) + 1);
  }

  // Sắp xếp giảm dần theo band
  const rows = Array.from(countMap.entries())
    .sort(([a], [b]) => b - a);

  const max = rows[0]?.[1] ?? 1;
  const total = submissions.filter(s => s.aiResult?.overallBand !== undefined).length;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">Phân bổ band score</h2>
        {total > 0 && (
          <span className="text-xs text-muted-foreground">{total} bài đã chấm</span>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
          <BarChart2 className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-5">
          {rows.map(([band, count]) => {
            const { bar, bg, badge } = getBandColor(band);
            const pct = (count / max) * 100;
            const share = Math.round((count / total) * 100);

            return (
              <div key={band} className="flex items-center gap-3">
                {/* Badge band score */}
                <span className={`w-12 shrink-0 rounded-md px-1.5 py-0.5 text-center text-xs font-bold ${badge}`}>
                  {band.toFixed(1)}
                </span>

                {/* Thanh biểu đồ */}
                <div className={`relative h-7 flex-1 overflow-hidden rounded-md ${bg}`}>
                  <div
                    className={`h-full rounded-md ${bar} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Số bài + tỉ lệ % */}
                <div className="flex w-20 shrink-0 items-center justify-end gap-1.5">
                  <span className="text-xs font-semibold text-foreground">{count} bài</span>
                  <span className="text-[11px] text-muted-foreground">({share}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
