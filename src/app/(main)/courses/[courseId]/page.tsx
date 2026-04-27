"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourse, useLessons } from "@/hooks/useCourses";
import { UI_TEXT } from "@/constants/ui-text";
import { useState } from "react";

const T = UI_TEXT.COURSES;

const BAND_FILTERS = [
  { value: null,          label: T.FILTER_BAND_ALL     },
  { value: "BAND_5_0",   label: T.FILTER_BAND_5_0     },
  { value: "BAND_6_0",   label: T.FILTER_BAND_6_0     },
  { value: "BAND_7_PLUS",label: T.FILTER_BAND_7_PLUS  },
] as const;

const BAND_LABEL: Record<string, string> = {
  BAND_5_0:    "Band 5.0",
  BAND_6_0:    "Band 6.0",
  BAND_7_PLUS: "Band 7+",
};

const BAND_COLOR: Record<string, string> = {
  BAND_5_0:    "bg-blue-100 text-blue-700",
  BAND_6_0:    "bg-emerald-100 text-emerald-700",
  BAND_7_PLUS: "bg-amber-100 text-amber-700",
};

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const { data: course, isLoading: courseLoading, isError: courseError } =
    useCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading } =
    useLessons({ courseId });

  const [selectedBand, setSelectedBand] = useState<string | null>(null);

  const filteredLessons = selectedBand
    ? lessons.filter((l) => l.targetBand === selectedBand)
    : lessons;


  if (courseLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-sm text-muted-foreground">{T.EMPTY_COURSES}</p>
        <button
          onClick={() => router.push("/courses")}
          className="text-sm text-primary hover:underline"
        >
          {T.DETAIL_BACK}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/courses")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {T.DETAIL_BACK}
      </button>

      {/* Course header */}
      <div className="rounded-xl border border-border bg-card p-5">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {course.topicId.name}
        </span>
        <h1 className="mt-2 text-xl font-bold text-foreground">{course.title}</h1>
        {course.description && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {course.description}
          </p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          {T.LABEL_LESSONS(course.totalLessons)}
        </p>
      </div>

      {/* Band filter */}
      <div className="flex flex-wrap gap-2">
        {BAND_FILTERS.map((f) => (
          <button
            key={String(f.value)}
            onClick={() => setSelectedBand(f.value)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              selectedBand === f.value
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>


      {/* Lesson list */}
      {lessonsLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[68px] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
          <PlayCircle className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{T.EMPTY_LESSONS}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredLessons.map((lesson, index) => (
            <button
              key={lesson._id}
              onClick={() =>
                router.push(`/courses/${courseId}/lessons/${lesson._id}`)
              }
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
            >
              {/* Số thứ tự */}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {index + 1}
              </span>

              {/* Title + description */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {lesson.title}
                </p>
                {lesson.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {lesson.description}
                  </p>
                )}
              </div>

              {/* Band badge */}
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
                  BAND_COLOR[lesson.targetBand],
                )}
              >
                {BAND_LABEL[lesson.targetBand]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
