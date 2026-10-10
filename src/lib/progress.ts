import type { ProgressPoint } from "./types";

export function progressSummary(points: ProgressPoint[]) {
  if (points.length === 0) return null;
  const first = points[0], last = points[points.length - 1];
  const best = points.reduce((a, b) => (b.weight > a.weight || (b.weight === a.weight && b.reps > a.reps) ? b : a));
  return { gain: last.weight - first.weight, best, last, sessions: points.length };
}
