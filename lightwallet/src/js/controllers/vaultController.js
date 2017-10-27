'use strict';

angular.module('copayApp.controllers').controller('vaultController', function($scope, $rootScope, $state) {

  $scope.toMasterKey = function() {
    $state.go('tabs.add.create-vault.master-key');
  };

  $scope.toConfirmKey = function() {

  };

  $scope.toSummaryView = function() {
    $state.go('tabs.add.create-vault.summary');
  };

  $scope.toVaultWallet = function() {

  };

});
