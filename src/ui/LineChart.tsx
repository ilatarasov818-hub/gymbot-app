import { useId } from "react";

/**
 * Линия по точкам. tone — цвет линии (good — рост), glow — неоновое свечение.
 * Подписи значений: «changes» — где значение сменилось, «ends» — первая, последняя и лучшая точки
 * (для длинных графиков за всё время).
 */
export function LineChart({ values, labels, tone = "accent", glow = false, marks = "changes", label = "График веса" }: {
  values: number[]; labels: string[]; tone?: "accent" | "good"; glow?: boolean; marks?: "changes" | "ends"; label?: string;
}) {
  const id = useId();
  const color = tone === "good" ? "var(--color-good)" : "var(--accent)";
  const w = 320, h = 160, pad = 24;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1);
  const y = (v: number) => h - pad - ((v - min) / span) * (h - pad * 2);
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const area = `${line} L${x(values.length - 1)},${h - pad + 8} L${x(0)},${h - pad + 8} Z`;
  const last = values.length - 1;
  const top = values.indexOf(max);
  const showValue = (i: number) => (marks === "ends"
    ? i === 0 || i === last || i === top
    : i === 0 || i === last || values[i] !== values[i - 1]);
  const dots = marks !== "ends" || values.length <= 24;
  return (
    <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full overflow-visible" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`${id}fill`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id}fill)`} />
      <path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
        style={glow ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined} />
      {values.map((v, i) => (
        <g key={i}>
          {(dots || showValue(i)) && <circle cx={x(i)} cy={y(v)} r="4.5" fill="var(--bg)" stroke={color} strokeWidth="2.5" />}
          {showValue(i) && (
            <text x={x(i)} y={y(v) - 11} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--fg)">{v.toLocaleString("ru-RU")}</text>
          )}
          {(i === 0 || i === last) && (
            <text x={x(i)} y={h + 14} textAnchor={i === 0 ? "start" : "end"} fontSize="11" fill="var(--hint)">{labels[i]}</text>
          )}
        </g>
      ))}
    </svg>
  );
}
