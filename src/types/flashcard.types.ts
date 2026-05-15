// Type cho flashcard set, card, review và payload CRUD.

// Điểm chất lượng ôn tập (SM-2) để tính ngày ôn tiếp theo (0–2 sai, 3–5 đúng).
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

// Một flashcard set thuộc user.
export interface FlashcardSet {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  cardCount: number;
  dueCount: number;
  createdAt: string;
  updatedAt: string;
}

// Một flashcard với nội dung trước/sau và metadata ôn tập.
export interface Flashcard {
  _id: string;
  setId: string;
  frontContent: string;
  backContent: string;
  nextReviewDate?: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// Shape flashcard trả về từ GET /flashcard-sets/review (setId được populate).
export interface FlashcardForReview extends Omit<Flashcard, "setId"> {
  setId: {
    title: string;
  };
}

// Response của GET /flashcard-sets/:id — gồm thông tin set và danh sách cards.
export interface FlashcardSetDetail {
  set: FlashcardSet;
  cards: Flashcard[];
}

// Payload POST /flashcard-sets.
export interface CreateFlashcardSetPayload {
  title: string;
  description?: string;
}

// Payload PATCH /flashcard-sets/:id.
export interface UpdateFlashcardSetPayload {
  title?: string;
  description?: string;
}

// Payload POST /flashcard-sets/:id/cards.
export interface CreateFlashcardPayload {
  frontContent: string;
  backContent: string;
  nextReviewDate?: string;
}

// Payload PATCH /flashcards/:id.
export interface UpdateFlashcardPayload {
  frontContent?: string;
  backContent?: string;
}

// Payload POST /flashcards/:id/review — ghi nhận quality tự đánh giá.
export interface ReviewFlashcardPayload {
  quality: ReviewQuality;
}
