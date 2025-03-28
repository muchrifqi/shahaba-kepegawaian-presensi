const CACHE_NAME = 'presensi-app-v3'; // Update versi cache
const OFFLINE_PAGE = '/offline.html';
const ASSETS_TO_CACHE = [
  // Core Assets
  '/',
  '/index.html',
  OFFLINE_PAGE,
  
  // Pages
  '/pages/pesertadidik.html',
  '/pages/landing.html',
  '/pages/landingpegawai.html',
  '/pages/about.html',
  '/pages/laporan.html',

  // Styles & Scripts
  '/assets/css/styles.css',
  '/assets/js/script.js',

  // Icons
  '/assets/icons/logopresensi72.png',
  '/assets/icons/logopresensi144.png',
  '/assets/icons/logopresensi167.png',
  '/assets/icons/logopresensi180.png',
  '/assets/icons/logopresensi192.png',
  '/assets/icons/logopresensi256.png',
  '/assets/icons/logopresensi384.png',
  '/assets/icons/logopresensi512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  // Network Falling Back to Cache dengan prioritas offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_PAGE))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request)
            .catch(() => {
              if (event.request.destination === 'image') {
                return caches.match('/assets/icons/logopresensi192.png');
              }
              return null;
            });
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});