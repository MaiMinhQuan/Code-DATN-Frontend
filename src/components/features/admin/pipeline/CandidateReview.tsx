"use client";

import { useState } from "react";
import { CheckSquare, Square, ChevronDown, ChevronUp } from "lucide-react";
import type { PipelineCandidate } from "@/types/pipeline.types";

interface Props {
  candidates: PipelineCandidate[];
  selectedIndexes: number[];
  onToggle: (i: number) => void;
}

function CandidateCard({
  question,
  essay,
  source,
  bandScore,
  wordCount,
  selected,
  onToggle,
}: {
  question: string;
  essay: string;
  source: string;
  bandScore?: number;
  wordCount: number;
  selected: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border transition-colors ${
        selected ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3 p-3">
        <button onClick={onToggle} className="mt-0.5 shrink-0">
          {selected ? (
            <CheckSquare className="h-4 w-4 text-indigo-600" />
          ) : (
            <Square className="h-4 w-4 text-slate-400" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-800 line-clamp-2">{question}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {source} · Band {bandScore ?? "?"} · {wordCount} từ
          </p>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          title={expanded ? "Thu gọn" : "Xem essay"}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="space-y-3 border-t border-slate-200 px-4 py-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Đề bài
            </p>
            <p className="text-sm leading-relaxed text-slate-700">{question}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Bài viết
            </p>
            <div className="max-h-72 overflow-y-auto rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {essay}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CandidateReview({ candidates, selectedIndexes, onToggle }: Props) {
  if (!candidates.length) return null;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Bài mẫu ({selectedIndexes.length}/{candidates.length} đã chọn)
      </p>
      <div className="space-y-2">
        {candidates.map((c, i) => (
          <CandidateCard
            key={i}
            question={c.question}
            essay={c.essay}
            source={c.source}
            bandScore={c.band_score || undefined}
            wordCount={c.essay.trim().split(/\s+/).length}
            selected={selectedIndexes.includes(i)}
            onToggle={() => onToggle(i)}
          />
        ))}
      </div>
    </div>
  );
}
