'use strict';

angular.module('copayApp.controllers').controller('addressesController', function($scope, $stateParams, $state, $timeout, $ionicHistory, $ionicScrollDelegate, configService, popupService, gettextCatalog, ongoingProcess, lodash, profileService, walletService, bwcError, platformInfo) {
  var UNUSED_ADDRESS_LIMIT = 5;
  var BALANCE_ADDRESS_LIMIT = 5;
  var config;
  var unitName;
  var unitToSatoshi;
  var satToUnit;
  var unitDecimals;
  var withBalance;
  $scope.showInfo = false;
  $scope.showMore = false;
  $scope.allAddressesView = false;
  $scope.isCordova = platformInfo.isCordova;
  $scope.wallet = profileService.getWallet($stateParams.walletId);

  function init() {
    ongoingProcess.set('gettingAddresses', true);
    walletService.getMainAddresses($scope.wallet, {}, function(err, addresses) {
      if (err) {
        ongoingProcess.set('gettingAddresses', false);
        return popupService.showAlert(bwcError.msg(err, gettextCatalog.getString('Could not update wallet')));
      }

      var allAddresses = addresses;

      walletService.getBalance($scope.wallet, {}, function(err, resp) {
        ongoingProcess.set('gettingAddresses', false);
        if (err) {
          return popupService.showAlert(bwcError.msg(err, gettextCatalog.getString('Could not update wallet')));
        }

        withBalance = resp.byAddress;
        var idx = lodash.indexBy(withBalance, 'address');
        $scope.noBalance = lodash.reject(allAddresses, function(x) {
          return idx[x.address];
        });

        processPaths($scope.noBalance);
        processPaths(withBalance);

        $scope.latestUnused = lodash.slice($scope.noBalance, 0, UNUSED_ADDRESS_LIMIT);
        $scope.latestWithBalance = lodash.slice(withBalance, 0, BALANCE_ADDRESS_LIMIT);

        lodash.each(withBalance, function(a) {
          a.balanceStr = (a.amount * satToUnit).toFixed(unitDecimals) + ' ' + unitName;
        });

        $scope.viewAll = {
          value: $scope.noBalance.length > UNUSED_ADDRESS_LIMIT || withBalance.length > BALANCE_ADDRESS_LIMIT
        };
        $scope.allAddresses = $scope.noBalance.concat(withBalance);
        $scope.$digest();
      });
    });
  };

  function processPaths(list) {
    lodash.each(list, function(n) {
      n.path = n.path.replace(/^m/g, 'xpub');
    });
  };

  $scope.newAddress = function() {
    if ($scope.gapReached) return;

    ongoingProcess.set('generatingNewAddress', true);
    walletService.getAddress($scope.wallet, true, function(err, addr) {
      if (err) {
        ongoingProcess.set('generatingNewAddress', false);
        $scope.gapReached = true;
        $timeout(function() {
          $scope.$digest();
        });
        return;
      }

      walletService.getMainAddresses($scope.wallet, {
        limit: 1
      }, function(err, _addr) {
        ongoingProcess.set('generatingNewAddress', false);
        if (err) return popupService.showAlert(gettextCatalog.getString('Error'), err);
        if (addr != _addr[0].address) return popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('New address could not be generated. Please try again.'));

        $scope.noBalance = [_addr[0]].concat($scope.noBalance);
        $scope.latestUnused = lodash.slice($scope.noBalance, 0, UNUSED_ADDRESS_LIMIT);
        $scope.viewAll = {
          value: $scope.noBalance.length > UNUSED_ADDRESS_LIMIT
        };
        $scope.$digest();
      });
    });
  };

  $scope.viewAllAddresses = function() {
    $state.go('tabs.receive.allAddresses', {
      walletId: $scope.wallet.id
    });
  };

  $scope.requestSpecificAmount = function() {
    $state.go('tabs.receive.amount', {
      customAmount: true,
      toAddress: $stateParams.toAddress
    });
  }

  $scope.showInformation = function() {
    $timeout(function() {
      $scope.showInfo = !$scope.showInfo;
      $ionicScrollDelegate.resize();
    }, 10);
  };

  $scope.readMore = function() {
    $timeout(function() {
      $scope.showMore = !$scope.showMore;
      $ionicScrollDelegate.resize();
    }, 10);
  };

  $scope.scan = function() {
    walletService.startScan($scope.wallet);
    $ionicHistory.clearHistory();
    $state.go('tabs.home');
  };

  $scope.sendByEmail = function() {
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

    ongoingProcess.set('sendingByEmail', true);
    $timeout(function() {
      var body = 'Copay Wallet "' + $scope.wallet.name + '" Addresses\n  Only Main Addresses are  shown.\n\n';
      body += "\n";
      body += $scope.allAddresses.map(function(v) {
        return ('* ' + v.address + ' ' + 'xpub' + v.path.substring(1) + ' ' + formatDate(v.createdOn));
      }).join("\n");
      ongoingProcess.set('sendingByEmail', false);

      window.plugins.socialsharing.shareViaEmail(
        body,
        'Copay Addresses',
        null, // TO: must be null or an array
        null, // CC: must be null or an array
        null, // BCC: must be null or an array
        null, // FILES: can be null, a string, or an array
        function() {},
        function() {}
      );

      $scope.menu.hide();
    });
  };

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    $scope.allAddressesView = data.stateName == 'tabs.receive.allAddresses' ? true : false;
    $timeout(function() {
      $scope.$apply();
    });
  });

  $scope.$on("$ionicView.afterEnter", function(event, data) {
    config = configService.getSync().wallet.settings;
    unitToSatoshi = config.unitToSatoshi;
    satToUnit = 1 / unitToSatoshi;
    unitName = config.unitName;
    unitDecimals = config.unitDecimals;

    if (!$scope.allAddresses || $scope.allAddresses.length < 0) init();
  });
});
