// Макеты экранов на выдуманных данных — только для разработки (?mock=…).
import { TabBar } from "@/ui/TabBar";
import { ProfileScreen } from "@/features/profile/ProfileScreen";
import { EditSheet } from "@/features/profile/EditSheet";
import { SurveyScreen } from "@/features/profile/SurveyScreen";
import type { Profile } from "@/lib/types";

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

const TABS = [
  { id: "home", label: "Главная", icon: "home" },
  { id: "progress", label: "Прогресс", icon: "chart" },
  { id: "history", label: "История", icon: "list" },
  { id: "profile", label: "Профиль", icon: "user" },
] as const;

function Shell({ children, tabs = true }: { children: React.ReactNode; tabs?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-6 pt-3">{children}</main>
      {tabs && <TabBar tabs={[...TABS]} value="profile" onChange={noop} />}
    </div>
  );
}

export function Mockups({ name }: { name: string }) {
  const profile = (patch: Partial<Profile> = {}, message?: string) => (
    <ProfileScreen profile={{ ...PROFILE, ...patch }} busy={false} message={message}
      onEdit={noop} onRebuild={noop} onRestart={noop} />
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
    default: return <p>Нет макета «{name}»</p>;
  }
}
