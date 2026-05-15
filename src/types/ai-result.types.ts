// Type cho kết quả chấm AI: danh sách lỗi và tổng hợp kết quả.
import { ErrorCategory } from "./enums";

// Một lỗi AI phát hiện trong bài viết.
export interface AIError {
  startIndex: number;
  endIndex: number;
  category: ErrorCategory;
  originalText: string;
  suggestion: string;
  explanation: string;
  severity: "low" | "medium" | "high";
}

// Kết quả chấm AI đầy đủ sau khi xử lý submission.
export interface AIResult {
  taskResponseScore: number;
  coherenceScore: number;
  lexicalScore: number;
  grammarScore: number;
  overallBand: number;
  errors: AIError[];
  generalFeedback?: string;
  strengths?: string;
  improvements?: string;
  processedAt: string;
}
