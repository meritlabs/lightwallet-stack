'use strict';

angular.module('copayApp.services').factory('feeService', function($log, $timeout, $stateParams, bwcService, walletService, configService, gettext, lodash, txFormatService, gettextCatalog) {
  var root = {};

  var CACHE_TIME_TS = 60; // 1 min

  // Constant fee options to translate
  root.feeOpts = {
    urgent: gettext('Urgent'),
    priority: gettext('Priority'),
    normal: gettext('Normal'),
    economy: gettext('Economy'),
    superEconomy: gettext('Super Economy'),
    custom: gettext('Custom')
  };

  var cache = {
    updateTs: 0,
  };

  root.getCurrentFeeLevel = function() {
    return configService.getSync().wallet.settings.feeLevel || 'normal';
  };


  root.getFeeRate = function(network, feeLevel, cb) {

    if (feeLevel == 'custom') return cb();

    network = network || 'livenet';

    root.getFeeLevel(network, function(err, levels, fromCache) {
      if (err) return cb(err);

      var feeLevelRate = lodash.find(levels[network], {
        level: feeLevel
      });

      if (!feeLevelRate || !feeLevelRate.feePerKB) {
        return cb({
          message: gettextCatalog.getString("Could not get dynamic fee for level: {{feeLevel}} on network {{network}}", {
            feeLevel: feeLevel,
            network: network
          })
        });
      }

      var feeRate = feeLevelRate.feePerKB;

      if (!fromCache) $log.debug('Dynamic fee: ' + feeLevel + '/' + network + ' ' + (feeLevelRate.feePerKB / 1000).toFixed() + ' Micros/B');

      return cb(null, feeRate);
    });
  };

  root.getCurrentFeeRate = function(network, cb) {
    return root.getFeeRate(network, root.getCurrentFeeLevel(), cb);
  };

  root.getFeeLevel = function(network ,cb) {

    if (cache.updateTs > Date.now() - CACHE_TIME_TS * 1000) {
      return cb(null, cache.data, true);
    }

    var opts = {};
    opts.bwsurl = configService.getDefaults().bws.url;
    var walletClient = bwcService.getClient(null, opts);
    var unitName = configService.getSync().wallet.settings.unitName;

    walletClient.getFeeLevels(network, function(err, level) {
        if (err) {
          return cb(gettextCatalog.getString('Could not get dynamic fee'));
        }

        cache.updateTs = Date.now();
        cache.data = cache.data || {};
        cache.data[network] = level;

        return cb(null, cache.data);
      });
  };


  return root;
});
