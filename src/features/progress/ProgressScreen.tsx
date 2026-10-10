import { useState } from "react";
import { Badge } from "@/ui/Badge";
import { Card, Row } from "@/ui/Card";
import { Chips } from "@/ui/Chips";
import { LineChart } from "@/ui/LineChart";
import { Centered, Notice } from "@/ui/Notice";
import { formatSet, shortDay } from "@/lib/format";
import { progressSummary } from "@/lib/progress";
import { api } from "@/data/api";
import { useLoad } from "@/data/useAppState";

export function ProgressScreen() {
  const { data, error } = useLoad(api.progress);
  const [picked, setPicked] = useState<string | null>(null);
  if (error) return <Notice>{error}</Notice>;
  if (!data) return <Centered>Загрузка…</Centered>;

  const exercises = data.exercises.filter((e) => e.points.length > 0);
  if (exercises.length === 0) {
    return <Centered>Здесь появятся графики рабочих весов после первой тренировки.</Centered>;
  }
  const current = exercises.find((e) => e.name === picked) ?? exercises[0];
  const points = current.points;
  const summary = progressSummary(points)!;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pt-2 text-[28px] font-bold">Прогресс</h1>
      <Chips items={exercises.map((e) => e.name)} value={current.name} onChange={setPicked} />
      <Card>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-caption text-hint">Рабочий вес</p>
            <p className="text-[34px] font-bold leading-tight">{summary.last.weight.toLocaleString("ru-RU")} кг</p>
          </div>
          {summary.gain > 0 && <Badge tone="good">+{summary.gain.toLocaleString("ru-RU")} кг за {summary.sessions} трен.</Badge>}
        </div>
        {points.length > 1 && (
          <div className="mt-2">
            <LineChart values={points.map((p) => p.weight)} labels={points.map((p) => shortDay(p.date))} />
          </div>
        )}
      </Card>
      <Card title="Последние тренировки">
        {[...points].reverse().slice(0, 5).map((p) => (
          <Row key={p.date} left={formatSet(p)} sub="лучший подход" right={shortDay(p.date)} />
        ))}
      </Card>
    </div>
  );
}
