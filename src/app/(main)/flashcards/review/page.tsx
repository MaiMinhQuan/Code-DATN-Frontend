"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CalendarCheck } from "lucide-react";
import { useReviewCards, useReviewFlashcard } from "@/hooks/useFlashcards";
import { ReviewSession } from "@/components/features/flashcards/ReviewSession";
import { UI_TEXT } from "@/constants/ui-text";
import type { ReviewQuality } from "@/types/flashcard.types";

const T = UI_TEXT.FLASHCARDS;

export default function FlashcardsReviewPage() {
  const router = useRouter();

  const { data: cards = [], isLoading } = useReviewCards();
  const reviewCard = useReviewFlashcard();

  const handleReview = (cardId: string, quality: ReviewQuality) => {
    reviewCard.mutate({ cardId, payload: { quality } });
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ─── Không có thẻ cần ôn ─────────────────────────────────────────────────
  if (cards.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CalendarCheck className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">
            {T.EMPTY_REVIEW}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {T.EMPTY_REVIEW_HINT}
          </p>
        </div>
        <button
          onClick={() => router.push("/flashcards")}
          className="flex items-center gap-1.5 text-sm text-primary transition-colors hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          {T.DETAIL_BACK}
        </button>
      </div>
    );
  }

  // ─── Review session ───────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/flashcards")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {T.DETAIL_BACK}
        </button>
        <span className="text-xs font-medium text-muted-foreground">
          {T.LABEL_DUE(cards.length)}
        </span>
      </div>

      {/* Centered review area */}
      <div className="mx-auto w-full max-w-lg">
        <ReviewSession
          cards={cards}
          isSubmitting={reviewCard.isPending}
          onReview={handleReview}
        />
      </div>
    </div>
  );
}
