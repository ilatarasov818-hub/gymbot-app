// Макеты экранов на выдуманных данных — только для разработки (?mock=…).
import { TabBar } from "@/ui/TabBar";
import { ProfileScreen } from "@/features/profile/ProfileScreen";
import { EditSheet } from "@/features/profile/EditSheet";
import { SurveyScreen } from "@/features/profile/SurveyScreen";
import { ChatScreen } from "@/features/coach/ChatScreen";
import { DeleteSheet, DeletedScreen, FeedbackSheet } from "@/features/profile/AccountSheets";
import { WorkoutScreen } from "@/features/workout/WorkoutScreen";
import { SkipSheet, SwapSheet } from "@/features/workout/ExerciseSheets";
import { ProgressView } from "@/features/progress/ProgressScreen";
import { AchievementsCard } from "@/features/progress/Achievements";
import { FinishScreen } from "@/features/workout/FinishScreen";
import { SettingsScreen } from "@/features/settings/SettingsScreen";
import { AvatarSheet, MeSheet } from "@/features/settings/MeSheets";
import type { Achievement, ActiveWorkout, AppState, ChatMessage, Me, Profile, WeekSummary } from "@/lib/types";
import { HomeScreen } from "@/features/home/HomeScreen";
import { BodyWeightSheet } from "@/features/progress/BodyWeight";
import sampleImage from "./sample.webp";

const PROFILE: Profile = {
  goal: "Масса", level: "Средний", weekdays: [0, 2, 4], duration: 60, place: "Зал", equipment: [],
  dumbbellStep: 2, stackStep: 5, limitations: "болит колено",
  replacements: [
    { exercise: "Жим ногами", replacement: "Ягодичный мост" },
    { exercise: "Разгибание ног", replacement: null },
  ],
  ownProgram: true, stale: false,
};

const ME: Me = { name: "Илья", avatar: null, avatarOwn: false, sex: "m", age: 29, weight: 82, height: 180, units: "kg" };
const ME_EMPTY: Me = { name: "Илья", avatar: null, avatarOwn: false, sex: null, age: null, weight: null, height: null, units: "kg" };

const noop = () => {};

const ACH: Achievement[] = [
  { id: "perfect", icon: "calendar", title: "Идеальная неделя", about: "Все запланированные тренировки за неделю. Уровни — недели подряд.", level: 1, levels: ["1 неделя", "4 подряд", "12 подряд"], progress: 2, target: 4, unit: "нед." },
  { id: "streak", icon: "flame", title: "Серия", about: "Недели подряд, в которые была хотя бы одна тренировка.", level: 1, levels: ["4 недели", "12 недель", "26 недель"], progress: 5, target: 12, unit: "нед." },
  { id: "workouts", icon: "dumbbell", title: "Тренировки", about: "Сколько всего тренировок сделано.", level: 1, levels: ["10", "50", "100"], progress: 23, target: 50, unit: "трен." },
  { id: "records", icon: "chart", title: "Рекорды", about: "Новый лучший вес в упражнении — это рекорд.", level: 2, levels: ["1 рекорд", "10 рекордов", "50 рекордов"], progress: 14, target: 50, unit: "рек." },
  { id: "tonnage", icon: "stack", title: "Всего поднято", about: "Вес × повторения по всем подходам.", level: 1, levels: ["10 т", "100 т", "1000 т"], progress: 38.5, target: 100, unit: "т" },
  { id: "early", icon: "sunrise", title: "Ранняя пташка", about: "Тренировки, начатые до 8 утра.", level: 0, levels: ["1 раз", "10 раз", "30 раз"], progress: 0, target: 1, unit: "раз" },
  { id: "night", icon: "moon", title: "Ночная смена", about: "Тренировки, начатые после 22:00.", level: 1, levels: ["1 раз", "10 раз", "30 раз"], progress: 1, target: 10, unit: "раз" },
];
const POINTS = [60, 62.5, 62.5, 65, 67.5, 70].map((weight, i) => ({ date: `2026-09-${String(7 + 4 * i).padStart(2, "0")}`, weight, reps: 8 }));

