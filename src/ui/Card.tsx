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

export function Row({ left, right, sub, onClick }: {
  left: ReactNode; right?: ReactNode; sub?: ReactNode; onClick?: () => void;
}) {
  const className = "flex w-full items-center justify-between gap-3 border-b border-line py-3 text-left last:border-0 last:pb-0 first:pt-0";
  const content = (
    <>
      <div className="min-w-0">
        <div className="truncate text-body">{left}</div>
        {sub && <div className="text-caption text-hint">{sub}</div>}
      </div>
      {right && <div className="shrink-0 text-body text-hint">{right}</div>}
    </>
  );
  return onClick
    ? <button type="button" className={className} onClick={onClick}>{content}</button>
    : <div className={className}>{content}</div>;
}
