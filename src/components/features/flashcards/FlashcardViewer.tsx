"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.FLASHCARDS;

interface FlashcardViewerProps {
  frontContent: string;
  backContent: string;
  // optional: controlled mode cho ReviewSession
  isFlipped?: boolean;
  onFlip?: () => void;
}

export function FlashcardViewer({
  frontContent,
  backContent,
  isFlipped: controlledFlipped,
  onFlip,
}: FlashcardViewerProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);

  // Controlled nếu truyền isFlipped, uncontrolled nếu không
  const isFlipped = controlledFlipped ?? internalFlipped;
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
            Mặt trước
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
            Mặt sau
          </p>
          <p className="text-center text-xl font-semibold text-foreground">
            {backContent}
          </p>
        </div>
      </div>
    </div>
  );
}
