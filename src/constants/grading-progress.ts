/** Mốc % tiến trình chấm bài — đồng bộ với backend/src/submissions/queue/submission.constants.ts */
export const GRADING_PROGRESS = {
  QUEUED:    0,
  STARTED:   10,
  ANALYZING: 30,
  SAVING:    80,
  COMPLETE:  100,
} as const;
