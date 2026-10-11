// Постоянный адрес приложения. Сам бот живёт на компьютере за туннелем,
// адрес которого меняется при каждом запуске: бот сообщает его сюда (POST /__origin),
// а этот воркер пересылает каждый запрос на текущий адрес.
// Нужна привязка KV с именем GYM.

const ORIGIN_RE = /^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/;

const OFFLINE_PAGE = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Gym</title></head>
<body style="font-family:-apple-system,system-ui,sans-serif;display:flex;min-height:90vh;align-items:center;justify-content:center;text-align:center;padding:24px;color:#8e8e93">
<div><div style="font-size:56px">😴</div><p>Бот сейчас недоступен.<br>Попробуй через пару минут.</p></div></body></html>`;

async function sha256(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Первый ключ запоминается навсегда: дальше адрес может сменить только тот же бот.
async function setOrigin(request, env) {
  const { url, key } = await request.json().catch(() => ({}));
  if (!ORIGIN_RE.test(url ?? "") || typeof key !== "string" || key.length < 32) {
    return new Response("bad request", { status: 400 });
  }
  const hash = await sha256(key);
  const known = await env.GYM.get("key");
  if (known && known !== hash) return new Response("forbidden", { status: 403 });
  if (!known) await env.GYM.put("key", hash);
  await env.GYM.put("origin", url);
  return new Response("ok");
}

function offline(url) {
  if (url.pathname.startsWith("/api/")) {
    return Response.json(
      { error: "Бот сейчас недоступен. Попробуй через пару минут." },
      { status: 503, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
  return new Response(OFFLINE_PAGE, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/__origin" && request.method === "POST") return setOrigin(request, env);

    const origin = await env.GYM.get("origin", { cacheTtl: 30 });
    if (!origin) return offline(url);
    let response;
    try {
      response = await fetch(new Request(origin + url.pathname + url.search, request));
    } catch {
      return offline(url);
    }
    // 530 — туннель уже закрыт (бот перезапускается или компьютер выключен).
    if (response.status === 530 || response.status === 502) return offline(url);
    return response;
  },
};
