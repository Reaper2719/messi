self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('modulo3-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/main.js',
        '/indexedDB.js',
        '/export.js',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});