// График одного упражнения из «Истории»: что рисуем, лучший результат, рост, короткие строки тренировок.
import { plural, shortDay } from "./format";
import type { DoneSet, ExerciseHistory } from "./types";
import { showKg, unitName } from "./units";

const num = (n: number) => n.toLocaleString("ru-RU");
const DAY_MS = 24 * 3600 * 1000;

/** Значения для графика: вес в единицах человека, без веса — повторы. */
export const chartValues = (e: ExerciseHistory) => e.points.map((p) => (e.bodyweight ? p.reps : showKg(p.weight)));

/** «50 кг» / «20 повт.» */
export const amount = (e: ExerciseHistory, value: number) => `${num(value)} ${e.bodyweight ? "повт." : unitName()}`;

/** Лучший результат за всё время в единицах графика. */
export function best(e: ExerciseHistory): number | null {
  const values = chartValues(e);
  return values.length ? Math.max(...values) : null;
}

/** Срок между первой и последней тренировкой: «6 недель», «5 дней». */
export function span(from: string, to: string): string {
  const days = Math.round((new Date(to).getTime() - new Date(from).getTime()) / DAY_MS);
  if (days >= 14) {
    const weeks = Math.round(days / 7);
    return `${weeks} ${plural(weeks, "неделю", "недели", "недель")}`;
  }
  return `${days} ${plural(days, "день", "дня", "дней")}`;
}

/** Первый → последний: { delta, text: «+12,5 кг за 6 недель» }; меньше двух тренировок — null. */
export function change(e: ExerciseHistory): { delta: number; text: string } | null {
  if (e.points.length < 2) return null;
  const values = chartValues(e);
  const delta = Math.round((values[values.length - 1] - values[0]) * 10) / 10;
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "±";
  return { delta, text: `${sign}${amount(e, Math.abs(delta))} за ${span(e.points[0].date, e.points[e.points.length - 1].date)}` };
}

/** «12 окт · 3 × 8–10 · 50 кг» — без веса последней части нет. */
export function sessionLine(date: string, sets: DoneSet[]): string {
  const reps = sets.map((s) => s.reps);
  const lo = Math.min(...reps), hi = Math.max(...reps);
  const top = Math.max(0, ...sets.map((s) => s.weight ?? 0));
  const parts = [shortDay(date), `${sets.length} × ${lo === hi ? lo : `${lo}–${hi}`}`];
  if (top) parts.push(`${num(showKg(top))} ${unitName()}`);
  return parts.join(" · ");
}
