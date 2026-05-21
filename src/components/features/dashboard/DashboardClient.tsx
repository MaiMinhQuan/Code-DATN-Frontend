"use client";

// Container chính của dashboard: lấy dữ liệu, tính stats và render các widget.
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSubmissions } from "@/hooks/useSubmission";
import { useFlashcardSets } from "@/hooks/useFlashcards";
import { SubmissionStatus } from "@/types/enums";
import { DashboardStats } from "./DashboardStats";
import { QuickActions } from "./QuickActions";
import { RecentSubmissions } from "./RecentSubmissions";
import { TopErrorsChart } from "./TopErrorsChart";
import { BandScoreChart } from "./BandScoreChart";
import { PenLine, BookOpen, BarChart3, Trophy, CheckCircle2, Sparkles } from "lucide-react";
import type { Submission } from "@/types/submission.types";

function WelcomeBanner() {
  const router = useRouter();

  const steps = [
    {
      num: "01",
      icon: PenLine,
      color: "bg-blue-100 text-blue-600",
      title: "Chọn đề và viết bài",
      desc: "Lựa chọn đề thi theo chủ đề và độ khó phù hợp với mục tiêu của bạn.",
    },
    {
      num: "02",
      icon: Sparkles,
      color: "bg-amber-100 text-amber-600",
      title: "AI chấm bài tự động",
      desc: "Bài viết được phân tích theo 4 tiêu chí IELTS chỉ trong vài giây.",
    },
    {
      num: "03",
      icon: BarChart3,
      color: "bg-emerald-100 text-emerald-600",
      title: "Nhận kết quả chi tiết",
      desc: "Xem điểm band, lỗi cụ thể và gợi ý cải thiện để tiến bộ nhanh hơn.",
    },
  ];

  const preview = [
    { icon: Trophy,   color: "bg-amber-100 text-amber-600",   label: "Band score",      value: "6.5" },
    { icon: BarChart3,color: "bg-violet-100 text-violet-600", label: "Phân tích lỗi",   value: "Chi tiết" },
    { icon: BookOpen, color: "bg-blue-100 text-blue-600",     label: "Gợi ý cải thiện", value: "Cá nhân hóa" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Card trái 2/3 — hướng dẫn 3 bước */}
      <div className="lg:col-span-2 flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Bắt đầu từ đây</p>
          <h2 className="mt-1 text-base font-bold text-foreground">3 bước để nhận phân tích bài viết từ AI</h2>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${step.color}`}>
                <step.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground/50">{step.num}</span>
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          <button
            onClick={() => router.push("/practice")}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <PenLine className="h-3.5 w-3.5" />
            Làm bài ngay
          </button>
          <button
            onClick={() => router.push("/sample-essays")}
            className="flex items-center gap-2 rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Xem bài mẫu
          </button>
        </div>
      </div>

      {/* Card phải 1/3 — xem trước kết quả */}
      <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Sau khi nộp bài</p>
        <h3 className="mt-1 text-sm font-bold text-foreground">Bạn sẽ nhận được</h3>

        <div className="mt-5 flex flex-1 flex-col gap-3">
          {preview.map(({ icon: Icon, color, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2.5">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground">{value}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            </div>
          ))}
        </div>

        <p className="mt-5 rounded-lg bg-primary/5 px-3 py-2.5 text-center text-xs leading-relaxed text-primary border border-primary/10">
          Kết quả phân tích sẵn sàng<br />chỉ trong vài giây
        </p>
      </div>
    </div>
  );
}

/*
Tính streak theo ngày nộp bài liên tiếp.

Input:
- submissions — danh sách submission đã hoàn thành.

Output:
- Số ngày streak liên tiếp.
*/
function calculateStreak(submissions: Submission[]): number {
  // Tạo set ngày (YYYY-M-D) có phát sinh submission
  const days = new Set(
    submissions
      .filter((s) => s.submittedAt)
      .map((s) => {
        const d = new Date(s.submittedAt!);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      }),
  );

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Chuẩn hóa key ngày để so sánh trong set
  const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const todayKey = key(today);
  const yesterdayKey = key(yesterday);

  // Nếu cả hôm nay và hôm qua đều không nộp thì streak = 0
  if (!days.has(todayKey) && !days.has(yesterdayKey)) return 0;

  // Bắt đầu đếm từ hôm nay (nếu có), ngược lại bắt đầu từ hôm qua
  const start = days.has(todayKey) ? today : yesterday;
  let streak = 0;
  const cursor = new Date(start);

  // Đi lùi từng ngày cho đến khi đứt streak
  while (days.has(key(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/*
Component trang dashboard phía client.

Input:
- Không có props.

Output:
- Các khối dashboard: stats, quick actions, top errors và recent submissions.
*/
export function DashboardClient() {
  const { data: submissionsData, isLoading: subLoading } = useSubmissions({
    status: SubmissionStatus.COMPLETED,
    limit: 50,
  });

  const { data: sets = [], isLoading: setsLoading } = useFlashcardSets();

  const submissions = submissionsData?.data ?? [];
  const totalCount = submissionsData?.total ?? 0;

  // Tính toán stats từ submissions + flashcards (memo để tránh tính lại không cần thiết)
  const stats = useMemo(() => {
    // Gom điểm overall band để tính trung bình
    const bands = submissions
      .map((s) => s.aiResult?.overallBand)
      .filter((b): b is number => b !== undefined);

    const avgBand =
      bands.length > 0
        ? bands.reduce((a, b) => a + b, 0) / bands.length
        : null;

    return {
      totalSubmissions: totalCount,
      avgBand,
      streak: calculateStreak(submissions),
      flashcardSets: sets.length,
    };
  }, [submissions, totalCount, sets]);

  const isLoading = subLoading || setsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        {/* Skeleton quick actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        {/* Skeleton chart + recent submissions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="h-56 animate-pulse rounded-xl bg-muted lg:col-span-2" />
          <div className="h-56 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardStats {...stats} />

      <QuickActions flashcardSets={stats.flashcardSets} />

      {submissions.length === 0 ? (
        <WelcomeBanner />
      ) : (
        <>
          <BandScoreChart submissions={submissions} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="flex h-full flex-col lg:col-span-2">
              <TopErrorsChart submissions={submissions} />
            </div>
            <RecentSubmissions submissions={submissions.slice(0, 3)} totalCount={totalCount} />
          </div>
        </>
      )}
    </div>
  );
}