const BODY = [["2026-09-07", 83.4], ["2026-09-14", 83.1], ["2026-09-21", 82.9], ["2026-09-28", 83.0], ["2026-10-05", 82.6], ["2026-10-12", 82.4]].map(([date, weight]) => ({ date: date as string, weight: weight as number }));
const SUMMARY: WeekSummary = {
  done: 3, planned: 3,
  records: [{ name: "Жим лёжа", weight: 70 }, { name: "Приседания", weight: 90 }],
  stalled: [{ name: "Тяга верхнего блока", weight: 50, weeks: 3 }],
  body: { weight: 82.4, delta: -0.2 },
  advice: "Тягу верхнего блока на этой неделе сделай 45 кг × 12 — потом 50 пойдёт легче. Остальное — добавляй по 2,5 кг, как получается.",
};
const DAY = (title: string, day: number, today = false) => ({
  day, slot: day, weekday: ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"][day], title, today, done: false,
  movedFrom: null, moveTo: [1, 3, 5, 6], pick: null, insteadOf: null, pickFrom: [2, 4],
  exercises: [
    { name: "Жим лёжа", sets: 3, repsMin: 6, repsMax: 10, bodyweight: false, weight: 70 },
    { name: "Приседания", sets: 3, repsMin: 6, repsMax: 10, bodyweight: false, weight: 90 },
    { name: "Тяга верхнего блока", sets: 3, repsMin: 8, repsMax: 12, bodyweight: false, weight: 50 },
  ],
});
const STATE: AppState = {
  user: { name: "Илья", units: "kg" }, profileReady: true, installUrl: null, today: "2026-10-12", serverTime: Date.now(),
  stats: { monthWorkouts: 11, streakWeeks: 6 },
  week: [DAY("Full Body A", 0, true), DAY("Full Body B", 2), DAY("Full Body C", 4)],
  workout: null, summary: SUMMARY,
};

const CHAT: ChatMessage[] = [
  { role: "user", text: "Жим застрял на 80 кг уже две недели. Что делать?" },
  { role: "assistant", text: "Вижу: 80 кг × 8, 8, 7 в понедельник и 80 × 8, 7, 7 в четверг. Это нормально — тело привыкает.\n\nПопробуй так:\n• следующую тренировку сделай 75 кг, но 4 подхода по 10;\n• потом снова 80 — обычно идёт легче;\n• спи 7–8 часов, без этого рост стоит." },
  { role: "user", text: "А может добавить отжимания на брусьях?" },
];

const CURL = {
  image: sampleImage, main: ["biceps"], help: ["forearm"],
  mainText: "бицепс", helpText: "предплечья",
  how: ["Локти прижаты к корпусу и не ходят вперёд.", "Поднимай на выдохе, опускай медленно — 2–3 секунды.", "Не раскачивайся: если тянет спина — вес великоват."],
};
const BENCH = {
  image: null, main: ["chest"], help: ["triceps", "front-deltoids"],
  mainText: "грудь", helpText: "трицепс, передние дельты", how: [],
};
const WORKOUT = (info: ActiveWorkout["exercises"][number]["info"], name = "Сгибание рук с гантелями"): ActiveWorkout => ({
  status: "active", dayName: "Руки и плечи", startedAt: new Date(Date.now() - 23 * 60000).toISOString(), index: 2,
  exercises: [
    { name: "Жим гантелей сидя", sets: 3, repsMin: 8, repsMax: 12, bodyweight: false },
    { name: "Разведения в стороны", sets: 3, repsMin: 12, repsMax: 15, bodyweight: false },
    { name, sets: 3, repsMin: 10, repsMax: 12, bodyweight: false, info },
    { name: "Французский жим", sets: 3, repsMin: 10, repsMax: 12, bodyweight: false },
  ],
  currentSet: 2, weight: 12, results: [{ weight: 12, reps: 12 }], notes: [], rest: null, awaitingExtra: false,
  canLater: true,
  swapOptions: [
    { name: "Молотковые сгибания", muscles: "бицепс, предплечья" },
    { name: "Сгибание рук на блоке", muscles: "бицепс" },
    { name: "Концентрированные сгибания", muscles: "бицепс" },
  ],
});
const workout = (w: ActiveWorkout) => (
  <WorkoutScreen workout={w} busy={false} onSet={noop} onExtra={async () => true}
    onSkip={async () => true} onSwap={async () => true} onFinish={noop} />
);

