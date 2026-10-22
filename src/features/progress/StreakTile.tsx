import { HexStat, NeonCard } from "@/ui/Neon";
import { weekProgress, weeksText } from "@/lib/streak";
import type { WeekStreak } from "@/lib/types";

/** Серия недель по плану: сейчас и лучшая. */
export function StreakTile({ streak: s }: { streak: WeekStreak }) {
  return (
    <NeonCard label="Серия недель">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-caption font-semibold uppercase tracking-wide text-hint">🔥 Серия недель</h2>
        <span className="text-caption text-hint tabular-nums">{weekProgress(s)}</span>
      </header>
      <div className="flex gap-1">
        <HexStat value={`${s.weeks}`} label="подряд" good={s.weeks > 0} />
        <HexStat value={`${s.best}`} label="лучшая" />
      </div>
      <p className="mt-3 text-caption text-hint">
        {s.weeks > 0
          ? `${weeksText(s.weeks)} подряд все тренировки по плану.${s.best > s.weeks ? ` Рекорд — ${weeksText(s.best)}.` : " Это твой рекорд!"}`
          : "Сделай все тренировки недели по плану — начнётся серия."}
      </p>
    </NeonCard>
  );
}
