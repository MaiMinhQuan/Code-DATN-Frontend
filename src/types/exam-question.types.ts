export interface PopulatedTopic {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

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

export interface GetExamQuestionsParams {
  topicId?: string;
  difficultyLevel?: number;
  tag?: string;
  isPublished?: boolean;
}
