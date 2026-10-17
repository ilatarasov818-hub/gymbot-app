// Обёртка над Telegram WebApp: остальной код не трогает window.Telegram напрямую.
import { isIOS } from "./install";
import { tap } from "./tap";

type HapticImpact = "light" | "medium" | "heavy";
type HapticNotice = "success" | "warning" | "error";

type TelegramWebApp = {
  initData: string;
  colorScheme: "light" | "dark";
  ready: () => void;
  expand: () => void;
  close: () => void;
  onEvent: (event: string, cb: () => void) => void;
  showConfirm?: (message: string, cb: (ok: boolean) => void) => void;
  disableVerticalSwipes?: () => void;
  openLink?: (url: string) => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
  HapticFeedback?: {
    impactOccurred: (style: HapticImpact) => void;
    notificationOccurred: (type: HapticNotice) => void;
  };
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

const tg = (): TelegramWebApp | undefined => window.Telegram?.WebApp;

export function initData(): string {
  return tg()?.initData ?? "";
}

// Открыто внутри Telegram: тогда Telegram сам говорит боту, кто это.
export function inTelegram(): boolean {
  return Boolean(initData());
}

export function startTelegram(onTheme: (scheme: "light" | "dark") => void) {
  const app = tg();
  if (!app) return;
  app.ready();
  app.expand();
  app.disableVerticalSwipes?.();
  onTheme(app.colorScheme);
  app.onEvent("themeChanged", () => onTheme(app.colorScheme));
}

// Верх и низ окна Telegram — в цвет своей темы; в «авто» возвращаем цвета Telegram.
export function setChromeColors(bg: string, surface: string, fixed: boolean) {
  const app = tg();
  if (!app || !inTelegram()) return;
  try {
    app.setHeaderColor?.(fixed ? bg : "bg_color");
    app.setBackgroundColor?.(fixed ? surface : "secondary_bg_color");
    app.setBottomBarColor?.(fixed ? bg : "bottom_bar_bg_color");
  } catch {
    // старый Telegram — не страшно
  }
}

const VIBRATION: Record<HapticImpact | HapticNotice, number | number[]> = {
  light: 10, medium: 20, heavy: 30, success: [20, 60, 20], warning: 40, error: [40, 60, 40],
};

export function haptic(kind: HapticImpact | HapticNotice) {
  const h = inTelegram() ? tg()?.HapticFeedback : undefined;
  if (!h) {
    if ("vibrate" in navigator) navigator.vibrate(VIBRATION[kind]);
    else if (isIOS()) tap(kind === "success" || kind === "error" ? 2 : 1);
    return;
  }
  if (kind === "success" || kind === "warning" || kind === "error") h.notificationOccurred(kind);
  else h.impactOccurred(kind);
}

export function confirm(message: string): Promise<boolean> {
  const app = tg();
  if (app?.showConfirm && app.initData) {
    return new Promise((resolve) => app.showConfirm!(message, resolve));
  }
  return Promise.resolve(window.confirm(message));
}

export function closeApp() {
  tg()?.close();
}

// Ссылка наружу: из Telegram — в браузер телефона, иначе — в новой вкладке.
export function openLink(url: string) {
  const app = tg();
  if (app?.openLink && inTelegram()) app.openLink(url);
  else window.open(url, "_blank", "noopener");
}

export function onVisible(cb: () => void): () => void {
  const handler = () => document.visibilityState === "visible" && cb();
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}
