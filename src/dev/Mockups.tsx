// Макеты экранов на выдуманных данных — только для разработки (?mock=…).
import { TabBar } from "@/ui/TabBar";
import { ProfileScreen } from "@/features/profile/ProfileScreen";
import { EditSheet } from "@/features/profile/EditSheet";
import { SurveyScreen } from "@/features/profile/SurveyScreen";
import { ChatScreen } from "@/features/coach/ChatScreen";
import { DeleteSheet, DeletedScreen, FeedbackSheet } from "@/features/profile/AccountSheets";
import type { ChatMessage, Profile } from "@/lib/types";

const PROFILE: Profile = {
  goal: "Масса", level: "Средний", weekdays: [0, 2, 4], duration: 60, place: "Зал", equipment: [],
  dumbbellStep: 2, stackStep: 5, limitations: "болит колено",
  replacements: [
    { exercise: "Жим ногами", replacement: "Ягодичный мост" },
    { exercise: "Разгибание ног", replacement: null },
  ],
  ownProgram: true, stale: false,
};

const noop = () => {};

const CHAT: ChatMessage[] = [
  { role: "user", text: "Жим застрял на 80 кг уже две недели. Что делать?" },
  { role: "assistant", text: "Вижу: 80 кг × 8, 8, 7 в понедельник и 80 × 8, 7, 7 в четверг. Это нормально — тело привыкает.\n\nПопробуй так:\n• следующую тренировку сделай 75 кг, но 4 подхода по 10;\n• потом снова 80 — обычно идёт легче;\n• спи 7–8 часов, без этого рост стоит." },
  { role: "user", text: "А может добавить отжимания на брусьях?" },
];

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
    <ProfileScreen profile={{ ...PROFILE, ...patch }} busy={false} message={message}
      onEdit={noop} onRebuild={noop} onRestart={noop} onFeedback={noop} onDelete={noop} />
  );
  switch (name) {
    case "profile": return <Shell>{profile()}</Shell>;
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
    default: return <p>Нет макета «{name}»</p>;
  }
}
