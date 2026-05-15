// Service gọi API flashcards: sets, cards và review (spaced repetition).

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
  // --- Sets ---

  /*
  Lấy danh sách flashcard sets của user hiện tại.
  Output:
  - Danh sách FlashcardSet.
  */
  getSets: async (): Promise<FlashcardSet[]> => {
    const { data } = await apiClient.get<FlashcardSet[]>("/flashcard-sets");
    return data;
  },

  /*
  Lấy danh sách thẻ đến hạn ôn dựa trên `nextReviewDate` (hôm nay hoặc quá hạn).
  Output:
  - Danh sách FlashcardForReview.
  */
  getReviewCards: async (): Promise<FlashcardForReview[]> => {
    const { data } = await apiClient.get<FlashcardForReview[]>(
      "/flashcard-sets/review",
    );
    return data;
  },

  /*
  Lấy chi tiết một flashcard set (kèm danh sách cards).
  Input:
  - id — setId.
  Output:
  - FlashcardSetDetail.
  */
  getSetDetail: async (id: string): Promise<FlashcardSetDetail> => {
    const { data } = await apiClient.get<FlashcardSetDetail>(
      `/flashcard-sets/${id}`,
    );
    return data;
  },

  /*
  Tạo mới flashcard set.
  Input:
  - payload — dữ liệu tạo set.
  Output:
  - FlashcardSet.
  */
  createSet: async (payload: CreateFlashcardSetPayload): Promise<FlashcardSet> => {
    const { data } = await apiClient.post<FlashcardSet>(
      "/flashcard-sets",
      payload,
    );
    return data;
  },

  /*
  Cập nhật metadata của flashcard set (title/description).
  Input:
  - id — setId.
  - payload — fields cần cập nhật.
  Output:
  - FlashcardSet.
  */
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

  /*
  Xoá flashcard set và toàn bộ cards bên trong.
  Input:
  - id — setId.
  Output:
  - { message }.
  */
  deleteSet: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/flashcard-sets/${id}`,
    );
    return data;
  },

  // --- Cards ---

  /*
  Thêm card mới vào một flashcard set.
  Input:
  - setId
  - payload — nội dung front/back.
  Output:
  - Flashcard.
  */
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

  /*
  Cập nhật nội dung card.
  Input:
  - cardId
  - payload — fields cần cập nhật.
  Output:
  - Flashcard.
  */
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

  /*
  Xoá một card.
  Input:
  - cardId
  Output:
  - { message }.
  */
  deleteCard: async (cardId: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/flashcard-sets/cards/${cardId}`,
    );
    return data;
  },

  /*
  Ghi nhận kết quả review để backend cập nhật nextReviewDate và tăng reviewCount.
  Input:
  - cardId
  - payload — kết quả review.
  Output:
  - Flashcard sau khi cập nhật lịch ôn.
  */
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
