import type { Units } from "@/lib/types";

// Бот хранит и считает вес в килограммах; фунты — только показ и ввод в приложении.
export const LB = 2.20462;
let current: Units = "kg";

export const setUnits = (units: Units) => { current = units; };
export const unitName = () => (current === "lb" ? "фнт" : "кг");
/** Шаг кнопок «+/−»: в кг — шаг оборудования из профиля, если он задан. */
export const weightStep = (kgStep?: number | null) => (current === "lb" ? 5 : kgStep || 2.5);
/** Килограммы → то, что видит человек. */
export const showKg = (kg: number) => (current === "lb" ? Math.round(kg * LB) : kg);
/** Введённое число → килограммы для бота. */
export const toKg = (value: number) => (current === "lb" ? Math.round((value / LB) * 10) / 10 : value);
