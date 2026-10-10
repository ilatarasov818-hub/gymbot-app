import type { ReactNode } from "react";
import { OptionList, ToggleGrid } from "@/ui/Choice";
import {
  DUMBBELL_STEPS, DURATIONS, EQUIPMENT, GOALS, HOME, LEVELS, PLACES, STACK_STEPS, WEEKDAYS, hasDumbbells,
} from "@/lib/profile";
import type { Profile, SurveyAnswers } from "@/lib/types";

export type Draft = { [K in keyof SurveyAnswers]?: SurveyAnswers[K] };
export type FieldKey = Exclude<keyof SurveyAnswers, "equipment">;

type Ctx = {
  draft: Draft;
  /** Ответ без перехода дальше (переключатели, текст). */
  set: (patch: Draft) => void;
  /** Ответ одним нажатием — сразу дальше. */
  pick: (patch: Draft) => void;
};

type Question = {
  title: string;
  note?: string;
  /** true — нужна кнопка «Дальше», false — хватает одного нажатия. */
  confirm: boolean;
  ready: (d: Draft) => boolean;
  skip?: (d: Draft) => boolean;
  render: (ctx: Ctx) => ReactNode;
};

export const QUESTIONS: Record<FieldKey, Question> = {
  goal: {
    title: "Какая у тебя цель?",
    note: "От неё зависят повторения и отдых.",
    confirm: false,
    ready: (d) => Boolean(d.goal),
    render: ({ draft, pick }) => <OptionList options={GOALS} value={draft.goal} onPick={(goal) => pick({ goal })} />,
  },
  level: {
    title: "Какой у тебя опыт?",
    confirm: false,
    ready: (d) => Boolean(d.level),
    render: ({ draft, pick }) => <OptionList options={LEVELS} value={draft.level} onPick={(level) => pick({ level })} />,
  },
  weekdays: {
    title: "В какие дни тренируешься?",
    note: "Отметь от 2 до 5 дней.",
    confirm: true,
    ready: (d) => (d.weekdays?.length ?? 0) >= 2 && (d.weekdays?.length ?? 0) <= 5,
    render: ({ draft, set }) => {
      const days = draft.weekdays ?? [];
      return (
        <ToggleGrid items={WEEKDAYS} selected={days.map((d) => WEEKDAYS[d])}
          onToggle={(item) => {
            const day = WEEKDAYS.indexOf(item);
            const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
            set({ weekdays: next.sort((a, b) => a - b) });
          }} />
      );
    },
  },
  duration: {
    title: "Сколько длится тренировка?",
    confirm: false,
    ready: (d) => Boolean(d.duration),
    render: ({ draft, pick }) => <OptionList options={DURATIONS} value={draft.duration} onPick={(duration) => pick({ duration })} />,
  },
  place: {
    title: "Где тренируешься?",
    confirm: true,
    ready: (d) => Boolean(d.place),
    render: ({ draft, set }) => {
      const equipment = draft.equipment ?? [];
      return (
        <div className="flex flex-col gap-4">
          <OptionList options={PLACES} value={draft.place} onPick={(place) => set({ place })} />
          {draft.place === HOME && (
            <div>
              <p className="mb-2 text-caption text-hint">Что есть дома? Ничего — соберу программу на своём весе.</p>
              <ToggleGrid items={EQUIPMENT} selected={equipment} columns={2}
                onToggle={(item) => set({
                  equipment: EQUIPMENT.filter((e) => (e === item) !== equipment.includes(e)),
                })} />
            </div>
          )}
        </div>
      );
    },
  },
  dumbbellStep: {
    title: "Какой минимальный шаг гантелей?",
    note: "Насколько отличаются соседние гантели.",
    confirm: false,
    ready: (d) => d.dumbbellStep !== undefined,
    skip: (d) => !hasDumbbells(d.place ?? null, d.equipment ?? []),
    render: ({ draft, pick }) => (
      <OptionList options={DUMBBELL_STEPS} value={draft.dumbbellStep} onPick={(dumbbellStep) => pick({ dumbbellStep })} />
    ),
  },
  stackStep: {
    title: "Какой шаг веса в тренажёрах?",
    note: "Насколько меняется вес, если переставить штырь на одну плитку.",
    confirm: false,
    ready: (d) => d.stackStep !== undefined,
    skip: (d) => d.place === HOME,
    render: ({ draft, pick }) => (
      <OptionList options={STACK_STEPS} value={draft.stackStep} onPick={(stackStep) => pick({ stackStep })} />
    ),
  },
  limitations: {
    title: "Есть травмы или упражнения, которые не хочешь делать?",
    note: "Тренер сам уберёт их и подберёт безопасные замены.",
    confirm: true,
    ready: (d) => d.limitations === null || Boolean(d.limitations?.trim()),
    render: ({ draft, set }) => {
      const has = typeof draft.limitations === "string";
      return (
        <div className="flex flex-col gap-3">
          <OptionList
            options={[{ value: false, label: "Нет" }, { value: true, label: "Есть" }]}
            value={draft.limitations === undefined ? undefined : has}
            onPick={(yes) => set({ limitations: yes ? draft.limitations ?? "" : null })} />
          {has && (
            <textarea autoFocus rows={3} maxLength={300} value={draft.limitations ?? ""}
              placeholder="Например: болит колено, не люблю жим ногами"
              onChange={(e) => set({ limitations: e.target.value })}
              className="w-full resize-none rounded-2xl bg-surface p-4 text-body outline-none placeholder:text-hint focus:ring-2 focus:ring-accent" />
          )}
        </div>
      );
    },
  },
};

export const ORDER: FieldKey[] = [
  "goal", "level", "weekdays", "duration", "place", "dumbbellStep", "stackStep", "limitations",
];

/** Вопросы, которые стоит задать при таких ответах. */
export const activeQuestions = (d: Draft) => ORDER.filter((key) => !QUESTIONS[key].skip?.(d));

/** Ответы из профиля: «не заполнено» становится «ещё не отвечал». */
export function profileDraft(p: Profile): Draft {
  return {
    goal: p.goal ?? undefined,
    level: p.level ?? undefined,
    weekdays: p.weekdays,
    duration: p.duration ?? undefined,
    place: p.place ?? undefined,
    equipment: p.equipment,
    dumbbellStep: p.dumbbellStep,
    stackStep: p.stackStep,
    limitations: p.limitations,
  };
}
