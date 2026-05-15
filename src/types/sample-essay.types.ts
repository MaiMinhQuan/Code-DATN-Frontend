// Type cho sample essay, highlight annotation và filter params.

// Literal band mục tiêu để phân loại bài mẫu.
export type TargetBand = "BAND_5_0" | "BAND_6_0" | "BAND_7_PLUS";

// Literal loại highlight của một đoạn được annotate trong bài mẫu.
export type HighlightType = "VOCABULARY" | "GRAMMAR" | "STRUCTURE" | "ARGUMENT";

// Một đoạn text được annotate trong bài mẫu.
export interface HighlightAnnotation {
  startIndex: number;
  endIndex: number;
  highlightType: HighlightType;
  explanation: string;
  color?: string;
}

// Topic tối giản khi topicId của bài mẫu được populate.
export interface PopulatedTopic {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

// Bài mẫu đầy đủ trả về từ GET /sample-essays/:id.
export interface SampleEssay {
  _id: string;
  title: string;
  topicId: PopulatedTopic;
  questionPrompt: string;
  targetBand: TargetBand;
  outlineContent: string;
  fullEssayContent: string;
  highlightAnnotations: HighlightAnnotation[];
  overallBandScore?: number;
  authorName?: string;
  viewCount: number;
  favoriteCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Query params của GET /sample-essays.
export interface GetSampleEssaysParams {
  topicId?: string;
  targetBand?: TargetBand;
}
