const CACHE_NAME = 'anshinsweets-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests (POST, PUT, DELETE etc.)
  if (request.method !== 'GET') return;

  // Skip API calls - fresh data is critical
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) return;

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Network-first strategy: try network, fall back to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache valid responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(async () => {
        // Network failed - try cache
        const cached = await caches.match(request);
        if (cached) return cached;
        // No cache either - return a basic offline response
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});
