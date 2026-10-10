import type { ActionResult, AppState, ExerciseProgress, HistoryEntry } from "@/lib/types";
import { getParam } from "@/platform/web/location";
import { initData } from "@/platform/web/telegram";

// Адрес бота приходит в ссылке: бот сам вписывает его в кнопку приложения.
const BASE = (getParam("api") ?? "").replace(/\/$/, "");

export class ApiError extends Error {}

async function request<T>(path: string, body?: unknown): Promise<T> {
  if (!BASE || !initData()) throw new ApiError("Открой приложение кнопкой в чате с ботом.");
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { Authorization: `tma ${initData()}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new ApiError("Бот не отвечает. Проверь, что компьютер с ботом включён, и попробуй ещё раз.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.error ?? "Что-то пошло не так. Попробуй ещё раз.");
  return data as T;
}

export type Action =
  | { name: "start"; day: number }
  | { name: "set"; weight: number; reps: number }
  | { name: "skip" }
  | { name: "extend" }
  | { name: "finish" }
  | { name: "extra"; title: string; weight: number; reps: number[] };

export const api = {
  state: () => request<AppState>("/api/state"),
  progress: () => request<{ exercises: ExerciseProgress[] }>("/api/progress"),
  history: () => request<{ workouts: HistoryEntry[] }>("/api/history"),
  act: ({ name, ...body }: Action) => {
    const payload = name === "extra" && "title" in body ? { ...body, name: body.title } : body;
    return request<ActionResult>(`/api/action/${name}`, payload);
  },
};
