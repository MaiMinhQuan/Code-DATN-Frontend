// React Query hooks cho flashcard sets/cards và review spaced repetition.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flashcardsService } from "@/services/flashcards.service";
import type {
  CreateFlashcardSetPayload,
  UpdateFlashcardSetPayload,
  CreateFlashcardPayload,
  UpdateFlashcardPayload,
  ReviewFlashcardPayload,
} from "@/types/flashcard.types";

// Factory query key cho cache flashcard sets.
export const flashcardSetKeys = {
  all: ["flashcard-sets"] as const,

  lists: () => [...flashcardSetKeys.all, "list"] as const,

  details: () => [...flashcardSetKeys.all, "detail"] as const,

  // Sinh key chi tiết flashcard set theo id.
  detail: (id: string) => [...flashcardSetKeys.details(), id] as const,

  // Key cho danh sách card đến hạn review.
  review: () => [...flashcardSetKeys.all, "review"] as const,
};

/*
Hook lấy danh sách flashcard sets của user.
*/
export function useFlashcardSets() {
  return useQuery({
    queryKey: flashcardSetKeys.lists(),
    queryFn: () => flashcardsService.getSets(),
    staleTime: 2 * 60 * 1000,
  });
}

/*
Hook lấy chi tiết một flashcard set.

Input:
- id — setId.

Output:
- Kết quả useQuery chứa chi tiết set và cards.
*/
export function useFlashcardSetDetail(id: string) {
  return useQuery({
    queryKey: flashcardSetKeys.detail(id),
    queryFn: () => flashcardsService.getSetDetail(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

/*
Hook lấy danh sách cards đến hạn review.
*/
export function useReviewCards() {
  return useQuery({
    queryKey: flashcardSetKeys.review(),
    queryFn: () => flashcardsService.getReviewCards(),
    staleTime: 0, // queue thay đổi sau mỗi lần review
  });
}

/*
Hook tạo flashcard set và invalidate cache list.
*/
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

/*
Hook cập nhật flashcard set và đồng bộ cache detail.
*/
export function useUpdateFlashcardSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFlashcardSetPayload }) =>
      flashcardsService.updateSet(id, payload),
    onSuccess: (updatedSet) => {
      // Cập nhật cache detail tại chỗ để tránh gọi mạng thêm
      qc.setQueryData(flashcardSetKeys.detail(updatedSet._id), (old: any) =>
        old ? { ...old, set: updatedSet } : old,
      );
      qc.invalidateQueries({ queryKey: flashcardSetKeys.lists() });
    },
  });
}

/*
Hook xóa flashcard set và invalidate cache list.
*/
export function useDeleteFlashcardSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => flashcardsService.deleteSet(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: flashcardSetKeys.lists() });
    },
  });
}

/*
Hook thêm card mới và refresh cache detail của set.
*/
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

/*
Hook cập nhật card và refresh cache detail của set cha.
*/
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

/*
Hook xóa card và refresh cache detail của set cha.
*/
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

/*
Hook ghi nhận kết quả review card và refresh queue review.
*/
export function useReviewFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; payload: ReviewFlashcardPayload }) =>
      flashcardsService.reviewCard(cardId, payload),
    onSuccess: () => {
      // Queue review thay đổi sau mỗi lần chấm, cần refetch
      qc.invalidateQueries({ queryKey: flashcardSetKeys.review() });
    },
  });
}
