'use strict';

angular.element(document).ready(function() {

  // Run copayApp after device is ready.
  var startAngular = function() {
    angular.bootstrap(document, ['copayApp']);
  };

  var handleBitcoinURI = function(url) {
    if (!url) return;
    if (url.indexOf('glidera') != -1) {
      url = '#/uri-glidera' + url.replace('bitcoin://glidera', '');
    }
    else {
      url = '#/uri-payment/' + url;
    }
    setTimeout(function() {
      window.location = url;
    }, 1000);
  };


  /* Cordova specific Init */
  if (window.cordova !== undefined) {

    document.addEventListener('deviceready', function() {

      document.addEventListener('pause', function() {
        if (!window.ignoreMobilePause) {
          window.location = '#/';
        }
      }, false);

      document.addEventListener('resume', function() {
        if (!window.ignoreMobilePause) {
          window.location = '#/cordova/resume';
        }
        setTimeout(function() {
          window.ignoreMobilePause = false;
        }, 100);
      }, false);

      // Back button event
      document.addEventListener('backbutton', function() {
        var loc = window.location;
        var isHome = loc.toString().match(/index\.html#\/$/) ? 'true' : '';
        if (!window.ignoreMobilePause) {
          window.location = '#/cordova/backbutton/'+isHome;
        }
        setTimeout(function() {
          window.ignoreMobilePause = false;
        }, 100);
      }, false);

      document.addEventListener('menubutton', function() {
        window.location = '#/preferences';
      }, false);

      setTimeout(function() {
        navigator.splashscreen.hide();
      }, 2000);

      window.plugins.webintent.getUri(handleBitcoinURI);
      window.plugins.webintent.onNewIntent(handleBitcoinURI);
      window.handleOpenURL = handleBitcoinURI;

      window.plugins.touchid.isAvailable(
        function(msg) { window.touchidAvailable = true; }, // success handler: TouchID available
        function(msg) { window.touchidAvailable = false; } // error handler: no TouchID available
      );

      startAngular();
    }, false);
  } else {
    try {
      window.handleOpenURL = handleBitcoinURI;
      window.plugins.webintent.getUri(handleBitcoinURI);
      window.plugins.webintent.onNewIntent(handleBitcoinURI);
    } catch (e) {}

    startAngular();
  }

});
