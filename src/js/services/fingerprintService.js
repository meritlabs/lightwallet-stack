'use strict';

angular.module('copayApp.services').factory('fingerprintService', function($log, gettextCatalog, configService, platformInfo) {
  var root = {};

  var _isAvailable = false;

  if (platformInfo.isMobile) {
    window.plugins.touchid = window.plugins.touchid || {};
    window.plugins.touchid.isAvailable(
      function(msg) {
        _isAvailable = 'IOS';
      },
      function(msg) {
        FingerprintAuth.isAvailable(function() {
          _isAvailable = 'ANDROID';
        }, function() {
          _isAvailable = false;
        });
      });
  };

  var requestFinger = function(cb) {
    console.log('[fingerprintService.js.26:requestFinger:]'); //TODO
    try {
      FingerprintAuth.show({
          clientId: 'Copay',
          clientSecret: 'hVu1NvCZOyUuGgr46bFL',
        },
        function(result) {
          if (result.withFingerprint) {
            $log.debug('Finger OK');
            return cb();
          } else if (result.withPassword) {
            $log.debug("Finger: Authenticated with backup password");
            return cb();
          }
        },
        function(msg) {
          $log.debug('Finger Failed:' + JSON.stringify(msg));
          return cb(gettextCatalog.getString('Finger Scan Failed') + ': ' + msg.localizedDescription);
        }
      );
    } catch (e) {
      $log.warn('Finger Scan Failed:' + JSON.stringify(e));
      return cb(gettextCatalog.getString('Finger Scan Failed'));
    };
  };


  var requestTouchId = function(cb) {
    try {
      window.plugins.touchid.verifyFingerprint(
        gettextCatalog.getString('Scan your fingerprint please'),
        function(msg) {
          $log.debug('Touch ID OK');
          return cb();
        },
        function(msg) {
          $log.debug('Touch ID Failed:' + JSON.stringify(msg));
          return cb(gettextCatalog.getString('Touch ID Failed') + ': ' + msg.localizedDescription);
        }
      );
    } catch (e) {
      $log.debug('Touch ID Failed:' + JSON.stringify(e));
      return cb(gettextCatalog.getString('Touch ID Failed'));
    };
  };

  var isNeeded = function(client) {
    if (!_isAvailable) return false;

    var config = configService.getSync();
    config.touchIdFor = config.touchIdFor || {};

    return config.touchIdFor[client.credentials.walletId];
  };

  root.isAvailable = function(client) {
    return _isAvailable;
  };

  root.check = function(client, cb) {
    if (isNeeded(client)) {
      console.log('[fingerprintService.js.82:_isAvailable:]', _isAvailable); //TODO
      if (_isAvailable == 'IOS')
        return requestTouchId(cb);
      else
        return requestFinger(cb);
    } else {
      return cb();
    }
  };

  return root;
});
