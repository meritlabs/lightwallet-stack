'use strict';

angular.module('copayApp.controllers').controller('preferencesInformation',
  function($scope, $log, $timeout, isMobile, gettextCatalog, lodash, profileService, storageService, go) {
    var base = 'xpub';
    var fc = profileService.focusedClient;
    var c = fc.credentials;

    this.init = function() {
      var basePath = c.getBaseAddressDerivationPath();

      $scope.walletName = c.walletName;
      $scope.walletId = c.walletId;
      $scope.network = c.network;
      $scope.addressType = c.addressType || 'P2SH';
      $scope.derivationStrategy = c.derivationStrategy || 'BIP45';
      $scope.basePath = basePath;
      $scope.M = c.m;
      $scope.N = c.n;
      $scope.pubKeys = lodash.pluck(c.publicKeyRing, 'xPubKey');
      $scope.addrs = null;

      fc.getMainAddresses({
        doNotVerify: true
      }, function(err, addrs) {
        if (err) {
          $log.warn(err);
          return;
        };
        var last10 = [],
          i = 0,
          e = addrs.pop();
        while (i++ < 10 && e) {
          e.path = base + e.path.substring(1);
          last10.push(e);
          e = addrs.pop();
        }
        $scope.addrs = last10;
        $timeout(function() {
          $scope.$apply();
        });

      });
    };

    this.sendAddrs = function() {
      var self = this;

      if (isMobile.Android() || isMobile.Windows()) {
        window.ignoreMobilePause = true;
      }

      self.loading = true;

      function formatDate(ts) {
        var dateObj = new Date(ts * 1000);
        if (!dateObj) {
          $log.debug('Error formating a date');
          return 'DateError';
        }
        if (!dateObj.toJSON()) {
          return '';
        }
        return dateObj.toJSON();
      };

      $timeout(function() {
        fc.getMainAddresses({
          doNotVerify: true
        }, function(err, addrs) {
          self.loading = false;
          if (err) {
            $log.warn(err);
            return;
          };

          var body = 'Copay Wallet "' + $scope.walletName + '" Addresses\n  Only Main Addresses are  shown.\n\n';
          body += "\n";
          body += addrs.map(function(v) {
            return ('* ' + v.address + ' ' + base + v.path.substring(1) + ' ' + formatDate(v.createdOn));
          }).join("\n");

          var properties = {
            subject: 'Copay Addresses',
            body: body,
            isHtml: false
          };
          window.plugin.email.open(properties);

          $timeout(function() {
            $scope.$apply();
          }, 1000);
        });
      }, 100);
    };

  });
