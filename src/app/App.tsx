import { useState } from "react";
import { TabBar } from "@/ui/TabBar";
import { Button } from "@/ui/Button";
import { Centered, Notice } from "@/ui/Notice";
import type { IconName } from "@/ui/Icon";
import { HomeScreen } from "@/features/home/HomeScreen";
import { WorkoutScreen } from "@/features/workout/WorkoutScreen";
import { RestScreen } from "@/features/workout/RestScreen";
import { FinishScreen } from "@/features/workout/FinishScreen";
import { useRestLeft } from "@/features/workout/useRestLeft";
import { ProgressScreen } from "@/features/progress/ProgressScreen";
import { HistoryScreen } from "@/features/history/HistoryScreen";
import { ProfileTab } from "@/features/profile/ProfileTab";
import { SurveyScreen } from "@/features/profile/SurveyScreen";
import { DeletedScreen } from "@/features/profile/AccountSheets";
import { CoachTab } from "@/features/coach/CoachTab";
import { useAppState } from "@/data/useAppState";
import { useChat } from "@/data/useChat";
import { getParam } from "@/platform/web/location";
import { closeApp, confirm, haptic } from "@/platform/web/telegram";
import { TAB_IDS, type Tab } from "./routes";

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "home", label: "Главная", icon: "home" },
  { id: "coach", label: "Тренер", icon: "chat" },
  { id: "progress", label: "Прогресс", icon: "chart" },
  { id: "history", label: "История", icon: "list" },
  { id: "profile", label: "Профиль", icon: "user" },
];

function initialTab(): Tab {
  const t = getParam("screen") as Tab | null;
  return t && TAB_IDS.includes(t) ? t : "home";
}

export function App() {
  const [tab, setTab] = useState<Tab>(initialTab);
  const app = useAppState();
  const chat = useChat();
  const [deleted, setDeleted] = useState(false);
  const { state, busy, act } = app;
  const workout = state?.workout?.status === "active" ? state.workout : null;
  const restLeft = useRestLeft(workout, app.offset, () => haptic("success"));

  let screen;
  if (deleted) {
    screen = <DeletedScreen onClose={closeApp} />;
  } else if (app.finished) {
    screen = <FinishScreen finished={app.finished} onDone={() => { app.closeFinished(); setTab("home"); }} />;
  } else if (!state) {
    screen = app.error
      ? <Centered><p>{app.error}</p><div className="w-full max-w-60"><Button variant="secondary" onClick={() => void app.refresh()}>Ещё раз</Button></div></Centered>
      : <Centered>Загрузка…</Centered>;
  } else if (!state.profileReady) {
    screen = <SurveyScreen busy={busy} onSubmit={(answers) => {
      void app.saveProfile({ name: "survey", answers }).then((done) => done && haptic("success"));
    }} />;
  } else if (workout && workout.rest && restLeft > 0) {
    screen = <RestScreen workout={workout} left={restLeft} busy={busy}
      onSkip={() => void act({ name: "skip" })} onExtend={() => void act({ name: "extend" })} />;
  } else if (workout) {
    screen = (
      <WorkoutScreen key={workout.index} workout={workout} busy={busy}
        onSet={async (weight, reps) => {
          haptic("medium");
          await act({ name: "set", weight, reps });
        }}
        onExtra={async (extra) => Boolean(await act({ name: "extra", ...extra }))}
        onFinish={async () => {
          if (await confirm("Закончить тренировку? Все сделанные подходы сохранятся.")) {
            const done = await act({ name: "finish" });
            if (done) haptic("success");
          }
        }} />
    );
  } else if (tab === "coach") {
    screen = <CoachTab chat={chat} />;
  } else if (tab === "progress") {
    screen = <ProgressScreen />;
  } else if (tab === "history") {
    screen = <HistoryScreen />;
  } else if (tab === "profile") {
    screen = <ProfileTab busy={busy} error={app.error} save={app.saveProfile} onDeleted={() => setDeleted(true)} />;
  } else {
    screen = <HomeScreen state={state} busy={busy} onStart={(day) => {
      haptic("light");
      void act({ name: "start", day });
    }} />;
  }

  const showTabs = Boolean(state?.profileReady) && !workout && !app.finished && !deleted;
  return (
    <div className="flex h-full flex-col">
      <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-6 pt-[max(env(safe-area-inset-top),12px)]">
        {state && app.error && !deleted && <Notice onClose={app.clearError}>{app.error}</Notice>}
        {screen}
      </main>
      {showTabs && <TabBar tabs={TABS} value={tab} onChange={setTab} />}
    </div>
  );
}
