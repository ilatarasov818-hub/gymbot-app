import { Button } from "@/ui/Button";
import { Card, Row } from "@/ui/Card";
import { Icon } from "@/ui/Icon";

const STATS = [["15", "подходов"], ["4 120", "кг поднято"], ["2", "рекорда"]];

export function FinishScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-good/15 text-good"><Icon name="trophy" size={40} /></span>
        <h1 className="mt-4 text-[28px] font-bold">Тренировка готова!</h1>
        <p className="text-hint">Спина и бицепс · 49 мин</p>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        {STATS.map(([v, l]) => (
          <div key={l} className="rounded-card bg-bg p-3">
            <div className="text-title font-bold">{v}</div>
            <div className="text-caption text-hint">{l}</div>
          </div>
        ))}
      </div>
      <Card title="В следующий раз">
        <Row left="Тяга верхнего блока" sub="все подходы на 12 — пора прибавить" right={<span className="font-semibold text-good">47,5 кг ↑</span>} />
        <Row left="Тяга гантели в наклоне" sub="добивай до 12 повторений" right="22 кг" />
        <Row left="Подъём гантелей на бицепс" sub="добивай до 15 повторений" right="12 кг" />
      </Card>
      <Button onClick={onDone}>Отлично</Button>
    </div>
  );
}
