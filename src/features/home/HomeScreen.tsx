import { Button } from "@/ui/Button";
import { Card, Row } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { formatWeight, plural } from "@/lib/format";
import { user, week } from "@/data/mock";

export function HomeScreen({ onStart }: { onStart: () => void }) {
  const today = week.find((d) => d.today)!;
  return (
    <div className="flex flex-col gap-4">
      <header className="pt-2">
        <p className="text-caption text-hint">Неделя {user.week} из {user.cycleWeeks}</p>
        <h1 className="text-[28px] font-bold leading-tight">Привет, {user.name} 👋</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Stat value={String(user.monthWorkouts)} label={`${plural(user.monthWorkouts, "тренировка", "тренировки", "тренировок")} за месяц`} />
        <Stat value={`${user.streakWeeks} нед.`} label="без пропусков 🔥" />
      </div>

      <Card title="Сегодня" action={<span className="text-caption text-hint">~50 мин</span>}>
        <h2 className="mb-3 text-title font-bold">{today.title}</h2>
        {today.exercises.map((ex) => (
          <Row key={ex.name} left={ex.name}
            sub={`${ex.sets} × ${ex.repsMin}–${ex.repsMax}${ex.weight == null ? " сек" : ""}`}
            right={formatWeight(ex.weight)} />
        ))}
        <div className="mt-4">
          <Button icon="play" onClick={onStart}>Начать тренировку</Button>
        </div>
      </Card>

      <Card title="Неделя">
        {week.map((day) => (
          <Row key={day.weekday}
            left={<span className={day.today ? "font-semibold" : ""}>{day.title}</span>}
            sub={day.today ? "сегодня" : day.weekday}
            right={day.done
              ? <span className="flex items-center gap-1 text-good"><Icon name="check" size={18} />готово</span>
              : <Icon name="chevron" size={18} />} />
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
