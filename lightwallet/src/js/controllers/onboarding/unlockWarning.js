'use strict';

angular.module('copayApp.controllers').controller('unlockWarningController', function($scope, $state, $stateParams, profileService) {
  var wallet = profileService.getWallet($stateParams.walletId);

  // @todo move that logic to service
  wallet.unlockWarnShown = true;

  $scope.goBack = function() {
    $state.go('tabs.wallet', {
      walletId: $stateParams.walletId
    });
  };

});
