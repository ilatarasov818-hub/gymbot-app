import { Icon } from "./Icon";

export function Stepper({ label, value, unit, onChange, step = 1 }: {
  label: string; value: number; unit?: string; step?: number; onChange: (v: number) => void;
}) {
  const btn = "flex size-12 items-center justify-center rounded-full bg-surface text-accent transition active:scale-95";
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-caption text-hint">{label}</span>
      <div className="flex items-center gap-4">
        <button type="button" aria-label="Меньше" className={btn} onClick={() => onChange(Math.max(0, value - step))}>
          <Icon name="minus" />
        </button>
        <span className="min-w-20 text-center text-[40px] font-bold tabular-nums leading-none">
          {value.toLocaleString("ru-RU")}
          {unit && <span className="ml-1 text-body font-medium text-hint">{unit}</span>}
        </span>
        <button type="button" aria-label="Больше" className={btn} onClick={() => onChange(value + step)}>
          <Icon name="plus" />
        </button>
      </div>
    </div>
  );
}
