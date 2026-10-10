import { useCallback, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { api } from "./api";

// Разговор живёт над вкладками: ушёл на другую — ответ не потеряется.
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const thinkingRef = useRef(false);

  // Разговор общий с чатом в Telegram — при каждом открытии берём свежий.
  const refresh = useCallback(async () => {
    if (thinkingRef.current) return;
    try {
      const chat = await api.chat();
      if (!thinkingRef.current) setMessages(chat.messages);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const send = useCallback(async (text: string) => {
    if (thinkingRef.current) return false;
    thinkingRef.current = true;
    setThinking(true);
    setError(null);
    setMessages((m) => [...(m ?? []), { role: "user", text }]);
    try {
      setMessages((await api.chatSend(text)).messages);
      return true;
    } catch (e) {
      setError((e as Error).message);
      setMessages((m) => (m ?? []).slice(0, -1));
      return false;
    } finally {
      thinkingRef.current = false;
      setThinking(false);
    }
  }, []);

  const newTopic = useCallback(async () => {
    try {
      setMessages((await api.chatNew()).messages);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  return { messages, thinking, error, refresh, send, newTopic, clearError: () => setError(null) };
}
