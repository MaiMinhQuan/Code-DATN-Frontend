// Biểu đồ SVG thể hiện xu hướng band score theo thời gian.
import { BarChart2 } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import type { Submission } from "@/types/submission.types";

const T = UI_TEXT.DASHBOARD;

interface ChartPoint {
  // Giá trị band tại một thời điểm.
  band: number;
  // Nhãn ngày (dd/MM) để hiển thị trục X.
  label: string;
}

// Kích thước viewport SVG.
const W = 480, H = 160;

// Padding của vùng vẽ biểu đồ.
const PAD = { l: 28, r: 12, t: 14, b: 28 };
const chartW = W - PAD.l - PAD.r;
const chartH = H - PAD.t - PAD.b;

// Tính vị trí X theo index điểm dữ liệu.
function xPos(i: number, total: number): number {
  // Nếu chỉ có 1 điểm thì đặt vào giữa biểu đồ
  return PAD.l + (total === 1 ? chartW / 2 : (i / (total - 1)) * chartW);
}

// Tính vị trí Y từ band score (đảo trục vì SVG có Y tăng dần xuống dưới).
function yPos(band: number, yMin: number, yMax: number): number {
  return PAD.t + (1 - (band - yMin) / (yMax - yMin)) * chartH;
}

interface BandScoreChartProps {
  // Danh sách submissions dùng để dựng biểu đồ.
  submissions: Submission[];
}

/*
Component biểu đồ band score.

Input:
- submissions — danh sách submission đã chấm.

Output:
- Biểu đồ đường band score hoặc empty state khi thiếu dữ liệu.
*/
export function BandScoreChart({ submissions }: BandScoreChartProps) {
  // Lấy tối đa 10 điểm gần nhất có đủ band + ngày nộp
  const points: ChartPoint[] = submissions
    .filter((s) => s.aiResult?.overallBand !== undefined && s.submittedAt)
    .slice(-10)
    .map((s) => ({
      band: s.aiResult!.overallBand,
      label: new Date(s.submittedAt!).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      }),
    }));

  // Tính range trục Y và chừa padding để biểu đồ thoáng hơn
  const yMin = Math.max(0, Math.floor(Math.min(...points.map((p) => p.band))) - 0.5);
  const yMax = Math.min(9, Math.ceil(Math.max(...points.map((p) => p.band))) + 0.5);
  const yRange = yMax - yMin || 1; // avoid division by zero when all scores are equal

  const coords = points.map((p, i) => ({
    x: xPos(i, points.length),
    y: yPos(p.band, yMin, yMax),
    ...p,
  }));

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");

  // Sinh 4 mốc chia đều cho trục Y
  const yTicks = Array.from({ length: 4 }, (_, i) =>
    +(yMin + (i / 3) * yRange).toFixed(1),
  );

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">{T.CHART_TITLE}</h2>
      </div>

      {/* Cần ít nhất 2 điểm để vẽ đường xu hướng */}
      {points.length < 2 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
          <BarChart2 className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">{T.CHART_EMPTY}</p>
        </div>
      ) : (
        <div className="p-5">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid ngang + nhãn trục Y */}
            {yTicks.map((tick) => {
              const y = yPos(tick, yMin, yMax);
              return (
                <g key={tick}>
                  <line
                    x1={PAD.l}
                    y1={y}
                    x2={W - PAD.r}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <text
                    x={PAD.l - 4}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#94a3b8"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Đường xu hướng */}
            <polyline
              fill="none"
              stroke="rgb(99 102 241)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={polylinePoints}
            />

            {/* Điểm dữ liệu + nhãn band và ngày */}
            {coords.map((c, i) => (
              <g key={i}>
                <circle cx={c.x} cy={c.y} r="4" fill="rgb(99 102 241)" />
                <text
                  x={c.x}
                  y={c.y - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="rgb(99 102 241)"
                >
                  {c.band.toFixed(1)}
                </text>
                <text
                  x={c.x}
                  y={H - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                >
                  {c.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}
