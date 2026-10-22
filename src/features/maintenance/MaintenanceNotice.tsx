import { Notice } from "@/ui/Notice";
import { plural } from "@/lib/format";

/** Плашка «скоро технические работы»: бот ставит обновление и 5–10 минут не отвечает. */
export function MaintenanceNotice({ at, serverTime }: { at: number; serverTime: number }) {
  const minutes = Math.max(1, Math.ceil((at - serverTime) / 60));
  return (
    <Notice>
      🛠 Через {minutes} {plural(minutes, "минуту", "минуты", "минут")} технические работы: ставлю обновление,
      5–10 минут приложение может не отвечать. Записанные подходы сохранятся.
    </Notice>
  );
}
