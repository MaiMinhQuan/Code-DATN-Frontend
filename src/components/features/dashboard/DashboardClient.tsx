"use client";

// Container chính của dashboard: lấy dữ liệu, tính stats và render các widget.
import { useMemo } from "react";
import { useSubmissions } from "@/hooks/useSubmission";
import { useFlashcardSets } from "@/hooks/useFlashcards";
import { SubmissionStatus } from "@/types/enums";
import { DashboardStats } from "./DashboardStats";
import { QuickActions } from "./QuickActions";
import { RecentSubmissions } from "./RecentSubmissions";
import { TopErrorsChart } from "./TopErrorsChart";
import type { Submission } from "@/types/submission.types";

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

    // Tổng số thẻ đến hạn ôn
    const dueCards = sets.reduce((sum, s) => sum + (s.dueCount ?? 0), 0);

    return {
      totalSubmissions: totalCount,
      avgBand,
      streak: calculateStreak(submissions),
      dueCards,
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

      <QuickActions dueCards={stats.dueCards} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Biểu đồ top lỗi chiếm 2 cột trên màn hình lớn */}
        <div className="flex h-full flex-col lg:col-span-2">
          <TopErrorsChart submissions={submissions} />
        </div>
        {/* Chỉ hiển thị 3 bài nộp gần nhất */}
        <RecentSubmissions
          submissions={submissions.slice(0, 3)}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
