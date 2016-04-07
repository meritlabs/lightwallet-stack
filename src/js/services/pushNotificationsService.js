'use strict';
angular.module('copayApp.services')
  .factory('pushNotificationsService', function($log, isMobile, storageService, configService, lodash, isCordova) {
    var root = {};
    var usePushNotifications = isCordova && !isMobile.Windows();

    root.enableNotifications = function(walletsClients) {
      if (!usePushNotifications) return;

      var config = configService.getSync();
      if (!config.pushNotifications.enabled) return;

      storageService.getDeviceToken(function(err, token) {
        if (err || !token) {
          $log.warn('No token available for this device. Cannot set push notifications');
          return;
        }

        lodash.forEach(walletsClients, function(walletClient) {
          var opts = {};
          opts.type = isMobile.iOS() ? "ios" : isMobile.Android() ? "android" : null;
          opts.token = token;
          root.subscribe(opts, walletClient, function(err, response) {
            if (err) $log.warn('Subscription error: ' + err.message + ': ' + JSON.stringify(opts));
            else $log.debug('Subscribed to push notifications service: ' + JSON.stringify(response));
          });
        });
      });
    }

    root.disableNotifications = function(walletsClients) {
      if (!usePushNotifications) return;

      lodash.forEach(walletsClients, function(walletClient) {
        root.unsubscribe(walletClient, function(err) {
          if (err) $log.warn('Unsubscription error: ' + err.message);
          else $log.debug('Unsubscribed from push notifications service');
        });
      });
    }

    root.subscribe = function(opts, walletClient, cb) {
      if (!usePushNotifications) return cb();

      var config = configService.getSync();
      if (!config.pushNotifications.enabled) return;

      walletClient.pushNotificationsSubscribe(opts, function(err, resp) {
        if (err) return cb(err);
        return cb(null, resp);
      });
    }

    root.unsubscribe = function(walletClient, cb) {
      if (!usePushNotifications) return cb();

      walletClient.pushNotificationsUnsubscribe(function(err) {
        if (err) return cb(err);
        return cb(null);
      });
    }

    return root;

  });
