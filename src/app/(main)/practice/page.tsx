// Trang danh sách đề luyện tập với filter chủ đề, độ khó và nút lấy đề ngẫu nhiên.
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Shuffle, Loader2, AlertCircle } from "lucide-react";
import { useExamQuestions } from "@/hooks/useExamQuestion";
import { useSubmissions } from "@/hooks/useSubmission";
import { examQuestionsService } from "@/services/exam-questions.service";
import { QuestionCard } from "@/components/features/practice/QuestionCard";
import { UI_TEXT } from "@/constants/ui-text";
import { SubmissionStatus } from "@/types/enums";
import { Submission } from "@/types/submission.types";
import { cn } from "@/lib/utils";

/*
Lấy questionId từ submission.

Input:
- sub — submission có thể chứa `questionId` dạng string hoặc object populate.

Output:
- Trả về questionId dạng chuỗi.
*/
function getQuestionId(sub: Submission): string {
  if (typeof sub.questionId === "string") return sub.questionId;
  return (sub.questionId as any)?._id?.toString() ?? "";
}

// Dễ gộp level 1-2, Trung bình = 3, Khó gộp level 4-5.
const DIFFICULTY_GROUPS = [
  { label: "Dễ",        values: [1, 2] },
  { label: "Trung bình", values: [3] },
  { label: "Khó",        values: [4, 5] },
] as const;

/*
Component PracticePage.

Output:
- Danh sách đề thi có filter client-side và hiển thị lịch sử điểm tốt nhất.
*/
export default function PracticePage() {
  const router = useRouter();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<readonly number[] | null>(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  const { data: questions = [], isLoading, isError } = useExamQuestions();

  // Chỉ lấy bài đã chấm xong để dựng map điểm tốt nhất và lịch sử làm bài
  const { data: submissionsData } = useSubmissions({
    status: SubmissionStatus.COMPLETED,
    limit: 50,
  });
  const completedSubmissions = submissionsData?.data ?? [];

  /* Map questionId -> band cao nhất người dùng từng đạt cho đề đó. */
  const bestBandByQuestion = useMemo(() => {
    const map = new Map<string, number>();
    completedSubmissions.forEach((sub) => {
      const qId = getQuestionId(sub);
      const band = sub.aiResult?.overallBand;
      if (!qId || band === undefined) return;
      const current = map.get(qId);
      // Luôn giữ band cao nhất qua mọi lần nộp
      if (current === undefined || band > current) map.set(qId, band);
    });
    return map;
  }, [completedSubmissions]);

  /* Map questionId -> danh sách submission hoàn thành để hiển thị lịch sử mỗi card. */
  const submissionsByQuestion = useMemo(() => {
    const map = new Map<string, typeof completedSubmissions>();
    completedSubmissions.forEach((sub) => {
      const qId = getQuestionId(sub);
      if (!qId) return;
      const existing = map.get(qId) ?? [];
      map.set(qId, [...existing, sub]);
    });
    return map;
  }, [completedSubmissions]);

  /* Danh sách topic unique lấy trực tiếp từ dữ liệu đề thi. */
  const topics = useMemo(() => {
    const seen = new Map<string, { _id: string; name: string }>();
    questions.forEach((q) => {
      if (q.topicId && !seen.has(q.topicId._id)) {
        seen.set(q.topicId._id, q.topicId);
      }
    });
    return Array.from(seen.values());
  }, [questions]);

  /* Danh sách đề sau khi áp dụng filter topic + độ khó. */
  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchTopic = !selectedTopicId || q.topicId?._id === selectedTopicId;
      const matchDiff = !selectedDifficulty || selectedDifficulty.includes(q.difficultyLevel);
      return matchTopic && matchDiff;
    });
  }, [questions, selectedTopicId, selectedDifficulty]);

  /*
  Lấy ngẫu nhiên một đề đã publish và điều hướng sang trang làm bài.

  Output:
  - Chuyển tới `/practice/{questionId}` khi thành công.
  */
  const handleRandom = async () => {
    setIsLoadingRandom(true);
    try {
      const q = await examQuestionsService.getRandomQuestion();
      router.push(`/practice/${q._id}`);
    } catch {
      setIsLoadingRandom(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header trang */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {UI_TEXT.PRACTICE_LIST.HEADING}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {UI_TEXT.PRACTICE_LIST.SUBHEADING}
          </p>
        </div>
        <button
          onClick={handleRandom}
          disabled={isLoadingRandom}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-lg",
            "border border-indigo-200 bg-indigo-50 px-4 py-2.5",
            "text-sm font-medium text-indigo-700 transition-colors",
            "hover:bg-indigo-100 disabled:opacity-60"
          )}
        >
          {isLoadingRandom
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Shuffle className="h-4 w-4" />
          }
          {UI_TEXT.PRACTICE_LIST.BTN_RANDOM}
        </button>
      </div>

      {/* Nhóm bộ lọc — 2 cột bằng nhau: chủ đề (trái) | độ khó (phải) */}
      <div className="flex items-stretch gap-0 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {/* Cột trái: filter chủ đề */}
        <div className="flex flex-1 flex-col gap-2 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Chủ đề
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTopicId(null)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                !selectedTopicId
                  ? "bg-indigo-600 text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-slate-200"
              )}
            >
              {UI_TEXT.PRACTICE_LIST.FILTER_ALL_TOPICS}
            </button>
            {topics.map((topic) => (
              <button
                key={topic._id}
                onClick={() => setSelectedTopicId(
                  selectedTopicId === topic._id ? null : topic._id
                )}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                  selectedTopicId === topic._id
                    ? "bg-indigo-600 text-white"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-slate-200"
                )}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>

        {/* Đường kẻ dọc phân cách */}
        <div className="w-px bg-[var(--border)]" />

        {/* Cột phải: filter độ khó (3 mức) */}
        <div className="flex flex-1 flex-col gap-2 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Độ khó
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty(null)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                !selectedDifficulty
                  ? "bg-slate-700 text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-slate-200"
              )}
            >
              {UI_TEXT.PRACTICE_LIST.FILTER_ALL_DIFFICULTY}
            </button>
            {DIFFICULTY_GROUPS.map((group) => {
              const isActive = selectedDifficulty?.toString() === group.values.toString();
              return (
                <button
                  key={group.label}
                  onClick={() => setSelectedDifficulty(isActive ? null : group.values)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-slate-700 text-white"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-slate-200"
                  )}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nội dung: loading / error / rỗng / lưới đề thi */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-sm text-[var(--muted-foreground)]">
            Không thể tải danh sách đề thi.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-24">
          <p className="font-medium text-[var(--foreground)]">
            {UI_TEXT.PRACTICE_LIST.EMPTY_TITLE}
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            {UI_TEXT.PRACTICE_LIST.EMPTY_DESC}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-[var(--muted-foreground)]">
            {filtered.length} đề thi
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((q) => (
              <QuestionCard
                key={q._id}
                question={q}
                userBestBand={bestBandByQuestion.get(q._id)}
                userSubmissions={submissionsByQuestion.get(q._id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
