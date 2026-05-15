// Trang ôn tập tổng hợp: lấy toàn bộ thẻ đến hạn từ tất cả set.
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CalendarCheck } from "lucide-react";
import { useReviewCards, useReviewFlashcard } from "@/hooks/useFlashcards";
import { ReviewSession } from "@/components/features/flashcards/ReviewSession";
import { UI_TEXT } from "@/constants/ui-text";
import type { ReviewQuality } from "@/types/flashcard.types";

const T = UI_TEXT.FLASHCARDS;

/*
Component FlashcardsReviewPage.

Output:
- Phiên ôn tập thẻ đến hạn toàn cục, kèm empty state và điều hướng quay lại.
*/
export default function FlashcardsReviewPage() {
  const router = useRouter();

  // Lấy toàn bộ card có `nextReviewDate` tới hôm nay hoặc đã quá hạn
  const { data: cards = [], isLoading } = useReviewCards();
  const reviewCard = useReviewFlashcard();

  /*
  Gửi kết quả review cho một card.

  Input:
  - cardId — ID card vừa review.
  - quality — điểm chất lượng nhớ bài (1/3/5).

  Output:
  - Gọi mutation cập nhật lịch ôn tập theo spaced repetition.
  */
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

  // Empty state khi không còn card nào đến hạn
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

  // Phiên review đang diễn ra
  return (
    <div className="space-y-6">
      {/* Header với nút quay lại và số thẻ đến hạn */}
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

      {/* Khu vực review chính */}
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
