import { useEffect, useState } from "react";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { Stepper } from "@/ui/Stepper";
import { formatSet } from "@/lib/format";
import { showKg, toKg, unitName, weightStep } from "@/lib/units";
import { minutesLeft } from "@/lib/eta";
import type { ActiveWorkout } from "@/lib/types";
import { ExtraSheet, type Extra } from "./ExtraSheet";
import { ExercisePicture, HowTo } from "./ExerciseInfoView";
import { SkipSheet, SwapSheet } from "./ExerciseSheets";

export function WorkoutScreen({ workout, busy, onSet, onExtra, onSkip, onSwap, onFinish }: {
  workout: ActiveWorkout;
  busy: boolean;
  onSet: (weight: number, reps: number) => void;
  onExtra: (extra: Extra) => Promise<boolean>;
  onSkip: (later: boolean) => Promise<boolean>;
  onSwap: (exercise: string) => Promise<boolean>;
  onFinish: () => void;
}) {
  const { exercises, index, results } = workout;
  const ex = exercises[index];
  const last = results[results.length - 1];
  const [weight, setWeight] = useState(() => showKg(last?.weight ?? workout.weight ?? 0));
  const [reps, setReps] = useState(last?.reps ?? ex.repsMax);
  const [extraOpen, setExtraOpen] = useState(false);
  const [sheet, setSheet] = useState<"skip" | "swap" | null>(null);
  const needsWeight = !ex.bodyweight && !ex.weightOptional;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between pt-2">
        <div className="flex flex-wrap gap-1.5" aria-label={`Упражнение ${index + 1} из ${exercises.length}`}>
          {exercises.map((_, i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full ${i < index ? "bg-good" : i === index ? "bg-accent" : "bg-line"}`} />
          ))}
        </div>
        <Elapsed workout={workout} />
      </header>

      <Card>
        <p className="text-caption text-hint">{workout.dayName} · {index + 1} из {exercises.length}</p>
        <h1 className="mt-1 text-title font-bold leading-tight">{ex.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>Подход {workout.currentSet} из {ex.sets}</Badge>
          <Badge>Цель {ex.repsMin}–{ex.repsMax} повт.</Badge>
        </div>
        {ex.info && <ExercisePicture info={ex.info} />}
        <div className="mt-6 flex flex-col gap-6">
          {!ex.bodyweight && <Stepper label="Вес" value={weight} unit={unitName()} step={weightStep()} onChange={setWeight} />}
          <Stepper label="Повторения" value={reps} onChange={setReps} />
        </div>
        <div className="mt-6">
          <Button icon="check" disabled={busy || reps <= 0 || (needsWeight && weight <= 0)}
            onClick={() => onSet(ex.bodyweight ? 0 : toKg(weight), reps)}>
            {needsWeight && weight <= 0 ? "Укажи вес" : "Записать подход"}
          </Button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button variant="plain" size="md" icon="swap" disabled={busy} onClick={() => setSheet("swap")}>Заменить</Button>
          <Button variant="plain" size="md" icon="skip" disabled={busy} onClick={() => setSheet("skip")}>Пропустить</Button>
        </div>
      </Card>

      {ex.info && ex.info.how.length > 0 && <Card title="Как делать"><HowTo info={ex.info} /></Card>}

      {workout.notes.length > 0 && (
        <Card title="Подсказка">
          {workout.notes.map((n) => <p key={n} className="text-caption">{n}</p>)}
        </Card>
      )}

      {results.length > 0 && (
        <Card title="Сделано">
          {results.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <span className="text-hint">Подход {i + 1}</span>
              <span className="flex items-center gap-2 font-semibold">{formatSet(s)}<span className="text-good"><Icon name="check" size={18} /></span></span>
            </div>
          ))}
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" size="md" icon="plus" disabled={busy} onClick={() => setExtraOpen(true)}>Доп. упражнение</Button>
        <Button variant="secondary" size="md" icon="flag" disabled={busy} onClick={onFinish}>Финиш</Button>
      </div>

      {sheet === "skip" && (
        <SkipSheet name={ex.name} canLater={workout.canLater} done={results.length} busy={busy}
          onClose={() => setSheet(null)} onSkip={async (later) => { if (await onSkip(later)) setSheet(null); }} />
      )}
      {sheet === "swap" && (
        <SwapSheet name={ex.name} muscles={ex.info?.mainText ?? ""} options={workout.swapOptions} busy={busy}
          onClose={() => setSheet(null)} onSwap={async (exercise) => { if (await onSwap(exercise)) setSheet(null); }} />
      )}
      {extraOpen && (
        <ExtraSheet busy={busy} onClose={() => setExtraOpen(false)}
          onSave={async (extra) => { if (await onExtra(extra)) setExtraOpen(false); }} />
      )}
    </div>
  );
}

function Elapsed({ workout }: { workout: ActiveWorkout }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const seconds = Math.max(0, Math.floor((now - new Date(workout.startedAt).getTime()) / 1000));
  const left = minutesLeft(workout, seconds);
  const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
  const text = h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
  return (
    <span className="flex shrink-0 items-center gap-1 text-caption tabular-nums text-hint">
      <Icon name="timer" size={16} />{text}{left > 0 && <span> · ещё ~{left} мин</span>}
    </span>
  );
}
