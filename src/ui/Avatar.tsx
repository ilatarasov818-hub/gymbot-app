export function Avatar({ name, src, size = 64 }: { name: string; src: string | null; size?: number }) {
  if (src) return <img src={src} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  return (
    <div aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.42 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-white">
      {(name.trim()[0] ?? "?").toUpperCase()}
    </div>
  );
}
