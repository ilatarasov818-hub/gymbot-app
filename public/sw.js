// Приложение открывается и без связи с ботом: страницу и картинки держим в памяти телефона.
// Данные (/api/) всегда берём у бота заново.
const CACHE = "gym-v1";
const SHELL = ["./", "./manifest.webmanifest", "./icon.svg", "./icon-192.png"];

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
