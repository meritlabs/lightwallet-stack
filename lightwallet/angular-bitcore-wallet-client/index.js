var bwcModule = angular.module('bwcModule', []);
var Client = require('../../packages/bitcore-wallet-client');

bwcModule.constant('MODULE_VERSION', '1.0.0');

bwcModule.provider("bwcService", function() {
  var provider = {};

  provider.$get = function() {
    var service = {};

    service.getBitcore = function() {
      return Client.Bitcore;
    };

    service.getErrors = function() {
      return Client.errors;
    };

    service.getSJCL = function() {
      return Client.sjcl;
    };

    service.buildTx = Client.buildTx;
    service.parseSecret = Client.parseSecret;
    service.Client = Client;

    service.getUtils = function() {
      return Client.Utils;
    };

    service.getClient = function(walletData, opts) {
      opts = opts || {};

      if (!opts.bwsurl) {
        console.log("No BWSURL passed into the bwsService to get the client!");
      }

      //note opts use `bwsurl` all lowercase;
      //setting a backup-backup bwsUrl because this module won't have access to the configService
      //TODO: This client probably should not return the client without a proper BWSURL.
      var bwc = new Client({
        baseUrl: opts.bwsurl || 'https://mws.merit.me/mws/api',
        verbose: opts.verbose,
        timeout: 100000,
        transports: ['polling'],
      });

      if (walletData)
        bwc.import(walletData, opts);
      return bwc;
    };
    return service;
  };

  return provider;
});
