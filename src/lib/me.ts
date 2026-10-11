import type { Me, Sex, Units } from "@/lib/types";
import { LB } from "@/lib/units";

export const SEXES: { value: Sex; label: string }[] = [
  { value: "m", label: "Мужской" },
  { value: "f", label: "Женский" },
];
export const UNITS: { value: Units; label: string }[] = [
  { value: "kg", label: "Килограммы" },
  { value: "lb", label: "Фунты" },
];

export const toUnits = (kg: number, units: Units) => units === "lb" ? Math.round(kg * LB) : kg;
export const fromUnits = (value: number, units: Units) => units === "lb" ? Math.round((value / LB) * 10) / 10 : value;
export const unitLabel = (units: Units) => units === "lb" ? "фнт" : "кг";

const years = (n: number) => {
  const d = n % 10, h = n % 100;
  return d === 1 && h !== 11 ? "год" : d >= 2 && d <= 4 && (h < 12 || h > 14) ? "года" : "лет";
};
export const ageText = (age: number) => `${age} ${years(age)}`;

/** «82 кг · 180 см · 29 лет» — то, что заполнено. */
export function meFacts(me: Me) {
  return [
    me.weight && `${toUnits(me.weight, me.units)} ${unitLabel(me.units)}`,
    me.height && `${me.height} см`,
    me.age && ageText(me.age),
  ].filter(Boolean).join(" · ");
}
