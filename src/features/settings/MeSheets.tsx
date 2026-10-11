import { useState } from "react";
import { Button } from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { Notice } from "@/ui/Notice";
import { Sheet } from "@/ui/Sheet";
import { Stepper } from "@/ui/Stepper";
import { fromUnits, toUnits, unitLabel } from "@/lib/me";
import type { Me } from "@/lib/types";
import type { MeField } from "./SettingsScreen";

const NUMBERS = {
  age: { title: "Возраст", unit: "лет", start: 25, step: 1 },
  weight: { title: "Вес", unit: "", start: 75, step: 0.5 },
  height: { title: "Рост", unit: "см", start: 175, step: 1 },
} as const;

/** Правка одного поля «Обо мне». Вес приходит и уходит в килограммах. */
export function MeSheet({ field, me, busy, error, onSave, onClose }: {
  field: MeField; me: Me; busy: boolean; error?: string | null;
  onSave: (patch: Partial<Me>) => void; onClose: () => void;
}) {
  const [name, setName] = useState(me.name);
  const num = field === "name" ? null : NUMBERS[field];
  const current = field === "name" ? 0 : me[field];
  const shown = field === "weight" && current ? toUnits(current, me.units) : current;
  const [value, setValue] = useState<number>(shown || (num?.start ?? 0));

  return (
    <Sheet title={field === "name" ? "Имя" : num!.title} onClose={onClose}>
      {field === "name" ? (
        <input autoFocus maxLength={40} value={name} onChange={(e) => setName(e.target.value)} placeholder="Как тебя называть"
          className="h-12 w-full rounded-2xl bg-surface px-4 text-body outline-none placeholder:text-hint focus:ring-2 focus:ring-accent" />
      ) : (
        <Stepper label="" value={value} step={field === "weight" && me.units === "lb" ? 1 : num!.step}
          unit={field === "weight" ? unitLabel(me.units) : num!.unit} onChange={setValue} />
      )}
      {error && <div className="mt-4"><Notice>{error}</Notice></div>}
      <div className="mt-5">
        <Button disabled={busy || (field === "name" ? !name.trim() : value <= 0)}
          onClick={() => onSave(field === "name" ? { name: name.trim() }
            : { [field]: field === "weight" ? fromUnits(value, me.units) : Math.round(value) })}>
          {busy ? "Сохраняю…" : "Сохранить"}
        </Button>
      </div>
    </Sheet>
  );
}

export function AvatarSheet({ me, busy, error, onPick, onTelegram, onRemove, onClose }: {
  me: Me; busy: boolean; error?: string | null;
  onPick: () => void; onTelegram: () => void; onRemove: () => void; onClose: () => void;
}) {
  const item = "flex w-full items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 text-body disabled:opacity-50";
  return (
    <Sheet title="Фото" onClose={onClose}>
      <div className="flex flex-col gap-2">
        <button type="button" disabled={busy} onClick={onPick} className={`${item} text-accent`}><Icon name="camera" />Выбрать с телефона</button>
        {(me.avatarOwn || !me.avatar) && (
          <button type="button" disabled={busy} onClick={onTelegram} className={`${item} text-accent`}><Icon name="user" />Взять из Telegram</button>
        )}
        {me.avatar && (
          <button type="button" disabled={busy} onClick={onRemove} className={`${item} text-bad`}><Icon name="trash" />Убрать фото</button>
        )}
      </div>
      {error && <div className="mt-4"><Notice>{error}</Notice></div>}
    </Sheet>
  );
}
