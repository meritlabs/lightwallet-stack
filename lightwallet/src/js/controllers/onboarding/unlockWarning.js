'use strict';

angular.module('copayApp.controllers').controller('unlockWarningController', function($scope, $state, $stateParams) {

  $scope.walletId = $stateParams.walletId;
  $scope.fromState = $stateParams.from == 'onboarding' ? $stateParams.from + '.backupRequest' : $stateParams.from;

  $scope.goBack = function() {
    $state.go($scope.fromState, {
      walletId: $scope.walletId
    });
  };

});
