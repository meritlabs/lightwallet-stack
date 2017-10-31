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
};

var _parseMeritdErr = function(err, res) {
  // This is an error received directly from the MeritD that was called. 
  if (err) {
    log.warn('Error returned from Meritd: ', err);
    log.warn("Meritd returned: " + res);
    return(err);
  }
  return null;
};

LocalDaemon.prototype.getInputForEasySend = function(easyScript, cb) {
  var self = this;
  
  this.node.getInputForEasySend(easyScript, function(err, easyReceipt) {
    if (err) {
      return new Error("Could not validate easyReceipt: " + err);
    }

    // If there is no receipt, then the easyReceipt is valid.  Let's send it to callback.
    return cb(err, easyReceipt);
  });
};

LocalDaemon.prototype.unlockWallet = function(referralCode, unlockAddress, cb) {
  var self = this;

  this.node.unlockWallet(referralCode, unlockAddress, function(err, response) {
    if (err) {
      return cb(_parseMeritdErr(err, response));
    }
    return cb(null, response);
  });
  
};


module.exports = LocalDaemon;