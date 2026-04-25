export type TargetBand = "BAND_5_0" | "BAND_6_0" | "BAND_7_PLUS";

export type HighlightType = "VOCABULARY" | "GRAMMAR" | "STRUCTURE" | "ARGUMENT";

export interface HighlightAnnotation {
  startIndex: number;
  endIndex: number;
  highlightType: HighlightType;
  explanation: string;
  color?: string;
}

export interface PopulatedTopic {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SampleEssay {
  _id: string;
  title: string;
  topicId: PopulatedTopic;        // populated object, KHÔNG phải string
  questionPrompt: string;
  targetBand: TargetBand;         // BAND_5_0 | BAND_6_0 | BAND_7_PLUS
  outlineContent: string;
  fullEssayContent: string;       // tên field đúng
  highlightAnnotations: HighlightAnnotation[];
  overallBandScore?: number;      // 0-9
  authorName?: string;
  viewCount: number;
  favoriteCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetSampleEssaysParams {
  topicId?: string;               // ObjectId string
  targetBand?: TargetBand;        // enum, không phải minBand/maxBand
}
