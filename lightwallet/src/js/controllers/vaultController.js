'use strict';

angular.module('copayApp.controllers').controller('vaultController', function($scope, $rootScope, $state, popupService, bwcService) {
  window.Client = walletClient;

  $scope.toMasterKey = function() {
    $state.go('tabs.add.create-vault.master-key');
  };

  $scope.toConfirmKey = function() {
    popupService.showConfirm('Master key', 'Are you sure that you have copied master key?', 'Yes', 'No', function(ok) {
      if (ok) {
        $scope.toSummaryView();
      }

      return;
    });
  };

  $scope.toSummaryView = function() {
    $state.go('tabs.add.create-vault.summary');
  };

  $scope.toVaultWallet = function() {
    $state.go('tabs.home');
  };

});
