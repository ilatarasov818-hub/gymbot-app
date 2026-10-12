import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-20 flex items-end bg-black/40" onClick={onClose}>
      <div role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}
        className="w-full rounded-t-3xl bg-(--bg) p-4 pb-[max(env(safe-area-inset-bottom),16px)]">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-title font-bold">{title}</h2>
          <button type="button" aria-label="Закрыть" onClick={onClose} className="text-hint"><Icon name="close" /></button>
        </header>
        {children}
      </div>
    </div>
  );
}
