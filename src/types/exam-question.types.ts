// Type cho exam question (đề viết) và query params.

// Topic tối giản khi topicId được populate.
export interface PopulatedTopic {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

// Một đề IELTS Writing Task 2 trả về từ backend.
export interface ExamQuestion {
  _id: string;
  title: string;
  questionPrompt: string;
  suggestedOutline?: string;
  difficultyLevel: number;
  isPublished: boolean;
  attemptCount: number;
  sourceReference?: string;
  tags: string[];
  topicId?: PopulatedTopic;
  createdAt: string;
  updatedAt: string;
}

// Query params của GET /exam-questions.
export interface GetExamQuestionsParams {
  topicId?: string;
  difficultyLevel?: number;
  tag?: string;
  isPublished?: boolean;
}
