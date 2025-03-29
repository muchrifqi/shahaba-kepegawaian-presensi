const CACHE_NAME = 'shahaba-presensi-v5';
const OFFLINE_PAGE = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  OFFLINE_PAGE,
  '/assets/css/style.css',
  '/assets/js/script.js',
  '/assets/icons/logopresensi192.png'
];

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Pre-caching offline page');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// ===== FETCH =====
self.addEventListener('fetch', (event) => {
  // Abort untuk non-GET requests
  if (event.request.method !== 'GET') return;

  // Prioritasi offline.html untuk navigasi
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Blokir notifikasi browser default
          return caches.match(OFFLINE_PAGE)
            .then(response => response || Response.redirect(OFFLINE_PAGE));
        })
    );
    return;
  }

  // Untuk asset lainnya
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        return cached || fetch(event.request)
          .catch(() => {
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_PAGE);
            }
            return Response.error();
          });
      })
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => 
          key !== CACHE_NAME ? caches.delete(key) : null
        )
      )
    )
  );
});