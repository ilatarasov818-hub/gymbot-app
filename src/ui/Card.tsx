import type { ReactNode } from "react";

export function Card({ children, title, action }: { children: ReactNode; title?: string; action?: ReactNode }) {
  return (
    <section className="rounded-card bg-bg p-4">
      {title && (
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-caption font-semibold uppercase tracking-wide text-hint">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Row({ left, right, sub }: { left: ReactNode; right?: ReactNode; sub?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-0 last:pb-0 first:pt-0">
      <div className="min-w-0">
        <div className="truncate text-body">{left}</div>
        {sub && <div className="text-caption text-hint">{sub}</div>}
      </div>
      {right && <div className="shrink-0 text-body text-hint">{right}</div>}
    </div>
  );
}
