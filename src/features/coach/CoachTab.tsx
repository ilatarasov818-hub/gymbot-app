import { useEffect } from "react";
import { Centered, Notice } from "@/ui/Notice";
import { haptic } from "@/platform/web/telegram";
import type { useChat } from "@/data/useChat";
import { ChatScreen } from "./ChatScreen";

export function CoachTab({ chat }: { chat: ReturnType<typeof useChat> }) {
  const { refresh } = chat;
  useEffect(() => { void refresh(); }, [refresh]);

  if (!chat.messages) {
    return chat.error ? <Notice>{chat.error}</Notice> : <Centered>Загрузка…</Centered>;
  }
  return (
    <ChatScreen messages={chat.messages} thinking={chat.thinking} error={chat.error}
      onCloseError={chat.clearError}
      onSend={async (text) => {
        haptic("light");
        const ok = await chat.send(text);
        if (ok) haptic("success");
        return ok;
      }}
      onNewTopic={() => void chat.newTopic()} />
  );
}
