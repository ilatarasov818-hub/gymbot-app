// Уведомления телефона (Web Push). На iPhone — только у приложения с экрана «Домой» (iOS 16.4+).
import { isIOS, isStandalone } from "./install";
import { inTelegram } from "./telegram";

export type PushSupport = "ok" | "install" | "unsupported";

export function pushSupport(): PushSupport {
  if (inTelegram()) return "unsupported";
  if (isIOS() && !isStandalone()) return "install";
  const ok = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  return ok ? "ok" : "unsupported";
}

export function pushDenied(): boolean {
  return "Notification" in window && Notification.permission === "denied";
}

async function registration(): Promise<ServiceWorkerRegistration> {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("no service worker")), 10000)),
  ]);
}

export async function currentSubscription(): Promise<PushSubscriptionJSON | null> {
  if (pushSupport() !== "ok") return null;
  const sub = await (await registration()).pushManager.getSubscription();
  return sub ? sub.toJSON() : null;
}

function keyBytes(key: string): Uint8Array<ArrayBuffer> {
  const raw = atob(key.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (key.length % 4)) % 4));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

// Вызывать прямо из нажатия: iPhone спрашивает разрешение только в ответ на нажатие.
export async function subscribePush(key: string): Promise<PushSubscriptionJSON | null> {
  if ((await Notification.requestPermission()) !== "granted") return null;
  const reg = await registration();
  const old = await reg.pushManager.getSubscription();
  const sub = old ?? await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(key) });
  return sub.toJSON();
}

export async function unsubscribePush(): Promise<string | null> {
  if (pushSupport() !== "ok") return null;
  const sub = await (await registration()).pushManager.getSubscription();
  if (!sub) return null;
  await sub.unsubscribe().catch(() => undefined);
  return sub.endpoint;
}

// Число на значке приложения гасим, как только его открыли.
export function clearBadge() {
  const nav = navigator as Navigator & { clearAppBadge?: () => Promise<void> };
  const clear = () => {
    if (document.visibilityState === "visible") void nav.clearAppBadge?.().catch(() => undefined);
  };
  clear();
  document.addEventListener("visibilitychange", clear);
}
