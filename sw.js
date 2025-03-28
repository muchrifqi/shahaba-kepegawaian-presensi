const CACHE_NAME = 'shahaba-presensi-v4'; // Update versi cache
const OFFLINE_PAGE = 'shahaba-kepegawaian-presensi/offline.html';
const ASSETS_TO_CACHE = [
  // Core Assets
  '/',
  '/index.html',
  OFFLINE_PAGE,
  
  // Halaman
  '/pages/pesertadidik.html',
  '/pages/landing.html',
  
  // CSS & JS
  '/assets/css/style.css',
  '/assets/js/script.js',
  '/assets/js/install.js',

  // Icons
  '/assets/icons/logopresensi192.png',
  '/assets/icons/logopresensi512.png'
];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Aktifkan SW segera
  );
});

// ===== FETCH EVENT =====
self.addEventListener('fetch', (event) => {
  // Abort jika request tidak valid
  if (
    event.request.method !== 'GET' || 
    event.request.url.startsWith('chrome-extension') ||
    event.request.url.includes('extension')
  ) {
    return;
  }

  // Handle navigation requests khusus
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return cache.match(OFFLINE_PAGE) || 
            new Response('<h1>Offline</h1><p>Silakan cek koneksi internet Anda</p>', {
              headers: { 'Content-Type': 'text/html' }
            });
        })
    );
    return;
  }

  // Handle semua request lainnya
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache response jika valid
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(async () => {
        // Fallback ke cache
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || 
          (event.request.destination === 'image' 
            ? caches.match('/assets/icons/logopresensi192.png') 
            : Response.error());
      })
  );
});

// ===== ACTIVATE EVENT =====
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
    }).then(() => self.clients.claim()) // Kontrol semua clients
  );
});

// ===== PUSH NOTIFICATION =====
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'Waktunya presensi!',
    icon: '/assets/icons/logopresensi192.png',
    vibrate: [200, 100, 200]
  };
  event.waitUntil(
    self.registration.showNotification('Shahaba Presensi', options)
  );
});