// React Query hooks cho flashcard sets/cards và ghi nhận lượt ôn tập.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flashcardsService } from "@/services/flashcards.service";
import type {
  CreateFlashcardSetPayload,
  UpdateFlashcardSetPayload,
  CreateFlashcardPayload,
  UpdateFlashcardPayload,
} from "@/types/flashcard.types";

export const flashcardSetKeys = {
  all: ["flashcard-sets"] as const,
  lists: () => [...flashcardSetKeys.all, "list"] as const,
  details: () => [...flashcardSetKeys.all, "detail"] as const,
  detail: (id: string) => [...flashcardSetKeys.details(), id] as const,
  byLesson: (lessonId: string) => [...flashcardSetKeys.all, "by-lesson", lessonId] as const,
  adminByLesson: (lessonId: string) => [...flashcardSetKeys.all, "admin-by-lesson", lessonId] as const,
  reviewDue: () => [...flashcardSetKeys.all, "review-due"] as const,
};

export function useFlashcardSets() {
  return useQuery({
    queryKey: flashcardSetKeys.lists(),
    queryFn: () => flashcardsService.getSets(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useFlashcardSetDetail(id: string) {
  return useQuery({
    queryKey: flashcardSetKeys.detail(id),
    queryFn: () => flashcardsService.getSetDetail(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useFlashcardSetByLesson(lessonId: string | undefined) {
  return useQuery({
    queryKey: flashcardSetKeys.byLesson(lessonId ?? ""),
    queryFn: () => flashcardsService.getSetByLesson(lessonId!),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateFlashcardSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFlashcardSetPayload) =>
      flashcardsService.createSet(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: flashcardSetKeys.lists() });
    },
  });
}

export function useUpdateFlashcardSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFlashcardSetPayload }) =>
      flashcardsService.updateSet(id, payload),
    onSuccess: (updatedSet) => {
      qc.setQueryData(flashcardSetKeys.detail(updatedSet._id), (old: any) =>
        old ? { ...old, set: updatedSet } : old,
      );
      qc.invalidateQueries({ queryKey: flashcardSetKeys.lists() });
    },
  });
}

export function useDeleteFlashcardSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => flashcardsService.deleteSet(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: flashcardSetKeys.lists() });
    },
  });
}

export function useCreateFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ setId, payload }: { setId: string; payload: CreateFlashcardPayload }) =>
      flashcardsService.createCard(setId, payload),
    onSuccess: (_, { setId }) => {
      qc.invalidateQueries({ queryKey: flashcardSetKeys.detail(setId) });
    },
  });
}

export function useUpdateFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; payload: UpdateFlashcardPayload }) =>
      flashcardsService.updateCard(cardId, payload),
    onSuccess: (updatedCard) => {
      qc.invalidateQueries({
        queryKey: flashcardSetKeys.detail(updatedCard.setId),
      });
    },
  });
}

export function useDeleteFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId }: { cardId: string; setId: string }) =>
      flashcardsService.deleteCard(cardId),
    onSuccess: (_, { setId }) => {
      qc.invalidateQueries({ queryKey: flashcardSetKeys.detail(setId) });
    },
  });
}

export function useAdminCreateLessonSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, payload }: { lessonId: string; payload: { title: string; description?: string } }) =>
      flashcardsService.adminCreateLessonSet(lessonId, payload),
    onSuccess: (_, { lessonId }) => {
      qc.invalidateQueries({ queryKey: flashcardSetKeys.adminByLesson(lessonId) });
    },
  });
}

export function useAdminFlashcardSetByLesson(lessonId: string | undefined) {
  return useQuery({
    queryKey: flashcardSetKeys.adminByLesson(lessonId ?? ""),
    queryFn: () => flashcardsService.adminGetSetByLesson(lessonId!),
    enabled: !!lessonId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminAddCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ setId, payload }: { setId: string; lessonId: string; payload: CreateFlashcardPayload }) =>
      flashcardsService.adminAddCard(setId, payload),
    onSuccess: (_, { lessonId }) => {
      qc.invalidateQueries({ queryKey: flashcardSetKeys.adminByLesson(lessonId) });
    },
  });
}

export function useAdminUpdateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; lessonId: string; payload: UpdateFlashcardPayload }) =>
      flashcardsService.adminUpdateCard(cardId, payload),
    onSuccess: (_, { lessonId }) => {
      qc.invalidateQueries({ queryKey: flashcardSetKeys.adminByLesson(lessonId) });
    },
  });
}

export function useAdminDeleteCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId }: { cardId: string; lessonId: string }) =>
      flashcardsService.adminDeleteCard(cardId),
    onSuccess: (_, { lessonId }) => {
      qc.invalidateQueries({ queryKey: flashcardSetKeys.adminByLesson(lessonId) });
    },
  });
}

export function useReviewFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => flashcardsService.reviewCard(cardId),
    onSuccess: (updatedCard) => {
      qc.invalidateQueries({ queryKey: flashcardSetKeys.lists() });
      qc.invalidateQueries({ queryKey: flashcardSetKeys.detail(updatedCard.setId) });
      qc.invalidateQueries({ queryKey: flashcardSetKeys.reviewDue() });
    },
  });
}

function isCardDue(card: { nextReviewDate?: string }): boolean {
  if (!card.nextReviewDate) return true;
  const due = new Date(card.nextReviewDate);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return due <= endOfToday;
}

/** Thẻ đến hạn từ mọi bộ — dùng trang /flashcards/review */
export function useReviewCards() {
  const setsQuery = useFlashcardSets();

  return useQuery({
    queryKey: flashcardSetKeys.reviewDue(),
    queryFn: async () => {
      const sets = setsQuery.data ?? [];
      if (sets.length === 0) return [];

      const details = await Promise.all(
        sets.map((s) => flashcardsService.getSetDetail(s._id)),
      );

      return details.flatMap((d) => d.cards.filter(isCardDue));
    },
    enabled: setsQuery.isSuccess,
    staleTime: 60 * 1000,
  });
}
