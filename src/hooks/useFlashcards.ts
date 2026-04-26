import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flashcardsService } from "@/services/flashcards.service";
import type {
  CreateFlashcardSetPayload,
  UpdateFlashcardSetPayload,
  CreateFlashcardPayload,
  UpdateFlashcardPayload,
  ReviewFlashcardPayload,
} from "@/types/flashcard.types";

// ─── Query key factory ────────────────────────────────────────────────────────

export const flashcardSetKeys = {
  all: ["flashcard-sets"] as const,
  lists: () => [...flashcardSetKeys.all, "list"] as const,
  details: () => [...flashcardSetKeys.all, "detail"] as const,
  detail: (id: string) => [...flashcardSetKeys.details(), id] as const,
  review: () => [...flashcardSetKeys.all, "review"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

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

export function useReviewCards() {
  return useQuery({
    queryKey: flashcardSetKeys.review(),
    queryFn: () => flashcardsService.getReviewCards(),
    staleTime: 0,
  });
}

// ─── Set mutations ────────────────────────────────────────────────────────────

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

// ─── Card mutations ───────────────────────────────────────────────────────────

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

export function useReviewFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; payload: ReviewFlashcardPayload }) =>
      flashcardsService.reviewCard(cardId, payload),
    onSuccess: () => {
      // Review queue thay đổi sau mỗi lần đánh giá
      qc.invalidateQueries({ queryKey: flashcardSetKeys.review() });
    },
  });
}
