import { useEffect, useState } from "react";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { Stepper } from "@/ui/Stepper";
import { formatSet } from "@/lib/format";
import type { ActiveWorkout } from "@/lib/types";
import { ExtraSheet, type Extra } from "./ExtraSheet";

export function WorkoutScreen({ workout, busy, onSet, onExtra, onFinish }: {
  workout: ActiveWorkout;
  busy: boolean;
  onSet: (weight: number, reps: number) => void;
  onExtra: (extra: Extra) => Promise<boolean>;
  onFinish: () => void;
}) {
  const { exercises, index, results } = workout;
  const ex = exercises[index];
  const last = results[results.length - 1];
  const [weight, setWeight] = useState(last?.weight ?? workout.weight ?? 0);
  const [reps, setReps] = useState(last?.reps ?? ex.repsMax);
  const [extraOpen, setExtraOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between pt-2">
        <div className="flex flex-wrap gap-1.5" aria-label={`Упражнение ${index + 1} из ${exercises.length}`}>
          {exercises.map((_, i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full ${i < index ? "bg-good" : i === index ? "bg-accent" : "bg-line"}`} />
          ))}
        </div>
        <Elapsed since={workout.startedAt} />
      </header>

      <Card>
        <p className="text-caption text-hint">{workout.dayName} · {index + 1} из {exercises.length}</p>
        <h1 className="mt-1 text-title font-bold leading-tight">{ex.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>Подход {workout.currentSet} из {ex.sets}</Badge>
          <Badge>Цель {ex.repsMin}–{ex.repsMax} повт.</Badge>
        </div>
        <div className="mt-6 flex flex-col gap-6">
          {!ex.bodyweight && <Stepper label="Вес" value={weight} unit="кг" step={2.5} onChange={setWeight} />}
          <Stepper label="Повторения" value={reps} onChange={setReps} />
        </div>
        <div className="mt-6">
          <Button icon="check" disabled={busy || reps <= 0 || (!ex.bodyweight && weight <= 0)}
            onClick={() => onSet(ex.bodyweight ? 0 : weight, reps)}>
            {!ex.bodyweight && weight <= 0 ? "Укажи вес" : "Записать подход"}
          </Button>
        </div>
      </Card>

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

      {extraOpen && (
        <ExtraSheet busy={busy} onClose={() => setExtraOpen(false)}
          onSave={async (extra) => { if (await onExtra(extra)) setExtraOpen(false); }} />
      )}
    </div>
  );
}

function Elapsed({ since }: { since: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const seconds = Math.max(0, Math.floor((now - new Date(since).getTime()) / 1000));
  const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
  const text = h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
  return <span className="flex items-center gap-1 text-caption tabular-nums text-hint"><Icon name="timer" size={16} />{text}</span>;
}
