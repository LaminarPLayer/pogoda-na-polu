// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
// Customize this with a different URL if needed.
const OFFLINE_URL = "offline.html";

const files = [
  OFFLINE_URL,
  "logo4.svg",
  "logo4-na-dworze.svg",
  "icons/01d.svg",
  "icons/01n.svg",
  "icons/02d.svg",
  "icons/02n.svg",
  "icons/03d.svg",
  "icons/03n.svg",
  "icons/04d.svg",
  "icons/04n.svg",
  "icons/09d.svg",
  "icons/09n.svg",
  "icons/10d.svg",
  "icons/10n.svg",
  "icons/11d.svg",
  "icons/11n.svg",
  "icons/13d.svg",
  "icons/13n.svg",
  "icons/50d.svg",
  "icons/50n.svg",
  "icons/condition-clouds.svg",
  "icons/condition-humidity.svg",
  "icons/condition-pressure.svg",
  "icons/condition-sunrise-sunset.svg",
  "icons/condition-wind-light.svg",
  "icons/condition-wind-moderate.svg",
  "icons/condition-wind-strong.svg",
  "icons/condition-wind.svg",
  "icons/daily-droplet-0.svg",
  "icons/daily-droplet-1.svg",
  "icons/daily-droplet-2.svg",
  "icons/daily-droplet-3.svg",
  "icons/daily-wind-new.svg",
  "icons/favicon.png",
  "icons/hourly-droplet-0.svg",
  "icons/hourly-droplet-1.svg",
  "icons/hourly-droplet-2.svg",
  "icons/hourly-droplet-3.svg",
  "icons/offline-cloud.svg",
  "icons/offline-dead-cloud.svg",
  "icons/offline-sun.svg",
  "icons/placeholder.svg",
  "icons/PWA-icon-192.png",
  "icons/PWA-icon-512.png",
  "pictures/01d.jpg",
  "pictures/01n.jpg",
  "pictures/02d.jpg",
  "pictures/02n.jpg",
  "pictures/03d.jpg",
  "pictures/03n.jpg",
  "pictures/04d.jpg",
  "pictures/04n.jpg",
  "pictures/09d.jpg",
  "pictures/09n.jpg",
  "pictures/10d.jpg",
  "pictures/10n.jpg",
  "pictures/11d.jpg",
  "pictures/11n.jpg",
  "pictures/13d.jpg",
  "pictures/13n.jpg",
  "pictures/50d.jpg",
  "pictures/50n.jpg",
  "pictures/preview.png"
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Setting {cache: 'reload'} in the new request will ensure that the
      // response isn't fulfilled from the HTTP cache; i.e., it will be from
      // the network.
      await cache.addAll(files);
    })()
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === "navigate") {
      event.respondWith(
        (async () => {
          try {
              // First, try to use the navigation preload response if it's supported.
              const preloadResponse = await event.preloadResponse;
              if (preloadResponse) {
                return preloadResponse;
              }

              // Always try the network first.
              const networkResponse = await fetch(event.request);
              return networkResponse;
          } catch (error) {
              // catch is only triggered if an exception is thrown, which is likely
              // due to a network error.
              // If fetch() returns a valid HTTP response with a response code in
              // the 4xx or 5xx range, the catch() will NOT be called.
              console.log("Fetch failed; returning offline page instead.", error);

              const cache = await caches.open(CACHE_NAME);
              const cachedResponse = await cache.match(OFFLINE_URL);
              return cachedResponse;
          }
        })()
      );
    }
    else{
        event.respondWith(
            caches.match(event.request, {ignoreSearch: true, ignoreVary: true, ignoreMethod: true}).then(function(response){
              return response || fetch(event.request);
            })
        );
    }

    // If our if() condition is false, then this fetch handler won't intercept the
    // request. If there are any other fetch handlers registered, they will get a
    // chance to call event.respondWith(). If no fetch handlers call
    // event.respondWith(), the request will be handled by the browser as if there
    // were no service worker involvement.
});