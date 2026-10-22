import type { MedalIcon } from "@/ui/Medal";

export type ThemePref = "auto" | "light" | "dark";
export type Accent = "blue" | "green" | "orange" | "red" | "purple" | "pink";
export type Wallpaper = "none" | "gym" | "mountains" | "waves" | "neon" | "photo";

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
  info?: ExerciseInfo | null; // техника для просмотра с главной
};

export type DayPlan = {
  day: number; // день программы — им запускаем и переносим
  slot: number; // день недели, когда тренировка на этой неделе (с учётом переноса)
  weekday: string;
  movedFrom: string | null; // день по плану, если перенесли
  title: string;
  today: boolean;
  done: boolean;
  moveTo: number[]; // свободные дни до конца недели, куда можно перенести
  pick: number | null; // день программы, поставленный на этот день вместо плана (им и запускаем)
  insteadOf: string | null; // тренировка по плану, если поставили другую
  pickFrom: number[]; // дни программы, которые можно поставить сюда (план — «вернуть по плану»)
  short?: boolean; // план длиннее получаса — можно «Коротко, 30 мин»
  exercises: PlanExercise[];
};

export type ActiveWorkout = {
  status: "active";
  dayName: string;
  startedAt: string;
  index: number;
  // weightOptional — своё упражнение вместо программы: можно и с весом, и без.
  // step — шаг веса этого оборудования из профиля, null — обычный.
  exercises: (Omit<PlanExercise, "weight"> & { info?: ExerciseInfo | null; weightOptional?: boolean; step?: number | null })[];
  currentSet: number;
  weight: number | null;
  results: DoneSet[];
  notes: string[];
  rest: { endsAt: number; total: number } | null;
  awaitingExtra: boolean;
  canLater: boolean; // текущее упражнение можно отложить в конец
  swapOptions: SwapOption[]; // похожие упражнения для замены текущего
};

export type SwapOption = { name: string; muscles: string };

export type Workout = ActiveWorkout | { status: "pending"; day: number } | { status: "free" };

export type AppState = {
  user: { name: string; units: Units };
  profileReady: boolean;
  installUrl: string | null; // постоянный адрес — по нему приложение ставят на экран телефона
  today: string;
  serverTime: number;
  // streakWeeks — недели хоть с одной тренировкой; streak — недели, когда сделан весь план.
  stats: { monthWorkouts: number; streakWeeks: number; streak?: WeekStreak };
  week: DayPlan[];
  workout: Workout | null;
  summary?: WeekSummary | null;
  monthSummary?: MonthSummary | null; // итог прошлого месяца — первые 7 дней нового
};

export type MedalLevel = 0 | 1 | 2 | 3;

export type Achievement = {
  id: string;
  icon: MedalIcon;
  title: string;
  about: string;
  level: MedalLevel;          // 0 — ещё нет, 1 бронза, 2 серебро, 3 золото
  levels: string[];           // пороги уровней: «1 неделя», «4 подряд», «12 подряд» (у разовых — один)
  progress: number;           // сколько есть сейчас к следующему уровню
  target: number | null;      // сколько нужно для следующего; null — всё собрано
  unit: string;               // «недель подряд», «т»
};

export type NewAchievement = { icon: MedalIcon; title: string; level: MedalLevel; levelText: string };

export type Finished = {
  title: string; duration: string; sets: number; volume: number; report: string;
  achievements?: NewAchievement[];
};

export type ActionResult = { message: string; finished?: Finished | null; state: AppState };

export type ProgressPoint = { date: string; weight: number; reps: number };

export type ExerciseProgress = { name: string; points: ProgressPoint[] };

export type BodyPoint = { date: string; weight: number }; // вес тела, кг

export type ProgressData = { exercises: ExerciseProgress[]; achievements: Achievement[]; body?: BodyPoint[]; streak?: WeekStreak };

// Серия: недели подряд, когда сделаны все тренировки из плана. Текущая неделя только добавляет.
export type WeekStreak = { weeks: number; best: number; thisWeek: { done: number; planned: number } };

// Одно упражнение за всё время: лучший подход каждой тренировки (без веса — максимум повторов).
export type ExerciseHistory = {
  name: string;
  bodyweight: boolean;
  points: ProgressPoint[];
  sessions: { date: string; sets: DoneSet[] }[]; // последние, новые сверху
};

// Итог недели: с вечера воскресенья до конца понедельника.
export type WeekSummary = {
  done: number;
  planned: number;
  records: { name: string; weight: number }[];
  stalled: { name: string; weight: number; weeks: number }[];
  body: { weight: number; delta: number | null } | null;
  streak?: string | null; // «🔥 Серия: 3 недели подряд»
  advice: string;
};

// Итог месяца: приходит 1-го числа, виден во вкладке «Прогресс» неделю.
export type MonthSummary = {
  month: string; // «2026-09»
  title: string; // «сентябрь»
  workouts: number;
  sets: number;
  tonnage: number; // кг
  gains: { name: string; start: number; end: number; gain: number }[];
  records: { name: string; weight: number }[];
  recordsCount: number;
  body: { weight: number; delta: number | null } | null;
  advice: string;
};

export type HistoryExercise = { name: string; sets: DoneSet[]; prev: number | null; record: boolean };

export type HistoryEntry = {
  date: string;
  title: string;
  minutes: number;
  /** Поднято за тренировку, кг. */
  tonnage: number;
  /** В скольких упражнениях вес вырос к прошлому разу. */
  grown: number;
  records: { name: string; weight: number }[];
  exercises: HistoryExercise[];
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

// Что тренер помнит о человеке надолго (травмы, график, «запомни …»).
export type Fact = { id: number; text: string; created_at: string };

export type Sex = "m" | "f";
export type Units = "kg" | "lb";
// Личные данные из «Настроек»: имя видит и тренер в чате.
export type Me = {
  name: string;
  avatar: string | null;        // адрес картинки или null — тогда буква имени
  avatarOwn: boolean;           // своё фото, а не из Telegram
  sex: Sex | null;
  age: number | null;
  weight: number | null;        // кг
  height: number | null;        // см
  units: Units;
};
