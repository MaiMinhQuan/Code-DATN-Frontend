import { create } from "zustand";
import { SubmissionStatus } from "@/types/enums";
import { Submission } from "@/types/submission.types";

interface SubmissionState {
  currentDraft: Partial<Submission> | null;
  gradingStatus: SubmissionStatus | null;
  gradingProgress: number;
  gradingMessage: string;
  setDraft: (draft: Partial<Submission>) => void;
  clearDraft: () => void;
  setGradingStatus: (status: SubmissionStatus) => void;
  setGradingProgress: (progress: number, message?: string) => void;
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
