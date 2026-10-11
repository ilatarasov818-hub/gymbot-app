import { useCallback, useEffect, useState } from "react";
import { load, save } from "@/platform/web/storage";
import { onVisible } from "@/platform/web/telegram";
import { api, ApiError } from "./api";
import { setToken } from "./session";

const LOGIN_KEY = "gym.login";
const POLL_MS = 2500;

type Pending = { code: string; link: string };

function stored(): Pending | null {
  try {
    return JSON.parse(load(LOGIN_KEY) ?? "null") as Pending | null;
  } catch {
    return null;
  }
}

// Вход по ссылке на бота: код берём заранее — ссылка должна открыться сразу по нажатию.
// Пока человек в Telegram, приложение спрашивает бота, подтвердил ли он вход.
export function useLogin() {
  const [pending, setPending] = useState<Pending | null>(stored);
  const [error, setError] = useState<string | null>(null);

  const keep = (next: Pending | null) => {
    save(LOGIN_KEY, next && JSON.stringify(next));
    setPending(next);
  };

  const fresh = useCallback(async () => {
    try {
      keep(await api.loginStart());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    if (!pending) void fresh();
  }, [pending, fresh]);

  useEffect(() => {
    if (!pending) return;
    let stop = false;
    const check = async () => {
      try {
        const result = await api.loginCheck(pending.code);
        if (stop || !result.token) return;
        keep(null);
        setToken(result.token);
      } catch (e) {
        // Код устарел — берём новый. Бот не отвечает — спросим в следующий раз.
        if (!stop && e instanceof ApiError && e.status === 410) keep(null);
      }
    };
    const timer = setInterval(() => document.visibilityState === "visible" && void check(), POLL_MS);
    const off = onVisible(() => void check());
    return () => { stop = true; clearInterval(timer); off(); };
  }, [pending]);

  return { link: pending?.link ?? null, error, retry: fresh };
}
