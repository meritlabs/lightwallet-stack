'use strict';

angular
  .module('copayApp.controllers')
  .controller('networkDetailsController', function($rootScope, $log, $scope, lodash, gettextCatalog, profileService) {

    $scope.$on('$ionicView.beforeEnter', function(event, data) {
      $log.debug('tabNetworkDetails entering');
    });
  });
