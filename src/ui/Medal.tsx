import { useId } from "react";
import type { MedalLevel } from "@/lib/types";

// Линейные иконки медалей (сетка 24×24).
const ICONS = {
  calendar: "M5 6h14v13H5zM5 10h14M9 4v4m6-4v4M9.5 14.5l2 2 3.5-3.5",
  flame: "M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.8.2 1.6 1 2.6 2.1 2.8C11 8.5 11 5.5 12 3z",
  dumbbell: "M3 10v4m3-6v8m0-4h12m0-4v8m3-6v4",
  chart: "M4 19h16M5 15l4-4 3 3 6-7m0 0h-4m4 0v4",
  stack: "M12 4l8 4-8 4-8-4zm-8 8l8 4 8-4M4 16l8 4 8-4",
  sunrise: "M4 18h16M7 18a5 5 0 0 1 10 0M12 5v4M5.6 10.6l1.8 1.8m11-1.8-1.8 1.8M9.5 7.5 12 5l2.5 2.5",
  moon: "M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5zM16 4l.6 1.4L18 6l-1.4.6L16 8l-.6-1.4L14 6l1.4-.6z",
} as const;
export type MedalIcon = keyof typeof ICONS;

// Переливы уровней: бронза, серебро (холодный металл), золото.
const GRADIENT: Record<Exclude<MedalLevel, 0>, [string, string, string]> = {
  1: ["#ffb26b", "#c8642a", "#ff8a3d"],
  2: ["#e8f4ff", "#7f93b5", "#7fd3ff"],
  3: ["#fff27a", "#f0a400", "#ffd23f"],
};

const HEX = "M32 2 58 17v30L32 62 6 47V17z";
const HEX_IN = "M32 8 52.5 20v24L32 56 11.5 44V20z";

export function Medal({ icon, level, size = "md" }: { icon: MedalIcon; level: MedalLevel; size?: "md" | "lg" }) {
  const id = useId();
  const px = size === "lg" ? 104 : 64;
  if (level === 0) {
    return (
      <svg width={px} height={px} viewBox="0 0 64 64" className="shrink-0 text-hint opacity-60" aria-hidden="true">
        <path d={HEX} fill="var(--surface)" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <g transform="translate(20 20)" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={ICONS[icon]} />
        </g>
      </svg>
    );
  }
  const [light, dark, glow] = GRADIENT[level];
  return (
    <svg width={px} height={px} viewBox="0 0 64 64" className="shrink-0" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 ${size === "lg" ? 12 : 6}px ${glow}99)` }}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={HEX} fill={`url(#${id}-g)`} />
      <path d={HEX} fill={`url(#${id}-s)`} />
      <path d={HEX_IN} fill="#0b0f1a" fillOpacity="0.55" stroke={light} strokeOpacity="0.9" strokeWidth="1" />
      <g transform="translate(20 20)" fill="none" stroke={light} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={ICONS[icon]} />
      </g>
      {Array.from({ length: level }, (_, i) => (
        <circle key={i} cx={32 + (i - (level - 1) / 2) * 6} cy="51" r="1.6" fill={light} />
      ))}
    </svg>
  );
}
