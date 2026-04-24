import { SubmissionStatus } from "./enums";
import { AIResult } from "./ai-result.types";

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

export interface CreateSubmissionDto {
  questionId: string;
  essayContent: string;
  timeSpentSeconds?: number;
}

export interface UpdateSubmissionDto {
  essayContent?: string;
  timeSpentSeconds?: number;
}

export interface PaginatedSubmissions {
  data: Submission[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
