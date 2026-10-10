import { Icon } from "./Icon";

type Item<T> = { value: T; label: string; hint?: string };

/** Выбор одного варианта: крупные строки с галочкой у текущего. */
export function OptionList<T>({ options, value, onPick }: {
  options: Item<T>[]; value?: T; onPick: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.label} type="button" onClick={() => onPick(o.value)}
            className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition active:scale-[0.98] ${
              active ? "bg-accent/12 ring-2 ring-accent" : "bg-surface"}`}>
            <span>
              <span className="block text-body font-semibold">{o.label}</span>
              {o.hint && <span className="block text-caption text-hint">{o.hint}</span>}
            </span>
            {active && <span className="text-accent"><Icon name="check" /></span>}
          </button>
        );
      })}
    </div>
  );
}

/** Несколько вариантов: плитки-переключатели. */
export function ToggleGrid({ items, selected, columns = 4, onToggle }: {
  items: string[]; selected: string[]; columns?: number; onToggle: (item: string) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {items.map((item) => {
        const on = selected.includes(item);
        return (
          <button key={item} type="button" aria-pressed={on} onClick={() => onToggle(item)}
            className={`h-12 rounded-2xl text-body font-semibold transition active:scale-95 ${
              on ? "bg-accent text-accent-fg" : "bg-surface text-fg"}`}>
            {item}
          </button>
        );
      })}
    </div>
  );
}
