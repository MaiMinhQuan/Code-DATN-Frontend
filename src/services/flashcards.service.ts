// Service gọi API flashcards: sets, cards và ghi nhận lượt ôn tập.

import { apiClient } from "./api.client";
import type {
  FlashcardSet,
  FlashcardSetDetail,
  Flashcard,
  CreateFlashcardSetPayload,
  UpdateFlashcardSetPayload,
  CreateFlashcardPayload,
  UpdateFlashcardPayload,
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
  Lấy flashcard set + cards gắn với một lesson (type LESSON).
  Input:
  - lessonId
  Output:
  - FlashcardSetDetail hoặc null nếu chưa có set.
  */
  getSetByLesson: async (lessonId: string): Promise<FlashcardSetDetail | null> => {
    const { data } = await apiClient.get<FlashcardSetDetail | null>(
      `/flashcard-sets/by-lesson/${lessonId}`,
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

  // --- Admin card management (bypass LESSON type check) ---

  adminGetSetByLesson: async (lessonId: string): Promise<FlashcardSetDetail | null> => {
    const { data } = await apiClient.get<FlashcardSetDetail | null>(
      `/flashcard-sets/admin/by-lesson/${lessonId}`,
    );
    return data;
  },

  adminAddCard: async (setId: string, payload: CreateFlashcardPayload): Promise<Flashcard> => {
    const { data } = await apiClient.post<Flashcard>(
      `/flashcard-sets/${setId}/admin/cards`,
      payload,
    );
    return data;
  },

  adminUpdateCard: async (cardId: string, payload: UpdateFlashcardPayload): Promise<Flashcard> => {
    const { data } = await apiClient.patch<Flashcard>(
      `/flashcard-sets/admin/cards/${cardId}`,
      payload,
    );
    return data;
  },

  adminDeleteCard: async (cardId: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/flashcard-sets/admin/cards/${cardId}`,
    );
    return data;
  },

  /*
  Ghi nhận lượt ôn tập — tăng reviewCount.
  Input:
  - cardId
  Output:
  - Flashcard sau khi cập nhật reviewCount.
  */
  reviewCard: async (cardId: string): Promise<Flashcard> => {
    const { data } = await apiClient.patch<Flashcard>(
      `/flashcard-sets/cards/${cardId}/review`,
    );
    return data;
  },
};
