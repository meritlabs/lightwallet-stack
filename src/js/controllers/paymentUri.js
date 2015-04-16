'use strict';
angular.module('copayApp.controllers').controller('paymentUriController', 
    function($rootScope, $stateParams, $location, $timeout, profileService, configService, lodash, bitcore, go) {

      function strip(number) {
        return (parseFloat(number.toPrecision(12)));
      };

      // Build bitcoinURI with querystring
      this.checkBitcoinUri = function() {
        var query = [];
        angular.forEach($location.search(), function(value, key) {
          query.push(key + "=" + value);
        });
        var queryString = query ? query.join("&") : null;
        this.bitcoinURI = $stateParams.data + ( queryString ? '?' + queryString : '');

        var URI = bitcore.URI;
        var isUriValid = URI.isValid(this.bitcoinURI);
        if (!URI.isValid(this.bitcoinURI)) {
          this.error = true;
          return;
        }
        var uri = new URI(this.bitcoinURI);

        if (uri && uri.address) {
          var config = configService.getSync().wallet.settings;
          var unitToSatoshi = config.unitToSatoshi;
          var satToUnit = 1 / unitToSatoshi;
          var unitName = config.unitName;

          uri.amount = strip(uri.amount * satToUnit) + ' ' + unitName;
          return uri;
        }
      };

      this.getWallets = function() {
        if (!profileService.profile) return;
        var config = configService.getSync();
        config.colorFor = config.colorFor || {};
        var ret = lodash.map(profileService.profile.credentials, function(c) {
          return {
            m: c.m,
            n: c.n,
            name: c.walletName,
            id: c.walletId,
            color: config.colorFor[c.walletId] || '#2C3E50'
          };
        });
        return lodash.sortBy(ret, 'walletName');
      };

      this.selectWallet = function(wid) {
        var self = this;
        if (wid != profileService.focusedClient.credentials.walletId) {
          profileService.setAndStoreFocus(wid, function() {});
        }
        go.send();
        $timeout(function() {
          $rootScope.$emit('paymentUri', self.bitcoinURI);
        }, 100);
      };
    });
