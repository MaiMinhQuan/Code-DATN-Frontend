"use client";

// Phiên ôn tập thẻ: lật thẻ, chấm mức độ nhớ và theo dõi tiến độ.
import { useState } from "react";
import { CheckCircle2, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";
import { FlashcardViewer } from "./FlashcardViewer";
import type { FlashcardForReview, ReviewQuality } from "@/types/flashcard.types";

const T = UI_TEXT.FLASHCARDS;

// Cấu hình 3 nút chấm mức độ nhớ theo thang chất lượng review.
const QUALITY_BUTTONS: { label: string; quality: ReviewQuality; className: string }[] = [
  { label: T.QUALITY_LABELS[0], quality: 1, className: "bg-red-100 text-red-700 hover:bg-red-200" },
  { label: T.QUALITY_LABELS[1], quality: 3, className: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { label: T.QUALITY_LABELS[2], quality: 5, className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
];

interface ReviewSessionProps {
  // Danh sách thẻ cần ôn trong phiên hiện tại.
  cards: FlashcardForReview[];
  // Trạng thái đang gửi kết quả review.
  isSubmitting: boolean;
  // Callback ghi nhận điểm quality cho thẻ hiện tại.
  onReview: (cardId: string, quality: ReviewQuality) => void;
}

/*
Component phiên ôn tập flashcard.

Input:
- cards — danh sách thẻ cần ôn.
- isSubmitting — trạng thái submit.
- onReview — hàm ghi nhận kết quả review.

Output:
- Màn hình ôn tập theo từng thẻ và màn hình hoàn thành khi đã ôn xong.
*/
export function ReviewSession({ cards, isSubmitting, onReview }: ReviewSessionProps) {
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [isFlipped,     setIsFlipped]     = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const isComplete  = currentIndex >= cards.length;
  const currentCard = cards[currentIndex];

  // Tiến độ phiên ôn theo phần trăm số thẻ đã xử lý.
  const progress    = (currentIndex / cards.length) * 100;

  /*
  Xử lý khi người dùng chọn quality cho thẻ hiện tại.

  Input:
  - quality — điểm đánh giá mức độ nhớ.

  Output:
  - Gửi kết quả review, chuyển sang thẻ tiếp theo và reset trạng thái lật thẻ.
  */
  const handleQuality = (quality: ReviewQuality) => {
    if (!currentCard || isSubmitting) return;
    onReview(currentCard._id, quality);
    setReviewedCount((n) => n + 1);
    setCurrentIndex((i) => i + 1);
    setIsFlipped(false); // reset trạng thái lật cho thẻ kế tiếp
  };

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

  return (
    <div className="flex flex-col gap-6">
      {/* Thanh tiến độ phiên ôn */}
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

      {/* Tên bộ thẻ hiện tại */}
      <div className="flex justify-center">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {currentCard.setId.title}
        </span>
      </div>

      {/* Thẻ hiện tại (lật trước/sau) */}
      <FlashcardViewer
        frontContent={currentCard.frontContent}
        backContent={currentCard.backContent}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped((f) => !f)}
      />

      {/* Sau khi lật mới hiển thị nhóm nút chọn quality */}
      {isFlipped ? (
        <div className="flex flex-col gap-3">
          <p className="text-center text-xs font-medium text-muted-foreground">
            {T.REVIEW_QUALITY_PROMPT}
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
          {T.REVIEW_FLIP_HINT}
        </p>
      )}
    </div>
  );
}
