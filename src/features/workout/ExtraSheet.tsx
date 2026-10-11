import { toKg, unitName, weightStep } from "@/lib/units";
import { useState } from "react";
import { Button } from "@/ui/Button";
import { Sheet } from "@/ui/Sheet";
import { Stepper } from "@/ui/Stepper";

export type Extra = { title: string; weight: number; reps: number[] };

export function ExtraSheet({ busy, onClose, onSave }: {
  busy: boolean; onClose: () => void; onSave: (extra: Extra) => void;
}) {
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState(0);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const ready = title.trim().length > 0 && sets > 0 && reps > 0;

  return (
    <Sheet title="Доп. упражнение" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название, например «Шраги»"
          maxLength={80} aria-label="Название"
          className="h-12 w-full rounded-xl bg-surface px-4 text-body outline-none placeholder:text-hint" />
        <Stepper label="Вес (0 — свой вес)" value={weight} unit={unitName()} step={weightStep()} onChange={setWeight} />
        <div className="grid grid-cols-2 gap-2">
          <Stepper compact label="Подходы" value={sets} onChange={(v) => setSets(Math.min(10, Math.round(v)))} />
          <Stepper compact label="Повторения" value={reps} onChange={(v) => setReps(Math.round(v))} />
        </div>
        <Button icon="check" disabled={busy || !ready}
          onClick={() => onSave({ title: title.trim(), weight: toKg(weight), reps: Array(sets).fill(reps) })}>
          Записать
        </Button>
      </div>
    </Sheet>
  );
}
