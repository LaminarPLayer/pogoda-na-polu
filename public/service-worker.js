var cacheName = 'js13kPWA-v1';
var appShellFiles = [
    '/offline.html',
    '/logo4.svg',
    '/icons/offline-cloud.svg',
    '/icons/offline-sun.svg',
    '/icons/offline-dead-cloud.svg'
];
    
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            // Setting {cache: 'reload'} in the new request will ensure that the
            // response isn't fulfilled from the HTTP cache; i.e., it will be from
            // the network.
            await cache.add(new Request('/offline.html', { cache: "reload" }));
        })()
    );
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();



    console.log('[Service Worker] Install');

    

    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(contentToCache);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((r) => {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
                    console.log('[Service Worker] Caching new resource: '+e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});