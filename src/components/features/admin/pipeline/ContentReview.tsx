"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Database, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePipelineLessons,
  usePipelineCandidates,
  useUpdateLessons,
  useUpdateCandidates,
  useAnalyzePipeline,
  useSeedPipeline,
  pipelineKeys,
} from "@/hooks/useAdminPipeline";
import { LessonReview } from "./LessonReview";
import { CandidateReview } from "./CandidateReview";
import type { PipelineJob } from "@/types/pipeline.types";

interface Props {
  jobId: string;
  job: PipelineJob;
}

const REVIEW_STATUSES = ["waiting_review", "analyzing", "ready_to_seed", "done", "failed"];

export function ContentReview({ jobId, job }: Props) {
  const queryClient = useQueryClient();

  const [selectedLessons, setSelectedLessons] = useState<number[]>([]);
  const [selectedEssays, setSelectedEssays] = useState<number[]>([]);
  const [lessonsReady, setLessonsReady] = useState(false);
  const [essaysReady, setEssaysReady] = useState(false);

  const enableFetch = REVIEW_STATUSES.includes(job.status) ? jobId : null;

  const { data: lessons, isLoading: lessonsLoading } = usePipelineLessons(enableFetch);
  const {
    data: candidates,
    isLoading: candidatesLoading,
    isError: candidatesError,
  } = usePipelineCandidates(enableFetch);

  const updateLessons = useUpdateLessons(jobId);
  const updateCandidates = useUpdateCandidates(jobId);
  const analyzeMutation = useAnalyzePipeline(jobId);
  const seedMutation = useSeedPipeline(jobId);

  // Khởi tạo lựa chọn từ dữ liệu đã lưu trước đó
  useEffect(() => {
    if (lessons && !lessonsReady) {
      setSelectedLessons(
        lessons.map((l, i) => (l.approved !== false ? i : -1)).filter((i) => i >= 0),
      );
      setLessonsReady(true);
    }
  }, [lessons, lessonsReady]);

  useEffect(() => {
    if (candidates && !essaysReady) {
      setSelectedEssays(
        candidates.map((c, i) => (c.approved ? i : -1)).filter((i) => i >= 0),
      );
      setEssaysReady(true);
    }
  }, [candidates, essaysReady]);

  const toggleLesson = (i: number) =>
    setSelectedLessons((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  const toggleEssay = (i: number) =>
    setSelectedEssays((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  // Lưu lựa chọn + kích hoạt phân tích AI (hoặc lưu thẳng nếu skipEssays)
  const handleConfirm = async () => {
    const hasCandidates = !job.skipEssays && candidates && candidates.length > 0;
    if (hasCandidates && selectedEssays.length === 0) {
      toast.error("Hãy chọn ít nhất 1 bài mẫu để phân tích");
      return;
    }
    await updateLessons.mutateAsync(selectedLessons);
    if (hasCandidates) {
      await updateCandidates.mutateAsync(selectedEssays);
    }
    await analyzeMutation.mutateAsync();
    if (job.skipEssays) {
      // analyze đã set ready_to_seed ngay lập tức → seed luôn
      await seedMutation.mutateAsync();
      toast.success("Đã lưu vào hệ thống");
    } else {
      toast.success("Đã bắt đầu phân tích bài đã chọn");
    }
  };

  const handleSeed = async () => {
    await seedMutation.mutateAsync();
    toast.success("Đã bắt đầu seed vào database");
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["sample-essays"] });
      queryClient.invalidateQueries({ queryKey: ["exam-questions"] });
      queryClient.invalidateQueries({ queryKey: pipelineKeys.job(jobId) });
    }, 1000);
  };

  if (!REVIEW_STATUSES.includes(job.status)) return null;

  const isLoading = lessonsLoading || candidatesLoading;
  const isConfirming =
    updateLessons.isPending || updateCandidates.isPending || analyzeMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  const candidatesLoaded = candidates !== undefined; // đã fetch xong (dù rỗng hay có lỗi)
  const hasContent = (lessons?.length ?? 0) > 0 || (candidates?.length ?? 0) > 0 || candidatesError || candidatesLoaded;
  if (!hasContent) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-sm font-semibold text-slate-700">Duyệt nội dung</h2>

      <div className="space-y-6">
        {/* Lesson & Video */}
        {lessons && lessons.length > 0 && (
          <LessonReview
            lessons={lessons}
            selectedIndexes={selectedLessons}
            onToggle={toggleLesson}
          />
        )}

        {/* Divider */}
        {lessons && lessons.length > 0 && candidates && candidates.length > 0 && (
          <div className="border-t border-slate-100" />
        )}

        {/* Sample Essays — ẩn hoàn toàn khi skipEssays */}
        {!job.skipEssays && (
          candidates && candidates.length > 0 ? (
            <CandidateReview
              candidates={candidates}
              selectedIndexes={selectedEssays}
              onToggle={toggleEssay}
            />
          ) : candidatesError || (candidates && candidates.length === 0) ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <p className="font-medium">
                {candidatesError ? "Không tải được bài mẫu" : "Không tìm được bài mẫu nào"}
              </p>
              <p className="mt-0.5 text-xs text-amber-600">
                {candidatesError
                  ? "File bài mẫu chưa có hoặc bị lỗi."
                  : "Bước 5 scrape không tìm được bài mẫu từ web."}
                {" "}Bạn vẫn có thể tiếp tục phân tích bài học &amp; video đã chọn.
              </p>
            </div>
          ) : null
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-6">
        {job.status === "waiting_review" && (
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isConfirming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : job.skipEssays ? (
              <Database className="h-4 w-4" />
            ) : (
              <FlaskConical className="h-4 w-4" />
            )}
            {job.skipEssays ? "Xác nhận & Lưu vào hệ thống" : "Xác nhận & Bắt đầu phân tích"}
          </button>
        )}

        {job.status === "ready_to_seed" && (
          <button
            onClick={handleSeed}
            disabled={seedMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {seedMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            Lưu vào hệ thống
          </button>
        )}

        {job.status === "done" && (
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Đã lưu thành công vào hệ thống
          </p>
        )}
      </div>
    </div>
  );
}
