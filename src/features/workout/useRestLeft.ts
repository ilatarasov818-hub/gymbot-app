import { useEffect, useRef, useState } from "react";
import type { ActiveWorkout } from "@/lib/types";

// Сколько секунд отдыха осталось по часам бота (offset — разница часов бота и телефона).
export function useRestLeft(workout: ActiveWorkout | null, offset: number, onDone: () => void): number {
  const endsAt = workout?.rest?.endsAt ?? null;
  const calc = () => (endsAt == null ? 0 : Math.max(0, Math.ceil(endsAt - (Date.now() / 1000 + offset))));
  const [left, setLeft] = useState(calc);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    setLeft(calc());
    if (endsAt == null) return;
    const timer = setInterval(() => {
      const next = calc();
      setLeft(next);
      if (next <= 0) {
        clearInterval(timer);
        done.current();
      }
    }, 250);
    return () => clearInterval(timer);
    // calc зависит только от endsAt и offset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt, offset]);

  return left;
}
