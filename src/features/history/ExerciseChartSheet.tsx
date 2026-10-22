import { useCallback } from "react";
import { LineChart } from "@/ui/LineChart";
import { HexStat } from "@/ui/Neon";
import { Centered, Notice } from "@/ui/Notice";
import { Sheet } from "@/ui/Sheet";
import { shortDay } from "@/lib/format";
import { amount, best, change, chartValues, sessionLine } from "@/lib/exerciseChart";
import { api } from "@/data/api";
import { useLoad } from "@/data/useAppState";
import type { ExerciseHistory } from "@/lib/types";

const RECENT = 4;

/** Упражнение за всё время: график лучшего веса (без веса — повторов), рекорд, рост, последние тренировки. */
export function ExerciseChartSheet({ name, onClose }: { name: string; onClose: () => void }) {
  const load = useCallback(() => api.exercise(name), [name]);
  const { data, error } = useLoad(load);
  return (
    <Sheet title={name} onClose={onClose}>
      {error ? <Notice>{error}</Notice> : data ? <ExerciseChart e={data} /> : <Centered>Загрузка…</Centered>}
    </Sheet>
  );
}

export function ExerciseChart({ e }: { e: ExerciseHistory }) {
  if (e.points.length === 0) return <p className="text-body text-hint">Записей по этому упражнению пока нет.</p>;
  const values = chartValues(e);
  const top = best(e)!;
  const diff = change(e);
  const growing = diff != null && diff.delta > 0;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1">
        <HexStat value={amount(e, top)} label={e.bodyweight ? "лучший раз" : "лучший вес"} />
        <HexStat value={`${e.points.length}`} label="тренировок" />
      </div>
      {diff && (
        <p className={`text-center text-body font-semibold ${growing ? "text-good" : "text-hint"}`}>
          {diff.text}
        </p>
      )}
      {values.length > 1 ? (
        <LineChart values={values} labels={e.points.map((p) => shortDay(p.date))} tone={growing ? "good" : "accent"}
          glow marks="ends" label={e.bodyweight ? "График повторов" : "График веса"} />
      ) : (
        <p className="text-caption text-hint">График появится после второй тренировки с этим упражнением.</p>
      )}
      <div>
        <p className="mb-1 text-[11px] uppercase tracking-widest text-hint">Последние тренировки</p>
        <ul className="flex flex-col gap-1">
          {e.sessions.slice(0, RECENT).map((s) => (
            <li key={s.date} className="text-caption tabular-nums">{sessionLine(s.date, s.sets)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
