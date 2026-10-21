import { useState } from "react";
import { Centered, Notice } from "@/ui/Notice";
import { api } from "@/data/api";
import { useLoad } from "@/data/useAppState";
import { WorkoutCard } from "./WorkoutCard";

export function HistoryScreen() {
  const { data, error } = useLoad(api.history);
  // Последняя тренировка раскрыта сразу, остальные — по нажатию.
  const [open, setOpen] = useState<string | null | undefined>(undefined);
  if (error) return <Notice>{error}</Notice>;
  if (!data) return <Centered>Загрузка…</Centered>;
  if (data.workouts.length === 0) return <Centered>За последний месяц тренировок пока нет.</Centered>;
  const current = open === undefined ? data.workouts[0].date : open;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pt-2 text-[28px] font-bold">История</h1>
      {data.workouts.map((w) => (
        <WorkoutCard key={w.date} w={w} open={current === w.date}
          onToggle={() => setOpen(current === w.date ? null : w.date)} />
      ))}
    </div>
  );
}
