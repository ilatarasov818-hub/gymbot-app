import type { ActiveWorkout } from "./types";

const FIRST_SET_SECONDS = 180; // подход + отдых, пока своего темпа нет

/** Сколько минут примерно осталось: оставшиеся подходы × свой темп за эту тренировку. */
export function minutesLeft(workout: ActiveWorkout, elapsedSeconds: number): number {
  const { exercises, index, currentSet } = workout;
  const total = exercises.reduce((sum, e) => sum + e.sets, 0);
  const done = exercises.slice(0, index).reduce((sum, e) => sum + e.sets, 0) + currentSet - 1;
  const perSet = done >= 2 ? elapsedSeconds / done : FIRST_SET_SECONDS;
  return Math.max(0, Math.ceil(((total - done) * perSet) / 60));
}

/** Сколько примерно займёт тренировка по плану, минут (округлено до 5). */
export function plannedMinutes(exercises: { sets: number }[]): number {
  const sets = exercises.reduce((sum, e) => sum + e.sets, 0);
  return Math.max(5, Math.round((sets * FIRST_SET_SECONDS) / 60 / 5) * 5);
}
