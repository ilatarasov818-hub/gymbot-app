import { Sheet } from "@/ui/Sheet";
import { weekdayIndex } from "@/lib/format";
import type { DayPlan } from "@/lib/types";

const NAMES = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

/** Перенос тренировки на свободный день до конца недели. */
export function MoveSheet({ day, today, busy, onPick, onClose }: {
  day: DayPlan; today: string; busy: boolean; onPick: (to: number) => void; onClose: () => void;
}) {
  const todayIndex = weekdayIndex(today);
  return (
    <Sheet title="Перенести тренировку" onClose={onClose}>
      <p className="mb-3 text-body text-hint">{day.title} · только на эту неделю, со следующей — снова по плану.</p>
      <div className="flex flex-col gap-2">
        {day.moveTo.map((to) => (
          <button key={to} type="button" disabled={busy} onClick={() => onPick(to)}
            className="flex h-12 items-center justify-between rounded-2xl bg-surface px-4 text-body font-semibold transition active:scale-95 disabled:opacity-50">
            <span>{NAMES[to]}{to === todayIndex ? " · сегодня" : ""}</span>
            {to === day.day && <span className="text-caption text-hint">вернуть по плану</span>}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
