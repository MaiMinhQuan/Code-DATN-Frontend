"use client";

import { useParams, useRouter } from "next/navigation";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useCourse, useLessons, useLesson } from "@/hooks/useCourses";
import { LessonList } from "@/components/features/courses/LessonList";
import { LessonDetail } from "@/components/features/courses/LessonDetail";
import { UI_TEXT } from "@/constants/ui-text";
import type { Lesson } from "@/types/course.types";

const T = UI_TEXT.COURSES;

export default function LessonDetailPage() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const router = useRouter();

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons({ courseId });
  const {
    data: lesson,
    isLoading: lessonLoading,
    isError: lessonError,
  } = useLesson(lessonId);

  // Chờ course header load trước khi render split panel
  if (courseLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="-m-6" style={{ height: "calc(100vh - 4rem)" }}>
      <Allotment>
        {/* ── Left panel: danh sách lesson ── */}
        <Allotment.Pane minSize={260} maxSize={400} preferredSize={300}>
          <div className="flex h-full flex-col border-r border-border">
            {/* Header */}
            <div className="flex shrink-0 flex-col gap-1 border-b border-border px-4 py-3">
              <button
                onClick={() => router.push(`/courses/${courseId}`)}
                className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {T.DETAIL_BACK}
              </button>
              {course && (
                <>
                  <h1 className="line-clamp-2 text-sm font-bold text-foreground">
                    {course.title}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {T.LABEL_LESSONS(course.totalLessons)}
                  </p>
                </>
              )}
            </div>

            {/* Lesson list — scrollable */}
            <div className="flex-1 overflow-y-auto">
              <LessonList
                lessons={lessons}
                isLoading={lessonsLoading}
                activeLessonId={lessonId}
                onSelect={(l: Lesson) =>
                  router.push(`/courses/${courseId}/lessons/${l._id}`)
                }
              />
            </div>
          </div>
        </Allotment.Pane>

        {/* ── Right panel: nội dung lesson ── */}
        <Allotment.Pane minSize={400}>
          <div className="h-full overflow-y-auto">
            {lessonLoading && (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {lessonError && !lessonLoading && (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <AlertCircle className="h-10 w-10 text-red-400" />
                <p className="text-sm text-muted-foreground">
                  {T.EMPTY_LESSONS}
                </p>
              </div>
            )}

            {lesson && !lessonLoading && <LessonDetail lesson={lesson} />}
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
