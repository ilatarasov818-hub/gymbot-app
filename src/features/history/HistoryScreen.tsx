import { Card } from "@/ui/Card";
import { formatDay, formatSet } from "@/lib/format";
import { history } from "@/data/mock";

export function HistoryScreen() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="pt-2 text-[28px] font-bold">История</h1>
      {history.map((w) => (
        <Card key={w.date} title={formatDay(w.date)} action={<span className="text-caption text-hint">{w.minutes} мин</span>}>
          <h2 className="mb-2 font-bold">{w.title}</h2>
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
