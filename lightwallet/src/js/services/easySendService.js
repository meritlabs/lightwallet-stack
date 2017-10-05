'use string';
angular.module('copayApp.services')
  .factory('easySendService', function easySendServiceFactory($rootScope, $timeout, $log, $state, bitcore, lodash, storageService) {
    
    var service = {};
    service.createEasySendScriptHash = function(wallet, cb) {

      // TODO: get network and a passphrase
      var opts = {
        network: 'testnet',
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
