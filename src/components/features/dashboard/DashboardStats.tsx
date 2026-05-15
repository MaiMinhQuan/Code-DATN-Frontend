// Khối thống kê nhanh trên dashboard.
import { TrendingUp, FileText, Flame, BookOpen } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.DASHBOARD;

interface DashboardStatsProps {
  // Tổng số bài đã nộp.
  totalSubmissions: number;
  // Band trung bình (null nếu chưa có dữ liệu).
  avgBand: number | null;
  // Streak ngày luyện tập liên tiếp.
  streak: number;
  // Số thẻ flashcard đến hạn ôn.
  dueCards: number;
}

// Cấu hình card thống kê từ dữ liệu đầu vào.
const STATS = (p: DashboardStatsProps) => [
  {
    label: T.STAT_SUBMISSIONS,
    value: p.totalSubmissions,
    icon: FileText,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: T.STAT_AVG_BAND,
    // Hiển thị 1 chữ số thập phân, hoặc dấu gạch ngang nếu chưa có điểm
    value: p.avgBand !== null ? p.avgBand.toFixed(1) : "—",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    label: T.STAT_STREAK,
    value: p.streak > 0 ? `${p.streak} ngày` : "—",
    icon: Flame,
    color: "bg-orange-100 text-orange-600",
  },
  {
    label: T.STAT_DUE_CARDS,
    value: p.dueCards,
    icon: BookOpen,
    color: "bg-violet-100 text-violet-600",
  },
];

/*
Component hiển thị các card thống kê.

Input:
- totalSubmissions — tổng số bài đã nộp.
- avgBand — điểm band trung bình.
- streak — số ngày streak.
- dueCards — số thẻ cần ôn.

Output:
- Grid 4 card thống kê trên dashboard.
*/
export function DashboardStats(props: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STATS(props).map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
