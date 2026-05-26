/** Helpers band score cho Sample Essay (single source: overallBandScore). */

export function getBandBadgeStyle(score: number): string {
  if (score >= 7) return "bg-emerald-100 text-emerald-700";
  if (score >= 6) return "bg-sky-100 text-sky-700";
  return "bg-amber-100 text-amber-700";
}

export function formatBandScore(score?: number): string {
  if (score === undefined || score === null || Number.isNaN(score)) return "—";
  return score % 1 === 0 ? score.toFixed(0) : score.toFixed(1);
}

/** Map legacy targetBand query → min/max (backward compat, remove in Phase 4). */
export function legacyTargetBandToRange(
  targetBand?: string
): { minBand?: number; maxBand?: number } {
  switch (targetBand) {
    case "BAND_7_PLUS":
      return { minBand: 7, maxBand: 9 };
    case "BAND_6_0":
      return { minBand: 6, maxBand: 6.5 };
    case "BAND_5_0":
      return { minBand: 0, maxBand: 5.5 };
    default:
      return {};
  }
}
