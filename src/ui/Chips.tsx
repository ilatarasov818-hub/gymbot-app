export function Chips({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      {items.map((item) => (
        <button key={item} type="button" onClick={() => onChange(item)}
          className={`h-9 shrink-0 rounded-full px-4 text-caption font-semibold transition active:scale-95 ${
            item === value ? "bg-accent text-accent-fg" : "bg-bg text-fg"}`}>
          {item}
        </button>
      ))}
    </div>
  );
}
