import { useState } from "react";
import { TabBar } from "@/ui/TabBar";
import { HomeScreen } from "@/features/home/HomeScreen";
import { WorkoutScreen } from "@/features/workout/WorkoutScreen";
import { RestScreen } from "@/features/workout/RestScreen";
import { FinishScreen } from "@/features/workout/FinishScreen";
import { ProgressScreen } from "@/features/progress/ProgressScreen";
import { HistoryScreen } from "@/features/history/HistoryScreen";
import type { IconName } from "@/ui/Icon";
import { getParam } from "@/platform/web/location";
import { ROUTES, type Route, type Tab } from "./routes";

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "home", label: "Главная", icon: "home" },
  { id: "progress", label: "Прогресс", icon: "chart" },
  { id: "history", label: "История", icon: "list" },
];

function initialRoute(): Route {
  const r = getParam("screen") as Route | null;
  return r && ROUTES.includes(r) ? r : "home";
}

export function App() {
  const [route, setRoute] = useState<Route>(initialRoute);
  const inWorkout = route === "workout" || route === "rest" || route === "finish";
  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto px-4 pb-6 pt-[max(env(safe-area-inset-top),12px)]">
        {route === "home" && <HomeScreen onStart={() => setRoute("workout")} />}
        {route === "workout" && <WorkoutScreen onSet={() => setRoute("rest")} onFinish={() => setRoute("finish")} />}
        {route === "rest" && <RestScreen onSkip={() => setRoute("workout")} />}
        {route === "finish" && <FinishScreen onDone={() => setRoute("home")} />}
        {route === "progress" && <ProgressScreen />}
        {route === "history" && <HistoryScreen />}
      </main>
      {!inWorkout && <TabBar tabs={TABS} value={route as Tab} onChange={setRoute} />}
    </div>
  );
}
