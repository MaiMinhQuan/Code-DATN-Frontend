"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, BookOpen, RefreshCw } from "lucide-react";
import { useFlashcardSetDetail, useReviewFlashcard } from "@/hooks/useFlashcards";
import { ReviewSession } from "@/components/features/flashcards/ReviewSession";
import { UI_TEXT } from "@/constants/ui-text";
import type { Flashcard, FlashcardForReview, ReviewQuality } from "@/types/flashcard.types";

const T = UI_TEXT.FLASHCARDS;

type ReviewMode = "all" | "due";

function isDue(card: Flashcard): boolean {
  if (!card.nextReviewDate) return true;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return new Date(card.nextReviewDate) <= today;
}

export default function SetReviewPage() {
  const { setId } = useParams<{ setId: string }>();
  const router = useRouter();

  const [mode, setMode] = useState<ReviewMode | null>(null);

  const { data, isLoading } = useFlashcardSetDetail(setId);
  const reviewCard = useReviewFlashcard();

  const { set, cards = [] } = data ?? {};

  const dueCards = cards.filter(isDue);

  const selectedCards: Flashcard[] =
    mode === "all" ? cards : mode === "due" ? dueCards : [];

  const reviewCards: FlashcardForReview[] = selectedCards.map((card) => ({
    ...card,
    setId: { title: set?.title ?? "" },
  }));

  const handleReview = (cardId: string, quality: ReviewQuality) => {
    reviewCard.mutate({ cardId, payload: { quality } });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ─── Mode selection ────────────────────────────────────────────────────────
  if (mode === null) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push(`/flashcards/${setId}`)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {T.DETAIL_BACK}
        </button>

        <div>
          <h2 className="text-lg font-bold text-foreground">{T.REVIEW_MODE_TITLE}</h2>
          {set?.title && (
            <p className="mt-0.5 text-sm text-muted-foreground">{set.title}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Thẻ đến hạn */}
          <button
            onClick={() => setMode("due")}
            disabled={dueCards.length === 0}
            className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <BookOpen className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{T.REVIEW_MODE_DUE}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {dueCards.length === 0
                  ? T.REVIEW_MODE_DUE_EMPTY
                  : T.LABEL_DUE(dueCards.length)}
              </p>
            </div>
          </button>

          {/* Tất cả thẻ */}
          <button
            onClick={() => setMode("all")}
            disabled={cards.length === 0}
            className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{T.REVIEW_MODE_ALL}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {T.LABEL_CARD_COUNT(cards.length)}
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ─── No cards empty state (sau khi chọn mode) ─────────────────────────────
  if (reviewCards.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">{T.EMPTY_REVIEW}</p>
          <p className="mt-1 text-sm text-muted-foreground">{T.EMPTY_REVIEW_HINT}</p>
        </div>
        <button
          onClick={() => setMode(null)}
          className="flex items-center gap-1.5 text-sm text-primary transition-colors hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          {T.REVIEW_MODE_TITLE}
        </button>
      </div>
    );
  }

  // ─── Review session ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMode(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {T.REVIEW_MODE_TITLE}
        </button>
        <span className="text-xs font-medium text-muted-foreground">
          {T.LABEL_DUE(reviewCards.length)}
        </span>
      </div>

      <div className="mx-auto w-full max-w-lg">
        <ReviewSession
          cards={reviewCards}
          isSubmitting={reviewCard.isPending}
          onReview={handleReview}
        />
      </div>
    </div>
  );
}
