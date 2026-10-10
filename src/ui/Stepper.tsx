import { Icon } from "./Icon";

export function Stepper({ label, value, unit, onChange, step = 1, compact = false }: {
  label: string; value: number; unit?: string; step?: number; compact?: boolean; onChange: (v: number) => void;
}) {
  const btn = `flex ${compact ? "size-10" : "size-12"} shrink-0 items-center justify-center rounded-full bg-surface text-accent transition active:scale-95`;
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-caption text-hint">{label}</span>
      <div className={`flex items-center ${compact ? "gap-1" : "gap-4"}`}>
        <button type="button" aria-label="Меньше" className={btn} onClick={() => onChange(Math.max(0, Math.round((value - step) * 100) / 100))}>
          <Icon name="minus" />
        </button>
        <label className={`flex items-baseline justify-center ${compact ? "min-w-12" : "min-w-20"}`}>
          <input type="number" inputMode="decimal" aria-label={label} value={value}
            onChange={(e) => onChange(Math.max(0, Number(e.target.value.replace(",", ".")) || 0))}
            style={{ width: `${Math.max(String(value).length, 1) + 0.5}ch` }}
            className={`bg-transparent text-center ${compact ? "text-[28px]" : "text-[40px]"} font-bold tabular-nums leading-none outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`} />
          {unit && <span className="ml-1 text-body font-medium text-hint">{unit}</span>}
        </label>
        <button type="button" aria-label="Больше" className={btn} onClick={() => onChange(Math.round((value + step) * 100) / 100)}>
          <Icon name="plus" />
        </button>
      </div>
    </div>
  );
}
