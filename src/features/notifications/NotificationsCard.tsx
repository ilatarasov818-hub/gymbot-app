import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { usePush } from "@/data/usePush";

const WHAT = "Конец отдыха, когда экран погас, напоминание в день тренировки, итог недели.";

// Уведомления на этом телефоне. В Telegram не показываем — там пишет сам бот.
export function NotificationsCard() {
  const push = usePush();
  if (push.status === "loading" || push.status === "unsupported") return null;

  let body;
  if (push.status === "install") {
    body = (
      <p className="text-body">
        На iPhone уведомления работают, когда приложение добавлено на экран «Домой».
        В Safari нажми «Поделиться» → «На экран «Домой»» и открой Gym оттуда.
      </p>
    );
  } else if (push.status === "denied") {
    body = (
      <p className="text-body">
        Уведомления запрещены. Включи их в «Настройках» телефона → «Уведомления» → Gym и вернись сюда.
      </p>
    );
  } else if (push.status === "off") {
    body = (
      <>
        <p className="mb-3 text-body">{WHAT}</p>
        <Button size="md" icon="bell" disabled={push.busy} onClick={() => void push.enable()}>Включить уведомления</Button>
      </>
    );
  } else {
    body = (
      <>
        <p className="mb-3 text-body">✅ Включены. {WHAT}</p>
        <div className="grid grid-cols-2 gap-3">
          <Button size="md" variant="secondary" disabled={push.busy} onClick={() => void push.test()}>Проверить</Button>
          <Button size="md" variant="secondary" disabled={push.busy} onClick={() => void push.disable()}>Выключить</Button>
        </div>
        {push.tested && <p className="mt-2 text-caption text-hint">Отправил — уведомление придёт через пару секунд.</p>}
      </>
    );
  }

  return (
    <Card title="Уведомления">
      {body}
      {push.error && <p className="mt-2 text-caption text-bad">{push.error}</p>}
    </Card>
  );
}
