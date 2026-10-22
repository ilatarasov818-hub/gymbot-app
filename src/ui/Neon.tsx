import type { ReactNode } from "react";

// Неоновый стиль «Истории»: свечение акцентом, «рост» — зелёным, плитки-шестиугольники.
export const GLOW = "text-accent [text-shadow:0_0_14px_color-mix(in_srgb,var(--accent)_70%,transparent)]";
export const GLOW_GOOD = "text-good [text-shadow:0_0_14px_color-mix(in_srgb,var(--color-good)_60%,transparent)]";
const HEX = "[clip-path:polygon(10%_0,90%_0,100%_50%,90%_100%,10%_100%,0_50%)]";

export function HexStat({ value, label, good }: { value: string; label: string; good?: boolean }) {
  return (
    <div className={`flex-1 bg-accent/12 px-4 py-2 text-center ${HEX}`}>
      <div className={`text-title font-bold tabular-nums ${good ? GLOW_GOOD : GLOW}`}>{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-hint">{label}</div>
    </div>
  );
}

/** Карточка с градиентной рамкой и свечением. */
export function NeonCard({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="rounded-card bg-gradient-to-br from-accent via-[#7c4ddb] to-transparent p-px shadow-[0_0_24px_-6px_var(--accent)]">
      <section aria-label={label} className="rounded-card bg-bg/95 p-4 backdrop-blur">{children}</section>
    </div>
  );
}
