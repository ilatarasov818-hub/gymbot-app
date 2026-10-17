import type { ReactNode } from "react";
import { Avatar } from "@/ui/Avatar";
import { Card, Row } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { Segmented } from "@/ui/Segmented";
import { Swatches } from "@/ui/Swatches";
import { WallpaperPicker } from "./WallpaperPicker";
import { ACCENTS } from "@/lib/accents";
import { SEXES, UNITS, ageText, toUnits, unitLabel } from "@/lib/me";
import type { Accent, Me, Sex, ThemePref, Units, Wallpaper } from "@/lib/types";

export type MeField = "name" | "age" | "weight" | "height";

const THEMES: { value: ThemePref; label: string }[] = [
  { value: "auto", label: "Авто" },
  { value: "light", label: "Светлая" },
  { value: "dark", label: "Тёмная" },
];

const Value = ({ children }: { children: ReactNode }) => (
  <span className="flex max-w-48 items-center gap-1"><span className="truncate">{children}</span><Icon name="chevron" size={16} /></span>
);

export function SettingsScreen({ me, theme, onTheme, accent, onAccent, wallpaper, wallpaperPhoto, onWallpaper, onWallpaperPhoto, wallpaperError, onBack, onAvatar, onEdit, onSex, onUnits, onFeedback, onReset, onDelete, onLogout, install, notifications, memory, message, onCloseMessage }: {
  me: Me;
  theme: ThemePref;
  onTheme: (theme: ThemePref) => void;
  accent: Accent;
  onAccent: (accent: Accent) => void;
  wallpaper: Wallpaper;
  wallpaperPhoto: string | null;
  onWallpaper: (value: Wallpaper) => void;
  onWallpaperPhoto: () => void;
  wallpaperError?: string | null;
  onBack: () => void;
  onAvatar: () => void;
  onEdit: (field: MeField) => void;
  onSex: (sex: Sex) => void;
  onUnits: (units: Units) => void;
  onFeedback: () => void;
  onReset: () => void;
  onDelete: () => void;
  onLogout?: () => void;
  install?: ReactNode;
  notifications?: ReactNode;
  memory?: ReactNode;
  message?: string | null;
  onCloseMessage?: () => void;
}) {
  const empty = <span className="text-hint">не указан</span>;
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-1 pt-2">
        <button type="button" aria-label="Назад" onClick={onBack} className="-ml-2 p-1 text-accent"><Icon name="back" size={28} /></button>
        <h1 className="text-[28px] font-bold leading-tight">Настройки</h1>
      </header>

      <button type="button" onClick={onAvatar} className="flex flex-col items-center gap-2 self-center">
        <span className="relative">
          <Avatar name={me.name} src={me.avatar} size={96} />
          <span className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full bg-bg text-accent shadow">
            <Icon name="camera" size={20} />
          </span>
        </span>
        <span className="text-caption text-accent">{me.avatar ? "Сменить фото" : "Добавить фото"}</span>
      </button>

      <Card title="Обо мне">
        <Row onClick={() => onEdit("name")} left="Имя" right={<Value>{me.name || empty}</Value>} />
        <Row onClick={() => onEdit("age")} left="Возраст" right={<Value>{me.age ? ageText(me.age) : empty}</Value>} />
        <Row onClick={() => onEdit("weight")} left="Вес" right={<Value>{me.weight ? `${toUnits(me.weight, me.units)} ${unitLabel(me.units)}` : empty}</Value>} />
        <Row onClick={() => onEdit("height")} left="Рост" right={<Value>{me.height ? `${me.height} см` : empty}</Value>} />
        <div className="pt-3">
          <p className="mb-2 text-caption text-hint">Пол</p>
          <Segmented options={SEXES} value={me.sex} onPick={onSex} />
        </div>
        <p className="mt-3 text-caption text-hint">Тренер обращается к тебе по имени и учитывает эти данные в советах.</p>
      </Card>

      {memory}

      <Card title="Единицы веса">
        <Segmented options={UNITS} value={me.units} onPick={onUnits} />
      </Card>

      <Card title="Оформление">
        <Segmented options={THEMES} value={theme} onPick={onTheme} />
        {theme === "auto" && <p className="mt-2 text-caption text-hint">Как в Telegram.</p>}
        <p className="mb-3 mt-5 text-caption font-semibold uppercase tracking-wide text-hint">Цвет</p>
        <Swatches options={ACCENTS} value={accent} onPick={onAccent} />
        <p className="mb-3 mt-5 text-caption font-semibold uppercase tracking-wide text-hint">Обои</p>
        <WallpaperPicker value={wallpaper} photo={wallpaperPhoto} onPick={onWallpaper} onPhoto={onWallpaperPhoto} />
        {wallpaperError && <p className="mt-2 text-caption text-bad">{wallpaperError}</p>}
      </Card>

      {notifications}

      {install}

      {message && (
        <div onClick={onCloseMessage} className="whitespace-pre-line rounded-card bg-good/15 p-4 text-caption font-medium">
          {message}
        </div>
      )}

      <Card>
        <Row onClick={onFeedback} left={<span className="flex items-center gap-3 text-accent"><Icon name="mail" />Написать отзыв</span>} />
        {onLogout && (
          <Row onClick={onLogout} left={<span className="flex items-center gap-3 text-accent"><Icon name="logout" />Выйти</span>} />
        )}
        <Row onClick={onReset} left={<span className="flex items-center gap-3 text-bad"><Icon name="chart" />Сбросить историю тренировок</span>} />
        <Row onClick={onDelete} left={<span className="flex items-center gap-3 text-bad"><Icon name="trash" />Удалить мои данные</span>} />
      </Card>
    </div>
  );
}
