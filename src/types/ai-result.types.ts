import { ErrorCategory } from "./enums";

export interface AIError {
  startIndex: number;
  endIndex: number;
  category: ErrorCategory;
  originalText: string;
  suggestion: string;
  explanation: string;
  severity: "low" | "medium" | "high";
}

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
