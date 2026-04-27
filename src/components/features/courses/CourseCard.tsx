"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import type { Course } from "@/types/course.types";

const T = UI_TEXT.COURSES;


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
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{T.LABEL_LESSONS(course.totalLessons)}</span>
          </div>
          <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            Học ngay
          </span>
        </div>
      </div>
    </Link>
  );
}
