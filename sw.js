const CACHE_NAME = 'presensi-app-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './pages/pesertadidik.html',
  './pages/about.html',
  './pages/laporan.html',
  './assets/css/styles.css',
  './assets/js/script.js',
  './assets/icons/icon-72x72.png',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Fetch cached assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Update service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});