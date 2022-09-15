self.addEventListener('install', function(event) {
  // this happens while the old version is still in control
  event.waitUntil(
    caches.open('myapp-static-v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/index.js',
        '/assets/scss/main.css'
      ]);
    })
  )
});

self.addEventListener('activate', function(event) {
  // the old version is gone now, do what you couldn't
  // do while it was still around
  event.waitUntil(
    schemaMigrationAndCleanup()
  )
});

 
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      return cachedResponse || fetch(event.request);
    })
  );
});