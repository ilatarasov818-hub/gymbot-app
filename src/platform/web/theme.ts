// Тема приложения: «авто» — как в Telegram (или в системе), либо выбранная вручную.
import { load, save } from "./storage";
import { setChromeColors } from "./telegram";
import { ACCENTS } from "@/lib/accents";
import type { Accent, ThemePref } from "@/lib/types";
type Scheme = "light" | "dark";

const KEY = "theme";
const ACCENT_KEY = "accent";
let telegramScheme: Scheme | null = null;
let param: string | null = null;

export function themePref(): ThemePref {
  const v = load(KEY);
  return v === "light" || v === "dark" ? v : "auto";
}

export function accentPref(): Accent | null {
  const v = load(ACCENT_KEY);
  return ACCENTS.find((a) => a.value === v)?.value ?? null;
}

function apply() {
  const pref = themePref();
  const fixed = pref !== "auto";
  const scheme = fixed ? pref : param ?? telegramScheme
    ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const root = document.documentElement;
  if (scheme === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;
  // Своя тема не берёт цвета Telegram — иначе в светлом Telegram «тёмная» осталась бы светлой.
  if (fixed) root.dataset.fixed = "";
  else delete root.dataset.fixed;
  const accent = accentPref();
  if (accent) root.dataset.accent = accent;
  else delete root.dataset.accent;
  const css = getComputedStyle(root);
  setChromeColors(css.getPropertyValue("--bg").trim(), css.getPropertyValue("--surface").trim(), fixed);
}

export function initTheme(themeParam: string | null) {
  param = themeParam;
  apply();
}

export function setTelegramScheme(scheme: Scheme) {
  telegramScheme = scheme;
  apply();
}

export function setThemePref(pref: ThemePref) {
  save(KEY, pref === "auto" ? null : pref);
  apply();
}

export function setAccentPref(accent: Accent) {
  save(ACCENT_KEY, accent);
  apply();
}
