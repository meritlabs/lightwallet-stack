'use strict';

angular.module('copayApp.controllers').controller('collectEmailController', function($scope, $state, $timeout, $stateParams, $ionicConfig, profileService, configService, walletService, platformInfo, pushNotificationsService) {

  $scope.$on("$ionicView.beforeLeave", function() {
    $ionicConfig.views.swipeBackEnabled(true);
  });

  $scope.$on("$ionicView.enter", function() {
    $ionicConfig.views.swipeBackEnabled(false);
  });

  var isCordova = platformInfo.isCordova;
  var isWP = platformInfo.isWP;
  var usePushNotifications = isCordova && !isWP;
  var requiresOptIn = platformInfo.isIOS;

  var wallet = profileService.getWallet($stateParams.walletId);
  var walletId = wallet.credentials.walletId;
  $scope.data = {};
  $scope.data.accept = false;

  $scope.save = function() {
    var opts = {
      emailFor: {}
    };
    opts.emailFor[walletId] = $scope.email;
    walletService.updateRemotePreferences(wallet, {
      email: $scope.email,
    }, function(err) {
      if (err) $log.warn(err);
      configService.set(opts, function(err) {
        if (err) $log.warn(err);
        $scope.goNextView();
      });
    });
  };

  $scope.goNextView = function() {
    if (!usePushNotifications) {
      $state.go('onboarding.backupRequest', {
        walletId: walletId
      });
    } else if (requiresOptIn) {
      $state.go('onboarding.notifications', {
        walletId: walletId
      });
    } else {
      pushNotificationsService.init();
      $state.go('onboarding.backupRequest', {
        walletId: walletId
      });
    }
  };

  $scope.confirm = function(emailForm) {
    if (emailForm.$invalid) return;
    $scope.confirmation = true;
    $scope.email = emailForm.email.$modelValue;
  };

  $scope.cancel = function() {
    $scope.confirmation = false;
    $timeout(function() {
      $scope.$digest();
    }, 1);
  };

});
