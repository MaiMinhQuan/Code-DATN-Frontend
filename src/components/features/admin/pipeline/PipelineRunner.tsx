"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  Circle,
} from "lucide-react";
import { useCreatePipelineJob, usePipelineJob, pipelineKeys } from "@/hooks/useAdminPipeline";
import { usePipelineSocket } from "@/hooks/usePipelineSocket";
import { useQueryClient } from "@tanstack/react-query";
import { ContentReview } from "./ContentReview";
import type { PipelineJob } from "@/types/pipeline.types";

interface FormValues {
  topic: string;
  maxVideos: number;
  maxEssays: number;
}

// ─── Step definitions ─────────────────────────────────────────────────────────

type StepPhase = "run" | "scrape" | "analyze" | "seed";
type StepState = "done" | "active" | "pending" | "failed";

interface StepDef {
  key: string;
  label: string;
  phase: StepPhase;
  stepNum: number;
  doneText: string;
  keywords: string[];
}

const STEPS: StepDef[] = [
  {
    key: "s1", label: "Tìm video",       phase: "run",     stepNum: 1,
    doneText: "Video YouTube đã tìm thấy",
    keywords: ["video", "tim duoc", "ket qua"],
  },
  {
    key: "s2", label: "Tải phụ đề video",      phase: "run",     stepNum: 2,
    doneText: "Phụ đề video đã tải về",
    keywords: ["subtitle", "transcript", "tai ve"],
  },
  {
    key: "s3", label: "AI phân tích nội dung", phase: "run",     stepNum: 3,
    doneText: "Từ vựng & ngữ pháp đã trích xuất",
    keywords: ["vocab", "grammar", "tu vung", "ngu phap", "extract"],
  },
  {
    key: "s4", label: "Tạo bài học",           phase: "run",     stepNum: 4,
    doneText: "Bài học và thẻ từ vựng đã tạo",
    keywords: ["lesson", "flashcard", "tong hop", "da tao"],
  },
  {
    key: "s5", label: "Tìm bài mẫu",           phase: "scrape",  stepNum: 5,
    doneText: "Bài mẫu đã thu thập từ web",
    keywords: ["essay", "candidate", "bai mau", "scrape", "tim duoc"],
  },
  {
    key: "s5b", label: "Phân tích bài mẫu",    phase: "analyze", stepNum: 5,
    doneText: "AI đã chấm điểm và tạo highlight",
    keywords: ["annotation", "band", "phan tich", "analysed", "da luu"],
  },
  {
    key: "s6", label: "Lưu vào hệ thống",      phase: "seed",    stepNum: 6,
    doneText: "Đã lưu tất cả vào hệ thống",
    keywords: ["seed", "hoan thanh", "da tao", "insert"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PAST_RUN_STATUSES = ["waiting_review", "analyzing", "ready_to_seed", "seeding", "done"];

function getStepState(step: StepDef, job: PipelineJob): StepState {
  const { status, currentStep } = job;

  if (step.phase === "run") {
    const s = step.stepNum;
    if (currentStep > s) return "done";
    if (PAST_RUN_STATUSES.includes(status)) return "done";
    if (currentStep === s && status === "running") return "active";
    if (currentStep === s && status === "failed") return "failed";
    return "pending";
  }

  if (step.phase === "scrape") {
    if (PAST_RUN_STATUSES.includes(status)) return "done";
    if (currentStep === 5 && status === "running") return "active";
    if (currentStep === 5 && status === "failed") return "failed";
    return "pending";
  }

  if (step.phase === "analyze") {
    if (["ready_to_seed", "seeding", "done"].includes(status)) return "done";
    if (status === "analyzing") return "active";
    if (status === "failed" && currentStep === 5) return "failed";
    return "pending";
  }

  if (step.phase === "seed") {
    if (status === "done") return "done";
    if (status === "seeding") return "active";
    if (status === "failed" && currentStep === 6) return "failed";
    return "pending";
  }

  return "pending";
}

function extractSummary(logs: string[], keywords: string[]): string {
  for (let i = logs.length - 1; i >= 0; i--) {
    const lower = logs[i].toLowerCase();
    const clean = logs[i].trim();
    if (
      keywords.some((kw) => lower.includes(kw)) &&
      clean &&
      !clean.startsWith("[stderr]") &&
      !/^[=─\-\s]+$/.test(clean)
    ) {
      return clean.length > 80 ? clean.slice(0, 80) + "…" : clean;
    }
  }
  return "";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIcon({ state }: { state: StepState }) {
  if (state === "done")   return <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />;
  if (state === "active") return <Loader2 className="h-5 w-5 shrink-0 animate-spin text-indigo-500" />;
  if (state === "failed") return <XCircle className="h-5 w-5 shrink-0 text-red-500" />;
  return <Circle className="h-5 w-5 shrink-0 text-slate-200" />;
}

function StepRow({
  step,
  job,
  isLast,
  children,
}: {
  step: StepDef;
  job: PipelineJob;
  isLast: boolean;
  children?: React.ReactNode;
}) {
  const state = getStepState(step, job);
  const summary =
    state === "done"
      ? extractSummary(job.logs, step.keywords) || step.doneText
      : state === "failed"
      ? extractSummary(job.logs, ["✗", "không tìm", "lỗi", "error", ...step.keywords])
      : undefined;

  return (
    <div>
      <div className="flex gap-3">
        {/* Icon + connector */}
        <div className="flex flex-col items-center">
          <StepIcon state={state} />
          {(!isLast || children) && (
            <div
              className={`mt-1 w-px flex-1 min-h-[20px] ${
                state === "done" ? "bg-emerald-200" : "bg-slate-100"
              }`}
            />
          )}
        </div>

        {/* Label + sub-text */}
        <div className="pb-4 pt-0.5 min-w-0 flex-1">
          <p
            className={`text-sm font-medium leading-none ${
              state === "active" ? "text-indigo-700"
              : state === "done"   ? "text-slate-800"
              : state === "failed" ? "text-red-600"
              : "text-slate-400"
            }`}
          >
            {step.label}
          </p>
          {state === "done" && summary && (
            <p className="mt-1 text-xs text-slate-500">{summary}</p>
          )}
          {state === "active" && (
            <p className="mt-1 text-xs text-indigo-400">Đang xử lý...</p>
          )}
          {state === "failed" && (
            <p className="mt-1 text-xs text-red-400">{summary || "Gặp lỗi khi xử lý"}</p>
          )}
        </div>
      </div>

      {/* Inline slot (dùng để nhúng CandidateReview) */}
      {children && (
        <div className="ml-8 mb-2">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PipelineRunner() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { maxVideos: 5, maxEssays: 5 },
  });

  const createJob = useCreatePipelineJob();
  const { data: job } = usePipelineJob(activeJobId);

  // WebSocket chỉ dùng để trigger refetch — không cần log state
  usePipelineSocket(activeJobId, () => {
    if (activeJobId) {
      queryClient.invalidateQueries({ queryKey: pipelineKeys.job(activeJobId) });
    }
  });

  const onSubmit = async (values: FormValues) => {
    const { jobId } = await createJob.mutateAsync({
      topic: values.topic,
      maxVideos: Number(values.maxVideos),
      maxEssays: Number(values.maxEssays),
    });
    setActiveJobId(jobId);
  };

  const isRunning = ["pending", "running", "analyzing", "seeding"].includes(
    job?.status ?? "",
  );

  // CandidateReview hiển thị sau bước scrape (khi đã có dữ liệu để duyệt)
  const showReview =
    activeJobId &&
    job &&
    ["waiting_review", "analyzing", "ready_to_seed", "done", "failed"].includes(job.status);

  return (
    <div className="space-y-6">
      {/* ── Form ── */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Cài đặt</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Chủ đề IELTS
            </label>
            <input
              {...register("topic", { required: "Nhập tên chủ đề" })}
              placeholder="VD: Technology and Society"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.topic && (
              <p className="mt-1 text-xs text-red-500">{errors.topic.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Số video</label>
              <input
                type="number"
                {...register("maxVideos", { min: 1, max: 20 })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Số bài mẫu</label>
              <input
                type="number"
                {...register("maxEssays", { min: 1, max: 20 })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createJob.isPending || isRunning}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {createJob.isPending || isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Bắt đầu tạo nội dung
          </button>
        </form>
      </div>

      {/* ── Vertical Stepper ── */}
      {activeJobId && job && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-slate-700">
            Tiến trình — <span className="font-normal text-slate-500">{job.topic}</span>
          </h2>

          <div>
            {STEPS.map((step, idx) => {
              const isLast = idx === STEPS.length - 1;
              const isScrapeDone = step.phase === "scrape" && showReview;

              return (
                <StepRow
                  key={step.key}
                  step={step}
                  job={job}
                  isLast={isLast && !isScrapeDone}
                >
                  {isScrapeDone ? (
                    <ContentReview jobId={activeJobId} job={job} />
                  ) : undefined}
                </StepRow>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
