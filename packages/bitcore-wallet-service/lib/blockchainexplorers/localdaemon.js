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

function LocalDaemon(node) {
  this.node = node;
};

LocalDaemon.prototype.validateEasyReceipt = function(easyScript, cb) {
  var self = this;
  
  this.node.validateEasyReceipt(easyScript, function(err, easyReceipt) {
    if (err) {
      return new Error("Could not validate easyReceipt: " + err);
    }

    // If there is no receipt, then the easyReceipt is valid.  Let's send it to callback.
    return cb(err, easyReceipt);
  });
};

module.exports = LocalDaemon;