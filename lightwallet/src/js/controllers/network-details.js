'use strict';

angular
  .module('copayApp.controllers')
  .controller('networkDetailsController', function(
    $rootScope,
    $log,
    $scope,
    $timeout,
    lodash,
    gettextCatalog,
    txFormatService,
    profileService,
    walletService
  ) {
    $scope.$on('$ionicView.beforeEnter', function(event, data) {
      $scope.wallet = profileService.getWallet(data.stateParams.walletId);
      $scope.fetchingAnv = true;
      $scope.fetchingRewards = true;

      walletService.getANV($scope.wallet, function(err, anv) {
        $scope.fetchingAnv = false;

        if (err) {
          $scope.errorAnv = err;
        }

        $timeout(function() {
          $scope.anv = txFormatService.parseAmount(anv, 'micros');
        });
      });

      walletService.getRewards($scope.wallet, function(err, addressRewards) {
        $scope.fetchingRewards = false;

        if (err) {
          $scope.errorRewards = err;
        }

        $timeout(function() {
          $scope.rewards = {
            mining: txFormatService.parseAmount(addressRewards.rewards.mining, 'micros'),
            ambassador: txFormatService.parseAmount(addressRewards.rewards.ambassador, 'micros'),
          };
        });
      });
    });
  });
