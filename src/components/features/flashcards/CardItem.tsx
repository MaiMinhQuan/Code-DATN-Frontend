"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Flashcard } from "@/types/flashcard.types";

interface CardItemProps {
  card: Flashcard;
  onEdit: (card: Flashcard) => void;
  onDelete: (cardId: string) => void;
}

export function CardItem({ card, onEdit, onDelete }: CardItemProps) {
  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-4">
        {/* Front */}
        <div className="flex-1 min-w-0 border-r border-border pr-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/60">
            Mặt trước
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {card.frontContent}
          </p>
        </div>

        {/* Back */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/60">
            Mặt sau
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{card.backContent}</p>
        </div>

        {/* Actions — hiện khi hover */}
        <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(card)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(card._id)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
