// ============================================================
// SERVICE WORKER
// Lets the app open with no internet (e.g. in a restaurant basement).
// Strategy: "network first" — always try to get the newest version,
// and only use the saved copy when offline. That way updates show up
// right away instead of being stuck on an old version.
// ============================================================

const CACHE = "allergen-app-v10";

// The app's own files, saved when the app is installed
const APP_FILES = [
  "./", "./index.html", "./allergens.js", "./checker.js", "./barcode.js",
  "./dishes.js", "./askcook.js", "./mascot.js", "./people.js", "./ai.js", "./manifest.json", "./icon-192.png", "./icon-512.png"
];

self.addEventListener("install", event => {
  // Save each file on its own, so one missing file can't stop the whole install
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(APP_FILES.map(f => cache.add(new Request(f, { cache: "no-cache" }))))
    )
  );
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

  // For our own files, skip the browser's short-term cache ("no-cache")
  // so a new version on GitHub shows up right away
  const fresh = isOurFile ? fetch(req.url, { cache: "no-cache", credentials: "same-origin" }) : fetch(req);

  event.respondWith(
    fresh
      .then(response => {
        // Save a copy for next time we're offline
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(req, copy));
        return response;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
