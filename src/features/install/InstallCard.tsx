import { useEffect, useState } from "react";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { canPromptInstall, isIOS, isStandalone, onInstallChange, promptInstall } from "@/platform/web/install";
import { inTelegram, openLink } from "@/platform/web/telegram";

// Как поставить приложение на экран телефона, чтобы открывать его без Telegram.
export function InstallCard({ installUrl }: { installUrl?: string | null }) {
  const [, redraw] = useState(0);
  useEffect(() => onInstallChange(() => redraw((n) => n + 1)), []);

  if (isStandalone()) return null;

  if (inTelegram()) {
    if (!installUrl) return null;
    return (
      <Card title="Приложение на телефон">
        <p className="mb-3 text-body">
          Можно открывать без Telegram — значком на экране телефона. Открой в браузере и добавь на экран «Домой».
        </p>
        <Button size="md" variant="secondary" icon="phone" onClick={() => openLink(installUrl)}>Открыть в браузере</Button>
      </Card>
    );
  }

  return (
    <Card title="Приложение на телефон">
      {canPromptInstall() ? (
        <Button size="md" icon="phone" onClick={() => void promptInstall()}>Установить приложение</Button>
      ) : (
        <p className="text-body">
          {isIOS()
            ? "В Safari нажми «Поделиться» (квадрат со стрелкой) → «На экран «Домой»»."
            : "В меню браузера (⋮) выбери «Установить приложение» или «Добавить на главный экран»."}
        </p>
      )}
    </Card>
  );
}
