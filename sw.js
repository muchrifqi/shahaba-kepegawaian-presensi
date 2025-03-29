const CACHE_NAME = 'presensi-app-v2';
const ASSETS_TO_CACHE = [
  '/index.html',
  '/pages/offline.html',
  '/pages/pesertadidik.html',
  '/pages/landing.html',
  '/pages/landingpegawai.html',
  '/pages/about.html',
  '/pages/laporan.html',
  '/assets/css/styles.css',
  '/assets/js/script.js',
  '/assets/icons/logopresensi72.png',
  '/assets/icons/logopresensi144.png',
  '/assets/icons/logopresensi167.png',
  '/assets/icons/logopresensi180.png',
  '/assets/icons/logopresensi192.png',
  '/assets/icons/logopresensi256.png',
  '/assets/icons/logopresensi384.png',
  '/assets/icons/logopresensi512.png'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then((cache) => {
              return cache.addAll(ASSETS_TO_CACHE);
          })
          .catch((error) => {
              console.error('Failed to cache resources:', error);
          })
  );
});

// Fetch cached assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request)
          .then((response) => {
              return response || fetch(event.request);
          })
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