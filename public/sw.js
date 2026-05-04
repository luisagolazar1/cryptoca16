// Service Worker para CRYPTOCA16 PWA
const CACHE_NAME = 'cryptoca16-v2.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

console.log('[SW] Service Worker iniciado');

// Install Event
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cache abierto:', CACHE_NAME);
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('[SW] Error en addAll (esperado):', err.message);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deletando cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // No cachear APIs externas
  if (
    event.request.url.includes('api.binance.com') ||
    event.request.url.includes('stream.binance.com') ||
    event.request.url.includes('fonts.googleapis.com') ||
    event.request.url.includes('fonts.gstatic.com')
  ) {
    return;
  }

  // Network first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          return (
            response ||
            new Response('Offline - No hay datos disponibles', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain; charset=utf-8',
              }),
            })
          );
        });
      })
  );
});

console.log('[SW] Service Worker registrado correctamente');
