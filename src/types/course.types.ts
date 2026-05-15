// Type cho course, lesson (embed) và query params liên quan.
import type { TargetBand } from "./enums";
import type { PopulatedTopic } from "./sample-essay.types";

export type { PopulatedTopic };

// Course trả về từ GET /courses.
export interface Course {
  _id: string;
  title: string;
  description?: string;
  topicId: PopulatedTopic;
  thumbnailUrl?: string;
  orderIndex: number;
  isPublished: boolean;
  totalLessons: number;
  instructorName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Video embed trong lesson.
export interface LessonVideo {
  title: string;
  videoUrl: string;
  duration?: number;
  thumbnailUrl?: string;
}

// Từ vựng embed trong lesson.
export interface LessonVocabulary {
  word: string;
  pronunciation?: string;
  definition: string;
  examples: string[];
  translation?: string;
}

// Ngữ pháp embed trong lesson.
export interface LessonGrammar {
  title: string;
  explanation: string;
  examples: string[];
  structure?: string;
}

// Lesson trả về từ GET /lessons (courseId là string).
export interface Lesson {
  _id: string;
  title: string;
  courseId: string;
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

// Lesson detail: courseId được populate metadata course.
export interface LessonDetail extends Omit<Lesson, "courseId"> {
  courseId: {
    title: string;
    description?: string;
  };
}

// Query params của GET /courses.
export interface CourseQueryParams {
  topicId?: string;
  isPublished?: boolean;
}

// Query params của GET /lessons (bắt buộc courseId).
export interface LessonQueryParams {
  courseId: string;
  targetBand?: TargetBand;
}
