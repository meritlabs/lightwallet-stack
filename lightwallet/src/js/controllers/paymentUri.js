'use strict';
angular.module('copayApp.controllers').controller('paymentUriController',
  function($rootScope, $scope, $stateParams, $location, $timeout, $ionicHistory, profileService, configService, lodash, bitcore, $state) {
    function strip(number) {
      return (parseFloat(number.toPrecision(12)));
    };

    // Build meritURI with querystring
    this.init = function() {
      var query = [];
      this.meritURI = $stateParams.url;

      var URI = bitcore.URI;
      var isUriValid = URI.isValid(this.meritURI);
      if (!URI.isValid(this.meritURI)) {
        this.error = true;
        return;
      }
      var uri = new URI(this.meritURI);

      if (uri && uri.address) {
        var config = configService.getSync().wallet.settings;
        var unitToMicro = config.unitToMicro;
        var microToUnit = 1 / unitToMicro;
        var unitName = config.unitName;

        if (uri.amount) {
          uri.amount = strip(uri.amount * microToUnit) + ' ' + unitName;
        }
        uri.network = uri.address.network.name;
        this.uri = uri;
      }
    };

    this.getWallets = function(network) {

      $scope.wallets = [];
      lodash.forEach(profileService.getWallets(network), function(w) {
        var client = profileService.getClient(w.id);
        profileService.isReady(client, function(err) {
          if (err) return;
          $scope.wallets.push(w);
        })
      });
    };

    this.selectWallet = function(wid) {
      var self = this;
      profileService.setAndStoreFocus(wid, function() {});
      $ionicHistory.removeBackView();
      $state.go('tabs.home');
      $timeout(function() {
        $rootScope.$emit('paymentUri', self.meritURI);
      }, 1000);
    };
  });
