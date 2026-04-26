// ─── Enums / Literals ─────────────────────────────────────────────────────────

// SM-2: 0–2 = sai, 3–5 = đúng (độ tự tin tăng dần)
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

// ─── FlashcardSet ─────────────────────────────────────────────────────────────

export interface FlashcardSet {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Flashcard ────────────────────────────────────────────────────────────────

export interface Flashcard {
  _id: string;
  setId: string;            // plain string trong list/detail
  frontContent: string;
  backContent: string;
  nextReviewDate?: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// setId được populate trong GET /flashcard-sets/review
export interface FlashcardForReview extends Omit<Flashcard, "setId"> {
  setId: {
    title: string;
  };
}

// ─── Composite response ───────────────────────────────────────────────────────

// GET /flashcard-sets/:id trả { set, cards }
export interface FlashcardSetDetail {
  set: FlashcardSet;
  cards: Flashcard[];
}

// ─── Mutation payloads ────────────────────────────────────────────────────────

export interface CreateFlashcardSetPayload {
  title: string;
  description?: string;
}

export interface UpdateFlashcardSetPayload {
  title?: string;
  description?: string;
}

export interface CreateFlashcardPayload {
  frontContent: string;
  backContent: string;
  nextReviewDate?: string;
}

export interface UpdateFlashcardPayload {
  frontContent?: string;
  backContent?: string;
}

export interface ReviewFlashcardPayload {
  quality: ReviewQuality;
}
