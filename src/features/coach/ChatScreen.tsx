import { useState } from "react";
import { Icon } from "@/ui/Icon";
import { Notice } from "@/ui/Notice";
import { ScrollAnchor } from "@/ui/ScrollAnchor";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Как понять, что пора добавить вес?",
  "Что съесть до тренировки?",
  "Болят мышцы после тренировки — это нормально?",
  "Чем заменить упражнение, если тренажёр занят?",
];

const MAX_CHARS = 1000;

export function ChatScreen({ messages, thinking, error, onSend, onNewTopic, onCloseError }: {
  messages: ChatMessage[];
  thinking: boolean;
  error?: string | null;
  /** false — не отправилось, текст вернётся в поле. */
  onSend: (text: string) => Promise<boolean> | void;
  onNewTopic: () => void;
  onCloseError?: () => void;
}) {
  const [text, setText] = useState("");
  const send = async (value: string) => {
    const clean = value.trim();
    if (!clean || thinking) return;
    setText("");
    if ((await onSend(clean)) === false) setText((t) => t || clean);
  };

  return (
    <div className="flex flex-1 flex-col gap-3">
      <header className="flex items-center justify-between pt-2">
        <h1 className="text-[28px] font-bold leading-tight">Тренер</h1>
        {messages.length > 0 && (
          <button type="button" disabled={thinking} onClick={onNewTopic}
            className="text-body font-medium text-accent disabled:opacity-50">Новая тема</button>
        )}
      </header>

      {messages.length === 0 && !thinking ? (
        <div className="flex flex-col gap-3">
          <p className="text-body text-hint">
            Спрашивай про технику, питание, восстановление. Я вижу твой профиль, программу и последние тренировки. Скажи «запомни …» — учту надолго.
          </p>
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => void send(s)}
              className="rounded-2xl bg-bg px-4 py-3 text-left text-body text-accent active:scale-[0.98]">
              {s}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {messages.map((m, i) => (
            <div key={i}
              className={`max-w-[85%] whitespace-pre-line break-words rounded-[20px] px-4 py-2.5 text-body ${
                m.role === "user"
                  ? "self-end rounded-br-md bg-accent text-accent-fg"
                  : "self-start rounded-bl-md bg-bg"}`}>
              {m.text}
            </div>
          ))}
          {thinking && (
            <div className="self-start animate-pulse rounded-[20px] rounded-bl-md bg-bg px-4 py-2.5 text-body text-hint">
              Думаю…
            </div>
          )}
          <ScrollAnchor watch={`${messages.length}-${thinking}`} />
        </div>
      )}

      {error && <Notice onClose={onCloseError}>{error}</Notice>}

      <div className="sticky bottom-0 -mx-4 -mb-6 mt-auto flex items-end gap-2 bg-surface px-4 pb-1 pt-2">
        <textarea rows={1} maxLength={MAX_CHARS} value={text} placeholder="Спроси тренера…"
          onChange={(e) => setText(e.target.value)}
          className="field-sizing-content max-h-32 min-h-11 flex-1 resize-none rounded-[22px] bg-bg px-4 py-2.5 text-body outline-none placeholder:text-hint" />
        <button type="button" aria-label="Отправить" disabled={!text.trim() || thinking} onClick={() => void send(text)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition active:scale-90 disabled:opacity-40">
          <Icon name="send" size={22} />
        </button>
      </div>
    </div>
  );
}
