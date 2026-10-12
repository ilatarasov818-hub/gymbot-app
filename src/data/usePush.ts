import { useEffect, useState } from "react";
import { currentSubscription, pushDenied, pushSupport, subscribePush, unsubscribePush } from "@/platform/web/push";
import { api } from "./api";

export type PushStatus = "loading" | "unsupported" | "install" | "denied" | "off" | "on";

// Уведомления на этом телефоне: включены ли, включить, выключить, проверить.
export function usePush() {
  const [status, setStatus] = useState<PushStatus>(() => {
    const support = pushSupport();
    return support === "ok" ? "loading" : support;
  });
  const [key, setKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tested, setTested] = useState(false);

  useEffect(() => {
    if (pushSupport() !== "ok") return;
    let alive = true;
    void (async () => {
      try {
        const { key } = await api.pushKey();
        if (!alive) return;
        if (!key) return setStatus("unsupported");
        setKey(key);
        const sub = await currentSubscription();
        // Подписка есть — напоминаем о ней боту (могли войти заново или сменить бота).
        if (sub) await api.pushSubscribe(sub);
        if (alive) setStatus(sub ? "on" : pushDenied() ? "denied" : "off");
      } catch {
        if (alive) setStatus("unsupported");
      }
    })();
    return () => { alive = false; };
  }, []);

  const run = async (job: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await job();
    } catch (e) {
      setError((e as Error).message || "Не получилось. Попробуй ещё раз.");
    } finally {
      setBusy(false);
    }
  };

  const enable = () => run(async () => {
    if (!key) return;
    let sub: PushSubscriptionJSON | null;
    try {
      sub = await subscribePush(key);
    } catch {
      throw new Error("Телефон не дал включить уведомления. Попробуй ещё раз.");
    }
    if (!sub) {
      setStatus(pushDenied() ? "denied" : "off");
      return;
    }
    await api.pushSubscribe(sub);
    setStatus("on");
    setTested(false);
  });

  const disable = () => run(async () => {
    const endpoint = await unsubscribePush();
    if (endpoint) await api.pushUnsubscribe(endpoint).catch(() => undefined);
    setStatus("off");
  });

  const test = () => run(async () => {
    await api.pushTest();
    setTested(true);
  });

  return { status, busy, error, tested, enable, disable, test };
}

// Выход из аккаунта: уведомления этого телефона больше не нужны.
export async function dropPush() {
  const endpoint = await unsubscribePush().catch(() => null);
  if (endpoint) await api.pushUnsubscribe(endpoint).catch(() => undefined);
}
