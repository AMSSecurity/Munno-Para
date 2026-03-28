// AMS Security Munno Para — Service Worker
// Enables PWA install and basic offline support

const CACHE_NAME = 'mpsc-portal-v1';
const CACHE_URLS = [
  '/Munno-Para/',
  '/Munno-Para/index.html',
  '/Munno-Para/MPSC_Security_Log_Sheets_5_.html',
  '/Munno-Para/MPSC_Monthly_Report.html'
];

// Install — cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_URLS).catch(() => {
        // Non-fatal — some files may not exist yet
      });
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', event => {
  // Only handle GET requests for same-origin or GitHub Pages
  if (event.request.method !== 'GET') return;

  // Don't cache Firebase or Google API calls
  const url = event.request.url;
  if (url.includes('firebase') || url.includes('googleapis') ||
      url.includes('script.google.com') || url.includes('firebaseio')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Network failed — try cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/Munno-Para/');
          }
        });
      })
  );
});
