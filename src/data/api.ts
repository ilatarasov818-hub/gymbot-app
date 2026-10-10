import type {
  ActionResult, ChatMessage, AppState, ExerciseProgress, HistoryEntry, Profile, ProfileResult, SurveyAnswers,
} from "@/lib/types";
import { getParam } from "@/platform/web/location";
import { initData } from "@/platform/web/telegram";

// Страницу отдаёт сам бот, поэтому запросы идут туда же. ?api= — для разработки.
const BASE = (getParam("api") ?? "").replace(/\/$/, "");

export class ApiError extends Error {}

async function request<T>(path: string, body?: unknown, timeout = 15000): Promise<T> {
  if (!initData()) throw new ApiError("Открой приложение кнопкой в чате с ботом.");
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { Authorization: `tma ${initData()}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
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
  | { name: "skipExercise"; later: boolean }
  | { name: "swap"; exercise: string }
  | { name: "extra"; title: string; weight: number; reps: number[] };

// Замены под ограничения подбирает ИИ — это бывает долго.
const PROFILE_TIMEOUT = 180000;

export type ProfileAction =
  | { name: "edit"; field: string; value: unknown; equipment?: string[] }
  | { name: "survey"; answers: SurveyAnswers }
  | { name: "rebuild" };

// Ответ ИИ ждёт своей очереди к бесплатной модели.
const CHAT_TIMEOUT = 180000;

type Chat = { messages: ChatMessage[] };

export const api = {
  state: () => request<AppState>("/api/state"),
  progress: () => request<{ exercises: ExerciseProgress[] }>("/api/progress"),
  history: () => request<{ workouts: HistoryEntry[] }>("/api/history"),
  act: ({ name, ...body }: Action) => {
    const payload = name === "extra" && "title" in body ? { ...body, name: body.title } : body;
    return request<ActionResult>(`/api/action/${name}`, payload);
  },
  profile: () => request<Profile>("/api/profile"),
  profileAct: (action: ProfileAction) => {
    const body = action.name === "survey" ? action.answers : { ...action, name: undefined };
    return request<ProfileResult>(`/api/profile/${action.name}`, body, PROFILE_TIMEOUT);
  },
  chat: () => request<Chat>("/api/chat"),
  chatSend: (text: string) => request<Chat>("/api/chat/send", { text }, CHAT_TIMEOUT),
  chatNew: () => request<Chat>("/api/chat/new", {}),
  feedback: (text: string) => request<{ message: string }>("/api/account/feedback", { text }),
  deleteData: () => request<{ message: string; deleted: boolean }>("/api/account/delete", {}),
};
