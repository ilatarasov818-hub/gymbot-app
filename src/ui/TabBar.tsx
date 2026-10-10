import { Icon, type IconName } from "./Icon";

export function TabBar<T extends string>({ tabs, value, onChange }: {
  tabs: { id: T; label: string; icon: IconName }[]; value: T; onChange: (id: T) => void;
}) {
  return (
    <nav className="flex border-t border-line bg-bg/90 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur">
      {tabs.map((tab) => (
        <button key={tab.id} type="button" onClick={() => onChange(tab.id)}
          className={`flex flex-1 flex-col items-center gap-0.5 text-[11px] font-medium ${
            tab.id === value ? "text-accent" : "text-hint"}`}>
          <Icon name={tab.icon} size={24} />
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
