import { useState } from "react";
import { Button } from "@/ui/Button";
import { Card, Row } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { Notice } from "@/ui/Notice";
import { Avatar } from "@/ui/Avatar";
import { meFacts } from "@/lib/me";
import {
  DURATIONS, GOALS, HOME, LEVELS, daysText, hasDumbbells, labelOf, placeText, stepText,
} from "@/lib/profile";
import type { Me, Profile } from "@/lib/types";
import type { FieldKey } from "./questions";

export function ProfileScreen({ profile, me, busy, message, onSettings, onEdit, onRebuild, onRestart, onCloseMessage }: {
  profile: Profile;
  me: Me;
  busy: boolean;
  message?: string | null;
  onSettings: () => void;
  onEdit: (field: FieldKey) => void;
  onRebuild: () => void;
  onRestart: () => void;
  onCloseMessage?: () => void;
}) {
  const p = profile;
  const [open, setOpen] = useState(false);
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
      <header className="flex items-center justify-between pt-2">
        <h1 className="text-[28px] font-bold leading-tight">Профиль</h1>
        <button type="button" aria-label="Настройки" onClick={onSettings}
          className="flex size-10 items-center justify-center rounded-full bg-bg text-accent active:scale-95">
          <Icon name="gear" />
        </button>
      </header>

      <button type="button" onClick={onSettings} className="flex items-center gap-4 rounded-card bg-bg p-4 text-left">
        <Avatar name={me.name} src={me.avatar} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-title font-bold">{me.name || "Без имени"}</span>
          <span className="block truncate text-caption text-hint">{meFacts(me) || "Добавь вес, рост и возраст"}</span>
        </span>
        <span className="text-hint"><Icon name="chevron" size={16} /></span>
      </button>

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

      <Card title="Данные">
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between gap-3 text-left">
          <span className="min-w-0 truncate text-body">{rows.slice(0, 3).map(([, , value]) => value).join(" · ")}</span>
          <span className={`shrink-0 text-hint transition-transform ${open ? "-rotate-90" : "rotate-90"}`}>
            <Icon name="chevron" size={20} />
          </span>
        </button>
        {open && (
          <div className="mt-3 border-t border-line pt-3">
            {rows.map(([key, label, value]) => (
              <Row key={key} onClick={() => onEdit(key)} left={label} right={
                  <span className="flex max-w-48 items-center gap-1">
                    <span className="truncate">{value}</span>
                    <Icon name="chevron" size={16} />
                  </span>} />
            ))}
          </div>
        )}
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
    </div>
  );
}
