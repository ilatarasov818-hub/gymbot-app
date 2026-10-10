export type PlanExercise = {
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  weight: number | null; // null — упражнение со своим весом
};

export type DoneSet = { weight: number | null; reps: number };

export type DayPlan = { title: string; weekday: string; exercises: PlanExercise[]; done: boolean; today: boolean };

export type HistoryEntry = {
  date: string; // ISO
  title: string;
  minutes: number;
  exercises: { name: string; sets: DoneSet[] }[];
};

export type ProgressPoint = { date: string; weight: number; reps: number };
