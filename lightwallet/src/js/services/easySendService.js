'use strict';

angular.module('copayApp.services')
  .factory('easySendService', function easySendServiceFactory($rootScope, $timeout, $log, $state, bitcore, lodash, ledger, storageService) {

    var service = {};
    service.createEasySendScriptHash = function(wallet, cb) {

      // TODO: get a passphrase
      var opts = {
        network: wallet.credentials.network,
        passphrase: 'donkey'
      }

      wallet.buildEasySendScriptHash(opts, function(err, easySendResult) {
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
            unlockCode: res1.shareCode,
            address: easySendResult.receiverPubKey.toAddress().toString(),
            network: opts.network
          };

          return wallet.unlockAddress(unlockRecipientOpts, function(err2, res2) {
            if (err2) return cb(err2);
            return cb(null, easySendResult);
          });
        });
      });
    }
    return service;
});
