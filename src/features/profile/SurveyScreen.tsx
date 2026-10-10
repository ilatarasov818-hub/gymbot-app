import { useState } from "react";
import { Button } from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import type { SurveyAnswers } from "@/lib/types";
import { QUESTIONS, activeQuestions, type Draft } from "./questions";

export function SurveyScreen({ busy, initial = {}, startAt = 0, onSubmit, onCancel }: {
  busy: boolean;
  initial?: Draft;
  startAt?: number;
  onSubmit: (answers: SurveyAnswers) => void;
  onCancel?: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(initial);
  const [index, setIndex] = useState(startAt);
  const keys = activeQuestions(draft);
  const key = keys[Math.min(index, keys.length - 1)];
  const question = QUESTIONS[key];
  const last = index >= keys.length - 1;

  const next = (d: Draft) => {
    if (last) onSubmit(d as SurveyAnswers);
    else setIndex(index + 1);
  };
  const set = (patch: Draft) => setDraft({ ...draft, ...patch });
  const pick = (patch: Draft) => {
    const d = { ...draft, ...patch };
    setDraft(d);
    // Даём увидеть отмеченный вариант перед переходом.
    setTimeout(() => next(d), 180);
  };
  const back = index > 0 ? () => setIndex(index - 1) : onCancel;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <header className="flex items-center gap-3 pt-2">
        {back
          ? <button type="button" aria-label="Назад" onClick={back} className="-ml-1 rotate-180 text-accent"><Icon name="chevron" /></button>
          : <span className="w-[22px]" />}
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${((index + 1) / keys.length) * 100}%` }} />
        </div>
        <span className="text-caption text-hint">{index + 1} из {keys.length}</span>
      </header>

      {index === 0 && !onCancel && (
        <p className="text-body text-hint">Ответь на пару вопросов — соберу программу и подстрою повторения, отдых и шаг веса.</p>
      )}

      <section className="rounded-card bg-bg p-4">
        <h1 className="text-title font-bold leading-tight">{question.title}</h1>
        {question.note && <p className="mt-1 text-caption text-hint">{question.note}</p>}
        <div className="mt-4">{question.render({ draft, set, pick })}</div>
      </section>

      {question.confirm && (
        <div className="mt-auto">
          <Button disabled={busy || !question.ready(draft)} onClick={() => next(draft)}>
            {busy ? "Собираю программу…" : last ? "Готово" : "Дальше"}
          </Button>
        </div>
      )}
    </div>
  );
}
