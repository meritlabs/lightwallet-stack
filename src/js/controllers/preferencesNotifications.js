'use strict';

angular.module('copayApp.controllers').controller('preferencesNotificationsController', function($scope, $log, $timeout, $window, lodash, configService, platformInfo, pushNotificationsService, profileService, emailService) {
  var updateConfig = function() {
    var config = configService.getSync();
    $scope.appName = $window.appConfig.nameCase;
    $scope.PNEnabledByUser = true;
    $scope.usePushNotifications = platformInfo.isCordova && !platformInfo.isWP;
    $scope.isIOSApp = platformInfo.isIOS && platformInfo.isCordova;

    $scope.pushNotifications = {
      value: config.pushNotifications.enabled
    };

    $scope.latestEmail = {
      value: getLatestEmailConfig()
    };

    $scope.newEmail = lodash.clone($scope.latestEmail);
    var isEmailEnabled = config.emailNotifications ? config.emailNotifications.enabled : false;

    $scope.emailNotifications = {
      value: isEmailEnabled && $scope.newEmail.value ? true : false
    };

    $timeout(function() {
      $scope.$apply();
    });
  };

  $scope.pushNotificationsChange = function() {
    if (!$scope.pushNotifications) return;
    var opts = {
      pushNotifications: {
        enabled: $scope.pushNotifications.value
      }
    };
    configService.set(opts, function(err) {
      if (opts.pushNotifications.enabled)
        profileService.pushNotificationsInit();
      else
        pushNotificationsService.disableNotifications(profileService.getWallets());
      if (err) $log.debug(err);
    });
  };

  $scope.emailNotificationsChange = function() {
    var opts = {
      emailNotifications: {
        enabled: $scope.emailNotifications.value
      }
    };
    configService.set(opts, function(err) {
      if (err) $log.debug(err);
    });

    $scope.latestEmail = {
      value: getLatestEmailConfig()
    };

    $scope.newEmail = lodash.clone($scope.latestEmail);

    if (!$scope.emailNotifications.value) {
      emailService.enableEmailNotifications({
        enabled: $scope.emailNotifications.value,
        email: null
      });
    }
    $timeout(function() {
      $scope.$apply();
    });
  };

  $scope.save = function() {
    emailService.enableEmailNotifications({
      enabled: $scope.emailNotifications.value,
      email: $scope.newEmail.value
    });

    $scope.latestEmail = {
      value: $scope.newEmail.value
    };

    $timeout(function() {
      $scope.$apply();
    });
  };

  function getLatestEmailConfig() {
    var config = configService.getSync();
    return config.emailFor ? lodash.values(config.emailFor)[0] : null;
  };

  $scope.$on("$ionicView.enter", function(event, data) {
    updateConfig();
  });
});