const TABS = [
  { id: "home", label: "Главная", icon: "home" },
  { id: "coach", label: "Тренер", icon: "chat" },
  { id: "progress", label: "Прогресс", icon: "chart" },
  { id: "history", label: "История", icon: "list" },
  { id: "profile", label: "Профиль", icon: "user" },
] as const;

function Shell({ children, tabs = true, tab = "profile" }: { children: React.ReactNode; tabs?: boolean; tab?: string }) {
  return (
    <div className="flex h-full flex-col">
      <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-6 pt-3">{children}</main>
      {tabs && <TabBar tabs={[...TABS]} value={tab} onChange={noop} />}
    </div>
  );
}

export function Mockups({ name }: { name: string }) {
  const profile = (patch: Partial<Profile> = {}, message?: string) => (
    <ProfileScreen profile={{ ...PROFILE, ...patch }} me={ME} busy={false} message={message} onSettings={noop}
      onEdit={noop} onRebuild={noop} onRestart={noop} />
  );
  const settings = (me: Me = ME) => (
    <SettingsScreen me={me} theme="auto" onTheme={noop} accent="blue" onAccent={noop} wallpaper="gym" wallpaperPhoto={null} onWallpaper={noop} onWallpaperPhoto={noop} onBack={noop} onAvatar={noop}
      onEdit={noop} onSex={noop} onUnits={noop} onFeedback={noop} onReset={noop} onDelete={noop} onLogout={noop} />
  );
  switch (name) {
    case "profile": return <Shell>{profile()}</Shell>;
    case "settings": return <Shell>{settings()}</Shell>;
    case "settings-bottom": return <Shell>{settings()}</Shell>;
    case "settings-empty": return <Shell>{settings(ME_EMPTY)}</Shell>;
    case "settings-weight": return <Shell>{settings()}<MeSheet field="weight" me={ME} busy={false} onSave={noop} onClose={noop} /></Shell>;
    case "settings-avatar": return <Shell>{settings()}<AvatarSheet me={ME} busy={false} onPick={noop} onTelegram={noop} onRemove={noop} onClose={noop} /></Shell>;
    case "stale": return <Shell>{profile({ stale: true, weekdays: [0, 2, 4, 5] })}</Shell>;
    case "limits-done": return <Shell>{profile({}, "🩺 Учёл: «болит колено».\nЖим ногами → Ягодичный мост\nРазгибание ног — убрал, безопасной замены нет")}</Shell>;
    case "edit-days": return <Shell>{profile()}<EditSheet field="weekdays" profile={PROFILE} busy={false} onSave={noop} onClose={noop} /></Shell>;
    case "edit-limits": return <Shell>{profile()}<EditSheet field="limitations" profile={PROFILE} busy={false} onSave={noop} onClose={noop} /></Shell>;
    case "survey-goal": return <Shell tabs={false}><SurveyScreen busy={false} onSubmit={noop} /></Shell>;
    case "survey-days": return <Shell tabs={false}><SurveyScreen busy={false} startAt={2} initial={{ goal: "Масса", level: "Новичок", weekdays: [0, 3] }} onSubmit={noop} /></Shell>;
    case "survey-home": return <Shell tabs={false}><SurveyScreen busy={false} startAt={4} initial={{ goal: "Масса", level: "Новичок", weekdays: [0, 3], duration: 60, place: "Дом", equipment: ["Гантели", "Турник"] }} onSubmit={noop} /></Shell>;
    case "chat-empty": return <Shell tab="coach"><ChatScreen messages={[]} thinking={false} onSend={noop} onNewTopic={noop} /></Shell>;
    case "chat": return <Shell tab="coach"><ChatScreen messages={CHAT} thinking onSend={noop} onNewTopic={noop} /></Shell>;
    case "profile-bottom": return <Shell>{profile({ replacements: [] })}</Shell>;
    case "feedback": return <Shell>{profile()}<FeedbackSheet busy={false} onSend={noop} onClose={noop} /></Shell>;
    case "delete": return <Shell>{profile()}<DeleteSheet busy={false} onDelete={noop} onClose={noop} /></Shell>;
    case "deleted": return <Shell tabs={false}><DeletedScreen onClose={noop} /></Shell>;
    case "set": return <Shell tabs={false}>{workout(WORKOUT(CURL))}</Shell>;
    case "set-bottom": return <Shell tabs={false}>{workout(WORKOUT(CURL))}</Shell>;
    case "skip": return <Shell tabs={false}>{workout(WORKOUT(CURL))}<SkipSheet name="Сгибание рук с гантелями" canLater done={1} busy={false} onClose={noop} onSkip={noop} /></Shell>;
    case "swap": return <Shell tabs={false}>{workout(WORKOUT(CURL))}<SwapSheet name="Сгибание рук с гантелями" muscles="бицепс" options={WORKOUT(CURL).swapOptions} busy={false} onClose={noop} onSwap={noop} /></Shell>;
    case "achievements": return <Shell tab="progress"><ProgressView data={{ exercises: [{ name: "Жим лёжа", points: POINTS }, { name: "Приседания", points: POINTS }], achievements: ACH }} picked={null} onPick={noop} onAddWeight={noop} /></Shell>;
    case "achievements-new": return <Shell tab="progress"><ProgressView data={{ exercises: [], achievements: ACH.map((a) => ({ ...a, level: 0, progress: 0 })) }} picked={null} onPick={noop} onAddWeight={noop} /></Shell>;
    case "achievement": return <Shell tab="progress"><h1 className="pt-2 text-[28px] font-bold">Прогресс</h1><AchievementsCard items={ACH} openId="perfect" /></Shell>;
    case "finish-ach": return <Shell tabs={false}><FinishScreen onDone={noop} finished={{ title: "Full Body A", duration: "52 мин", sets: 18, volume: 6240, report: "📊 Итог тренировки\n⏱ Время: 52 мин\n📈 Прогресс:\n• Жим лёжа: вес 67.5 → 70 кг",
      achievements: [{ icon: "calendar", title: "Идеальная неделя", level: 1, levelText: "1 неделя" }, { icon: "chart", title: "Рекорды", level: 2, levelText: "10 рекордов" }] }} /></Shell>;
    case "summary": return <Shell tab="home"><HomeScreen state={STATE} busy={false} onStart={noop} onMove={async () => true} onPick={async () => true} /></Shell>;
    case "body": return <Shell tab="progress"><ProgressView data={{ exercises: [{ name: "Жим лёжа", points: POINTS }], achievements: ACH, body: BODY }} picked={null} onPick={noop} onAddWeight={noop} /></Shell>;
    case "body-empty": return <Shell tab="progress"><ProgressView data={{ exercises: [], achievements: ACH.map((a) => ({ ...a, level: 0, progress: 0 })), body: [] }} picked={null} onPick={noop} onAddWeight={noop} /></Shell>;
    case "body-sheet": return <Shell tab="progress"><ProgressView data={{ exercises: [{ name: "Жим лёжа", points: POINTS }], achievements: ACH, body: BODY }} picked={null} onPick={noop} onAddWeight={noop} /><BodyWeightSheet last={82.4} busy={false} onSave={noop} onClose={noop} /></Shell>;
    case "set-noimage": return <Shell tabs={false}>{workout(WORKOUT(BENCH, "Жим штанги лёжа"))}</Shell>;
    default: return <p>Нет макета «{name}»</p>;
  }
}
