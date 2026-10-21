import { Icon } from "@/ui/Icon";
import { ProgressRing } from "@/ui/ProgressRing";
import { formatDay } from "@/lib/format";
import { barShare, growth, repsRange, topWeight } from "@/lib/history";
import { showKg, unitName } from "@/lib/units";
import type { HistoryEntry, HistoryExercise } from "@/lib/types";

const RING_MINUTES = 60;
const GLOW = "text-accent [text-shadow:0_0_14px_color-mix(in_srgb,var(--accent)_70%,transparent)]";
const GLOW_GOOD = "text-good [text-shadow:0_0_14px_color-mix(in_srgb,var(--color-good)_60%,transparent)]";
const HEX = "[clip-path:polygon(10%_0,90%_0,100%_50%,90%_100%,10%_100%,0_50%)]";
const num = (n: number) => n.toLocaleString("ru-RU");

function HexStat({ value, label, good }: { value: string; label: string; good?: boolean }) {
  return (
    <div className={`flex-1 bg-accent/12 px-4 py-2 text-center ${HEX}`}>
      <div className={`text-title font-bold tabular-nums ${good ? GLOW_GOOD : GLOW}`}>{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-hint">{label}</div>
    </div>
  );
}

function ExerciseRow({ e }: { e: HistoryExercise }) {
  const top = topWeight(e), up = growth(e);
  return (
    <div>
      <div className="flex justify-between gap-3 text-caption">
        <span className="truncate">{e.name}</span>
        <span className="flex shrink-0 gap-2 tabular-nums">
          <span className="text-hint">{e.sets.length} × {repsRange(e)}{top ? ` · ${num(showKg(top))} ${unitName()}` : ""}</span>
          {up != null && (up > 0
            ? <span className="font-semibold text-good">▲ {num(showKg(up))}</span>
            : <span className="text-hint">{up < 0 ? "▼" : "="}</span>)}
        </span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-line">
        <div className={`h-full rounded-full ${up && up > 0 ? "bg-good shadow-[0_0_8px_var(--color-good)]" : "bg-accent shadow-[0_0_8px_var(--accent)]"}`}
          style={{ width: `${barShare(e) * 100}%` }} />
      </div>
    </div>
  );
}

/** Карточка-итог: кольцо минут, тонны / подходы / рост, рекорды; упражнения — по нажатию. */
export function WorkoutCard({ w, open, onToggle }: { w: HistoryEntry; open: boolean; onToggle: () => void }) {
  const sets = w.exercises.reduce((n, e) => n + e.sets.length, 0);
  const tonnes = showKg(w.tonnage) / 1000;
  return (
    <div className="rounded-card bg-gradient-to-br from-accent via-[#7c4ddb] to-transparent p-px shadow-[0_0_24px_-6px_var(--accent)]">
      <section className="rounded-card bg-bg/95 p-4 backdrop-blur">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-3 text-left">
          <ProgressRing value={w.minutes / RING_MINUTES} size={56} stroke={4} glow>
            <span className="text-body font-bold leading-none tabular-nums">{w.minutes}</span>
            <span className="text-[10px] uppercase leading-none text-hint">мин</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-hint">{formatDay(w.date)}</p>
            <h3 className="truncate text-title font-bold">{w.title}</h3>
          </div>
          <span className={`text-hint transition-transform ${open ? "-rotate-90" : "rotate-90"}`}><Icon name="chevron" size={20} /></span>
        </button>
        <div className="mt-3 flex gap-1">
          <HexStat value={num(Math.round(tonnes * 10) / 10)} label={unitName() === "кг" ? "тонн" : "тыс. фнт"} />
          <HexStat value={`${sets}`} label="подходов" />
          <HexStat value={`▲${w.grown}`} label="рост" good={w.grown > 0} />
        </div>
        {w.records.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {w.records.map((r) => (
              <span key={r.name} className="rounded-full border border-[#f5c542]/60 bg-[#f5c542]/10 px-3 py-1 text-caption font-semibold text-[#f5c542] shadow-[0_0_10px_-2px_#f5c542]">
                🏆 {r.name} {num(showKg(r.weight))} {unitName()}
              </span>
            ))}
          </div>
        )}
        {open && (
          <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
            {w.exercises.map((e) => <ExerciseRow key={e.name} e={e} />)}
          </div>
        )}
      </section>
    </div>
  );
}
