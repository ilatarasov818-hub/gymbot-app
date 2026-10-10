import { useState } from "react";
import { Button } from "@/ui/Button";
import { Notice } from "@/ui/Notice";
import { Sheet } from "@/ui/Sheet";

export function FeedbackSheet({ busy, error, onSend, onClose }: {
  busy: boolean;
  error?: string | null;
  onSend: (text: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  return (
    <Sheet title="Отзыв" onClose={onClose}>
      <p className="-mt-2 mb-4 text-caption text-hint">
        Что понравилось, что мешает, чего не хватает. Прочитает автор бота.
      </p>
      <textarea autoFocus rows={5} maxLength={2000} value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Например: хочу видеть вес за прошлую неделю прямо в тренировке"
        className="w-full resize-none rounded-2xl bg-surface p-4 text-body outline-none placeholder:text-hint focus:ring-2 focus:ring-accent" />
      {error && <div className="mt-4"><Notice>{error}</Notice></div>}
      <div className="mt-4">
        <Button disabled={busy || !text.trim()} onClick={() => onSend(text.trim())}>
          {busy ? "Отправляю…" : "Отправить"}
        </Button>
      </div>
    </Sheet>
  );
}

const DELETED = [
  "ответы анкеты и программу",
  "все записанные подходы и историю",
  "отзывы",
  "разговор с тренером",
];

export function DeleteSheet({ busy, error, onDelete, onClose }: {
  busy: boolean;
  error?: string | null;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet title="Удалить мои данные?" onClose={onClose}>
      <p className="mb-2 text-body">Удалю навсегда:</p>
      <ul className="mb-4 list-disc pl-5 text-body">
        {DELETED.map((d) => <li key={d}>{d}</li>)}
      </ul>
      <p className="mb-4 text-caption text-hint">Вернуть их будет нельзя. Захочешь вернуться — начнём с чистого листа.</p>
      {error && <div className="mb-4"><Notice>{error}</Notice></div>}
      <div className="flex flex-col gap-2">
        <Button variant="danger" disabled={busy} onClick={onDelete}>{busy ? "Удаляю…" : "Удалить всё"}</Button>
        <Button variant="plain" disabled={busy} onClick={onClose}>Не удалять</Button>
      </div>
    </Sheet>
  );
}

export function DeletedScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="text-[56px]">👋</div>
      <h1 className="text-title font-bold">Данные удалены</h1>
      <p className="text-body text-hint">Захочешь вернуться — просто напиши боту, начнём с чистого листа.</p>
      <div className="w-full max-w-60"><Button onClick={onClose}>Закрыть</Button></div>
    </div>
  );
}
