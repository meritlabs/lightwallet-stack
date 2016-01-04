'use strict';

angular.module('copayApp.controllers').controller('preferencesGlobalController',
  function($scope, $rootScope, $log, configService, uxLanguage, isCordova, pushNotificationsService) {

    this.init = function() {
      var config = configService.getSync();
      this.unitName = config.wallet.settings.unitName;
      this.currentLanguageName = uxLanguage.getCurrentLanguageName();
      this.selectedAlternative = {
        name: config.wallet.settings.alternativeName,
        isoCode: config.wallet.settings.alternativeIsoCode
      };
      $scope.spendUnconfirmed = config.wallet.spendUnconfirmed;
      $scope.glideraEnabled = config.glidera.enabled;
      $scope.glideraTestnet = config.glidera.testnet;
      $scope.notifications = config.notifications ? config.notifications.enabled : true;
    };

    if (isCordova) $scope.mobile = true;
    else $scope.mobile = false;

    var unwatchSpendUnconfirmed = $scope.$watch('spendUnconfirmed', function(newVal, oldVal) {
      if (newVal == oldVal) return;
      var opts = {
        wallet: {
          spendUnconfirmed: newVal
        }
      };
      configService.set(opts, function(err) {
        $rootScope.$emit('Local/SpendUnconfirmedUpdated', newVal);
        if (err) $log.debug(err);
      });
    });

    var unwatchNotification = $scope.$watch('notifications', function(newVal, oldVal) {
      if (newVal == oldVal) return;
      var opts = {
        notifications: {
          enabled: newVal
        }
      };
      configService.set(opts, function(err) {
        if (opts.notifications.enabled)
          pushNotificationsService.enableNotifications();
        else
          pushNotificationsService.disableNotifications();
        if (err) $log.debug(err);
      });
    });

    var unwatchGlideraEnabled = $scope.$watch('glideraEnabled', function(newVal, oldVal) {
      if (newVal == oldVal) return;
      var opts = {
        glidera: {
          enabled: newVal
        }
      };
      configService.set(opts, function(err) {
        $rootScope.$emit('Local/GlideraUpdated');
        if (err) $log.debug(err);
      });
    });

    var unwatchGlideraTestnet = $scope.$watch('glideraTestnet', function(newVal, oldVal) {
      if (newVal == oldVal) return;
      var opts = {
        glidera: {
          testnet: newVal
        }
      };
      configService.set(opts, function(err) {
        $rootScope.$emit('Local/GlideraUpdated');
        if (err) $log.debug(err);
      });
    });

    $scope.$on('$destroy', function() {
      unwatchSpendUnconfirmed();
      unwatchGlideraEnabled();
      unwatchGlideraTestnet();
    });
  });
