'use strict';

angular.module('copayApp.controllers').controller('advancedSettingsController', function($scope, $rootScope, $log, $window, lodash, configService, uxLanguage, platformInfo, pushNotificationsService, profileService, feeService, storageService, $ionicHistory, $timeout, $ionicScrollDelegate) {

  var updateConfig = function() {

    var config = configService.getSync();

    $scope.spendUnconfirmed = {
      value: config.wallet.spendUnconfirmed
    };
    $scope.bitpayCardEnabled = {
      value: config.bitpayCard.enabled
    };
    $scope.amazonEnabled = {
      value: config.amazon.enabled
    };
    $scope.glideraEnabled = {
      value: config.glidera.enabled
    };
    $scope.coinbaseEnabled = {
      value: config.coinbase.enabled
    };
    $scope.recentTransactionsEnabled = {
      value: config.recentTransactions.enabled
    };
    $scope.frequentlyUsedEnabled = {
      value: config.frequentlyUsed.enabled
    };
  };

  $scope.global = $rootScope;
  if (!$scope.global.developmentUtilitiesEnabled) {
    $scope.global.developmentUtilitiesEnabled = {
      value: false
    };
  }

  $scope.toggledDevelopmentUtils = function() {
    if ($scope.global.developmentUtilitiesEnabled.value) {
      $log.debug('User enabled development utilities.');
      $timeout(function() {
        $ionicScrollDelegate.resize();
      }, 10);
    } else {
      $log.debug('User disabled development utilities.');
    }
  }

  $scope.activateFeedbackCard = function() {
    $scope.feedbackCardActivating = true;
    storageService.getFeedbackInfo(function(error, info) {
      var feedbackInfo = JSON.parse(info);
      // hardcoding so we can distinguish from normal operation
      feedbackInfo.time = 1231006505; // genesis block time
      feedbackInfo.version = window.version;
      feedbackInfo.sent = false;
      storageService.setFeedbackInfo(JSON.stringify(feedbackInfo), function() {
        $log.debug('Activated feedback card with: ' + JSON.stringify(feedbackInfo));
        $ionicHistory.clearCache();
        $timeout(function() {
          $scope.feedbackCardActivating = false;
          $scope.feedbackCardActivated = true;
          $timeout(function() {
            $scope.feedbackCardActivated = false;
          }, 10000);
        }, 500);
      });
    });
  }

  $scope.resetActivateFeedbackCard = function() {
    $scope.feedbackCardActivated = false;
  }

  $scope.spendUnconfirmedChange = function() {
    var opts = {
      wallet: {
        spendUnconfirmed: $scope.spendUnconfirmed.value
      }
    };
    configService.set(opts, function(err) {
      if (err) $log.debug(err);
    });
  };

  $scope.bitpayCardChange = function() {
    var opts = {
      bitpayCard: {
        enabled: $scope.bitpayCardEnabled.value
      }
    };
    configService.set(opts, function(err) {
      if (err) $log.debug(err);
    });
  };

  $scope.amazonChange = function() {
    var opts = {
      amazon: {
        enabled: $scope.amazonEnabled.value
      }
    };
    configService.set(opts, function(err) {
      if (err) $log.debug(err);
    });
  };

  $scope.glideraChange = function() {
    var opts = {
      glidera: {
        enabled: $scope.glideraEnabled.value
      }
    };
    configService.set(opts, function(err) {
      if (err) $log.debug(err);
    });
  };

  $scope.coinbaseChange = function() {
    var opts = {
      coinbase: {
        enabled: $scope.coinbaseEnabled.value
      }
    };
    configService.set(opts, function(err) {
      if (err) $log.debug(err);
    });
  };

  $scope.recentTransactionsChange = function() {
    var opts = {
      recentTransactions: {
        enabled: $scope.recentTransactionsEnabled.value
      }
    };
    configService.set(opts, function(err) {
      if (err) $log.debug(err);
    });
  };

  $scope.frequentlyUsedChange = function() {
    var opts = {
      frequentlyUsed: {
        enabled: $scope.frequentlyUsedEnabled.value
      }
    };
    configService.set(opts, function(err) {
      if (err) $log.debug(err);
    });
  };

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    updateConfig();
  });

});
