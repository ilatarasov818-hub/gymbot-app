import type { ReactNode } from "react";
import { Icon } from "@/ui/Icon";
import { WALLPAPERS } from "@/lib/wallpapers";
import type { Wallpaper } from "@/lib/types";

/** Обои: «без», готовые картинки и своё фото — плитки в ряд, у выбранной рамка и галочка. */
export function WallpaperPicker({ value, photo, onPick, onPhoto }: {
  value: Wallpaper; photo: string | null; onPick: (value: Wallpaper) => void; onPhoto: () => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      <Tile label="Без обоев" active={value === "none"} onClick={() => onPick("none")}>
        <span className="text-caption text-hint">Нет</span>
      </Tile>
      {WALLPAPERS.map((w) => (
        <Tile key={w.value} label={w.label} active={value === w.value} onClick={() => onPick(w.value)} image={w.src} />
      ))}
      <Tile label={photo ? "Своё фото" : "Выбрать фото"} active={value === "photo"} image={photo ?? undefined}
        onClick={() => (photo && value !== "photo" ? onPick("photo") : onPhoto())}>
        {!photo && <span className="text-accent"><Icon name="plus" size={24} /></span>}
      </Tile>
      {photo && value === "photo" && (
        <Tile label="Другое фото" active={false} onClick={onPhoto}>
          <span className="text-accent"><Icon name="camera" size={22} /></span>
        </Tile>
      )}
    </div>
  );
}

function Tile({ label, active, image, onClick, children }: {
  label: string; active: boolean; image?: string; onClick: () => void; children?: ReactNode;
}) {
  return (
    <button type="button" aria-label={label} aria-pressed={active} onClick={onClick}
      className={`relative flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface bg-cover bg-center transition active:scale-95 ${
        active ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""}`}
      style={image ? { backgroundImage: `url("${image}")` } : undefined}>
      {children}
      {active && (
        <span className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-accent text-accent-fg">
          <Icon name="check" size={14} />
        </span>
      )}
    </button>
  );
}
