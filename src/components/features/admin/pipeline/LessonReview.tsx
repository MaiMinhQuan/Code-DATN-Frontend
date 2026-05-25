"use client";

import { useState } from "react";
import {
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Video,
} from "lucide-react";
import type { PipelineLessonItem } from "@/types/pipeline.types";

interface Props {
  lessons: PipelineLessonItem[];
  selectedIndexes: number[];
  onToggle: (i: number) => void;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function VideoRow({ video }: { video: { title: string; url: string; duration?: number } }) {
  const [open, setOpen] = useState(false);
  const videoId = extractYouTubeId(video.url);

  return (
    <div className="mt-1.5">
      <div className="flex items-center gap-2">
        <Video className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-xs text-indigo-600 hover:underline"
        >
          {video.title}
        </a>
        {video.duration && (
          <span className="shrink-0 text-xs text-slate-400">
            {formatDuration(video.duration)}
          </span>
        )}
        {videoId && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
          >
            {open ? "Ẩn" : "Xem"}
          </button>
        )}
      </div>

      {open && videoId && (
        <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LessonCard({
  item,
  selected,
  onToggle,
}: {
  item: PipelineLessonItem;
  selected: boolean;
  onToggle: () => void;
}) {
  const [showVocab, setShowVocab] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);
  const lesson = item.lesson;

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        selected ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <button onClick={onToggle} className="mt-0.5 shrink-0">
          {selected ? (
            <CheckSquare className="h-4 w-4 text-indigo-600" />
          ) : (
            <Square className="h-4 w-4 text-slate-400" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-800">{lesson.title}</p>

          {lesson.videos.map((v, i) => (
            <VideoRow key={i} video={v} />
          ))}

          <div className="mt-3 flex flex-wrap gap-3">
            <button
              onClick={() => setShowVocab((v) => !v)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {lesson.vocabularies.length} từ vựng
              {showVocab ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            <button
              onClick={() => setShowGrammar((v) => !v)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {lesson.grammars.length} ngữ pháp
              {showGrammar ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          {showVocab && lesson.vocabularies.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {lesson.vocabularies.map((v, i) => (
                <div key={i} className="rounded bg-white px-2 py-1 text-xs ring-1 ring-slate-200">
                  <span className="font-semibold text-slate-800">{v.word}</span>
                  {v.translation && (
                    <span className="ml-1 text-slate-500">— {v.translation}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {showGrammar && lesson.grammars.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {lesson.grammars.map((g, i) => (
                <div key={i} className="rounded bg-white px-3 py-2 text-xs ring-1 ring-slate-200">
                  <p className="font-semibold text-slate-800">{g.title}</p>
                  {g.explanation && (
                    <p className="mt-0.5 text-slate-500 line-clamp-2">{g.explanation}</p>
                  )}
                  {g.structure && (
                    <p className="mt-0.5 font-mono text-indigo-700">{g.structure}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LessonReview({ lessons, selectedIndexes, onToggle }: Props) {
  if (!lessons.length) return null;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Bài học & Video ({selectedIndexes.length}/{lessons.length} đã chọn)
      </p>
      <div className="space-y-3">
        {lessons.map((item, i) => (
          <LessonCard
            key={i}
            item={item}
            selected={selectedIndexes.includes(i)}
            onToggle={() => onToggle(i)}
          />
        ))}
      </div>
    </div>
  );
}
