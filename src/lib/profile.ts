import type { Profile } from "./types";

export type Option<T> = { value: T; label: string; hint?: string };

export const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
export const GYM = "Зал";
export const HOME = "Дом";
export const DUMBBELLS = "Гантели";

export const GOALS: Option<string>[] = [
  { value: "Масса", label: "💪 Масса", hint: "набрать мышцы" },
  { value: "Сила", label: "🏋️ Сила", hint: "поднимать больше в базовых" },
  { value: "Рельеф", label: "🔥 Рельеф", hint: "убрать жир, сохранить мышцы" },
  { value: "Здоровье", label: "❤️ Здоровье", hint: "тонус и самочувствие" },
];

export const LEVELS: Option<string>[] = [
  { value: "Новичок", label: "Новичок", hint: "до 6 месяцев" },
  { value: "Средний", label: "Средний", hint: "до 2 лет" },
  { value: "Опытный", label: "Опытный", hint: "больше 2 лет" },
];

export const DURATIONS: Option<number>[] = [
  { value: 45, label: "45 мин" },
  { value: 60, label: "60 мин" },
  { value: 90, label: "90 мин" },
];

export const PLACES: Option<string>[] = [
  { value: GYM, label: "🏢 Зал", hint: "тренажёры, штанги, гантели" },
  { value: HOME, label: "🏠 Дом", hint: "отметишь, что есть дома" },
];

export const EQUIPMENT = [DUMBBELLS, "Скамья", "Турник", "Резинки"];

export const DUMBBELL_STEPS: Option<number | null>[] = [
  { value: 1, label: "1 кг" },
  { value: 2, label: "2 кг" },
  { value: 2.5, label: "2.5 кг" },
  { value: null, label: "Не знаю", hint: "возьму обычный шаг" },
];

export const STACK_STEPS: Option<number | null>[] = [
  { value: 5, label: "5 кг" },
  { value: 10, label: "10 кг" },
  { value: null, label: "Не знаю", hint: "возьму обычный шаг" },
];

export const hasDumbbells = (place: string | null, equipment: string[]) =>
  place !== HOME || equipment.includes(DUMBBELLS);

export const stepText = (value: number | null) => (value ? `${value} кг` : "обычный");

export function daysText(weekdays: number[]) {
  return weekdays.length ? weekdays.map((d) => WEEKDAYS[d]).join(", ") : "—";
}

export function placeText(p: Pick<Profile, "place" | "equipment">) {
  if (p.place !== HOME) return p.place ?? "—";
  return p.equipment.length ? `Дом: ${p.equipment.join(", ").toLowerCase()}` : "Дом, без инвентаря";
}

export const labelOf = <T,>(options: Option<T>[], value: T) =>
  options.find((o) => o.value === value)?.label ?? "—";
