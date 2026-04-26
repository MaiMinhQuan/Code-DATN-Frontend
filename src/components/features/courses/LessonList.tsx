import { BookOpen } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import { LessonItem } from "./LessonItem";
import type { Lesson } from "@/types/course.types";

const T = UI_TEXT.COURSES;

interface LessonListProps {
  lessons: Lesson[];
  isLoading: boolean;
  activeLessonId: string | null;
  onSelect: (lesson: Lesson) => void;
}

export function LessonList({ lessons, isLoading, activeLessonId, onSelect }: LessonListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-1.5 p-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <BookOpen className="h-8 w-8 text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground">{T.EMPTY_LESSONS}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-3">
      {lessons.map((lesson) => (
        <LessonItem
          key={lesson._id}
          lesson={lesson}
          isActive={lesson._id === activeLessonId}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}
