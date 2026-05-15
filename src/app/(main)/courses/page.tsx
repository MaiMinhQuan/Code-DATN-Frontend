// Trang danh sách khóa học với bộ lọc chủ đề.
"use client";

import { useState, useMemo } from "react";
import { useCourses } from "@/hooks/useCourses";
import { CourseFilter } from "@/components/features/courses/CourseFilter";
import { CourseList } from "@/components/features/courses/CourseList";
import { UI_TEXT } from "@/constants/ui-text";
import type { CourseQueryParams } from "@/types/course.types";

const T = UI_TEXT.COURSES;

/*
Component CoursesPage.

Output:
- Danh sách khóa học theo filter chủ đề và trạng thái tải dữ liệu.
*/
export default function CoursesPage() {
  const [params, setParams] = useState<CourseQueryParams>({});

  // Lấy toàn bộ khóa học để dựng danh sách topic unique cho filter
  const { data: allCourses = [] } = useCourses();

  // Lấy khóa học theo params đang filter
  const { data: courses = [], isLoading } = useCourses(params);

  // Dựng danh sách topic unique từ allCourses
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
      {/* Header trang */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{T.PAGE_TITLE}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{T.PAGE_SUBTITLE}</p>
      </div>

      {/* Bộ lọc chỉ hiển thị khi đã có topic */}
      {topics.length > 0 && (
        <CourseFilter params={params} topics={topics} onChange={setParams} />
      )}

      {/* Lưới danh sách khóa học */}
      <CourseList courses={courses} isLoading={isLoading} />
    </div>
  );
}
