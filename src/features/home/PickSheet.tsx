import { Sheet } from "@/ui/Sheet";
import type { DayPlan } from "@/lib/types";

/** Другая тренировка из плана на этот день — только на эту дату, остальные дни не меняются. */
export function PickSheet({ day, week, busy, onPick, onClose }: {
  day: DayPlan; week: DayPlan[]; busy: boolean; onPick: (pick: number) => void; onClose: () => void;
}) {
  // Название тренировки по плану — из её собственного дня, а не из подменённого.
  const options = day.pickFrom.map((d) => ({ day: d, plan: week.find((w) => w.day === d) }));
  return (
    <Sheet title="Другая тренировка" onClose={onClose}>
      <p className="mb-3 text-body text-hint">{day.weekday[0].toUpperCase() + day.weekday.slice(1)} · только на этот день, остальной план не меняется.</p>
      <div className="flex flex-col gap-2">
        {options.map(({ day: d, plan }) => (
          <button key={d} type="button" disabled={busy} onClick={() => onPick(d)}
            className="flex h-12 items-center justify-between gap-3 rounded-2xl bg-surface px-4 text-body font-semibold transition active:scale-95 disabled:opacity-50">
            <span className="truncate">{d === day.day ? day.insteadOf : plan?.pick == null ? plan?.title : plan.insteadOf}</span>
            <span className="shrink-0 text-caption text-hint">{d === day.day ? "вернуть по плану" : plan ? `по плану — ${plan.weekday}` : ""}</span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
