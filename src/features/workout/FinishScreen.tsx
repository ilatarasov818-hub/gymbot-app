import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { LEVEL_NAME } from "@/lib/medals";
import { Medal } from "@/ui/Medal";
import { plural } from "@/lib/format";
import type { Finished } from "@/lib/types";

export function FinishScreen({ finished, onDone }: { finished: Finished; onDone: () => void }) {
  const stats: [string, string][] = [
    [String(finished.sets), plural(finished.sets, "подход", "подхода", "подходов")],
    [finished.volume.toLocaleString("ru-RU"), "кг поднято"],
    [finished.duration, "время"],
  ];
  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-good/15 text-good"><Icon name="trophy" size={40} /></span>
        <h1 className="mt-4 text-[28px] font-bold">Тренировка готова!</h1>
        {finished.title && <p className="text-hint">{finished.title}</p>}
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        {stats.map(([v, l]) => (
          <div key={l} className="rounded-card bg-bg p-3">
            <div className="text-title font-bold">{v}</div>
            <div className="text-caption text-hint">{l}</div>
          </div>
        ))}
      </div>
      {finished.achievements && finished.achievements.length > 0 && (
        <Card title={finished.achievements.length > 1 ? "🏅 Новые достижения" : "🏅 Новое достижение"}>
          <div className="flex flex-col gap-3">
            {finished.achievements.map((a) => (
              <div key={a.title} className="flex items-center gap-3">
                <Medal icon={a.icon} level={a.level} />
                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-caption text-hint">{LEVEL_NAME[a.level]} · {a.levelText}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      <Card title="Итог от тренера">
        <p className="whitespace-pre-line text-caption leading-relaxed">{finished.report}</p>
      </Card>
      <Button onClick={onDone}>Отлично</Button>
    </div>
  );
}
