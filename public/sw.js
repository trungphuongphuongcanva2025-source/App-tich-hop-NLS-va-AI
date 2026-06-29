// Pass-through Service Worker to satisfy Chrome PWA installation prompt criteria
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Pass-through request directly to network
  e.respondWith(fetch(e.request));
});
