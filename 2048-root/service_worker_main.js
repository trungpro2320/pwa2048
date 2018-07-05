'use strict'

const CACHE_NAME = 'cache-v1';
// The files we want to cache
const resourceList = [
  '/2048-root',
  '/2048-root/index.html',
  '/2048-root/favicon.ico',
  '/2048-root/style/main.css',
  '/2048-root/style/fonts/clear-sans.css',
  '/2048-root/style/fonts/ClearSans-Bold-webfont.eot',
  '/2048-root/style/fonts/ClearSans-Bold-webfont.svg',
  '/2048-root/style/fonts/ClearSans-Bold-webfont.woff',
  '/2048-root/style/fonts/ClearSans-Light-webfont.eot',
  '/2048-root/style/fonts/ClearSans-Light-webfont.svg',
  '/2048-root/style/fonts/ClearSans-Light-webfont.woff',
  '/2048-root/style/fonts/ClearSans-Regular-webfont.eot',
  '/2048-root/style/fonts/ClearSans-Regular-webfont.svg',
  '/2048-root/style/fonts/ClearSans-Regular-webfont.woff',
  '/2048-root/js/animframe_polyfill.js',
  '/2048-root/js/application.js',
  '/2048-root/js/bind_polyfill.js',
  '/2048-root/js/classlist_polyfill.js',
  '/2048-root/js/game_manager.js',
  '/2048-root/js/grid.js',
  '/2048-root/js/html_actuator.js',
  '/2048-root/js/keyboard_input_manager.js',
  '/2048-root/js/local_storage_manager.js',
  '/2048-root/js/tile.js',
  '/2048-root/meta/apple-touch-icon.png',
  '/2048-root/meta/apple-touch-icon_96.png',
  '/2048-root/meta/apple-touch-icon_144.png',
  '/2048-root/meta/apple-touch-startup-image-640x920.png',
  '/2048-root/meta/apple-touch-startup-image-640x1096.png'
];

//This is the "Offline copy of pages" wervice worker
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(resourceList).then(function() {
				return self.skipWaiting();
			});
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});
