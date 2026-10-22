// Серия недель: подписи для главной и «Прогресса».
import { plural } from "./format";
import type { WeekStreak } from "./types";

export const weeksText = (n: number) => `${n} ${plural(n, "неделя", "недели", "недель")}`;

/** «🔥 5 недель подряд»; без серии — пусто. */
export const streakChip = (s: WeekStreak) => (s.weeks > 0 ? `🔥 ${weeksText(s.weeks)} подряд` : "");

/** «Эта неделя: 2 из 3» / «Эта неделя: всё по плану ✓». */
export function weekProgress(s: WeekStreak): string {
  const { done, planned } = s.thisWeek;
  return done >= planned ? "Эта неделя: всё по плану ✓" : `Эта неделя: ${done} из ${planned}`;
}

/** Доля недели 0…1 для полоски. */
export const weekShare = (s: WeekStreak) => Math.min(1, s.thisWeek.done / Math.max(1, s.thisWeek.planned));
