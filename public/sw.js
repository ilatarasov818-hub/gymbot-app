// Приложение открывается и без связи с ботом: страницу и картинки держим в памяти телефона.
// Данные (/api/) всегда берём у бота заново.
const CACHE = "gym-v2"; // новая иконка — сменить номер, чтобы телефоны взяли свежие картинки
const SHELL = ["./", "./manifest.webmanifest", "./icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function fromNetwork(request, fallback) {
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(CACHE)).put(fallback ?? request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(fallback ?? request);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (request.mode === "navigate") {
    // Свежая страница, если бот на связи; иначе — сохранённая.
    event.respondWith(fromNetwork(request, "./"));
    return;
  }
  // Файлы сборки и картинки не меняются — сначала из памяти.
  event.respondWith(caches.match(request).then((cached) => cached ?? fromNetwork(request)));
});

// Уведомление от бота: конец отдыха, день тренировки, итог недели.
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  const tag = data.tag || undefined;
  const shown = self.registration.showNotification(data.title || "Gym", {
    body: data.body || "",
    tag,
    renotify: Boolean(tag),
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    data: { url: data.url || "./" },
  });
  // Напоминание и итог — точкой на значке, пока приложение не открыли.
  const badge = tag === "rest" || tag === "test" ? Promise.resolve() : self.navigator.setAppBadge?.(1)?.catch(() => undefined);
  event.waitUntil(Promise.all([shown, badge]));
});

// Нажали на уведомление — открываем приложение (или уже открытое) на нужном экране.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "./", self.registration.scope).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const open = windows[0];
    if (open) {
      await open.focus();
      if (url !== self.registration.scope && "navigate" in open) await open.navigate(url).catch(() => undefined);
      return;
    }
    await self.clients.openWindow(url);
  })());
});
