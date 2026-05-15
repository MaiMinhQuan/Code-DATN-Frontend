// Nhóm hành động nhanh trên dashboard.
import { useRouter } from "next/navigation";
import { PenLine, BookOpen, ArrowRight } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.DASHBOARD;

interface QuickActionsProps {
  // Số thẻ flashcard đang đến hạn ôn.
  dueCards: number;
}

/*
Component nút hành động nhanh.

Input:
- dueCards — số thẻ cần ôn.

Output:
- Hai card điều hướng nhanh: luyện viết và ôn flashcard.
*/
export function QuickActions({ dueCards }: QuickActionsProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Nút chuyển nhanh sang trang luyện viết */}
      <button
        onClick={() => router.push("/practice")}
        className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <PenLine className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{T.QUICK_PRACTICE_TITLE}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{T.QUICK_PRACTICE_DESC}</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </button>

      {/* Nút chuyển nhanh sang trang flashcards */}
      <button
        onClick={() => router.push("/flashcards")}
        className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <BookOpen className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{T.QUICK_FLASHCARD_TITLE}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {dueCards > 0 ? T.QUICK_FLASHCARD_DESC(dueCards) : T.QUICK_FLASHCARD_EMPTY}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Badge hiện khi có thẻ đến hạn */}
          {dueCards > 0 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
              {dueCards}
            </span>
          )}
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </button>
    </div>
  );
}
