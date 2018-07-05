if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service_worker_main.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    alert('pwa is failed');
    console.log('ServiceWorker registration failed: ', err);
  });
  	navigator.serviceWorker.ready.then(function(registration) {
			 console.log("Service Worker Ready");
		});
}
