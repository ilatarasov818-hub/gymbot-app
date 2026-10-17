import type { MonthSummary } from "./types";
import { plural } from "./format";
import { showKg, unitName } from "./units";

// Картинка «Итог месяца» для друзей: что на ней написано. Рисует platform/web/share.ts.
export type ShareCard = {
  brand: string;
  title: string;
  subtitle: string;
  stats: { value: string; label: string }[];
  lines: { icon: string; text: string }[];
  footer: string;
};

const num = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 1 });
const kg = (n: number) => `${num(showKg(n))} ${unitName()}`;

/** «Сентябрь 2026» из «2026-09» и «сентябрь». */
export function monthTitle(s: MonthSummary): string {
  return `${s.title.charAt(0).toUpperCase()}${s.title.slice(1)} ${s.month.slice(0, 4)}`;
}

/** Сколько поднято за месяц, крупно: 12 340 кг → «12,3» + «тонны»; меньше тонны — в кг. */
export function tonnage(s: MonthSummary): { value: string; label: string } {
  const value = showKg(s.tonnage);
  if (value >= 1000) {
    const t = Math.round(value / 100) / 10;
    if (unitName() !== "кг") return { value: num(t), label: "тыс. фнт" };
    return { value: num(t), label: Number.isInteger(t) ? plural(t, "тонна", "тонны", "тонн") : "тонны" };
  }
  return { value: num(Math.round(value)), label: `${unitName()} поднято` };
}

export function monthShareCard(s: MonthSummary): ShareCard {
  const lines = s.gains.map((g) => ({ icon: "📈", text: `${g.name}: ${kg(g.start)} → ${kg(g.end)}` }));
  if (s.body?.delta) {
    const sign = s.body.delta > 0 ? "+" : "−";
    lines.push({ icon: "⚖️", text: `Вес тела: ${kg(s.body.weight)} (${sign}${kg(Math.abs(s.body.delta))})` });
  }
  return {
    brand: "Gym — AI-тренер",
    title: "Итог месяца",
    subtitle: monthTitle(s),
    stats: [
      { value: String(s.workouts), label: plural(s.workouts, "тренировка", "тренировки", "тренировок") },
      tonnage(s),
      { value: String(s.recordsCount), label: plural(s.recordsCount, "рекорд", "рекорда", "рекордов") },
    ],
    lines: lines.slice(0, 4),
    footer: "Тренируюсь с Gym в Telegram 💪",
  };
}
