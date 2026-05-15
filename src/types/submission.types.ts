// Type cho submissions, DTO tạo/cập nhật và response phân trang.
import { SubmissionStatus } from "./enums";
import { AIResult } from "./ai-result.types";

// Submission đại diện cho một lần nộp bài của học sinh.
export interface Submission {
  _id: string;
  userId: string;
  questionId: string;
  essayContent: string;
  wordCount?: number;
  timeSpentSeconds?: number;
  status: SubmissionStatus;
  aiResult?: AIResult;
  errorMessage?: string;
  submittedAt?: string;
  attemptNumber: number;
  createdAt: string;
  updatedAt: string;
}

// Payload POST /submissions — tạo draft.
export interface CreateSubmissionDto {
  questionId: string;
  essayContent: string;
  timeSpentSeconds?: number;
}

// Payload PATCH /submissions/:id — cập nhật draft.
export interface UpdateSubmissionDto {
  essayContent?: string;
  timeSpentSeconds?: number;
}

// Response phân trang của GET /submissions.
export interface PaginatedSubmissions {
  data: Submission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
