// Сводка тренировки для «Истории»: короткие строки вместо всех подходов.
import type { HistoryExercise } from "./types";

export const topWeight = (e: HistoryExercise) => Math.max(0, ...e.sets.map((s) => s.weight ?? 0));

/** «7–8» или «8»: разброс повторов по подходам. */
export function repsRange(e: HistoryExercise): string {
  const r = e.sets.map((s) => s.reps);
  const lo = Math.min(...r), hi = Math.max(...r);
  return lo === hi ? `${lo}` : `${lo}–${hi}`;
}

/** Насколько вырос лучший вес к прошлой тренировке; null — сравнить не с чем. */
export function growth(e: HistoryExercise): number | null {
  const top = topWeight(e);
  return top && e.prev != null ? top - e.prev : null;
}

/** Длина полоски 0…1: вес сегодня к прошлому разу, без веса — короткая метка. */
export function barShare(e: HistoryExercise): number {
  const top = topWeight(e);
  if (!top) return 0.12;
  return Math.max(0.12, Math.min(1, top / Math.max(top, e.prev ?? 0)));
}
