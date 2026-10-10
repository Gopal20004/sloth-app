// Service worker: keeps the app shell available offline and loads hashed assets from cache.
// It never touches the API or config.json, so data is always live and a new API address is
// picked up on the next launch. Bumping CACHE drops old shells after a deploy.
const CACHE = "sloth-shell-v12";
// Derived from the script URL (always available at evaluation time), e.g. "/sloth-app/sw.js" -> "/sloth-app/".
const BASE = self.location.pathname.replace(/[^/]*$/, "");

self.addEventListener("install", (event) => {
  // Precaching is best effort: a failed fetch here must never leave the worker stuck in "installing".
  event.waitUntil(caches.open(CACHE)
    .then((cache) => cache.addAll([BASE, BASE + "theme-init.js"]).catch(() => undefined))
    .catch(() => undefined)
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;              // API, videos, tunnel: always network
  if (url.pathname.endsWith("/config.json")) return;             // must never be stale

  if (request.mode === "navigate") {
    // Shell: network first so deploys show up immediately; cached copy when offline.
    event.respondWith(fetch(request.url, { cache: "no-cache", credentials: "same-origin" }).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(BASE, copy));
      return response;
    }).catch(() => caches.match(BASE)));
    return;
  }
  if (url.pathname.includes("/assets/") || url.pathname.includes("/stickers/")) {
    // Content-hashed files never change, and sticker images only change with a new CACHE: cache first.
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    })));
  }
});

// A sticker travels as a token like "[sticker:gg]"; a notification should read like a person wrote it.
const STICKER = /^\[sticker:[a-z0-9-]{1,40}\]$/;
const readable = (body) => STICKER.test(String(body || "").trim()) ? "Sent a sticker" : body || "";

// Push notifications: the API sends {title, body, url, tag}; tapping opens (or focuses) that page.
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { title: "Sloth", body: event.data ? event.data.text() : "" }; }
  const title = data.title || "Sloth";
  event.waitUntil(self.registration.showNotification(title, {
    body: readable(data.body),
    tag: data.tag || undefined,
    icon: BASE + "icons/icon-192.png",
    badge: BASE + "icons/icon-192.png",
    data: { url: data.url || "/" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = BASE.replace(/\/$/, "") + (event.notification.data && event.notification.data.url ? event.notification.data.url : "/");
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((client) => "focus" in client);
    if (existing) { existing.navigate(target); return existing.focus(); }
    return self.clients.openWindow(target);
  }));
});
