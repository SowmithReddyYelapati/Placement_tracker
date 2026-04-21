// Basic Service Worker to enable PWA installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let the browser do its default fetch
  event.respondWith(fetch(event.request).catch(() => {
    // Optional: Return a fallback offline page here if desired
  }));
});
