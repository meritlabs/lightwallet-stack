'use strict';

angular.module('copayApp.services').service('startupService', function($log, $timeout) {

  var splashscreenVisible = true;
  var statusBarVisible = false;

  function _hideSplash(){
    if(navigator.splashscreen && splashscreenVisible){
      $log.debug('startupService is hiding the splashscreen...');
      $timeout(function(){
        navigator.splashscreen.hide();
      }, 20);
      splashscreenVisible = false;
    }
  }
  function _showStatusBar(){
    if(StatusBar && !statusBarVisible){
      $log.debug('startupService is showing the StatusBar...');
      StatusBar.show();
      statusBarVisible = true;
    }
  }
  this.ready = function() {
    _showStatusBar();
    _hideSplash();
  };
});
