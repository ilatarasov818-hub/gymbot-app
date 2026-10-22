import { useState } from "react";
import { Button } from "@/ui/Button";
import { Sheet } from "@/ui/Sheet";

// Столько же хранит бот.
export const NOTE_CHARS = 200;

// Строка «📝 сиденье на 4» под названием упражнения; нажатие — править.
export function NoteLine({ note, disabled, onEdit }: { note?: string | null; disabled?: boolean; onEdit: () => void }) {
  return (
    <button type="button" disabled={disabled} onClick={onEdit}
      className="mt-1 flex max-w-full items-start gap-1.5 text-left text-caption transition active:scale-95 disabled:opacity-50">
      <span aria-hidden>📝</span>
      {note
        ? <span className="min-w-0 break-words text-fg">{note}</span>
        : <span className="font-semibold text-accent">Добавить заметку</span>}
    </button>
  );
}

// Заметка к упражнению: настройки тренажёра, хват, на что обратить внимание.
export function NoteSheet({ name, note, busy, onClose, onSave }: {
  name: string; note?: string | null; busy: boolean;
  onClose: () => void; onSave: (note: string) => void;
}) {
  const [text, setText] = useState(note ?? "");
  return (
    <Sheet title="Заметка" onClose={onClose}>
      <p className="-mt-2 mb-4 text-caption text-hint">«{name}» — видно каждый раз перед этим упражнением.</p>
      <textarea autoFocus rows={3} maxLength={NOTE_CHARS} value={text} onChange={(e) => setText(e.target.value)}
        aria-label="Заметка" placeholder="Например: сиденье на 4, узкий хват"
        className="w-full resize-none rounded-2xl bg-surface p-4 text-body outline-none placeholder:text-hint focus:ring-2 focus:ring-accent" />
      <p className="mt-1 text-right text-caption tabular-nums text-hint">{text.length}/{NOTE_CHARS}</p>
      <div className="mt-3 flex flex-col gap-2">
        <Button icon="check" disabled={busy || (!text.trim() && !note)} onClick={() => onSave(text.trim())}>
          {busy ? "Сохраняю…" : "Сохранить"}
        </Button>
        {note && (
          <Button variant="plain" size="md" icon="trash" disabled={busy} onClick={() => onSave("")}>Удалить заметку</Button>
        )}
      </div>
    </Sheet>
  );
}
