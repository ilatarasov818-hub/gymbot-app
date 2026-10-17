import { useState } from "react";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { formatWeight } from "@/lib/format";
import { monthShareCard, monthTitle } from "@/lib/monthCard";
import type { MonthSummary } from "@/lib/types";
import { renderCard, shareImage, type ShareResult } from "@/platform/web/share";

const NOTE: Record<ShareResult, string> = {
  shared: "Отправлено 🙌",
  downloaded: "Картинка сохранена — отправь её друзьям.",
  cancelled: "",
};

/** Итог прошлого месяца: крупные цифры и кнопка «Поделиться» картинкой. */
export function MonthSummaryCard({ summary: s, onShare = shareMonth }: {
  summary: MonthSummary; onShare?: (s: MonthSummary) => Promise<ShareResult>;
}) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const card = monthShareCard(s);

  const share = async () => {
    setBusy(true);
    setNote("");
    try {
      setNote(NOTE[await onShare(s)]);
    } catch {
      setNote("Не получилось сделать картинку. Попробуй ещё раз.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title={`Итог месяца · ${monthTitle(s)}`}>
      <div className="grid grid-cols-3 gap-2">
        {card.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-surface p-3">
            <p className="text-[26px] font-bold leading-tight">{stat.value}</p>
            <p className="text-caption text-hint">{stat.label}</p>
          </div>
        ))}
      </div>
      {s.gains.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {s.gains.map((g) => (
            <li key={g.name} className="flex justify-between gap-2 text-body">
              <span className="min-w-0 truncate">📈 {g.name}</span>
              <span className="shrink-0 text-hint">{formatWeight(g.start)} → {formatWeight(g.end)}</span>
            </li>
          ))}
        </ul>
      )}
      {s.advice && <p className="mt-3 rounded-2xl bg-surface p-3 text-caption">💬 {s.advice}</p>}
      <div className="mt-3">
        <Button icon="share" variant="secondary" size="md" disabled={busy} onClick={() => void share()}>
          {busy ? "Готовлю картинку…" : "Поделиться"}
        </Button>
      </div>
      {note && <p role="status" className="mt-2 text-center text-caption text-hint">{note}</p>}
    </Card>
  );
}

async function shareMonth(s: MonthSummary): Promise<ShareResult> {
  const blob = await renderCard(monthShareCard(s));
  return shareImage(blob, `gym-itog-${s.month}.png`, `Мой итог месяца: ${monthTitle(s)} 💪`);
}
