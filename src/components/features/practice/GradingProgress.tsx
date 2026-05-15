"use client";

// Thanh tiến trình chấm bài theo trạng thái submission realtime.
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ClipboardList } from "lucide-react";
import { SubmissionStatus } from "@/types/enums";
import { useSubmissionStore } from "@/stores/submission.store";
import { UI_TEXT } from "@/constants/ui-text";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  idle: {
    icon: ClipboardList,
    label: UI_TEXT.PRACTICE.GRADING_IDLE,
    barColor: "bg-[var(--muted)]",
    textColor: "text-[var(--muted-foreground)]",
    spin: false,
  },
  [SubmissionStatus.SUBMITTED]: {
    icon: Loader2,
    label: UI_TEXT.PRACTICE.GRADING_WAITING,
    barColor: "bg-indigo-400",
    textColor: "text-indigo-600",
    spin: true,
  },
  [SubmissionStatus.PROCESSING]: {
    icon: Loader2,
    label: UI_TEXT.PRACTICE.GRADING_PROCESSING,
    barColor: "bg-indigo-500",
    textColor: "text-indigo-600",
    spin: true,
  },
  [SubmissionStatus.COMPLETED]: {
    icon: CheckCircle2,
    label: UI_TEXT.PRACTICE.GRADING_COMPLETED,
    barColor: "bg-emerald-500",
    textColor: "text-emerald-600",
    spin: false,
  },
  [SubmissionStatus.FAILED]: {
    icon: XCircle,
    label: UI_TEXT.PRACTICE.GRADING_FAILED,
    barColor: "bg-red-500",
    textColor: "text-red-600",
    spin: false,
  },
} as const;

/*
Component tiến trình chấm bài.

Output:
- Trạng thái hiện tại, progress bar và thông điệp tiến trình/lỗi.
*/
export function GradingProgress() {
  const { gradingStatus, gradingProgress, gradingMessage } = useSubmissionStore();

  // Quy đổi trạng thái DRAFT/null về trạng thái idle để hiển thị mặc định
  const configKey =
    gradingStatus === SubmissionStatus.DRAFT || gradingStatus === null
      ? "idle"
      : gradingStatus;

  const config = STATUS_CONFIG[configKey] ?? STATUS_CONFIG.idle;
  const Icon = config.icon;

  // Chỉ coi là active khi bài vừa submit hoặc đang processing
  const isActive =
    gradingStatus === SubmissionStatus.SUBMITTED ||
    gradingStatus === SubmissionStatus.PROCESSING;

  const displayProgress =
    gradingStatus === SubmissionStatus.COMPLETED
      ? 100
      : gradingStatus === SubmissionStatus.SUBMITTED
        ? 5
        : gradingProgress;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
      {/* Dòng trạng thái hiện tại */}
      <div className="flex items-center gap-2">
        <Icon
          className={cn("h-5 w-5", config.textColor, config.spin && "animate-spin")}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={configKey}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className={cn("text-sm font-medium", config.textColor)}
          >
            {config.label}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Thanh phần trăm tiến trình */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <motion.div
          className={cn("h-full rounded-full", config.barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Thông điệp chi tiết từ backend/websocket */}
      <AnimatePresence>
        {(isActive || gradingStatus === SubmissionStatus.FAILED) && gradingMessage && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-[var(--muted-foreground)]"
          >
            {gradingMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
