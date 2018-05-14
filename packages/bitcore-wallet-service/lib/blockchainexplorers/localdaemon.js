/**
 * This is the new (proposed) approach for accessing the blockchain in a more reliable and fast way.
 * Instead of utilizing a blockchain explorer as an intermediary for the WalletService, Merit plans
 * to ensure that one (or multiple) merit daemons are accessible directly by the walletService.
 *
 * Eventually, the WalletService and the Blockchain Explorer should utilize the same shared Lib for how
 * they interact with the local daemon.
 */
'use strict';

var bitcore = require('bitcore-lib');
var _ = bitcore.deps._;
var $ = bitcore.util.preconditions;
var async = require('async');
var _ = require('lodash');
var log;

function LocalDaemon(node) {
  this.node = node;
  log = this.node.log; //This daemon requires BWS to be run through bitcore-node, which is a requirement going forward.
}

var _parseMeritdErr = function(err, res) {
  // This is an error received directly from the MeritD that was called.
  if (err) {
    let message, code;

    if (err.code) {
      log.warn('Local Daemon Error: ' + err.message + '. Code:' + err.code);

      message = `${err.message}. Code: ${err.code}`;
      code = 400;
    } else {
      log.warn('Local Daemon Error: ');
      log.warn(err.message);
      log.warn(err.stack);

      message = err.message;
      code = 500;
    }

    return { message, code };
  }

  return null;
};

LocalDaemon.prototype.getInputForEasySend = function(easyScript, cb) {
  var self = this;

  this.node.getInputForEasySend(easyScript, function(err, easyReceipt) {
    if (err) {
      return new Error('Could not validate easyReceipt: ' + err);
    }

    // If there is no receipt, then the easyReceipt is valid.  Let's send it to callback.
    return cb(err, easyReceipt);
  });
};

LocalDaemon.prototype.sendReferral = function(rawReferral, cb) {
  var self = this;

  this.node.sendReferral(rawReferral, function(err, response) {
    return cb(_parseMeritdErr(err, response), response);
  });
};


LocalDaemon.prototype.getPendingReferrals  = function(addresses) {
    return this.node.getPendingReferrals(addresses);
};
LocalDaemon.prototype.getAcceptedReferrals = function(addresses) {
    return this.node.getAcceptedReferrals(addresses);
};
LocalDaemon.prototype.getAddressMempool = function(addresses) {
    return this.node.getAddressMempool(addresses);
};



module.exports = LocalDaemon;
