"use client";

// Bộ lọc course theo chủ đề trên trang danh sách khóa học.
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";
import type { CourseQueryParams } from "@/types/course.types";

const T = UI_TEXT.COURSES;

interface TopicOption {
  _id: string;
  name: string;
}

interface CourseFilterProps {
  // Trạng thái filter hiện tại.
  params: CourseQueryParams;
  // Danh sách topic dùng để render các nút lọc.
  topics: TopicOption[];
  // Callback trả params mới về component cha.
  onChange: (params: CourseQueryParams) => void;
}

/*
Component bộ lọc courses.

Input:
- params — trạng thái filter hiện tại.
- topics — danh sách topic khả dụng.
- onChange — hàm cập nhật filter.

Output:
- Cụm nút lọc topic và nút reset khi đang có filter.
*/
export function CourseFilter({ params, topics, onChange }: CourseFilterProps) {
  const hasFilter = !!params.topicId;

  return (
    <div className="flex items-center gap-3">
      {/* Danh sách nút lọc theo topic (cuộn ngang khi tràn) */}
      <div className="flex flex-1 gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1 [&::-webkit-scrollbar]:hidden">
        {/* Nút hiển thị tất cả topic */}
        <button
          onClick={() => onChange({ ...params, topicId: undefined })}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            !params.topicId
              ? "bg-primary text-white"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          {T.FILTER_TOPIC_ALL}
        </button>

        {/* Một nút cho mỗi topic */}
        {topics.map((topic) => (
          <button
            key={topic._id}
            onClick={() => onChange({ ...params, topicId: topic._id })}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              params.topicId === topic._id
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {topic.name}
          </button>
        ))}
      </div>

      {/* Nút reset chỉ hiện khi có filter */}
      {hasFilter && (
        <button
          onClick={() => onChange({})}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" />
          {T.BTN_RESET_FILTER}
        </button>
      )}
    </div>
  );
}
