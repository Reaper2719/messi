self.addEventListener('install', e => {
  e.waitUntil(caches.open('modulo1-store').then(cache => cache.addAll([
    './', './index.html', './styles.css', './main.js', './manifest.json'
  ])));
  self.skipWaiting();
});
self.addEventListener('activate', e => self.clients.claim());
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});