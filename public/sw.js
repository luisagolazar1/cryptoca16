const CACHE_NAME = 'cryptoca16-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/advanced',
  '/analysis',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Instalar Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache opened');
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache addAll error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, fall back to cache
self.addEventListener('fetch', event => {
  // No cachear requests a APIs externas
  if (event.request.url.includes('api.binance.com') || event.request.url.includes('stream.binance.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // No cachear respuestas no-OK
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clonar la respuesta
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(error => {
        // Caché fallback
        return caches.match(event.request).then(response => {
          return response || new Response('Offline - Contenido no disponible', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Background Sync para actualizar datos
self.addEventListener('sync', event => {
  if (event.tag === 'sync-prices') {
    event.waitUntil(
      fetch('/api/crypto-data?action=all')
        .then(response => response.json())
        .then(data => {
          // Guardar en IndexedDB o localStorage
          localStorage.setItem('cached_prices', JSON.stringify(data));
        })
        .catch(error => console.log('Sync error:', error))
    );
  }
});

// Push Notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    tag: 'cryptoca16',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'CRYPTOCA16', options)
  );
});

// Notificación Click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
