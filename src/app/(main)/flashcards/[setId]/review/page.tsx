"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useFlashcardSetDetail, useReviewFlashcard } from "@/hooks/useFlashcards";
import { ReviewSession } from "@/components/features/flashcards/ReviewSession";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.FLASHCARDS;

export default function SetReviewPage() {
  const { setId } = useParams<{ setId: string }>();
  const router    = useRouter();

  const { data, isLoading } = useFlashcardSetDetail(setId);
  const reviewCard          = useReviewFlashcard();

  const { set, cards = [] } = data ?? {};

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/flashcards/${setId}`)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {T.DETAIL_BACK}
        </button>
        <span className="text-xs font-medium text-muted-foreground">
          {T.LABEL_CARD_COUNT(cards.length)}
        </span>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <ReviewSession
          cards={cards}
          setTitle={set?.title ?? ""}
          isSubmitting={reviewCard.isPending}
          onReview={(cardId) => reviewCard.mutate(cardId)}
          onComplete={() => router.push(`/flashcards/${setId}`)}
        />
      </div>
    </div>
  );
}
