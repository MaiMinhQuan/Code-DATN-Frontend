"use client";

import { useState } from "react";
import { CheckCircle2, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";
import { FlashcardViewer } from "./FlashcardViewer";
import type { FlashcardForReview, ReviewQuality } from "@/types/flashcard.types";

const T = UI_TEXT.FLASHCARDS;

const QUALITY_BUTTONS: { label: string; quality: ReviewQuality; className: string }[] = [
  { label: T.QUALITY_LABELS[0], quality: 1, className: "bg-red-100 text-red-700 hover:bg-red-200" },
  { label: T.QUALITY_LABELS[1], quality: 3, className: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { label: T.QUALITY_LABELS[2], quality: 5, className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
];

interface ReviewSessionProps {
  cards: FlashcardForReview[];
  isSubmitting: boolean;
  onReview: (cardId: string, quality: ReviewQuality) => void;
}

export function ReviewSession({ cards, isSubmitting, onReview }: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const isComplete = currentIndex >= cards.length;
  const currentCard = cards[currentIndex];
  const progress = (currentIndex / cards.length) * 100;

  const handleQuality = (quality: ReviewQuality) => {
    if (!currentCard || isSubmitting) return;
    onReview(currentCard._id, quality);
    setReviewedCount((n) => n + 1);
    setCurrentIndex((i) => i + 1);
    setIsFlipped(false);
  };

  // ── Màn hình hoàn thành ───────────────────────────────────────────────────
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <PartyPopper className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">{T.REVIEW_COMPLETE}</h2>
        <p className="text-sm text-muted-foreground">
          {T.REVIEW_COMPLETE_HINT(reviewedCount)}
        </p>
      </div>
    );
  }

  // ── Session đang diễn ra ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {T.REVIEW_PROGRESS(currentIndex + 1, cards.length)}
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

      {/* Set name badge */}
      <div className="flex justify-center">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {currentCard.setId.title}
        </span>
      </div>

      {/* Flip card */}
      <FlashcardViewer
        frontContent={currentCard.frontContent}
        backContent={currentCard.backContent}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped((f) => !f)}
      />

      {/* Quality buttons — chỉ hiện sau khi lật */}
      {isFlipped ? (
        <div className="flex flex-col gap-3">
          <p className="text-center text-xs font-medium text-muted-foreground">
            Bạn nhớ được đến mức nào?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {QUALITY_BUTTONS.map(({ label, quality, className }) => (
              <button
                key={quality}
                onClick={() => handleQuality(quality)}
                disabled={isSubmitting}
                className={cn(
                  "rounded-xl py-2.5 text-xs font-semibold transition-colors disabled:opacity-50",
                  className,
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          Nhấn vào thẻ để xem đáp án
        </p>
      )}
    </div>
  );
}
