import { apiClient } from "./api.client";
import type {
  FlashcardSet,
  FlashcardSetDetail,
  FlashcardForReview,
  Flashcard,
  CreateFlashcardSetPayload,
  UpdateFlashcardSetPayload,
  CreateFlashcardPayload,
  UpdateFlashcardPayload,
  ReviewFlashcardPayload,
} from "@/types/flashcard.types";

export const flashcardsService = {
  // ─── Sets ──────────────────────────────────────────────────────────────────

  getSets: async (): Promise<FlashcardSet[]> => {
    const { data } = await apiClient.get<FlashcardSet[]>("/flashcard-sets");
    return data;
  },

  getReviewCards: async (): Promise<FlashcardForReview[]> => {
    const { data } = await apiClient.get<FlashcardForReview[]>(
      "/flashcard-sets/review",
    );
    return data;
  },

  getSetDetail: async (id: string): Promise<FlashcardSetDetail> => {
    const { data } = await apiClient.get<FlashcardSetDetail>(
      `/flashcard-sets/${id}`,
    );
    return data;
  },

  createSet: async (payload: CreateFlashcardSetPayload): Promise<FlashcardSet> => {
    const { data } = await apiClient.post<FlashcardSet>(
      "/flashcard-sets",
      payload,
    );
    return data;
  },

  updateSet: async (
    id: string,
    payload: UpdateFlashcardSetPayload,
  ): Promise<FlashcardSet> => {
    const { data } = await apiClient.patch<FlashcardSet>(
      `/flashcard-sets/${id}`,
      payload,
    );
    return data;
  },

  deleteSet: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/flashcard-sets/${id}`,
    );
    return data;
  },

  // ─── Cards ─────────────────────────────────────────────────────────────────

  createCard: async (
    setId: string,
    payload: CreateFlashcardPayload,
  ): Promise<Flashcard> => {
    const { data } = await apiClient.post<Flashcard>(
      `/flashcard-sets/${setId}/cards`,
      payload,
    );
    return data;
  },

  updateCard: async (
    cardId: string,
    payload: UpdateFlashcardPayload,
  ): Promise<Flashcard> => {
    const { data } = await apiClient.patch<Flashcard>(
      `/flashcard-sets/cards/${cardId}`,
      payload,
    );
    return data;
  },

  deleteCard: async (cardId: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/flashcard-sets/cards/${cardId}`,
    );
    return data;
  },

  reviewCard: async (
    cardId: string,
    payload: ReviewFlashcardPayload,
  ): Promise<Flashcard> => {
    const { data } = await apiClient.patch<Flashcard>(
      `/flashcard-sets/cards/${cardId}/review`,
      payload,
    );
    return data;
  },
};
