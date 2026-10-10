import type { DayPlan, HistoryEntry, ProgressPoint } from "@/lib/types";

// Пример данных для макетов. Позже их заменят ответы бота.
export const user = { name: "Илья", week: 2, cycleWeeks: 4, monthWorkouts: 9, streakWeeks: 3 };

export const week: DayPlan[] = [
  {
    title: "Грудь и трицепс", weekday: "пн", done: true, today: false,
    exercises: [],
  },
  {
    title: "Спина и бицепс", weekday: "ср", done: false, today: true,
    exercises: [
      { name: "Тяга верхнего блока", sets: 3, repsMin: 8, repsMax: 12, weight: 45 },
      { name: "Тяга гантели в наклоне", sets: 3, repsMin: 8, repsMax: 12, weight: 22 },
      { name: "Горизонтальная тяга", sets: 3, repsMin: 10, repsMax: 12, weight: 40 },
      { name: "Подъём гантелей на бицепс", sets: 3, repsMin: 10, repsMax: 15, weight: 12 },
      { name: "Планка", sets: 3, repsMin: 30, repsMax: 60, weight: null },
    ],
  },
  { title: "Ноги и плечи", weekday: "пт", done: false, today: false, exercises: [] },
];

export const progress: Record<string, ProgressPoint[]> = {
  "Жим гантелей лёжа": [
    { date: "2026-08-28", weight: 18, reps: 10 },
    { date: "2026-09-04", weight: 18, reps: 12 },
    { date: "2026-09-11", weight: 20, reps: 9 },
    { date: "2026-09-18", weight: 20, reps: 11 },
    { date: "2026-09-25", weight: 22, reps: 8 },
    { date: "2026-10-02", weight: 22, reps: 10 },
    { date: "2026-10-09", weight: 24, reps: 9 },
  ],
  "Тяга верхнего блока": [
    { date: "2026-09-02", weight: 35, reps: 12 },
    { date: "2026-09-16", weight: 40, reps: 10 },
    { date: "2026-09-30", weight: 45, reps: 9 },
  ],
  "Приседания": [
    { date: "2026-09-04", weight: 40, reps: 10 },
    { date: "2026-09-18", weight: 45, reps: 10 },
    { date: "2026-10-02", weight: 50, reps: 8 },
  ],
};

export const nextWeight: Record<string, string> = {
  "Жим гантелей лёжа": "В следующий раз: 24 кг, добивай до 12 повторений",
};

export const history: HistoryEntry[] = [
  {
    date: "2026-10-09", title: "Грудь и трицепс", minutes: 52,
    exercises: [
      { name: "Жим гантелей лёжа", sets: [{ weight: 24, reps: 9 }, { weight: 24, reps: 8 }, { weight: 24, reps: 8 }] },
      { name: "Разводка гантелей", sets: [{ weight: 10, reps: 12 }, { weight: 10, reps: 12 }, { weight: 10, reps: 11 }] },
      { name: "Отжимания на брусьях", sets: [{ weight: null, reps: 10 }, { weight: null, reps: 9 }, { weight: null, reps: 8 }] },
    ],
  },
  {
    date: "2026-10-06", title: "Ноги и плечи", minutes: 58,
    exercises: [
      { name: "Приседания", sets: [{ weight: 50, reps: 8 }, { weight: 50, reps: 8 }, { weight: 50, reps: 7 }] },
      { name: "Жим гантелей сидя", sets: [{ weight: 14, reps: 10 }, { weight: 14, reps: 9 }, { weight: 14, reps: 9 }] },
    ],
  },
  {
    date: "2026-10-03", title: "Спина и бицепс", minutes: 47,
    exercises: [
      { name: "Тяга верхнего блока", sets: [{ weight: 45, reps: 9 }, { weight: 45, reps: 9 }, { weight: 45, reps: 8 }] },
      { name: "Подъём гантелей на бицепс", sets: [{ weight: 12, reps: 12 }, { weight: 12, reps: 11 }, { weight: 12, reps: 10 }] },
    ],
  },
];
