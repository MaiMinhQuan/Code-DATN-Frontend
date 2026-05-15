// Danh sách card khóa học, kèm trạng thái loading và empty.
import { BookOpen } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import { CourseCard } from "./CourseCard";
import type { Course } from "@/types/course.types";

const T = UI_TEXT.COURSES;

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card overflow-hidden">
      <div className="h-36 bg-muted" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 w-20 rounded-full bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="mt-2 border-t border-border pt-3">
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

interface CourseListProps {
  // Danh sách khóa học cần hiển thị.
  courses: Course[];
  // Trạng thái đang tải dữ liệu.
  isLoading: boolean;
}

/*
Component danh sách courses.

Input:
- courses — danh sách course.
- isLoading — trạng thái tải dữ liệu.

Output:
- Grid card course hoặc skeleton/empty state tương ứng.
*/
export function CourseList({ courses, isLoading }: CourseListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
        <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">{T.EMPTY_COURSES}</p>
        <p className="mt-1 text-xs text-muted-foreground">{T.EMPTY_COURSES_HINT}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
}
