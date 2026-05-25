// Type cho flashcard set, card, và payload CRUD.

export interface FlashcardSet {
  _id: string;
  type: 'LESSON' | 'PERSONAL';
  userId?: string;
  lessonId?: string;
  title: string;
  description?: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  _id: string;
  setId: string;
  frontContent: string;
  backContent: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardSetDetail {
  set: FlashcardSet;
  cards: Flashcard[];
}

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
}

export interface UpdateFlashcardPayload {
  frontContent?: string;
  backContent?: string;
}
