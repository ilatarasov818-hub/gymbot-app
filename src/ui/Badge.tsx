import type { ReactNode } from "react";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" }) {
  const color = tone === "good" ? "bg-good/15 text-good font-semibold" : "bg-surface font-medium";
  return <span className={`rounded-full px-3 py-1 text-caption ${color}`}>{children}</span>;
}
