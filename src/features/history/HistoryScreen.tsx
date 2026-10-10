import { Card } from "@/ui/Card";
import { Centered, Notice } from "@/ui/Notice";
import { formatDay, formatSet, plural } from "@/lib/format";
import { api } from "@/data/api";
import { useLoad } from "@/data/useAppState";

export function HistoryScreen() {
  const { data, error } = useLoad(api.history);
  if (error) return <Notice>{error}</Notice>;
  if (!data) return <Centered>Загрузка…</Centered>;
  if (data.workouts.length === 0) return <Centered>За последний месяц тренировок пока нет.</Centered>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pt-2 text-[28px] font-bold">История</h1>
      {data.workouts.map((w) => (
        <Card key={w.date} title={formatDay(w.date)}
          action={<span className="text-caption text-hint">
            {w.minutes ? `${w.minutes} мин · ` : ""}{w.exercises.length} {plural(w.exercises.length, "упражнение", "упражнения", "упражнений")}
          </span>}>
          {w.exercises.map((ex) => (
            <div key={ex.name} className="flex justify-between gap-3 py-1 text-caption">
              <span className="truncate">{ex.name}</span>
              <span className="shrink-0 tabular-nums text-hint">{ex.sets.map(formatSet).join(" · ")}</span>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}
