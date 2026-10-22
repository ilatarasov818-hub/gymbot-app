import { useState } from "react";
import { Icon } from "@/ui/Icon";
import { showKg, unitName } from "@/lib/units";
import type { WarmupSet } from "@/lib/types";

// Разминка перед первым рабочим подходом: только подсказка, в историю не идёт.
export function WarmupCard({ sets }: { sets: WarmupSet[] }) {
  const [done, setDone] = useState<number[]>([]);
  const toggle = (i: number) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  return (
    <section aria-label="Разминка" className="mt-4 rounded-2xl bg-surface p-3">
      <p className="flex items-baseline justify-between gap-2 text-caption">
        <span className="font-semibold">🔥 Разминка</span>
        <span className="text-hint">{unitName()} × повт. · не в историю</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {sets.map((s, i) => {
          const ticked = done.includes(i);
          return (
            <button key={i} type="button" aria-pressed={ticked} onClick={() => toggle(i)}
              className={`flex h-9 items-center gap-1 rounded-full px-3 text-caption font-semibold tabular-nums transition active:scale-95 ${
                ticked ? "bg-good/15 text-good" : "bg-bg text-fg"}`}>
              {ticked && <Icon name="check" size={16} />}
              {showKg(s.weight).toLocaleString("ru-RU")} × {s.reps}
            </button>
          );
        })}
      </div>
    </section>
  );
}
