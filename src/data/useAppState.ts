import { useCallback, useEffect, useRef, useState } from "react";
import type { AppState, Finished } from "@/lib/types";
import { onVisible } from "@/platform/web/telegram";
import { api, type Action, type ProfileAction } from "./api";

const REFRESH_MS = 15000;

// Состояние с бота: тренировку можно вести и в чате, поэтому подтягиваем его заново.
export function useAppState() {
  const [state, setState] = useState<AppState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState<Finished | null>(null);
  const [offset, setOffset] = useState(0); // часы бота минус часы телефона, сек
  const busyRef = useRef(false);

  const apply = useCallback((next: AppState) => {
    setState(next);
    setOffset(next.serverTime - Date.now() / 1000);
  }, []);

  const refresh = useCallback(async () => {
    if (busyRef.current) return;
    try {
      apply(await api.state());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [apply]);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => document.visibilityState === "visible" && void refresh(), REFRESH_MS);
    const off = onVisible(() => void refresh());
    return () => { clearInterval(timer); off(); };
  }, [refresh]);

  // Одно действие за раз: пока бот отвечает, кнопки заблокированы.
  const run = useCallback(async <T extends { state: AppState }>(call: () => Promise<T>) => {
    if (busyRef.current) return null;
    busyRef.current = true;
    setBusy(true);
    try {
      const result = await call();
      apply(result.state);
      setError(null);
      return result;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, [apply]);

  const act = useCallback(async (action: Action) => {
    const result = await run(() => api.act(action));
    if (result?.finished) setFinished(result.finished);
    return result;
  }, [run]);

  const saveProfile = useCallback((action: ProfileAction) => run(() => api.profileAct(action)), [run]);

  return { state, error, busy, finished, offset, refresh, act, saveProfile, closeFinished: () => setFinished(null), clearError: () => setError(null) };
}

export function useLoad<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    load().then(setData, (e: Error) => setError(e.message));
  }, [load]);
  return { data, error };
}
