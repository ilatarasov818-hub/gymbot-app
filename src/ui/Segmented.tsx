/** Переключатель из нескольких вариантов в одну строку. */
export function Segmented<T extends string>({ options, value, onPick }: {
  options: { value: T; label: string }[]; value: T; onPick: (value: T) => void;
}) {
  return (
    <div className="flex rounded-xl bg-surface p-1">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onPick(o.value)} aria-pressed={o.value === value}
          className={`h-9 flex-1 rounded-lg text-caption font-semibold transition ${
            o.value === value ? "bg-bg text-fg shadow-sm" : "text-hint"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
