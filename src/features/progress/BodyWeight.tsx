import { useState } from "react";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { LineChart } from "@/ui/LineChart";
import { Notice } from "@/ui/Notice";
import { Sheet } from "@/ui/Sheet";
import { Stepper } from "@/ui/Stepper";
import { formatWeight, shortDay } from "@/lib/format";
import { showKg, toKg, unitName } from "@/lib/units";
import type { BodyPoint } from "@/lib/types";

const MONTH_MS = 30 * 24 * 3600 * 1000;

/** Изменение за последний месяц: последний замер минус первый замер не старше 30 дней. */
function monthDelta(points: BodyPoint[]): number | null {
  if (points.length < 2) return null;
  const last = points[points.length - 1];
  const from = new Date(last.date).getTime() - MONTH_MS;
  const first = points.find((p) => new Date(p.date).getTime() >= from) ?? points[0];
  if (first === last) return null;
  return Math.round((last.weight - first.weight) * 10) / 10;
}

export function BodyWeightCard({ points, onAdd }: { points: BodyPoint[]; onAdd: () => void }) {
  const last = points[points.length - 1];
  const delta = monthDelta(points);
  return (
    <Card title="Вес тела">
      {last ? (
        <>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[34px] font-bold leading-tight">{formatWeight(last.weight)}</p>
              <p className="text-caption text-hint">{shortDay(last.date)}</p>
            </div>
            {delta !== null && delta !== 0 && (
              <Badge>{delta > 0 ? "+" : "−"}{formatWeight(Math.abs(delta))} за месяц</Badge>
            )}
          </div>
          {points.length > 1 && (
            <div className="mt-2">
              <LineChart values={points.map((p) => showKg(p.weight))} labels={points.map((p) => shortDay(p.date))} />
            </div>
          )}
        </>
      ) : (
        <p className="text-body text-hint">Взвешивайся раз в неделю — построю график. В понедельник утром напомню в чате.</p>
      )}
      <div className="mt-4">
        <Button size="md" variant="plain" icon="plus" onClick={onAdd}>Добавить вес</Button>
      </div>
    </Card>
  );
}

/** Новый замер. Значение приходит и уходит в килограммах. */
export function BodyWeightSheet({ last, busy, error, onSave, onClose }: {
  last: number | null; busy: boolean; error?: string | null; onSave: (kg: number) => void; onClose: () => void;
}) {
  const [value, setValue] = useState(() => showKg(last ?? 75));
  return (
    <Sheet title="Вес тела" onClose={onClose}>
      <Stepper label="Сегодня, лучше натощак" value={value} step={unitName() === "кг" ? 0.1 : 0.5} unit={unitName()} onChange={setValue} />
      {error && <div className="mt-4"><Notice>{error}</Notice></div>}
      <div className="mt-5">
        <Button disabled={busy || value <= 0} onClick={() => onSave(toKg(value))}>{busy ? "Сохраняю…" : "Сохранить"}</Button>
      </div>
    </Sheet>
  );
}
