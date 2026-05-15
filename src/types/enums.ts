// Enum dùng chung cho frontend — mirror chính xác giá trị enum từ backend.

// Role người dùng để phân quyền tính năng admin/student.
export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

// Mức band mục tiêu dùng để phân loại lesson/course.
export enum TargetBand {
  BAND_5_0 = "BAND_5_0",
  BAND_6_0 = "BAND_6_0",
  BAND_7_PLUS = "BAND_7_PLUS",
}

// Trạng thái vòng đời của bài nộp trong pipeline chấm.
export enum SubmissionStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// Loại highlight cho annotation trong bài mẫu.
export enum HighlightType {
  VOCABULARY = "VOCABULARY",
  GRAMMAR = "GRAMMAR",
  STRUCTURE = "STRUCTURE",
  ARGUMENT = "ARGUMENT",
}

// Nhóm lỗi AI phát hiện (phục vụ filter và tô màu).
export enum ErrorCategory {
  GRAMMAR = "GRAMMAR",
  VOCABULARY = "VOCABULARY",
  COHERENCE = "COHERENCE",
  TASK_RESPONSE = "TASK_RESPONSE",
  SPELLING = "SPELLING",
  PUNCTUATION = "PUNCTUATION",
}
