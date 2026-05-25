"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";
import type { GetSampleEssaysParams } from "@/types/sample-essay.types";

const T = UI_TEXT.SAMPLE_ESSAYS;

interface TopicOption {
  _id: string;
  name: string;
}

interface EssayFilterProps {
  params: GetSampleEssaysParams;
  topics: TopicOption[];
  onChange: (params: GetSampleEssaysParams) => void;
}

export function EssayFilter({ params, topics, onChange }: EssayFilterProps) {
  const hasFilter = !!params.topicId;

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1 [&::-webkit-scrollbar]:hidden">
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

        {topics.map((topic) => (
          <button
            key={topic._id}
            onClick={() => onChange({ ...params, topicId: topic._id })}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              params.topicId === topic._id
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {topic.name}
          </button>
        ))}
      </div>

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
