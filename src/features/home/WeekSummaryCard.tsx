import { Card } from "@/ui/Card";
import { formatWeight, plural } from "@/lib/format";
import type { WeekSummary } from "@/lib/types";

const Line = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <li className="flex gap-2 text-body"><span className="w-6 shrink-0 text-center">{icon}</span><span className="min-w-0">{children}</span></li>
);

export function WeekSummaryCard({ summary: s }: { summary: WeekSummary }) {
  const all = s.planned > 0 && s.done >= s.planned;
  return (
    <Card title="Итог недели">
      <ul className="flex flex-col gap-2.5">
        <Line icon={all ? "✅" : "📅"}>
          {s.done} из {s.planned} {plural(s.planned, "тренировки", "тренировок", "тренировок")}{all ? " — всё по плану!" : ""}
        </Line>
        {s.records.length > 0 && (
          <Line icon="🏆">
            {s.records.length === 1 ? "Рекорд" : "Рекорды"}: {s.records.map((r) => `${r.name} ${formatWeight(r.weight)}`).join(", ")}
          </Line>
        )}
        {s.stalled.map((r) => (
          <Line key={r.name} icon="⏳">
            {r.name}: {formatWeight(r.weight)} уже {r.weeks} {plural(r.weeks, "неделю", "недели", "недель")}
          </Line>
        ))}
        {s.body && (
          <Line icon="⚖️">
            Вес тела {formatWeight(s.body.weight)}
            {s.body.delta ? <span className="text-hint"> ({s.body.delta > 0 ? "+" : "−"}{formatWeight(Math.abs(s.body.delta))} за неделю)</span> : null}
          </Line>
        )}
      </ul>
      {s.advice && <p className="mt-4 rounded-2xl bg-surface p-3 text-caption">💬 {s.advice}</p>}
    </Card>
  );
}
