import { Button } from "@/ui/Button";
import { ProgressRing } from "@/ui/ProgressRing";
import { formatRest, formatSet, formatWeight } from "@/lib/format";
import type { ActiveWorkout } from "@/lib/types";

export function RestScreen({ workout, left, busy, hint, onSkip, onExtend }: {
  workout: ActiveWorkout; left: number; busy: boolean; hint: string; onSkip: () => void; onExtend: () => void;
}) {
  const total = workout.rest?.total ?? 1;
  const ex = workout.exercises[workout.index];
  const last = workout.results[workout.results.length - 1];
  return (
    <div className="flex flex-col items-center gap-8 pt-6">
      <div className="text-center">
        <p className="text-caption font-semibold uppercase tracking-wide text-hint">Отдых</p>
        {last && <p className="mt-1 text-body">Записал: <b>{formatSet(last)}</b> 💪</p>}
      </div>

      <ProgressRing value={Math.min(1, left / total)}>
        <span className="text-display font-bold tabular-nums leading-none">{formatRest(left)}</span>
        <span className="mt-2 text-caption text-hint">из {formatRest(total)}</span>
      </ProgressRing>

      <div className="w-full rounded-card bg-bg p-4 text-center">
        <p className="text-caption text-hint">Дальше</p>
        <p className="mt-1 font-semibold">{ex.name}</p>
        <p className="text-caption text-hint">
          Подход {workout.currentSet} из {ex.sets}
          {!ex.bodyweight && last?.weight ? ` · ${formatWeight(last.weight)}` : ""} · цель {ex.repsMin}–{ex.repsMax}
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <Button variant="secondary" icon="plus" disabled={busy} onClick={onExtend}>30 сек</Button>
        <Button icon="skip" disabled={busy} onClick={onSkip}>Пропустить</Button>
      </div>
      <p className="text-center text-caption text-hint">{hint}</p>
    </div>
  );
}
