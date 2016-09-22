'use strict';

angular.module('copayApp.controllers').controller('preferencesController',
  function($scope, $rootScope, $timeout, $log, $stateParams, $ionicHistory, gettextCatalog, configService, profileService, fingerprintService, walletService) {
    var wallet = profileService.getWallet($stateParams.walletId);
    var walletId = wallet.credentials.walletId;
    $scope.wallet = wallet;

    $scope.encryptChange = function() {
      if (!wallet) return;
      var val = $scope.encryptEnabled;

      if (val && !walletService.isEncrypted(wallet)) {
        $log.debug('Encrypting private key for', wallet.name);
        walletService.encrypt(wallet, function(err) {
          if (err) {
            $log.warn(err);

            // ToDo show error?
            $scope.encryptEnabled = false;
            return;
          }
          profileService.updateCredentials(JSON.parse(wallet.export()), function() {
            $log.debug('Wallet encrypted');
            return;
          });
        })
      } else if (!val && walletService.isEncrypted(wallet)) {
        walletService.decrypt(wallet, function(err) {
          if (err) {
            $log.warn(err);

            // ToDo show error?
            $scope.encryptEnabled = true;
            return;
          }
          profileService.updateCredentials(JSON.parse(wallet.export()), function() {
            $log.debug('Wallet decrypted');
            return;
          });
        })
      }
    };

    $scope.touchIdChange = function() {
      var newStatus = $scope.touchIdEnabled;
      walletService.setTouchId(wallet, !!newStatus, function(err) {
        if (err) {
          $scope.touchIdEnabled = !newStatus;
          $timeout(function() {
            $scope.$apply();
          }, 1);
          return;
        }
        $log.debug('Touch Id status changed: ' + newStatus);
      });
    };

    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.externalSource = null;

      if (!wallet)
        return $ionicHistory.goBack();

      var config = configService.getSync();

      $scope.encryptEnabled = walletService.isEncrypted(wallet);
      if (wallet.isPrivKeyExternal)
        $scope.externalSource = wallet.getPrivKeyExternalSourceName() == 'ledger' ? 'Ledger' : 'Trezor';

      $scope.touchIdAvailable = fingerprintService.isAvailable();
      $scope.touchIdEnabled = config.touchIdFor ? config.touchIdFor[walletId] : null;

      $scope.deleted = false;
      if (wallet.credentials && !wallet.credentials.mnemonicEncrypted && !wallet.credentials.mnemonic) {
        $scope.deleted = true;
      }
    });
  });
