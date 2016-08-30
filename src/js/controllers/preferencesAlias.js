'use strict';

angular.module('copayApp.controllers').controller('preferencesAliasController',
  function($scope, $timeout, $stateParams, $ionicHistory, $ionicNavBarDelegate, gettextCatalog, configService, profileService, walletService) {
    $ionicNavBarDelegate.title(gettextCatalog.getString('Alias'));
    var wallet = profileService.getWallet($stateParams.walletId);
    $scope.wallet = wallet;
    var walletId = wallet.credentials.walletId;
    var config = configService.getSync();

    config.aliasFor = config.aliasFor || {};
    $scope.walletName = wallet.credentials.walletName;
    $scope.alias = config.aliasFor[walletId] || wallet.walletName;

    $scope.save = function() {
      var opts = {
        aliasFor: {}
      };
      opts.aliasFor[walletId] = $scope.alias;

      configService.set(opts, function(err) {
        if (err) $log.warn(err);
        $ionicHistory.goBack();
      });
    };
  });
