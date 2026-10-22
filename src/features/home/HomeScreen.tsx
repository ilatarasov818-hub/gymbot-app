import { useState } from "react";
import { Button } from "@/ui/Button";
import { Card, Row } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { formatWeight, plural } from "@/lib/format";
import { plannedMinutes } from "@/lib/eta";
import type { AppState, DayPlan, PlanExercise } from "@/lib/types";
import { ExerciseSheet } from "./ExerciseSheet";
import { MoveSheet } from "./MoveSheet";
import { PickSheet } from "./PickSheet";
import { WeekSummaryCard } from "./WeekSummaryCard";

function defaultDay(week: DayPlan[]): DayPlan | undefined {
  const todayIndex = week.findIndex((d) => d.today);
  if (todayIndex >= 0) return week[todayIndex];
  const now = new Date().getDay() || 7; // пн = 1 … вс = 7
  return week.find((d) => d.slot + 1 > now) ?? week[0];
}

export function HomeScreen({ state, busy, onStart, onMove, onPick, onNote }: {
  state: AppState; busy: boolean; onStart: (day: number, short?: boolean) => void;
  onMove: (day: number, to: number) => Promise<boolean>; onPick: (day: number, pick: number) => Promise<boolean>;
  onNote: (exercise: string, note: string) => Promise<boolean>;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [shown, setShown] = useState<PlanExercise | null>(null);
  const [open, setOpen] = useState(false);
  const [moving, setMoving] = useState(false);
  const [picking, setPicking] = useState(false);
  const day = state.week.find((d) => d.day === picked) ?? defaultDay(state.week);
  const { stats } = state;
  const restDay = !state.week.some((d) => d.today);

  return (
    <div className="flex flex-col gap-4">
      <header className="pt-2">
        <h1 className="text-[28px] font-bold leading-tight">Привет{state.user.name ? `, ${state.user.name}` : ""} 👋</h1>
      </header>

      <WeekStrip week={state.week} selected={day?.day} streakWeeks={stats.streakWeeks}
        monthWorkouts={stats.monthWorkouts} onPick={(d) => { setPicked(d); setOpen(false); }} />

      {state.summary && <WeekSummaryCard summary={state.summary} />}

      {state.workout?.status === "free" && (
        <Card><p className="text-body">Сейчас идёт свободная запись в чате. Закончи её там кнопкой «🏁 Финиш».</p></Card>
      )}

      {day && (
        <Card title={day.today ? "Сегодня" : picked === null && restDay ? "Сегодня отдых · следующая" : day.weekday}>
          <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between gap-3 text-left">
            <div className="min-w-0">
              <h2 className="text-title font-bold">{day.title}</h2>
              <p className="text-caption text-hint">
                {day.exercises.length} {plural(day.exercises.length, "упражнение", "упражнения", "упражнений")} · ~{plannedMinutes(day.exercises)} мин
                {day.done && (day.today || picked !== null) ? " · готово ✓" : ""}
              </p>
              {day.movedFrom && <p className="text-caption text-accent">Перенесена, по плану — {day.movedFrom}</p>}
              {day.insteadOf && <p className="text-caption text-accent">Вместо плана — {day.insteadOf}</p>}
            </div>
            <span className={`shrink-0 text-hint transition-transform ${open ? "-rotate-90" : "rotate-90"}`}>
              <Icon name="chevron" size={20} />
            </span>
          </button>
          {open && (
            <div className="mt-3 border-t border-line pt-3">
              <p className="mb-1 text-caption text-hint">Нажми на упражнение — покажу технику</p>
              {day.exercises.map((ex) => (
                <Row key={ex.name} left={ex.name} onClick={() => setShown(ex)}
                  sub={`${ex.sets} × ${ex.repsMin}–${ex.repsMax}`}
                  right={ex.bodyweight ? "свой вес" : ex.weight ? formatWeight(ex.weight) : "подберём"} />
              ))}
            </div>
          )}
        </Card>
      )}

      {day && (
        <div className="flex flex-col gap-2">
          <Button icon="play" disabled={busy || state.workout?.status === "free"} onClick={() => onStart(day.pick ?? day.day)}>
            {day.today || picked !== null ? "Начать тренировку" : "Начать всё равно"}
          </Button>
          {/* Мало времени — только самое важное из плана. */}
          {day.short && !state.workout && (
            <Button icon="bolt" variant="secondary" size="md" disabled={busy} onClick={() => onStart(day.pick ?? day.day, true)}>
              Коротко, 30 мин
            </Button>
          )}
        </div>
      )}

      {day && day.pickFrom.length > 0 && !state.workout && (
        <Button icon="swap" variant="secondary" size="md" disabled={busy} onClick={() => setPicking(true)}>
          Другая тренировка из плана
        </Button>
      )}

      {day && day.moveTo.length > 0 && !state.workout && (
        <Button icon="calendar" variant="secondary" size="md" disabled={busy} onClick={() => setMoving(true)}>
          Перенести на другой день
        </Button>
      )}

      {moving && day && (
        <MoveSheet day={day} today={state.today} busy={busy} onClose={() => setMoving(false)} onPick={async (to) => {
          if (await onMove(day.day, to)) {
            setPicked(day.day);
            setMoving(false);
          }
        }} />
      )}

      {picking && day && (
        <PickSheet day={day} week={state.week} busy={busy} onClose={() => setPicking(false)} onPick={async (pick) => {
          if (await onPick(day.day, pick)) {
            setPicked(day.day);
            setPicking(false);
          }
        }} />
      )}

      {/* Заметка — свежая из состояния: после сохранения карточка не устаревает. */}
      {shown && (
        <ExerciseSheet exercise={shown} busy={busy} onClose={() => setShown(null)} onNote={onNote}
          note={state.week.flatMap((d) => d.exercises).find((e) => e.name === shown.name)?.note} />
      )}
    </div>
  );
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

/** Неделя кружками: галочка — тренировка сделана, рамка — выбранный день, точка — сегодня, без кружка — отдых. */
function WeekStrip({ week, selected, streakWeeks, monthWorkouts, onPick }: {
  week: DayPlan[]; selected?: number; streakWeeks: number; monthWorkouts: number; onPick: (day: number) => void;
}) {
  const todayIndex = (new Date().getDay() || 7) - 1;
  const note = streakWeeks
    ? `🔥 ${streakWeeks} нед. подряд`
    : monthWorkouts ? `${monthWorkouts} ${plural(monthWorkouts, "тренировка", "тренировки", "тренировок")} за месяц` : "";
  return (
    <section className="rounded-card bg-bg p-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-caption font-semibold uppercase tracking-wide text-hint">Неделя</h2>
        {note && <span className="text-caption font-semibold">{note}</span>}
      </header>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((label, i) => {
          const plan = week.find((d) => d.slot === i);
          const isToday = i === todayIndex;
          const chosen = plan !== undefined && selected === plan.day;
          const circle = plan?.done
            ? "bg-good text-white"
            : plan ? (chosen ? "bg-accent text-accent-fg" : "bg-surface text-fg") : "text-hint";
          const ring = chosen ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : "";
          return (
            <button key={label} type="button" disabled={!plan} onClick={() => plan && onPick(plan.day)}
              aria-label={plan ? `${label}: ${plan.title}` : `${label}: отдых`} aria-pressed={chosen}
              className="flex flex-col items-center gap-1.5">
              <span className={`flex size-10 items-center justify-center rounded-full text-caption font-semibold ${circle} ${ring}`}>
                {plan?.done ? <Icon name="check" size={18} /> : label}
              </span>
              <span className={`size-1.5 rounded-full ${isToday ? "bg-accent" : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
