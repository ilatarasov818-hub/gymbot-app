import { useState } from "react";
import { Button } from "@/ui/Button";
import { Card, Row } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { formatWeight, plural } from "@/lib/format";
import type { AppState, DayPlan } from "@/lib/types";

function defaultDay(week: DayPlan[]): DayPlan | undefined {
  const todayIndex = week.findIndex((d) => d.today);
  if (todayIndex >= 0) return week[todayIndex];
  const now = new Date().getDay() || 7; // пн = 1 … вс = 7
  return week.find((d) => d.day + 1 > now) ?? week[0];
}

export function HomeScreen({ state, busy, onStart }: {
  state: AppState; busy: boolean; onStart: (day: number) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const day = state.week.find((d) => d.day === picked) ?? defaultDay(state.week);
  const { stats } = state;
  const restDay = !state.week.some((d) => d.today);

  return (
    <div className="flex flex-col gap-4">
      <header className="pt-2">
        <h1 className="text-[28px] font-bold leading-tight">Привет{state.user.name ? `, ${state.user.name}` : ""} 👋</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Stat value={String(stats.monthWorkouts)} label={`${plural(stats.monthWorkouts, "тренировка", "тренировки", "тренировок")} за месяц`} />
        <Stat value={`${stats.streakWeeks} нед.`} label={stats.streakWeeks ? "без пропусков 🔥" : "подряд с тренировками"} />
      </div>

      {state.workout?.status === "free" && (
        <Card><p className="text-body">Сейчас идёт свободная запись в чате. Закончи её там кнопкой «🏁 Финиш».</p></Card>
      )}

      {day && (
        <Card title={day.today ? "Сегодня" : picked === null && restDay ? "Сегодня отдых · следующая" : day.weekday}>
          <h2 className="mb-3 text-title font-bold">{day.title}</h2>
          {day.exercises.map((ex) => (
            <Row key={ex.name} left={ex.name}
              sub={`${ex.sets} × ${ex.repsMin}–${ex.repsMax}`}
              right={ex.bodyweight ? "свой вес" : ex.weight ? formatWeight(ex.weight) : "подберём"} />
          ))}
          <div className="mt-4">
            <Button icon="play" disabled={busy || state.workout?.status === "free"} onClick={() => onStart(day.day)}>
              {day.today || picked !== null ? "Начать тренировку" : "Начать всё равно"}
            </Button>
          </div>
        </Card>
      )}

      <Card title="Неделя">
        {state.week.map((d) => (
          <button key={d.day} type="button" className="block w-full text-left" onClick={() => setPicked(d.day)}>
            <Row
              left={<span className={d.day === day?.day ? "font-semibold" : ""}>{d.title}</span>}
              sub={d.today ? "сегодня" : d.weekday}
              right={d.done
                ? <span className="flex items-center gap-1 text-good"><Icon name="check" size={18} />готово</span>
                : <Icon name="chevron" size={18} />} />
          </button>
        ))}
      </Card>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-card bg-bg p-4">
      <div className="text-[28px] font-bold leading-none">{value}</div>
      <div className="mt-1 text-caption text-hint">{label}</div>
    </div>
  );
}
