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

export function startTelegram(onTheme: (scheme: "light" | "dark") => void) {
  const app = tg();
  if (!app) return;
  app.ready();
  app.expand();
  app.disableVerticalSwipes?.();
  onTheme(app.colorScheme);
  app.onEvent("themeChanged", () => onTheme(app.colorScheme));
}

export function haptic(kind: HapticImpact | HapticNotice) {
  const h = tg()?.HapticFeedback;
  if (!h) return;
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

export function onVisible(cb: () => void): () => void {
  const handler = () => document.visibilityState === "visible" && cb();
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}
