import { Button } from "@/ui/Button";
import { ProgressRing } from "@/ui/ProgressRing";
import { formatRest } from "@/lib/format";

export function RestScreen({ onSkip }: { onSkip: () => void }) {
  const total = 120, left = 84;
  return (
    <div className="flex flex-col items-center gap-8 pt-6">
      <div className="text-center">
        <p className="text-caption font-semibold uppercase tracking-wide text-hint">Отдых</p>
        <p className="mt-1 text-body">Записал: <b>22 кг × 10</b> 💪</p>
      </div>

      <ProgressRing value={left / total}>
        <span className="text-display font-bold tabular-nums leading-none">{formatRest(left)}</span>
        <span className="mt-2 text-caption text-hint">из {formatRest(total)}</span>
      </ProgressRing>

      <div className="w-full rounded-card bg-bg p-4 text-center">
        <p className="text-caption text-hint">Дальше</p>
        <p className="mt-1 font-semibold">Тяга гантели в наклоне</p>
        <p className="text-caption text-hint">Подход 3 из 3 · 22 кг · цель 8–12</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <Button variant="secondary" icon="plus">30 сек</Button>
        <Button icon="skip" onClick={onSkip}>Пропустить</Button>
      </div>
      <p className="text-center text-caption text-hint">Когда отдых закончится, бот пришлёт сигнал — даже если телефон заблокирован.</p>
    </div>
  );
}
