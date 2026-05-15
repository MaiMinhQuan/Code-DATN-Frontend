"use client";

// Card hiển thị thông tin nhanh của một bộ flashcard.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Layers, BookOpen } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import type { FlashcardSet } from "@/types/flashcard.types";

const T = UI_TEXT.FLASHCARDS;

interface SetCardProps {
  // Dữ liệu bộ thẻ cần render.
  set: FlashcardSet;
  // Callback xử lý xóa bộ thẻ.
  onDelete: (id: string) => void;
}

/*
Component card bộ flashcard.

Input:
- set — dữ liệu bộ flashcard.
- onDelete — hàm xử lý xóa bộ.

Output:
- Card có tiêu đề, mô tả, số thẻ và nút vào review nhanh.
*/
export function SetCard({ set, onDelete }: SetCardProps) {
  const router = useRouter();

  return (
    <div className="group relative rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Nút xóa hiện khi hover card */}
      <button
        onClick={() => onDelete(set._id)}
        title={T.CONFIRM_DELETE_SET}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Click card để vào trang chi tiết bộ thẻ */}
      <Link href={`/flashcards/${set._id}`} className="flex h-full flex-col p-5">
        <div className="flex flex-1 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1 pr-6">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {set.title}
            </h3>
            {set.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {set.description}
              </p>
            )}
          </div>
        </div>

        {/* Footer: số thẻ, badge đến hạn và CTA ôn nhanh */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground/60">
              {T.LABEL_CARD_COUNT(set.cardCount)}
            </span>
            {set.dueCount > 0 && (
              // Badge số thẻ đến hạn ôn
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                {T.LABEL_DUE(set.dueCount)}
              </span>
            )}
          </div>

          {set.dueCount > 0 && (
            <button
              onClick={(e) => {
                // Chặn click của Link cha để điều hướng riêng sang trang review
                e.preventDefault();
                router.push(`/flashcards/${set._id}/review`);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <BookOpen className="h-3 w-3" />
              {T.BTN_START_REVIEW}
            </button>
          )}
        </div>
      </Link>
    </div>
  );
}
