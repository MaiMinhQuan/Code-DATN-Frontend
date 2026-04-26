import type { TargetBand } from "./enums";
import type { PopulatedTopic } from "./sample-essay.types";

export type { PopulatedTopic };

// ─── Course ───────────────────────────────────────────────────────────────────

export interface Course {
  _id: string;
  title: string;
  description?: string;
  topicId: PopulatedTopic;       // embedded object, không phải raw string
  thumbnailUrl?: string;
  orderIndex: number;
  isPublished: boolean;
  totalLessons: number;
  instructorName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Lesson sub-documents ─────────────────────────────────────────────────────

export interface LessonVideo {
  title: string;
  videoUrl: string;
  duration?: number;
  thumbnailUrl?: string;
}

export interface LessonVocabulary {
  word: string;
  pronunciation?: string;
  definition: string;
  examples: string[];
  translation?: string;
}

export interface LessonGrammar {
  title: string;
  explanation: string;
  examples: string[];
  structure?: string;
}

// ─── Lesson ───────────────────────────────────────────────────────────────────

export interface Lesson {
  _id: string;
  title: string;
  courseId: string;              // plain string trong list; được populate ở detail
  targetBand: TargetBand;
  description?: string;
  orderIndex: number;
  isPublished: boolean;
  videos: LessonVideo[];
  vocabularies: LessonVocabulary[];
  grammars: LessonGrammar[];
  notesContent?: string;
  createdAt: string;
  updatedAt: string;
}

// courseId khi được populate (dùng trong lesson detail response)
export interface LessonDetail extends Omit<Lesson, "courseId"> {
  courseId: {
    title: string;
    description?: string;
  };
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface CourseQueryParams {
  topicId?: string;
  isPublished?: boolean;
}

export interface LessonQueryParams {
  courseId: string;              // bắt buộc theo API
  targetBand?: TargetBand;
}
