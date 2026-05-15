// Zustand store quản lý draft submission hiện tại và tiến trình chấm AI real-time.
import { create } from "zustand";
import { SubmissionStatus } from "@/types/enums";
import { Submission } from "@/types/submission.types";

// Shape state/action của submission store.
interface SubmissionState {
  currentDraft: Partial<Submission> | null;
  gradingStatus: SubmissionStatus | null;
  gradingProgress: number;
  gradingMessage: string;

  /*
  Lưu draft submission đang thao tác.
  Input:
  - draft — dữ liệu submission dạng partial.
  */
  setDraft: (draft: Partial<Submission>) => void;

  // Xoá draft hiện tại khỏi state.
  clearDraft: () => void;

  /*
  Cập nhật status mới từ pipeline chấm (thường nhận qua WebSocket).
  Input:
  - status — trạng thái submission mới.
  */
  setGradingStatus: (status: SubmissionStatus) => void;

  /*
  Cập nhật tiến trình chấm và message hiển thị kèm theo.
  Input:
  - progress — phần trăm hoàn thành (0–100).
  - message — message trạng thái (optional).
  */
  setGradingProgress: (progress: number, message?: string) => void;

  // Reset toàn bộ state về giá trị khởi tạo.
  reset: () => void;
}

export const useSubmissionStore = create<SubmissionState>()((set) => ({
  currentDraft: null,
  gradingStatus: null,
  gradingProgress: 0,
  gradingMessage: "",
  setDraft: (draft) => set({ currentDraft: draft }),
  clearDraft: () => set({ currentDraft: null }),
  setGradingStatus: (status) => set({ gradingStatus: status }),
  setGradingProgress: (progress, message = "") =>
    set({ gradingProgress: progress, gradingMessage: message }),
  reset: () =>
    set({
      currentDraft: null,
      gradingStatus: null,
      gradingProgress: 0,
      gradingMessage: "",
    }),
}));
