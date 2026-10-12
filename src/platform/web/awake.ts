// Экран не гаснет, пока идёт тренировка (iPhone с iOS 18.4, Android). Где нельзя — просто ничего.

type Lock = { release: () => Promise<void>; addEventListener: (type: "release", cb: () => void) => void };
type WakeLock = { request: (type: "screen") => Promise<Lock> };

let wanted = false;
let lock: Lock | null = null;

async function grab() {
  const wakeLock = (navigator as Navigator & { wakeLock?: WakeLock }).wakeLock;
  if (!wanted || lock || !wakeLock || document.visibilityState !== "visible") return;
  try {
    lock = await wakeLock.request("screen");
    lock.addEventListener("release", () => { lock = null; });
  } catch {
    lock = null;
  }
}

// Телефон отпускает блокировку, когда приложение свернули, — берём заново при возврате.
document.addEventListener("visibilitychange", () => void grab());

export function keepScreenOn(on: boolean) {
  wanted = on;
  if (on) void grab();
  else void lock?.release().catch(() => undefined);
}
