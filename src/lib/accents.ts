import type { Accent } from "./types";

// Цвета на выбор. Кружки — светлый вариант цвета (классы целиком, чтобы Tailwind их увидел).
export const ACCENTS: { value: Accent; label: string; swatch: string }[] = [
  { value: "blue", label: "Синий", swatch: "bg-[#2481cc]" },
  { value: "green", label: "Зелёный", swatch: "bg-[#1f9d55]" },
  { value: "orange", label: "Оранжевый", swatch: "bg-[#e8780c]" },
  { value: "red", label: "Красный", swatch: "bg-[#e0353b]" },
  { value: "purple", label: "Фиолетовый", swatch: "bg-[#7c4ddb]" },
  { value: "pink", label: "Розовый", swatch: "bg-[#d63384]" },
];

export const DEFAULT_ACCENT: Accent = "blue";
