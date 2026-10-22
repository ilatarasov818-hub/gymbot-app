import type { ActionResult, AppState, ChatMessage, Fact, HistoryEntry, Me, Profile, ProfileResult, ProgressData, SurveyAnswers, BodyPoint } from "@/lib/types";
import { getParam } from "@/platform/web/location";
import { inTelegram, initData } from "@/platform/web/telegram";
import { getToken, setToken } from "./session";

// Страницу отдаёт сам бот, поэтому запросы идут туда же. ?api= — для разработки.
const BASE = (getParam("api") ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

function authorization(): string | null {
  if (inTelegram()) return `tma ${initData()}`;
  const token = getToken();
  return token ? `Bearer ${token}` : null;
}

async function request<T>(path: string, body?: unknown, timeout = 15000, auth = true): Promise<T> {
  const header = auth ? authorization() : null;
  if (auth && !header) throw new ApiError("Войди через Telegram.");
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { ...(header ? { Authorization: header } : {}), "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
    });
  } catch {
    throw new ApiError("Бот не отвечает. Проверь, что компьютер с ботом включён, и попробуй ещё раз.");
  }
  const data = await response.json().catch(() => ({}));
  // Ключ отозван (вышел на другом телефоне, удалил данные) — снова экран входа.
  if (response.status === 401 && header?.startsWith("Bearer ")) setToken(null);
  if (!response.ok) throw new ApiError(data.error ?? "Что-то пошло не так. Попробуй ещё раз.", response.status);
  return data as T;
}

export type Action =
  | { name: "start"; day: number; short?: boolean }
  | { name: "move"; day: number; to: number }
  | { name: "pick"; day: number; pick: number }
  | { name: "set"; weight: number; reps: number }
  | { name: "skip" }
  | { name: "extend" }
  | { name: "finish" }
  | { name: "skipExercise"; later: boolean }
  | { name: "swap"; exercise: string }
  | { name: "note"; exercise: string; note: string }
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
  progress: () => request<ProgressData>("/api/progress"),
  addBodyWeight: (weight: number) => request<{ body: BodyPoint[] }>("/api/body/add", { weight }),
  history: () => request<{ workouts: HistoryEntry[] }>("/api/history"),
  act: ({ name, ...body }: Action) => {
    const payload = name === "extra" && "title" in body ? { ...body, name: body.title } : body;
    return request<ActionResult>(`/api/action/${name}`, payload);
  },
  profile: () => request<Profile>("/api/profile"),
  me: () => request<Me>("/api/me"),
  // avatar: картинка data:… , "telegram" — взять из Telegram, null — убрать.
  saveMe: (patch: Partial<Omit<Me, "avatar" | "avatarOwn">> & { avatar?: string | null }) => request<Me>("/api/me/save", patch, 30000),
  profileAct: (action: ProfileAction) => {
    const body = action.name === "survey" ? action.answers : { ...action, name: undefined };
    return request<ProfileResult>(`/api/profile/${action.name}`, body, PROFILE_TIMEOUT);
  },
  chat: () => request<Chat>("/api/chat"),
  chatSend: (text: string) => request<Chat>("/api/chat/send", { text }, CHAT_TIMEOUT),
  chatNew: () => request<Chat>("/api/chat/new", {}),
  feedback: (text: string) => request<{ message: string }>("/api/account/feedback", { text }),
  loginStart: () => request<{ code: string; link: string }>("/api/login/start", {}, 15000, false),
  loginCheck: (code: string) => request<{ wait?: boolean; token?: string }>("/api/login/check", { code }, 15000, false),
  logout: () => request<{ ok: boolean }>("/api/logout", {}),
  resetHistory: () => request<{ message: string }>("/api/account/reset", {}),
  pushKey: () => request<{ key: string | null }>("/api/push"),
  pushSubscribe: (subscription: PushSubscriptionJSON) => request<{ ok: boolean }>("/api/push/subscribe", { subscription }),
  pushUnsubscribe: (endpoint: string) => request<{ ok: boolean }>("/api/push/unsubscribe", { endpoint }),
  pushTest: () => request<{ ok: boolean }>("/api/push/test", {}),
  facts: () => request<{ facts: Fact[] }>("/api/facts"),
  factDelete: (id: number) => request<{ facts: Fact[] }>("/api/facts/delete", { id }),
  deleteData: () => request<{ message: string; deleted: boolean }>("/api/account/delete", {}),
};
