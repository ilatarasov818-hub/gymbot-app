import { Button } from "@/ui/Button";
import { Card, Row } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { Notice } from "@/ui/Notice";
import {
  DURATIONS, GOALS, HOME, LEVELS, daysText, hasDumbbells, labelOf, placeText, stepText,
} from "@/lib/profile";
import type { Profile } from "@/lib/types";
import type { FieldKey } from "./questions";

export function ProfileScreen({ profile, busy, message, onEdit, onRebuild, onRestart, onFeedback, onDelete, onCloseMessage }: {
  profile: Profile;
  busy: boolean;
  message?: string | null;
  onEdit: (field: FieldKey) => void;
  onRebuild: () => void;
  onRestart: () => void;
  onFeedback: () => void;
  onDelete: () => void;
  onCloseMessage?: () => void;
}) {
  const p = profile;
  const rows: [FieldKey, string, string][] = [
    ["goal", "Цель", labelOf(GOALS, p.goal)],
    ["level", "Опыт", labelOf(LEVELS, p.level)],
    ["weekdays", "Дни", daysText(p.weekdays)],
    ["duration", "Длительность", labelOf(DURATIONS, p.duration)],
    ["place", "Где", placeText(p)],
  ];
  if (hasDumbbells(p.place, p.equipment)) rows.push(["dumbbellStep", "Шаг гантелей", stepText(p.dumbbellStep)]);
  if (p.place !== HOME) rows.push(["stackStep", "Шаг в тренажёрах", stepText(p.stackStep)]);
  rows.push(["limitations", "Ограничения", p.limitations || "нет"]);

  return (
    <div className="flex flex-col gap-4">
      <header className="pt-2">
        <h1 className="text-[28px] font-bold leading-tight">Профиль</h1>
      </header>

      {message && (
        <div onClick={onCloseMessage} className="whitespace-pre-line rounded-card bg-good/15 p-4 text-caption font-medium">
          {message}
        </div>
      )}

      {(p.stale || !p.ownProgram) && (
        <Notice>
          <p className="mb-3 text-body">
            {p.stale
              ? "Профиль менялся — пересобери программу, чтобы она это учла."
              : "Сейчас стандартная программа. Собери свою — по твоему профилю."}
          </p>
          <Button size="md" disabled={busy} onClick={onRebuild}>Собрать программу</Button>
        </Notice>
      )}

      <Card title="Ответы">
        {rows.map(([key, label, value]) => (
          <Row key={key} onClick={() => onEdit(key)} left={label} right={
              <span className="flex max-w-48 items-center gap-1">
                <span className="truncate">{value}</span>
                <Icon name="chevron" size={16} />
              </span>} />
        ))}
      </Card>

      {p.replacements.length > 0 && (
        <Card title="Тренер заменил">
          {p.replacements.map((r) => (
            <Row key={r.exercise} left={r.replacement ?? "Убрано"}
              sub={r.replacement ? `вместо «${r.exercise}»` : `«${r.exercise}» — безопасной замены нет`} />
          ))}
        </Card>
      )}

      <Button variant="secondary" disabled={busy} onClick={onRestart}>Заполнить заново</Button>

      <Card>
        <Row onClick={onFeedback} left={<span className="flex items-center gap-3 text-accent"><Icon name="mail" />Написать отзыв</span>} />
        <Row onClick={onDelete} left={<span className="flex items-center gap-3 text-bad"><Icon name="trash" />Удалить мои данные</span>} />
      </Card>
    </div>
  );
}
