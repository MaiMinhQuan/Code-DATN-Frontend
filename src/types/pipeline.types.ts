export type PipelineJobStatus =
  | "pending"
  | "running"
  | "waiting_review"
  | "analyzing"
  | "ready_to_seed"
  | "seeding"
  | "done"
  | "failed";

export interface PipelineJob {
  _id: string;
  topic: string;
  maxVideos: number;
  maxEssays: number;
  status: PipelineJobStatus;
  currentStep: number;
  logs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineCandidate {
  url: string;
  source: string;
  question: string;
  essay: string;
  band_score: number;
  approved: boolean;
}

export interface PipelineVideo {
  title: string;
  url: string;
  duration?: number;
  thumbnailUrl?: string;
}

export interface PipelineVocabulary {
  word: string;
  pronunciation?: string;
  definition?: string;
  translation?: string;
  examples?: string[];
}

export interface PipelineGrammar {
  title: string;
  explanation?: string;
  structure?: string;
  examples?: string[];
}

export interface PipelineLessonDetail {
  title: string;
  videos: PipelineVideo[];
  vocabularies: PipelineVocabulary[];
  grammars: PipelineGrammar[];
}

export interface PipelineLessonItem {
  topic: string;
  target_band: string;
  lesson: PipelineLessonDetail;
  flashcard_set: { title: string; cards: { frontContent: string; backContent: string }[] };
  approved?: boolean;
}
