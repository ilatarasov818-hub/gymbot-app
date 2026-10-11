import { useState } from "react";
import { Badge } from "@/ui/Badge";
import { Card, Row } from "@/ui/Card";
import { Chips } from "@/ui/Chips";
import { LineChart } from "@/ui/LineChart";
import { Centered, Notice } from "@/ui/Notice";
import { formatSet, formatWeight, shortDay } from "@/lib/format";
import { showKg } from "@/lib/units";
import { progressSummary } from "@/lib/progress";
import { api } from "@/data/api";
import { useLoad } from "@/data/useAppState";
import type { BodyPoint, ProgressData } from "@/lib/types";
import { BodyWeightCard, BodyWeightSheet } from "./BodyWeight";
import { AchievementsCard } from "./Achievements";

export function ProgressScreen() {
  const { data, error } = useLoad(api.progress);
  const [picked, setPicked] = useState<string | null>(null);
  const [body, setBody] = useState<BodyPoint[] | null>(null);
  const [sheet, setSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  if (error) return <Notice>{error}</Notice>;
  if (!data) return <Centered>Загрузка…</Centered>;
  const points = body ?? data.body ?? [];

  const save = async (kg: number) => {
    setSaving(true);
    try {
      setBody((await api.addBodyWeight(kg)).body);
      setSheet(false);
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProgressView data={{ ...data, body: points }} picked={picked} onPick={setPicked}
        onAddWeight={() => { setSaveError(null); setSheet(true); }} />
      {sheet && (
        <BodyWeightSheet last={points.at(-1)?.weight ?? null} busy={saving} error={saveError}
          onSave={(kg) => void save(kg)} onClose={() => setSheet(false)} />
      )}
    </>
  );
}

export function ProgressView({ data, picked, onPick, onAddWeight }: {
  data: ProgressData; picked: string | null; onPick: (name: string) => void; onAddWeight: () => void;
}) {
  const body = <BodyWeightCard points={data.body ?? []} onAdd={onAddWeight} />;
  const exercises = data.exercises.filter((e) => e.points.length > 0);
  if (exercises.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="pt-2 text-[28px] font-bold">Прогресс</h1>
        <AchievementsCard items={data.achievements} />
        {body}
        <p className="text-center text-caption text-hint">Здесь появятся графики рабочих весов после первой тренировки.</p>
      </div>
    );
  }
  const current = exercises.find((e) => e.name === picked) ?? exercises[0];
  const points = current.points;
  const summary = progressSummary(points)!;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pt-2 text-[28px] font-bold">Прогресс</h1>
      <AchievementsCard items={data.achievements} />
      {body}
      <Chips items={exercises.map((e) => e.name)} value={current.name} onChange={onPick} />
      <Card>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-caption text-hint">Рабочий вес</p>
            <p className="text-[34px] font-bold leading-tight">{formatWeight(summary.last.weight)}</p>
          </div>
          {summary.gain > 0 && <Badge tone="good">+{formatWeight(summary.gain)} за {summary.sessions} трен.</Badge>}
        </div>
        {points.length > 1 && (
          <div className="mt-2">
            <LineChart values={points.map((p) => showKg(p.weight))} labels={points.map((p) => shortDay(p.date))} />
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
