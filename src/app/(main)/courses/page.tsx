"use client";

import { useState, useMemo } from "react";
import { useCourses } from "@/hooks/useCourses";
import { CourseFilter } from "@/components/features/courses/CourseFilter";
import { CourseList } from "@/components/features/courses/CourseList";
import { UI_TEXT } from "@/constants/ui-text";
import type { CourseQueryParams } from "@/types/course.types";

const T = UI_TEXT.COURSES;

export default function CoursesPage() {
  const [params, setParams] = useState<CourseQueryParams>({});

  // Fetch all courses once (no topicId) để lấy danh sách topics
  const { data: allCourses = [] } = useCourses();

  // Fetch theo filter hiện tại
  const { data: courses = [], isLoading } = useCourses(params);

  // Rút unique topics từ all courses — chỉ tính toán lại khi allCourses thay đổi
  const topics = useMemo(() => {
    const seen = new Set<string>();
    return allCourses
      .map((c) => c.topicId)
      .filter((t) => {
        if (seen.has(t._id)) return false;
        seen.add(t._id);
        return true;
      });
  }, [allCourses]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{T.PAGE_TITLE}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{T.PAGE_SUBTITLE}</p>
      </div>

      {/* Filter — chỉ render khi đã có topics */}
      {topics.length > 0 && (
        <CourseFilter params={params} topics={topics} onChange={setParams} />
      )}

      {/* List */}
      <CourseList courses={courses} isLoading={isLoading} />
    </div>
  );
}
