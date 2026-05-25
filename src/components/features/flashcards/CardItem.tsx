"use client";

// Item hiển thị một thẻ trong danh sách card của bộ flashcard.
import { Pencil, Trash2 } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import type { Flashcard } from "@/types/flashcard.types";

const T = UI_TEXT.FLASHCARDS;

interface CardItemProps {
  card: Flashcard;
  onEdit: (card: Flashcard) => void;
  onDelete: (cardId: string) => void;
  readOnly?: boolean;
}

/*
Component item card flashcard.

Input:
- card — dữ liệu card.
- onEdit — hàm xử lý sửa card.
- onDelete — hàm xử lý xóa card.

Output:
- Hàng card gồm mặt trước, mặt sau và nhóm nút thao tác.
*/
export function CardItem({ card, onEdit, onDelete, readOnly = false }: CardItemProps) {
  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-4">
        {/* Cột mặt trước */}
        <div className="flex-1 min-w-0 border-r border-border pr-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/60">
            {T.CARD_FACE_FRONT}
          </p>
          <div
            className="tiptap mt-1 text-sm font-medium text-foreground"
            dangerouslySetInnerHTML={{ __html: card.frontContent }}
          />
        </div>

        {/* Cột mặt sau */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/60">
            {T.CARD_FACE_BACK}
          </p>
          <div
            className="tiptap mt-1 text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: card.backContent }}
          />
        </div>

        {/* Nút sửa/xóa chỉ hiện với PERSONAL set */}
        {!readOnly && (
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
        )}
      </div>
    </div>
  );
}
