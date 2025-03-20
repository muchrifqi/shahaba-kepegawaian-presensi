const CACHE_NAME = 'presensi-app-v1';
const ASSETS_TO_CACHE = [
  '/shahaba-kepegawaian-presensi/index.html',
  '/shahaba-kepegawaian-presensi/pages/pesertadidik.html',
  '/shahaba-kepegawaian-presensi/pages/about.html',
  '/shahaba-kepegawaian-presensi/pages/laporan.html',
  '/shahaba-kepegawaian-presensi/assets/css/styles.css',
  '/shahaba-kepegawaian-presensi/assets/js/script.js',
  '/shahaba-kepegawaian-presensi/assets/icons/icon-72x72.png',
  '/shahaba-kepegawaian-presensi/assets/icons/icon-192x192.png',
  '/shahaba-kepegawaian-presensi/assets/icons/icon-512x512.png'
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