import { useState } from "react";
import { Badge } from "@/ui/Badge";
import { Card, Row } from "@/ui/Card";
import { Chips } from "@/ui/Chips";
import { LineChart } from "@/ui/LineChart";
import { formatSet, shortDay } from "@/lib/format";
import { progressSummary } from "@/lib/progress";
import { nextWeight, progress } from "@/data/mock";

export function ProgressScreen() {
  const names = Object.keys(progress);
  const [name, setName] = useState(names[0]);
  const points = progress[name];
  const summary = progressSummary(points)!;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="pt-2 text-[28px] font-bold">Прогресс</h1>
      <Chips items={names} value={name} onChange={setName} />
      <Card>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-caption text-hint">Рабочий вес</p>
            <p className="text-[34px] font-bold leading-tight">{summary.last.weight} кг</p>
          </div>
          <Badge tone="good">+{summary.gain} кг за {summary.sessions} трен.</Badge>
        </div>
        <div className="mt-2">
          <LineChart values={points.map((p) => p.weight)} labels={points.map((p) => shortDay(p.date))} />
        </div>
        {nextWeight[name] && <p className="mt-2 rounded-xl bg-surface p-3 text-caption">🎯 {nextWeight[name]}</p>}
      </Card>
      <Card title="Последние подходы">
        {[...points].reverse().slice(0, 4).map((p) => (
          <Row key={p.date} left={formatSet(p)} right={shortDay(p.date)} />
        ))}
      </Card>
    </div>
  );
}
