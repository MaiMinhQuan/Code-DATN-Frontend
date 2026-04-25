"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ErrorCategory } from "@/types/enums";
import type { AIResult } from "@/types/ai-result.types";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { UI_TEXT } from "@/constants/ui-text";

interface BandScorePanelProps {
  result: AIResult;
}

const CATEGORY_DOT: Record<ErrorCategory, string> = {
  [ErrorCategory.GRAMMAR]:       "bg-red-400",
  [ErrorCategory.SPELLING]:      "bg-orange-400",
  [ErrorCategory.VOCABULARY]:    "bg-yellow-400",
  [ErrorCategory.COHERENCE]:     "bg-purple-400",
  [ErrorCategory.TASK_RESPONSE]: "bg-blue-400",
  [ErrorCategory.PUNCTUATION]:   "bg-slate-400",
};

function countByCategory(errors: AIResult["errors"]) {
  const counts = {} as Record<ErrorCategory, number>;
  for (const e of errors) {
    counts[e.category] = (counts[e.category] ?? 0) + 1;
  }
  return counts;
}

export function BandScorePanel({ result }: BandScorePanelProps) {
  const {
    overallBand,
    taskResponseScore,
    coherenceScore,
    lexicalScore,
    grammarScore,
    errors,
    generalFeedback,
    strengths,
    improvements,
  } = result;

  const T = UI_TEXT.RESULT;

  const radarData = [
    { axis: T.CRITERIA_TR,  score: taskResponseScore },
    { axis: T.CRITERIA_CC,  score: coherenceScore },
    { axis: T.CRITERIA_LR,  score: lexicalScore },
    { axis: T.CRITERIA_GRA, score: grammarScore },
  ];

  const criteriaScores = [
    { label: T.CRITERIA_TR,  value: taskResponseScore },
    { label: T.CRITERIA_CC,  value: coherenceScore },
    { label: T.CRITERIA_LR,  value: lexicalScore },
    { label: T.CRITERIA_GRA, value: grammarScore },
  ];

  const errorCounts = countByCategory(errors);
  const categoriesWithErrors = Object.values(ErrorCategory).filter(
    (cat) => (errorCounts[cat] ?? 0) > 0
  );

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">

      <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
          {T.OVERALL_BAND}
        </p>
        <p className="text-6xl font-bold text-indigo-600 leading-none">
          {overallBand.toFixed(1)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {criteriaScores.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-center"
          >
            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
            <p className="text-xl font-bold text-slate-800">{value.toFixed(1)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          {T.SCORE_BREAKDOWN}
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 9]}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickCount={4}
            />
            <Radar
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              formatter={(value) => [
                value != null ? Number(value).toFixed(1) : "-",
                T.CHART_SCORE,
              ]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {categoriesWithErrors.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            {T.ERRORS_FOUND(errors.length)}
          </p>
          <div className="flex flex-wrap gap-2">
            {categoriesWithErrors.map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
              >
                <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT[cat]}`} />
                {UI_TEXT.ERROR_CATEGORY[cat]} ({errorCounts[cat]})
              </span>
            ))}
          </div>
        </div>
      )}

      {generalFeedback && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            {T.FEEDBACK}
          </p>
          <MarkdownContent content={generalFeedback} />
        </div>
      )}

      {strengths && (
        <div className="rounded-xl border border-green-100 bg-green-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-3">
            {T.STRENGTHS}
          </p>
          <MarkdownContent content={strengths} className="text-green-900" />
        </div>
      )}

      {improvements && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">
            {T.IMPROVEMENTS}
          </p>
          <MarkdownContent content={improvements} className="text-amber-900" />
        </div>
      )}

    </div>
  );
}
