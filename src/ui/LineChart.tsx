export function LineChart({ values, labels }: { values: number[]; labels: string[] }) {
  const w = 320, h = 160, pad = 24;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1);
  const y = (v: number) => h - pad - ((v - min) / span) * (h - pad * 2);
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const area = `${line} L${x(values.length - 1)},${h - pad + 8} L${x(0)},${h - pad + 8} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full" role="img" aria-label="График веса">
      <defs>
        <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#fill)" />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r="4.5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2.5" />
          {(i === 0 || i === values.length - 1 || values[i] !== values[i - 1]) && (
            <text x={x(i)} y={y(v) - 11} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--fg)">{v}</text>
          )}
          {(i === 0 || i === values.length - 1) && (
            <text x={x(i)} y={h + 14} textAnchor={i === 0 ? "start" : "end"} fontSize="11" fill="var(--hint)">{labels[i]}</text>
          )}
        </g>
      ))}
    </svg>
  );
}
