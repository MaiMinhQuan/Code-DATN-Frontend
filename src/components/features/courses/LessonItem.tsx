"use client";

// Một item bài học trong sidebar lesson list.
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types/course.types";

// Nhãn band rút gọn để hiển thị gọn trong item.
const BAND_LABEL: Record<string, string> = {
  BAND_5_0:    "5.0",
  BAND_6_0:    "6.0",
  BAND_7_PLUS: "7+",
};

// Màu badge theo target band.
const BAND_COLOR: Record<string, string> = {
  BAND_5_0:    "bg-blue-100 text-blue-700",
  BAND_6_0:    "bg-emerald-100 text-emerald-700",
  BAND_7_PLUS: "bg-amber-100 text-amber-700",
};

interface LessonItemProps {
  // Dữ liệu lesson cần hiển thị.
  lesson: Lesson;
  // Đánh dấu item đang được chọn.
  isActive: boolean;
  // Callback khi click vào item.
  onClick: (lesson: Lesson) => void;
}

/*
Component item bài học.

Input:
- lesson — dữ liệu lesson.
- isActive — item có đang active hay không.
- onClick — hàm xử lý khi chọn lesson.

Output:
- Nút lesson có badge band và style active/inactive.
*/
export function LessonItem({ lesson, isActive, onClick }: LessonItemProps) {
  return (
    <button
      onClick={() => onClick(lesson)}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-all",
        isActive
          ? "border-primary/40 bg-primary/5"
          : "border-transparent hover:bg-muted/60",
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Icon phát bài, đổi màu khi item active */}
        <PlayCircle
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0",
            isActive ? "text-primary" : "text-muted-foreground/50",
          )}
        />
        <div className="flex-1 min-w-0">
          <p className={cn(
            "line-clamp-2 text-xs font-medium leading-relaxed",
            isActive ? "text-primary" : "text-foreground",
          )}>
            {lesson.title}
          </p>
          {/* Badge hiển thị target band của lesson */}
          <span className={cn(
            "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold",
            BAND_COLOR[lesson.targetBand] ?? "bg-muted text-muted-foreground",
          )}>
            Band {BAND_LABEL[lesson.targetBand] ?? lesson.targetBand}
          </span>
        </div>
      </div>
    </button>
  );
}
