'use strict';

angular.module('copayApp.services').factory('generateURLService', function() {
  var root = {};

  root.BASE_URL = 'https://c213.app.link/';
  root.getURL = function(obj) {
    // TODO: validate obj
    return root.BASE_URL +
      '?se=' + obj.se +
      '&sk=' + obj.sk +
      '&sn=' + obj.sn +
      '&bt=' + obj.bt +
      '&uc=' + obj.uc;
  }

  return root;
});
