(function () {
  'use strict';

  //After DOM Loaded
  document.addEventListener('DOMContentLoaded', function(event) {
    //On initial load to check connectivity
      updateNetworkStatus();

    window.addEventListener('online', updateNetworkStatus, false);
    window.addEventListener('offline', updateNetworkStatus, false);
  });

  //To update network status
  function updateNetworkStatus() {
    if (navigator.onLine) {
      toast('App is online');
    }
    else {
      toast('App is offline');
    }
  }
})();