"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Video, BookText, GraduationCap, Volume2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants/ui-text";
import type { LessonDetail as LessonDetailType } from "@/types/course.types";

const T = UI_TEXT.COURSES;

type Tab = "videos" | "vocabulary" | "grammar";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "videos",     label: T.TAB_VIDEOS,     icon: Video         },
  { key: "vocabulary", label: T.TAB_VOCABULARY,  icon: BookText      },
  { key: "grammar",    label: T.TAB_GRAMMAR,     icon: GraduationCap },
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

// Chuyển watch URL → embed URL với enablejsapi cho postMessage seeking.
function toYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?enablejsapi=1` : null;
}

// Định dạng giây → "M:SS".
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Gửi lệnh seek tới YouTube iframe qua postMessage API.
function seekYouTubeIframe(iframe: HTMLIFrameElement, seconds: number) {
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func: "seekTo", args: [seconds, true] }),
    "*"
  );
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func: "playVideo", args: [] }),
    "*"
  );
}

// Tab video: player + timeline từ vựng/ngữ pháp dưới video.
function VideosTab({
  lesson,
  seekRequest,
  onSeekHandled,
}: {
  lesson: LessonDetailType;
  seekRequest: number | null;
  onSeekHandled: () => void;
}) {
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  // Timeline: gộp vocab + grammar có timestamp, sắp xếp theo thời gian.
  const timeline = [
    ...lesson.vocabularies
      .filter((v) => v.timestamp != null)
      .map((v) => ({
        type: "vocab" as const,
        timestamp: v.timestamp!,
        label: v.word,
        context: v.contextSentence,
      })),
    ...lesson.grammars
      .filter((g) => g.timestamp != null)
      .map((g) => ({
        type: "grammar" as const,
        timestamp: g.timestamp!,
        label: g.title,
        context: g.contextSentence,
      })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  // Xử lý seek từ tab khác (Vocabulary / Grammar).
  useEffect(() => {
    if (seekRequest == null) return;
    const iframe = iframeRefs.current[0];
    if (!iframe) return;
    seekYouTubeIframe(iframe, seekRequest);
    onSeekHandled();
  }, [seekRequest, onSeekHandled]);

  const handleTimelineClick = (seconds: number) => {
    const iframe = iframeRefs.current[0];
    if (iframe) seekYouTubeIframe(iframe, seconds);
  };

  if (lesson.videos.length === 0) return <EmptyTab label={T.EMPTY_VIDEOS} />;

  return (
    <div className="flex flex-col gap-5">
      {lesson.videos.map((v, i) => {
        const embedUrl = toYouTubeEmbedUrl(v.videoUrl);
        return (
          <div key={i} className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border">
            {embedUrl ? (
              <iframe
                ref={(el) => { iframeRefs.current[i] = el; }}
                src={embedUrl}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full bg-black"
              />
            ) : (
              <video
                src={v.videoUrl}
                controls
                poster={v.thumbnailUrl}
                className="aspect-video w-full bg-black"
              />
            )}
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
        );
      })}

      {/* Timeline từ vựng & ngữ pháp theo mốc thời gian */}
      {timeline.length > 0 && (
        <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Từ vựng &amp; Ngữ pháp trong video</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Nhấn để tua đến thời điểm xuất hiện</p>
          </div>
          <div className="divide-y divide-border">
            {timeline.map((item, i) => (
              <button
                key={i}
                onClick={() => handleTimelineClick(item.timestamp)}
                className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50"
              >
                {/* Timestamp badge */}
                <span className="mt-0.5 shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-medium text-primary">
                  {formatTime(item.timestamp)}
                </span>
                {/* Type badge */}
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-medium",
                    item.type === "vocab"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-emerald-100 text-emerald-700"
                  )}
                >
                  {item.type === "vocab" ? "Từ vựng" : "Ngữ pháp"}
                </span>
                {/* Label + context */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  {item.context && (
                    <p className="mt-0.5 text-xs italic text-muted-foreground">
                      &ldquo;{item.context}&rdquo;
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Tab từ vựng: hiển thị từ, phát âm, nghĩa, dịch, ví dụ và timestamp tua video.
function VocabularyTab({
  lesson,
  onSeek,
}: {
  lesson: LessonDetailType;
  onSeek?: (seconds: number) => void;
}) {
  const vocabularies = [...lesson.vocabularies].sort((a, b) => {
    if (a.timestamp == null && b.timestamp == null) return 0;
    if (a.timestamp == null) return 1;
    if (b.timestamp == null) return -1;
    return a.timestamp - b.timestamp;
  });
  if (vocabularies.length === 0) return <EmptyTab label={T.EMPTY_VOCABULARY} />;
  return (
    <div className="flex flex-col gap-3">
      {vocabularies.map((v, i) => (
        <div key={i} className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          {/* Hàng từ vựng + phiên âm + timestamp */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base font-bold text-foreground">{v.word}</span>
            {v.pronunciation && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Volume2 className="h-3 w-3" />
                {v.pronunciation}
              </span>
            )}
            {v.timestamp != null && onSeek && (
              <button
                onClick={() => onSeek(v.timestamp!)}
                className="ml-auto flex shrink-0 items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                title="Tua video đến thời điểm này"
              >
                <Clock className="h-3 w-3" />
                {formatTime(v.timestamp)}
              </button>
            )}
          </div>

          {/* Ngữ cảnh trong video (nếu có) */}
          {v.contextSentence && (
            <p className="mt-1 rounded bg-muted px-2.5 py-1.5 text-xs italic text-muted-foreground">
              &ldquo;{v.contextSentence}&rdquo;
            </p>
          )}

          {/* Nghĩa tiếng Anh */}
          <p className="mt-1.5 text-sm text-foreground">{v.definition}</p>

          {/* Dịch nghĩa */}
          {v.translation && (
            <p className="mt-0.5 text-xs italic text-muted-foreground">{v.translation}</p>
          )}

          {/* Ví dụ */}
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

// Tab ngữ pháp: hiển thị cấu trúc, giải thích, ví dụ và timestamp tua video.
function GrammarTab({
  lesson,
  onSeek,
}: {
  lesson: LessonDetailType;
  onSeek?: (seconds: number) => void;
}) {
  const grammars = [...lesson.grammars].sort((a, b) => {
    if (a.timestamp == null && b.timestamp == null) return 0;
    if (a.timestamp == null) return 1;
    if (b.timestamp == null) return -1;
    return a.timestamp - b.timestamp;
  });
  if (grammars.length === 0) return <EmptyTab label={T.EMPTY_GRAMMAR} />;
  return (
    <div className="flex flex-col gap-4">
      {grammars.map((g, i) => (
        <div key={i} className="rounded-xl bg-card shadow-sm ring-1 ring-border">
          {/* Tiêu đề + timestamp */}
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h4 className="text-sm font-semibold text-foreground">{g.title}</h4>
            {g.timestamp != null && onSeek && (
              <button
                onClick={() => onSeek(g.timestamp!)}
                className="flex shrink-0 items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                title="Tua video đến thời điểm này"
              >
                <Clock className="h-3 w-3" />
                {formatTime(g.timestamp)}
              </button>
            )}
          </div>

          <div className="p-4">
            {/* Ngữ cảnh trong video */}
            {g.contextSentence && (
              <p className="mb-3 rounded bg-muted px-2.5 py-1.5 text-xs italic text-muted-foreground">
                &ldquo;{g.contextSentence}&rdquo;
              </p>
            )}

            {/* Cấu trúc mẫu */}
            {g.structure && (
              <div className="mb-3 rounded-lg bg-primary/5 px-4 py-2.5">
                <p className="font-mono text-xs font-medium text-primary">{g.structure}</p>
              </div>
            )}

            {/* Giải thích */}
            <p className="text-sm leading-relaxed text-muted-foreground">{g.explanation}</p>

            {/* Ví dụ */}
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

// Empty state dùng chung.
function EmptyTab({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-16">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

interface LessonDetailProps {
  lesson: LessonDetailType;
}

export function LessonDetail({ lesson }: LessonDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>("videos");
  // seekRequest: giây cần tua tới. Được set khi click timestamp từ tab Từ vựng/Ngữ pháp.
  const [seekRequest, setSeekRequest] = useState<number | null>(null);

  const handleSeek = useCallback((seconds: number) => {
    setActiveTab("videos");
    setSeekRequest(seconds);
  }, []);

  const handleSeekHandled = useCallback(() => setSeekRequest(null), []);

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

      {/* Thanh tab */}
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

      {/*
        Tất cả tab đều mount sẵn (CSS hidden khi không active) để iframe YouTube
        không bị reload khi chuyển tab — cần thiết cho tính năng seek.
      */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className={activeTab === "videos" ? "" : "hidden"}>
          <VideosTab
            lesson={lesson}
            seekRequest={seekRequest}
            onSeekHandled={handleSeekHandled}
          />
        </div>
        <div className={activeTab === "vocabulary" ? "" : "hidden"}>
          <VocabularyTab lesson={lesson} onSeek={handleSeek} />
        </div>
        <div className={activeTab === "grammar" ? "" : "hidden"}>
          <GrammarTab lesson={lesson} onSeek={handleSeek} />
        </div>
      </div>
    </div>
  );
}
