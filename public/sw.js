const CACHE_NAME = "spariq-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass-through network-first strategy — no offline AI functionality needed,
  // this service worker exists only to satisfy PWA installability requirements.
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
