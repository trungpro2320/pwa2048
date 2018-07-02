'use strict'

const CACHE_NAME = 'cache-v1';
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
//Install stage sets up the index page (home page) in the cahche and opens a new cache
self.addEventListener('install', function(event) {
  var indexPage = new Request('index.html');
  event.waitUntil(
    fetch(indexPage).then(function(response) {
      return caches.open(CACHE_NAME).then(function(cache) {
        console.log('[PWA Builder] Cached index page during Install'+ response.url);
        return cache.put(indexPage, response);
      });
  }));
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
