'use strict';

angular
  .module('copayApp.controllers')
  .controller('networkDetailsController', function($rootScope, $log, $scope, lodash, gettextCatalog, profileService) {

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
      $scope.wallet = profileService.getWallet(data.stateParams.walletId);
    });

  });
