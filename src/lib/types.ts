export type DoneSet = { weight: number | null; reps: number };

// Что показать на экране подхода: картинка, рабочие мышцы, техника.
export type ExerciseInfo = {
  image: string | null; // путь к картинке внутри приложения
  main: string[]; // мышцы для схемы тела (названия react-body-highlighter)
  help: string[];
  mainText: string; // «грудь»
  helpText: string; // «трицепс, передние дельты»
  how: string[];
};

export type PlanExercise = {
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  bodyweight: boolean;
  weight: number | null; // последний рабочий вес, null — нет истории или свой вес
};

export type DayPlan = {
  day: number;
  weekday: string;
  title: string;
  today: boolean;
  done: boolean;
  exercises: PlanExercise[];
};

export type ActiveWorkout = {
  status: "active";
  dayName: string;
  startedAt: string;
  index: number;
  exercises: (Omit<PlanExercise, "weight"> & { info?: ExerciseInfo | null })[];
  currentSet: number;
  weight: number | null;
  results: DoneSet[];
  notes: string[];
  rest: { endsAt: number; total: number } | null;
  awaitingExtra: boolean;
};

export type Workout = ActiveWorkout | { status: "pending"; day: number } | { status: "free" };

export type AppState = {
  user: { name: string };
  profileReady: boolean;
  today: string;
  serverTime: number;
  stats: { monthWorkouts: number; streakWeeks: number };
  week: DayPlan[];
  workout: Workout | null;
};

export type Finished = { title: string; duration: string; sets: number; volume: number; report: string };

export type ActionResult = { message: string; finished?: Finished | null; state: AppState };

export type ProgressPoint = { date: string; weight: number; reps: number };

export type ExerciseProgress = { name: string; points: ProgressPoint[] };

export type HistoryEntry = {
  date: string;
  minutes: number;
  exercises: { name: string; sets: DoneSet[] }[];
};

export type Profile = {
  goal: string | null;
  level: string | null;
  weekdays: number[];
  duration: number | null;
  place: string | null;
  equipment: string[];
  dumbbellStep: number | null;
  stackStep: number | null;
  limitations: string | null;
  replacements: { exercise: string; replacement: string | null }[];
  ownProgram: boolean;
  stale: boolean;
};

export type SurveyAnswers = {
  goal: string;
  level: string;
  weekdays: number[];
  duration: number;
  place: string;
  equipment: string[];
  dumbbellStep: number | null;
  stackStep: number | null;
  limitations: string | null;
};

export type ProfileResult = { message: string; profile: Profile; state: AppState };

export type ChatMessage = { role: "user" | "assistant"; text: string };
