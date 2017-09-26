'use strict';

angular
  .module('copayApp.controllers')
  .controller('tabNetworkController', function(
    $rootScope,
    $scope,
    $log,
    $state,
    $timeout,
    $ionicHistory,
    gettextCatalog,
    lodash,
    txFormatService,
    profileService,
    walletService
  ) {
    $scope.$on('$ionicView.beforeEnter', function(event, data) {
      $scope.wallets = profileService.getWallets();
      $scope.singleWallet = $scope.wallets.length == 1;

      if (!$scope.wallets[0]) return;

      // select first wallet if no wallet selected previously
      var selectedWallet = checkSelectedWallet($scope.wallet, $scope.wallets);
      $scope.onWalletSelect(selectedWallet);
    });

    var checkSelectedWallet = function(wallet, wallets) {
      if (!wallet) {
        return wallets[0];
      }

      var w = lodash.find(wallets, wallet.id);

      return w ? wallet : wallets[0];
    };

    $scope.onWalletSelect = function(wallet) {
      $scope.wallet = wallet;

      if (wallet.anv === void 0) {
        walletService.getANV($scope.wallet, function(err, anv) {
          $scope.fetchingAnv = false;

          if (err) {
            $scope.error = err;
          }

          $timeout(function() {
            wallet.anv = txFormatService.parseAmount(anv);
          });
        });
      }
    };

    $scope.showWalletSelector = function() {
      if ($scope.singleWallet) return;
      $scope.walletSelectorTitle = gettextCatalog.getString('Select a wallet');
      $scope.showWallets = true;
    };

    $scope.openNetworkDetails = function(wallet) {
      if (wallet) {
        $state.transitionTo('tabs.network.details', {
          walletId: wallet.id,
        });
      }
    };

    $scope.canGoBack = function() {
      return $state.params.passthroughMode;
    };

    function goBack() {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
      });
      $ionicHistory.backView().go();
    }

    $scope.goBack = goBack;
  });
