'use strict';

angular.module('copayApp.services').factory('generateURLService', function() {
  var root = {};

  root.getURL = function() {
    // return a placeholder url
    return 'merit.me';
  }

  return root;
});
