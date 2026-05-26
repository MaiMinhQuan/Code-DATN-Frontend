// Types cho Admin Dashboard — DTOs và response types.
import type { TargetBand, HighlightType, UserRole } from "./enums";
import type { Submission } from "./submission.types";

// Thống kê tổng quan từ GET /admin/stats.
export interface AdminStats {
  totalUsers: number;
  totalTopics: number;
  totalCourses: number;
  totalExamQuestions: number;
  totalSampleEssays: number;
  totalSubmissions: number;
  completedSubmissions: number;
  avgBandScore: number;
}

// --- Topics ---
export interface CreateTopicDto {
  name: string;
  description?: string;
}

export interface UpdateTopicDto extends Partial<CreateTopicDto> {
  isActive?: boolean;
}

// --- Courses ---
export interface CreateCourseDto {
  title: string;
  description?: string;
  topicId: string;
  isPublished?: boolean;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}

// --- Lessons ---
export interface CreateLessonDto {
  title: string;
  courseId: string;
  targetBand: TargetBand;
  description?: string;
  isPublished?: boolean;
  notesContent?: string;
}

export interface UpdateLessonDto extends Partial<Omit<CreateLessonDto, "courseId">> {}

export interface AddVideoDto {
  title: string;
  videoUrl: string;
  duration?: number;
  thumbnailUrl?: string;
}

export interface UpdateVideoDto extends Partial<AddVideoDto> {}

export interface AddVocabularyDto {
  word: string;
  pronunciation?: string;
  definition: string;
  examples?: string[];
  translation?: string;
  timestamp?: number;
  contextSentence?: string;
}

export interface UpdateVocabularyDto extends Partial<AddVocabularyDto> {}

export interface AddGrammarDto {
  title: string;
  explanation: string;
  examples?: string[];
  structure?: string;
  timestamp?: number;
  contextSentence?: string;
}

export interface UpdateGrammarDto extends Partial<AddGrammarDto> {}

// --- Exam Questions ---
export interface CreateExamQuestionDto {
  title: string;
  topicId?: string;
  questionPrompt: string;
  suggestedOutline?: string;
  difficultyLevel?: number;
  isPublished?: boolean;
  sourceReference?: string;
}

export interface UpdateExamQuestionDto extends Partial<CreateExamQuestionDto> {}

// --- Sample Essays ---
export interface CreateHighlightAnnotationDto {
  text: string;
  highlightType: HighlightType;
  explanation: string;
  color?: string;
}

export interface CreateSampleEssayDto {
  title: string;
  topicId: string;
  questionPrompt: string;
  outlineContent: string;
  fullEssayContent: string;
  highlightAnnotations?: CreateHighlightAnnotationDto[];
  isPublished?: boolean;
  authorName?: string;
  overallBandScore: number;
}

export interface UpdateSampleEssayDto extends Partial<CreateSampleEssayDto> {}

// --- Users Admin ---
export interface UpdateUserAdminDto {
  fullName?: string;
  role?: UserRole;
  isActive?: boolean;
}

// Pagination wrapper dùng chung.
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}

// Submission của user khi admin xem chi tiết.
export type AdminUserSubmission = Submission;
