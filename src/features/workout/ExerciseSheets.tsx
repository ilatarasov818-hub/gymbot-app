import { useState } from "react";
import { Button } from "@/ui/Button";
import { OptionList } from "@/ui/Choice";
import { Sheet } from "@/ui/Sheet";
import type { SwapOption } from "@/lib/types";

// Пропустить текущее упражнение: отложить в конец или убрать на сегодня.
export function SkipSheet({ name, canLater, done, busy, onClose, onSkip }: {
  name: string; canLater: boolean; done: number; busy: boolean;
  onClose: () => void; onSkip: (later: boolean) => void;
}) {
  return (
    <Sheet title="Пропустить упражнение" onClose={onClose}>
      <p className="mb-5 text-body">
        «{name}»{done > 0 && <span className="text-hint"> — сделанные подходы ({done}) сохранятся.</span>}
      </p>
      <div className="flex flex-col gap-3">
        {canLater && (
          <Button variant="secondary" icon="timer" disabled={busy} onClick={() => onSkip(true)}>Сделать позже</Button>
        )}
        <Button icon="skip" disabled={busy} onClick={() => onSkip(false)}>Пропустить сегодня</Button>
        <p className="text-center text-caption text-hint">Программа не меняется — только сегодняшняя тренировка.</p>
      </div>
    </Sheet>
  );
}

// Заменить текущее упражнение на сегодня: похожее из программы или своё.
export function SwapSheet({ name, muscles, options, busy, onClose, onSwap }: {
  name: string; muscles: string; options: SwapOption[]; busy: boolean;
  onClose: () => void; onSwap: (exercise: string) => void;
}) {
  const [own, setOwn] = useState("");
  return (
    <Sheet title="Чем заменить" onClose={onClose}>
      <p className="mb-4 text-body">
        «{name}»{muscles && <span className="text-hint"> · {muscles}</span>}
      </p>
      <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
        {options.length > 0 && (
          <OptionList options={options.map((o) => ({ value: o.name, label: o.name, hint: o.muscles }))}
            onPick={(exercise) => !busy && onSwap(exercise)} />
        )}
        <div className="flex flex-col gap-2">
          <p className="text-caption text-hint">{options.length > 0 ? "Или своё упражнение" : "Своё упражнение"}</p>
          <input value={own} onChange={(e) => setOwn(e.target.value)} placeholder="Например, «Жим в Смите»"
            maxLength={80} aria-label="Своё упражнение"
            className="h-12 w-full rounded-xl bg-surface px-4 text-body outline-none placeholder:text-hint" />
          <Button icon="check" disabled={busy || own.trim().length === 0} onClick={() => onSwap(own.trim())}>Заменить</Button>
        </div>
        <p className="text-center text-caption text-hint">Только на сегодня. Подходы и повторения — те же.</p>
      </div>
    </Sheet>
  );
}
