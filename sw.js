// ============================================================
// SERVICE WORKER
// Lets the app open with no internet (e.g. in a restaurant basement).
// Strategy: "network first" — always try to get the newest version,
// and only use the saved copy when offline. That way updates show up
// right away instead of being stuck on an old version.
// ============================================================

const CACHE = "allergen-app-v4";

// The app's own files, saved when the app is installed
const APP_FILES = [
  "./", "./index.html", "./allergens.js", "./checker.js", "./barcode.js",
  "./dishes.js", "./askcook.js", "./mascot.js", "./manifest.json", "./icon-192.png", "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  // Delete saved copies from older versions
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isOurFile = url.origin === self.location.origin;
  const isLibrary = url.hostname === "cdn.jsdelivr.net" || url.hostname === "unpkg.com";
  if (!isOurFile && !isLibrary) return; // e.g. the food database: always go online

  event.respondWith(
    fetch(req)
      .then(response => {
        // Save a copy for next time we're offline
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(req, copy));
        return response;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
