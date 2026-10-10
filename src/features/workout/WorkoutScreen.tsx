import { useState } from "react";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { Stepper } from "@/ui/Stepper";
import { formatSet } from "@/lib/format";
import { week } from "@/data/mock";

export function WorkoutScreen({ onSet, onFinish }: { onSet: () => void; onFinish: () => void }) {
  const exercises = week.find((d) => d.today)!.exercises;
  const index = 1, set = 2;
  const ex = exercises[index];
  const [weight, setWeight] = useState(ex.weight ?? 0);
  const [reps, setReps] = useState(10);
  const done = [{ weight: 22, reps: 12 }];

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between pt-2">
        <div className="flex gap-1.5" aria-label={`Упражнение ${index + 1} из ${exercises.length}`}>
          {exercises.map((_, i) => (
            <span key={i} className={`h-1.5 w-8 rounded-full ${i < index ? "bg-good" : i === index ? "bg-accent" : "bg-line"}`} />
          ))}
        </div>
        <span className="flex items-center gap-1 text-caption text-hint"><Icon name="timer" size={16} />18:42</span>
      </header>

      <Card>
        <p className="text-caption text-hint">Упражнение {index + 1} из {exercises.length}</p>
        <h1 className="mt-1 text-title font-bold leading-tight">{ex.name}</h1>
        <div className="mt-3 flex gap-2">
          <Badge>Подход {set} из {ex.sets}</Badge>
          <Badge>Цель {ex.repsMin}–{ex.repsMax} повт.</Badge>
        </div>
        <div className="mt-6 flex flex-col gap-6">
          <Stepper label="Вес" value={weight} unit="кг" step={2} onChange={setWeight} />
          <Stepper label="Повторения" value={reps} onChange={setReps} />
        </div>
        <div className="mt-6">
          <Button icon="check" onClick={onSet}>Записать подход</Button>
        </div>
      </Card>

      <Card title="Сделано">
        {done.map((s, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="text-hint">Подход {i + 1}</span>
            <span className="flex items-center gap-2 font-semibold">{formatSet(s)}<span className="text-good"><Icon name="check" size={18} /></span></span>
          </div>
        ))}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" size="md" icon="plus">Доп. упражнение</Button>
        <Button variant="secondary" size="md" icon="flag" onClick={onFinish}>Финиш</Button>
      </div>
    </div>
  );
}
