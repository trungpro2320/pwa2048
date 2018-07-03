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
//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function(event) {
  var updateCache = function(request){
    return caches.open(CACHE_NAME).then(function (cache) {
      return fetch(request).then(function (response) {
        console.log('[PWA Builder] add page to offline'+response.url)
        return cache.put(request, response);
      });
    });
  };
  event.waitUntil(updateCache(event.request));
  event.respondWith(
    fetch(event.request).catch(function(error) {
      console.log( '[PWA Builder] Network request Failed. Serving content from cache: ' + error );
      //Check to see if you have it in the cache
      //Return response
      //If not in the cache, then return error page
      return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (matching) {
          var report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
          return report
        });
      });
    })
  );
})