// Картинка-карточка для друзей: рисуем на canvas и отдаём системному «Поделиться» (или скачиваем).
import type { ShareCard } from "@/lib/monthCard";

const W = 1080;
const H = 1350; // 4:5 — так карточка целиком видна в ленте и в сторис
const FONT = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

export type ShareResult = "shared" | "downloaded" | "cancelled";

/** Цвет кнопок приложения сейчас (учитывает тему и выбранный цвет). */
function accentColor(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  return value || "#2481cc";
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

/** Текст в одну строку: не влезает — уменьшаем шрифт, потом обрезаем с «…». */
function fitText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, size: number, weight = 600) {
  let s = size;
  ctx.font = `${weight} ${s}px ${FONT}`;
  while (ctx.measureText(text).width > maxWidth && s > size * 0.7) {
    s -= 2;
    ctx.font = `${weight} ${s}px ${FONT}`;
  }
  let out = text;
  while (ctx.measureText(out).width > maxWidth && out.length > 1) out = `${out.slice(0, -2)}…`;
  ctx.fillText(out, x, y);
}

function draw(ctx: CanvasRenderingContext2D, card: ShareCard, accent: string) {
  // Фон: цвет приложения → почти чёрный.
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, accent);
  bg.addColorStop(0.55, "#16161c");
  bg.addColorStop(1, "#0b0b0f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  // Мягкий круг-блик справа сверху.
  const glow = ctx.createRadialGradient(W - 120, 140, 0, W - 120, 140, 520);
  glow.addColorStop(0, "rgba(255,255,255,0.22)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const pad = 88;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = `600 40px ${FONT}`;
  ctx.fillText(`🏋️ ${card.brand}`, pad, 150);

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 104px ${FONT}`;
  ctx.fillText(card.title, pad, 300);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = `600 56px ${FONT}`;
  ctx.fillText(card.subtitle, pad, 380);

  // Три больших числа в плашках.
  const gap = 28;
  const boxW = (W - pad * 2 - gap * 2) / 3;
  const boxY = 450;
  const boxH = 300;
  card.stats.forEach((stat, i) => {
    const x = pad + i * (boxW + gap);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    roundRect(ctx, x, boxY, boxW, boxH, 40);
    ctx.fillStyle = "#ffffff";
    fitText(ctx, stat.value, x + 36, boxY + 160, boxW - 72, 120, 800);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    fitText(ctx, stat.label, x + 36, boxY + 240, boxW - 72, 36, 600);
  });

  // Строки: рост весов и вес тела.
  let y = boxY + boxH + 110;
  for (const line of card.lines) {
    ctx.fillStyle = "#ffffff";
    ctx.font = `500 44px ${FONT}`;
    ctx.fillText(line.icon, pad, y);
    fitText(ctx, line.text, pad + 76, y, W - pad * 2 - 76, 44, 600);
    y += 82;
  }

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = `600 38px ${FONT}`;
  ctx.fillText(card.footer, pad, H - 96);
}

/** Нарисовать карточку в PNG. */
export function renderCard(card: ShareCard): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("canvas недоступен"));
  draw(ctx, card, accentColor());
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("не получилось нарисовать"))), "image/png");
  });
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/** Системное «Поделиться» с картинкой; где его нет — скачать файл. */
export async function shareImage(blob: Blob, filename: string, text: string): Promise<ShareResult> {
  const file = new File([blob], filename, { type: "image/png" });
  const data: ShareData = { files: [file], text };
  if (typeof navigator.share === "function" && navigator.canShare?.(data)) {
    try {
      await navigator.share(data);
      return "shared";
    } catch (e) {
      if ((e as Error).name === "AbortError") return "cancelled";
      // Telegram и некоторые браузеры запрещают — тогда просто скачиваем.
    }
  }
  download(blob, filename);
  return "downloaded";
}
