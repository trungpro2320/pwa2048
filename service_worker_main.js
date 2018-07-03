'use strict'

const CACHE_NAME = 'cache-v1';
const RUNTIME = 'runtime';
// The files we want to cache
const resourceList = [
  '/',
  'index.html',
  'favicon.ico',
  '/style/main.css',
  '/style/fonts/clear-sans.css',
  '/style/fonts/ClearSans-Bold-webfont.eot',
  '/style/fonts/ClearSans-Bold-webfont.svg',
  '/style/fonts/ClearSans-Bold-webfont.woff',
  '/style/fonts/ClearSans-Light-webfont.eot',
  '/style/fonts/ClearSans-Light-webfont.svg',
  '/style/fonts/ClearSans-Light-webfont.woff',
  '/style/fonts/ClearSans-Regular-webfont.eot',
  '/style/fonts/ClearSans-Regular-webfont.svg',
  '/style/fonts/ClearSans-Regular-webfont.woff',
  '/js/animframe_polyfill.js',
  '/js/application.js',
  '/js/bind_polyfill.js',
  '/js/classlist_polyfill.js',
  '/js/game_manager.js',
  '/js/grid.js',
  '/js/html_actuator.js',
  '/js/keyboard_input_manager.js',
  '/js/local_storage_manager.js',
  '/js/tile.js',
  '/meta/apple-touch-icon.png',
  '/meta/apple-touch-icon_96.png',
  '/meta/apple-touch-icon_144.png',
  '/meta/apple-touch-startup-image-640x920.png',
  '/meta/apple-touch-startup-image-640x1096.png'
];

//This is the "Offline copy of pages" wervice worker
// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(resourceList))
      .then(self.skipWaiting())
  );
});
//Cache list of predefined resources during activate event, using the cache API
self.addEventListener('activate', function( event ){
   const currentCaches = [CACHE_NAME, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});
// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});