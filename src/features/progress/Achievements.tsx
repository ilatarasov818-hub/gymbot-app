import { useState } from "react";
import { Card } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { LEVEL_NAME } from "@/lib/medals";
import { Medal } from "@/ui/Medal";
import { Sheet } from "@/ui/Sheet";
import type { Achievement } from "@/lib/types";

export function AchievementsCard({ items, openId }: { items: Achievement[]; openId?: string }) {
  const [open, setOpen] = useState<Achievement | null>(() => items.find((a) => a.id === openId) ?? null);
  const got = items.filter((a) => a.level > 0).length;
  return (
    <Card title="Достижения" action={<span className="text-caption text-hint">{got} из {items.length}</span>}>
      <div className="grid grid-cols-4 gap-x-2 gap-y-4">
        {items.map((a) => (
          <button key={a.id} type="button" onClick={() => setOpen(a)} className="flex flex-col items-center gap-1.5 active:scale-95">
            <Medal icon={a.icon} level={a.level} />
            <span className={`line-clamp-2 text-center text-[11px] leading-tight ${a.level ? "" : "text-hint"}`}>{a.title}</span>
          </button>
        ))}
      </div>
      {open && <AchievementSheet a={open} onClose={() => setOpen(null)} />}
    </Card>
  );
}

function AchievementSheet({ a, onClose }: { a: Achievement; onClose: () => void }) {
  const share = a.target ? Math.min(1, a.progress / a.target) : 1;
  return (
    <Sheet title={a.title} onClose={onClose}>
      <div className="flex flex-col items-center gap-3 text-center">
        <Medal icon={a.icon} level={a.level} size="lg" />
        <p className="text-caption font-semibold uppercase tracking-wide text-hint">{LEVEL_NAME[a.level]}</p>
        <p className="text-body">{a.about}</p>
      </div>
      {a.target !== null && (
        <div className="mt-5">
          <div className="mb-1 flex justify-between text-caption">
            <span className="text-hint">До следующего уровня</span>
            <span className="font-semibold">{a.progress.toLocaleString("ru-RU")} из {a.target.toLocaleString("ru-RU")} {a.unit}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-accent" style={{ width: `${share * 100}%` }} />
          </div>
        </div>
      )}
      {a.levels.length > 1 && (
        <div className="mt-5 flex flex-col gap-2">
          {a.levels.map((text, i) => {
            const done = a.level > i;
            return (
              <div key={text} className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
                <span className="text-body">{LEVEL_NAME[(i + 1) as 1 | 2 | 3]} · {text}</span>
                {done ? <span className="text-good"><Icon name="check" /></span> : <span className="text-caption text-hint">впереди</span>}
              </div>
            );
          })}
        </div>
      )}
    </Sheet>
  );
}
