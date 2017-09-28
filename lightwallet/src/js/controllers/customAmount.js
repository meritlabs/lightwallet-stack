'use strict';

angular.module('copayApp.controllers').controller('customAmountController', function($scope, $ionicHistory, txFormatService, platformInfo, configService, profileService, walletService, popupService) {

  var showErrorAndBack = function(title, msg) {
    popupService.showAlert(title, msg, function() {
      $scope.close();
    });
  };

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    var walletId = data.stateParams.id;

    if (!walletId) {
      showErrorAndBack('Error', 'No wallet selected');
      return;
    }

    $scope.showShareButton = platformInfo.isCordova ? (platformInfo.isIOS ? 'iOS' : 'Android') : null;

    $scope.wallet = profileService.getWallet(walletId);

    walletService.getAddress($scope.wallet, false, function(err, addr) {
      if (!addr) {
        showErrorAndBack('Error', 'Could not get the address');
        return;
      }

      $scope.address = addr;

      var parsedAmount = txFormatService.parseAmount(
        data.stateParams.amount,
        data.stateParams.currency);

      // Amount in USD or MRT
      var amount = parsedAmount.amount;
      var currency = parsedAmount.currency;
      $scope.amountUnitStr = parsedAmount.amountUnitStr;

      if (currency != 'MRT') {
        // Convert to MRT
        var config = configService.getSync().wallet.settings;
        var amountUnit = txFormatService.microToUnit(parsedAmount.amountMicros);
        var mrtParsedAmount = txFormatService.parseAmount(amountUnit, config.unitName);

        $scope.amountMrt = mrtParsedAmount.amount;
        $scope.altAmountStr = mrtParsedAmount.amountUnitStr;
      } else {
        $scope.amountMrt = amount; // MRT
        $scope.altAmountStr = txFormatService.formatAlternativeStr(parsedAmount.amountMicros);
      }
    });
  });

  $scope.close = function() {
    $ionicHistory.nextViewOptions({
      disableAnimate: true
    });
    $ionicHistory.goBack(-2);
  };

  $scope.shareAddress = function() {
    if (!platformInfo.isCordova) return;
    var data = 'bitcoin:' + $scope.address + '?amount=' + $scope.amountMrt;
    window.plugins.socialsharing.share(data, null, null, null);
  }

  $scope.copyToClipboard = function() {
    return 'bitcoin:' + $scope.address + '?amount=' + $scope.amountMrt;
  };

});
