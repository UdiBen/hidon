// Minimal offline shell. Bump CACHE to evict everything from an older release.
const CACHE = 'hidon-v1';
const SHELL = ['./manifest.webmanifest', './favicon.svg', './apple-touch-icon.png'];

// The document's own script and stylesheet are requested before this worker
// takes control, so they never pass through the fetch handler on a first visit.
// Reading them out of the shell HTML at install time keeps the very first
// offline launch working, and survives the hashes changing every build.
const precache = async (cache) => {
  await cache.addAll(SHELL);

  const response = await fetch('./', { cache: 'reload' });
  const html = await response.clone().text();
  await cache.put('./', response);

  const assets = [...html.matchAll(/(?:src|href)="([^"]*assets\/[^"]+)"/g)].map((m) => m[1]);
  if (assets.length) await cache.addAll(assets);
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // A failed precache must not leave a broken worker installed; the fetch
      // handler fills the cache on later visits instead.
      .then((cache) => precache(cache).catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const save = (request, response) =>
  caches.open(CACHE).then((cache) => cache.put(request, response));

// Hosts vary static assets on Origin or Accept-Encoding. A precached entry is
// stored without those request headers, so an exact Vary comparison would miss
// the very requests the document makes. The URL alone identifies these files.
const lookup = (request) => caches.match(request, { ignoreVary: true });

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // Navigations go to the network first, so a new deploy is picked up as soon
  // as there is a connection, with the cached shell as the offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          event.waitUntil(save(request, response.clone()));
          return response;
        })
        .catch(() => lookup(request).then((hit) => hit ?? lookup('./'))),
    );
    return;
  }

  // Everything else is a content-hashed asset, so a cache hit is never stale.
  event.respondWith(
    lookup(request).then(
      (hit) =>
        hit ??
        fetch(request).then((response) => {
          if (response.ok) event.waitUntil(save(request, response.clone()));
          return response;
        }),
    ),
  );
});
