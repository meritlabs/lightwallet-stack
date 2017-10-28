'use strict';

angular.module('copayApp.services')
  .factory('easySendService', function easySendServiceFactory($rootScope, $timeout, $log, $state, $window, bitcore, lodash, storageService) {

    var service = {};

    service.createEasySendScriptHash = function(wallet, cb) {

      // TODO: get a passphrase
      var opts = {
        network: wallet.credentials.network,
        passphrase: 'donkey'
      }

      wallet.buildEasySendScript(opts, function(err, easySendResult) {
        if (err) {
          return cb(err);
        }
        var unlockScriptOpts = {
          unlockCode: wallet.shareCode,
          address: easySendResult.script.toAddress().toString(),
          network: opts.network
        };

        return wallet.unlockAddress(unlockScriptOpts, function(err1, res1) {
          if (err1) return cb(err1);
          var unlockRecipientOpts = {
            unlockCode: wallet.shareCode,
            address: easySendResult.receiverPubKey.toAddress().toString(),
            network: opts.network
          };

          return wallet.unlockAddress(unlockRecipientOpts, function(err2, res2) {
            if (err2) return cb(err2);
            return cb(null, easySendResult);
          });
        });
      });
    };

    service.sendSMS = function(recipient, url, cb) {
      var smsPlugin = null;
      try {
        smsPlugin = $window.sms;
      } catch(ex) {
        return cb(ex);
      }
      var options = {
        android: {intent: 'INTENT'}
      };

      smsPlugin.send(recipient.toString(),
        service._getBody(url),
        options,
        service._onSuccess(cb),
        service._onFailure(cb));
    };

    service.sendEmail = function(recipient, url, cb) {
      try {
        var emailPlugin = null;
      } catch(ex) {
        return cb(ex);
      }
      emailPlugin = $window.cordova.plugins.email;
      emailPlugin.open({to: [recipient], body: service._getBody(url)}, service._onSuccess(cb));
    };

    service._getBody = function(url) {
      return 'You\'ve been sent some merit. Click the link to redeem it!. ' + url;
    };

    service._onSuccess = function(cb) { return function(res) { return cb(null, res); }; };
    service._onFailure = function(cb) { return function(err) { return cb(err); }; };

    return service;
});
