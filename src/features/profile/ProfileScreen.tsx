import type { ReactNode } from "react";
import { Button } from "@/ui/Button";
import { Card, Row } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { Notice } from "@/ui/Notice";
import { Segmented } from "@/ui/Segmented";
import { Swatches } from "@/ui/Swatches";
import { ACCENTS } from "@/lib/accents";
import {
  DURATIONS, GOALS, HOME, LEVELS, daysText, hasDumbbells, labelOf, placeText, stepText,
} from "@/lib/profile";
import type { Accent, Profile, ThemePref } from "@/lib/types";
import type { FieldKey } from "./questions";

const THEMES: { value: ThemePref; label: string }[] = [
  { value: "auto", label: "Авто" },
  { value: "light", label: "Светлая" },
  { value: "dark", label: "Тёмная" },
];

export function ProfileScreen({ profile, busy, message, theme, onTheme, accent, onAccent, onEdit, onRebuild, onRestart, onFeedback, onDelete, onLogout, onCloseMessage, install }: {
  profile: Profile;
  busy: boolean;
  message?: string | null;
  theme: ThemePref;
  onTheme: (theme: ThemePref) => void;
  accent: Accent;
  onAccent: (accent: Accent) => void;
  onEdit: (field: FieldKey) => void;
  onRebuild: () => void;
  onRestart: () => void;
  onFeedback: () => void;
  onDelete: () => void;
  onLogout?: () => void;
  onCloseMessage?: () => void;
  install?: ReactNode;
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

      <Card title="Оформление">
        <Segmented options={THEMES} value={theme} onPick={onTheme} />
        {theme === "auto" && <p className="mt-2 text-caption text-hint">Как в Telegram.</p>}
        <p className="mb-3 mt-5 text-caption font-semibold uppercase tracking-wide text-hint">Цвет</p>
        <Swatches options={ACCENTS} value={accent} onPick={onAccent} />
      </Card>

      <Card>
        <Row onClick={onFeedback} left={<span className="flex items-center gap-3 text-accent"><Icon name="mail" />Написать отзыв</span>} />
        {onLogout && (
          <Row onClick={onLogout} left={<span className="flex items-center gap-3 text-accent"><Icon name="logout" />Выйти</span>} />
        )}
        <Row onClick={onDelete} left={<span className="flex items-center gap-3 text-bad"><Icon name="trash" />Удалить мои данные</span>} />
      </Card>

      {install}
    </div>
  );
}
