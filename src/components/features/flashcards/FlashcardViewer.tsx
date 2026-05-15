"use client";

// Thẻ flashcard dạng flip 3D (mặt trước/mặt sau).
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.FLASHCARDS;

interface FlashcardViewerProps {
  // Nội dung mặt trước.
  frontContent: string;
  // Nội dung mặt sau.
  backContent: string;
  // Trạng thái lật thẻ (dùng khi component chạy chế độ controlled).
  isFlipped?: boolean;
  // Callback lật thẻ (dùng khi component chạy chế độ controlled).
  onFlip?: () => void;
}

/*
Component hiển thị và lật flashcard.

Input:
- frontContent — nội dung mặt trước.
- backContent — nội dung mặt sau.
- isFlipped — trạng thái lật từ component cha (optional).
- onFlip — callback lật thẻ từ component cha (optional).

Output:
- Thẻ có hiệu ứng flip 3D và hiển thị đúng mặt theo trạng thái hiện tại.
*/
export function FlashcardViewer({
  frontContent,
  backContent,
  isFlipped: controlledFlipped,
  onFlip,
}: FlashcardViewerProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);

  // Ưu tiên trạng thái controlled, fallback sang state nội bộ.
  const isFlipped = controlledFlipped ?? internalFlipped;

  /*
  Xử lý hành động lật thẻ.

  Output:
  - Gọi onFlip nếu đang controlled, hoặc tự đổi state nội bộ nếu uncontrolled.
  */
  const handleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped((f) => !f);
    }
  };

  return (
    <div
      className="cursor-pointer select-none"
      style={{ perspective: "1200px" }}
      onClick={handleFlip}
    >
      {/* Container xoay trục Y để tạo hiệu ứng lật */}
      <div
        className="relative h-64 w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Mặt trước */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-card px-8 py-6 shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {T.CARD_FACE_FRONT}
          </p>
          <p className="text-center text-xl font-semibold text-foreground">
            {frontContent}
          </p>
          <div className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            {T.BTN_FLIP}
          </div>
        </div>

        {/* Mặt sau */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-primary/30 bg-primary/5 px-8 py-6 shadow-sm"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-primary/60">
            {T.CARD_FACE_BACK}
          </p>
          <p className="text-center text-xl font-semibold text-foreground">
            {backContent}
          </p>
        </div>
      </div>
    </div>
  );
}
