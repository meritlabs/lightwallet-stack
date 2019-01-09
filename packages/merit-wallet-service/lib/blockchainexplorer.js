'use strict';

var _ = require('lodash');
var $ = require('preconditions').singleton();
var log = require('npmlog'); // Default to NPM Log
log.debug = log.verbose;

var Insight = require('./blockchainexplorers/insight');

var PROVIDERS = {
  insight: {
    //'livenet': 'http://127.0.0.1:3131', //Does not exist for now.
    testnet: 'http://127.0.0.1:3001',
  },
};

function BlockChainExplorer(opts) {
  $.checkArgument(opts);

  var provider = opts.provider || 'insight';
  var network = opts.network || 'testnet';
  var log = opts.log || log; //If we don't have a unified logger, use npmlog.

  $.checkState(PROVIDERS[provider], 'Provider ' + provider + ' not supported');
  $.checkState(
    _.includes(_.keys(PROVIDERS[provider]), network),
    'Network ' + network + ' not supported by this provider',
  );

  var url = opts.url || PROVIDERS[provider][network];

  switch (provider) {
    case 'insight':
      return new Insight({
        network: network,
        url: url,
        apiPrefix: opts.apiPrefix,
        userAgent: opts.userAgent,
        log: opts.log,
      });
    default:
      throw new Error('Provider ' + provider + ' not supported.');
  }
}

module.exports = BlockChainExplorer;
