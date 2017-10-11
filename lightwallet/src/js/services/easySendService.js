'use strict';

angular.module('copayApp.services')
  .factory('easySendService', function easySendServiceFactory($rootScope, $timeout, $log, $state, bitcore, lodash, storageService) {
    
    var service = {};
    service.createEasySendScriptHash = function(wallet, cb) {

      // TODO: get a passphrase
      var opts = {
        network: wallet.credentials.network,
        passphrase: 'donkey'
      }

      wallet.buildEasySendScriptHash(opts, function(err, result) {
        if (err) {
          return cb(err);
        }
        return cb(null, result);
      });
    }
    return service;
});
