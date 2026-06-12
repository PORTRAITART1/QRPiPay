const CACHE_NAME = 'qrpipay-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index-*.js',
  '/assets/index-*.css',
  '/logo.png',
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Cache opened');
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache add error (non-fatal):', err);
      });
    })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(response => {
          return response || new Response('Offline - page not cached');
        });
      })
  );
});
