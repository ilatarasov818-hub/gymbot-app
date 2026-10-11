// Обёртка над Telegram WebApp: остальной код не трогает window.Telegram напрямую.

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

const VIBRATION: Record<HapticImpact | HapticNotice, number | number[]> = {
  light: 10, medium: 20, heavy: 30, success: [20, 60, 20], warning: 40, error: [40, 60, 40],
};

export function haptic(kind: HapticImpact | HapticNotice) {
  const h = inTelegram() ? tg()?.HapticFeedback : undefined;
  if (!h) {
    navigator.vibrate?.(VIBRATION[kind]);
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
