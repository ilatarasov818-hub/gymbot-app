import { useEffect, useState } from "react";
import type { Fact } from "@/lib/types";
import { api } from "./api";

// «Что помнит тренер»: список фактов и удаление по одному.
export function useFacts() {
  const [facts, setFacts] = useState<Fact[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api.facts()
      .then(({ facts }) => { if (alive) setFacts(facts); })
      .catch((e: Error) => { if (alive) { setFacts([]); setError(e.message); } });
    return () => { alive = false; };
  }, []);

  const remove = async (id: number) => {
    const before = facts;
    setError(null);
    // Сразу убираем из списка, при ошибке возвращаем.
    setFacts((list) => list?.filter((f) => f.id !== id) ?? null);
    try {
      setFacts((await api.factDelete(id)).facts);
    } catch (e) {
      setFacts(before);
      setError((e as Error).message);
    }
  };

  return { facts, error, remove };
}
