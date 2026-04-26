"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";
import type { Course } from "@/types/course.types";

const T = UI_TEXT.COURSES;

function getBandBadgeStyle(band: string) {
  if (band === "BAND_7_PLUS") return "bg-amber-100 text-amber-700 border border-amber-200";
  if (band === "BAND_6_0")    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  return "bg-blue-100 text-blue-700 border border-blue-200";
}

const BAND_LABEL: Record<string, string> = {
  BAND_5_0:    "Band 5.0",
  BAND_6_0:    "Band 6.0",
  BAND_7_PLUS: "Band 7+",
};

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course._id}`}
      className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative h-36 w-full bg-muted">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Topic badge */}
        <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
          {course.topicId.name}
        </span>

        {/* Title */}
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {course.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 mt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{T.LABEL_LESSONS(course.totalLessons)}</span>
          </div>
          {course.instructorName && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span className="line-clamp-1 max-w-[100px]">{course.instructorName}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
