"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, PartyPopper } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import { FlashcardViewer } from "./FlashcardViewer";
import type { Flashcard } from "@/types/flashcard.types";

const T = UI_TEXT.FLASHCARDS;

interface ReviewSessionProps {
  cards: Flashcard[];
  setTitle: string;
  isSubmitting: boolean;
  onReview: (cardId: string) => void;
  onComplete?: () => void;
}

export function ReviewSession({ cards, setTitle, isSubmitting, onReview, onComplete }: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped,    setIsFlipped]    = useState(false);
  const [reviewedIds,  setReviewedIds]  = useState<Set<string>>(new Set());

  const isComplete  = currentIndex >= cards.length;
  const currentCard = cards[currentIndex];
  const progress    = (reviewedIds.size / cards.length) * 100;

  const markReviewed = (card: Flashcard) => {
    if (!reviewedIds.has(card._id)) {
      onReview(card._id);
      setReviewedIds((prev) => new Set(prev).add(card._id));
    }
  };

  const handleNext = () => {
    if (!currentCard || isSubmitting) return;
    markReviewed(currentCard);
    setCurrentIndex((i) => i + 1);
    setIsFlipped(false);
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    setIsFlipped(false);
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <PartyPopper className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">{T.REVIEW_COMPLETE}</h2>
        <p className="text-sm text-muted-foreground">
          {T.REVIEW_COMPLETE_HINT(reviewedIds.size)}
        </p>
        {onComplete && (
          <button
            onClick={onComplete}
            className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {T.BTN_BACK_TO_LIST}
          </button>
        )}
      </div>
    );
  }

  const isLastCard = currentIndex + 1 >= cards.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Thanh tiến độ */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {reviewedIds.size} / {cards.length} đã ôn
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Badge tên bộ thẻ */}
      <div className="flex justify-center">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {setTitle}
        </span>
      </div>

      {/* Thẻ flip */}
      <FlashcardViewer
        frontContent={currentCard.frontContent}
        backContent={currentCard.backContent}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped((f) => !f)}
      />

      {/* Hint lật thẻ */}
      {!isFlipped && (
        <p className="text-center text-xs text-muted-foreground">{T.REVIEW_FLIP_HINT}</p>
      )}

      {/* Điều hướng dạng ← n / total → */}
      <div className="flex items-center justify-center gap-5">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>

        <span className="min-w-[5rem] text-center text-sm font-medium text-foreground">
          {currentIndex + 1} / {cards.length}
        </span>

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-50"
        >
          {isLastCard ? (
            <span className="text-[10px] font-bold text-primary">OK</span>
          ) : (
            <ChevronRight className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Nút Hoàn thành riêng khi ở thẻ cuối */}
      {isLastCard && (
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Hoàn thành
        </button>
      )}
    </div>
  );
}
