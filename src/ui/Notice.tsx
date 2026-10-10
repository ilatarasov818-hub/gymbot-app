import type { ReactNode } from "react";

export function Notice({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div role="alert" onClick={onClose}
      className="rounded-card bg-warn/15 p-3 text-caption font-medium text-fg">
      {children}
    </div>
  );
}

export function Centered({ children }: { children: ReactNode }) {
  return <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-hint">{children}</div>;
}
