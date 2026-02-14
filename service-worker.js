const CACHE_NAME = 'coleccion-ra-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  'https://aframe.io/releases/1.4.0/aframe.min.js',
  'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE_NAME).then(cache => 
      cache.match(e.request).then(res => 
        res || fetch(e.request).then(netRes => {
          if (e.request.url.includes('aframe') || 
              e.request.url.includes('ar.js') || 
              e.request.url.includes('.html') ||
              e.request.url.includes('.js')) {
            cache.put(e.request, netRes.clone());
          }
          return netRes;
        })
      )
    )
  );
});