// Обои под карточками: готовые или своё фото. Хранятся только на этом устройстве.
import { load, save } from "./storage";
import { WALLPAPERS, wallpaperSrc } from "@/lib/wallpapers";
import type { Wallpaper } from "@/lib/types";

const KEY = "wallpaper";
const PHOTO_KEY = "wallpaper-photo";

export function wallpaperPhoto(): string | null {
  return load(PHOTO_KEY);
}

export function wallpaperPref(): Wallpaper {
  const v = load(KEY);
  if (v === "photo") return wallpaperPhoto() ? "photo" : "none";
  return WALLPAPERS.find((w) => w.value === v)?.value ?? "none";
}

export function applyWallpaper() {
  const root = document.documentElement;
  const src = wallpaperSrc(wallpaperPref(), wallpaperPhoto());
  if (src) {
    root.dataset.wall = "";
    root.style.setProperty("--wall", `url("${src}")`);
  } else {
    delete root.dataset.wall;
    root.style.removeProperty("--wall");
  }
}

export function setWallpaperPref(value: Wallpaper) {
  save(KEY, value === "none" ? null : value);
  applyWallpaper();
}

/** Своё фото. false — не влезло в память браузера. */
export function setWallpaperPhoto(photo: string): boolean {
  save(PHOTO_KEY, photo);
  if (load(PHOTO_KEY) !== photo) return false;
  setWallpaperPref("photo");
  return true;
}
