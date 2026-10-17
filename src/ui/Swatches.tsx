import { Icon } from "./Icon";

/** Выбор цвета: ряд кружков, у выбранного — галочка. */
export function Swatches<T extends string>({ options, value, onPick }: {
  options: { value: T; label: string; swatch: string }[]; value: T; onPick: (value: T) => void;
}) {
  return (
    <div className="flex justify-between">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onPick(o.value)} aria-label={o.label} aria-pressed={o.value === value}
          className={`flex size-10 items-center justify-center rounded-full text-white transition active:scale-90 ${o.swatch} ${
            o.value === value ? "ring-2 ring-fg ring-offset-2 ring-offset-bg" : ""}`}>
          {o.value === value && <Icon name="check" size={20} />}
        </button>
      ))}
    </div>
  );
}
