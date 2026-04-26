"use client";

import { useState } from "react";
import { Video, BookText, GraduationCap, FileText, Volume2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import type { LessonDetail as LessonDetailType } from "@/types/course.types";

const T = UI_TEXT.COURSES;

type Tab = "videos" | "vocabulary" | "grammar" | "notes";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "videos",     label: T.TAB_VIDEOS,     icon: Video         },
  { key: "vocabulary", label: T.TAB_VOCABULARY,  icon: BookText      },
  { key: "grammar",    label: T.TAB_GRAMMAR,     icon: GraduationCap },
  { key: "notes",      label: T.TAB_NOTES,       icon: FileText      },
];

const BAND_COLOR: Record<string, string> = {
  BAND_5_0:    "bg-blue-100 text-blue-700",
  BAND_6_0:    "bg-emerald-100 text-emerald-700",
  BAND_7_PLUS: "bg-amber-100 text-amber-700",
};

const BAND_LABEL: Record<string, string> = {
  BAND_5_0:    "Band 5.0",
  BAND_6_0:    "Band 6.0",
  BAND_7_PLUS: "Band 7+",
};

// ─── Tab content components ───────────────────────────────────────────────────

function VideosTab({ lesson }: { lesson: LessonDetailType }) {
  if (lesson.videos.length === 0) {
    return <EmptyTab label={T.EMPTY_VIDEOS} />;
  }
  return (
    <div className="flex flex-col gap-5">
      {lesson.videos.map((v, i) => (
        <div key={i} className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border">
          <video
            src={v.videoUrl}
            controls
            poster={v.thumbnailUrl}
            className="aspect-video w-full bg-black"
          />
          <div className="flex items-start justify-between gap-3 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">{v.title}</p>
            {v.duration && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {T.LABEL_DURATION(v.duration)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function VocabularyTab({ lesson }: { lesson: LessonDetailType }) {
  if (lesson.vocabularies.length === 0) {
    return <EmptyTab label={T.EMPTY_VOCABULARY} />;
  }
  return (
    <div className="flex flex-col gap-3">
      {lesson.vocabularies.map((v, i) => (
        <div key={i} className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          {/* Word + pronunciation */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base font-bold text-foreground">{v.word}</span>
            {v.pronunciation && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Volume2 className="h-3 w-3" />
                {v.pronunciation}
              </span>
            )}
          </div>

          {/* Definition */}
          <p className="mt-1.5 text-sm text-foreground">{v.definition}</p>

          {/* Translation */}
          {v.translation && (
            <p className="mt-0.5 text-xs italic text-muted-foreground">
              {v.translation}
            </p>
          )}

          {/* Examples */}
          {v.examples.length > 0 && (
            <div className="mt-2.5 flex flex-col gap-1.5 border-t border-border pt-2.5">
              {v.examples.map((ex, j) => (
                <p key={j} className="text-xs leading-relaxed text-muted-foreground">
                  <span className="mr-1.5 font-bold text-primary">•</span>
                  {ex}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GrammarTab({ lesson }: { lesson: LessonDetailType }) {
  if (lesson.grammars.length === 0) {
    return <EmptyTab label={T.EMPTY_GRAMMAR} />;
  }
  return (
    <div className="flex flex-col gap-4">
      {lesson.grammars.map((g, i) => (
        <div key={i} className="rounded-xl bg-card shadow-sm ring-1 ring-border">
          {/* Title bar */}
          <div className="border-b border-border px-4 py-3">
            <h4 className="text-sm font-semibold text-foreground">{g.title}</h4>
          </div>

          <div className="p-4">
            {/* Structure */}
            {g.structure && (
              <div className="mb-3 rounded-lg bg-primary/5 px-4 py-2.5">
                <p className="font-mono text-xs font-medium text-primary">
                  {g.structure}
                </p>
              </div>
            )}

            {/* Explanation */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {g.explanation}
            </p>

            {/* Examples */}
            {g.examples.length > 0 && (
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                {g.examples.map((ex, j) => (
                  <p key={j} className="text-xs leading-relaxed text-foreground">
                    <span className="mr-1.5 font-bold text-primary">›</span>
                    {ex}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesTab({ lesson }: { lesson: LessonDetailType }) {
  if (!lesson.notesContent) {
    return <EmptyTab label={T.EMPTY_NOTES} />;
  }
  return (
    <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <MarkdownContent content={lesson.notesContent} />
    </div>
  );
}

function EmptyTab({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-16">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface LessonDetailProps {
  lesson: LessonDetailType;
}

export function LessonDetail({ lesson }: LessonDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>("videos");

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground">{lesson.title}</h2>
            {lesson.description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {lesson.description}
              </p>
            )}
          </div>
          <span
            className={cn(
              "mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
              BAND_COLOR[lesson.targetBand] ?? "bg-muted text-muted-foreground",
            )}
          >
            {BAND_LABEL[lesson.targetBand] ?? lesson.targetBand}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border bg-card px-6">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 py-3 text-xs font-medium transition-colors",
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "videos"     && <VideosTab     lesson={lesson} />}
        {activeTab === "vocabulary" && <VocabularyTab lesson={lesson} />}
        {activeTab === "grammar"    && <GrammarTab    lesson={lesson} />}
        {activeTab === "notes"      && <NotesTab      lesson={lesson} />}
      </div>
    </div>
  );
}
