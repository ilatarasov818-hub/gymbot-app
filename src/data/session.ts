import { useSyncExternalStore } from "react";
import { load, save } from "@/platform/web/storage";

// Ключ приложения вне Telegram: выдаёт бот после входа по ссылке.
const TOKEN_KEY = "gym.token";
const listeners = new Set<() => void>();

export function getToken(): string | null {
  return load(TOKEN_KEY);
}

export function setToken(token: string | null) {
  save(TOKEN_KEY, token);
  listeners.forEach((cb) => cb());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useToken(): string | null {
  return useSyncExternalStore(subscribe, getToken);
}
