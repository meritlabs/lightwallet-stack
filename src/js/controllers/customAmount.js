'use strict';

angular.module('copayApp.controllers').controller('customAmountController', function($rootScope, $scope, $stateParams, $ionicHistory, txFormatService, platformInfo) {

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    var satToBtc = 1 / 100000000;
    $scope.isCordova = platformInfo.isCordova;
    $scope.address = data.stateParams.toAddress;
    $scope.amount = parseInt(data.stateParams.toAmount);
    $scope.amountBtc = ($scope.amount * satToBtc).toFixed(8);
    $scope.amountStr = txFormatService.formatAmountStr($scope.amount);
    $scope.altAmountStr = txFormatService.formatAlternativeStr($scope.amount);
  });

  $scope.shareAddress = function(uri) {
    window.plugins.socialsharing.share(uri, null, null, null);
  };

  $scope.finish = function() {
    $ionicHistory.nextViewOptions({
      disableAnimate: false,
      historyRoot: true
    });
    $ionicHistory.goBack(-2);
  };

});
