import type { Wallpaper } from "./types";
import gym from "@/assets/wallpapers/gym.webp";
import mountains from "@/assets/wallpapers/mountains.webp";
import waves from "@/assets/wallpapers/waves.webp";
import neon from "@/assets/wallpapers/neon.webp";

// Готовые обои. «Без обоев» и «своё фото» — отдельные плитки в выборе.
export const WALLPAPERS: { value: Exclude<Wallpaper, "none" | "photo">; label: string; src: string }[] = [
  { value: "gym", label: "Зал", src: gym },
  { value: "mountains", label: "Горы", src: mountains },
  { value: "waves", label: "Волны", src: waves },
  { value: "neon", label: "Неон", src: neon },
];

export function wallpaperSrc(value: Wallpaper, photo: string | null): string | null {
  if (value === "photo") return photo;
  return WALLPAPERS.find((w) => w.value === value)?.src ?? null;
}
