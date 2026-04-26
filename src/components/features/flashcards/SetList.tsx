import { Layers } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import { SetCard } from "./SetCard";
import type { FlashcardSet } from "@/types/flashcard.types";

const T = UI_TEXT.FLASHCARDS;

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 h-3 w-16 rounded bg-muted" />
    </div>
  );
}

interface SetListProps {
  sets: FlashcardSet[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export function SetList({ sets, isLoading, onDelete }: SetListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (sets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
        <Layers className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">{T.EMPTY_SETS}</p>
        <p className="mt-1 text-xs text-muted-foreground">{T.EMPTY_SETS_HINT}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sets.map((set) => (
        <SetCard key={set._id} set={set} onDelete={onDelete} />
      ))}
    </div>
  );
}
