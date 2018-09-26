/**
 * This is the new (proposed) approach for accessing the blockchain in a more reliable and fast way.
 * Instead of utilizing a blockchain explorer as an intermediary for the WalletService, Merit plans
 * to ensure that one (or multiple) Merit daemons are accessible directly by the walletService.
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
const { promisify } = require('util');

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



LocalDaemon.prototype.getMempoolReferrals  = function(addresses) {
    return this.node.getMempoolReferrals(addresses);
};

LocalDaemon.prototype.getBlockchainReferrals = function(addresses) {
    return this.node.getBlockchainReferrals(addresses);
};

/**
 * Receive addresses for requests that were accepted, but not in blockchain yet
 * @param addresses that requests were sent for
 * @return Array of addresses that were accepted
 */
LocalDaemon.prototype.getMempoolAcceptedAddresses = async function(addresses) {
    let acceptedAddresses = [];

    const txs = (await this.node.getAddressMempool(addresses))
        .filter(t => t.isInvite && t.satoshis < 0); //is invite tx and sent FROM given address

    await Promise.all(_.map(txs, async (t) => {
        let res = await promisify(this.node.getDetailedTransaction)(t.txid);
        acceptedAddresses.push(res.outputs[0].address);
    }));

    return acceptedAddresses;
};

LocalDaemon.prototype.getCommunityRank = function(addresses) {
    return this.node.getCommunityRank(addresses);
};


LocalDaemon.prototype.getCommunityLeaderboard = function(limit) {
    return this.node.getCommunityLeaderboard(limit);
};

LocalDaemon.prototype.getAddressBalance = async function(addresses, options) {
  const {err, result} = await promisify(this.node.getAddressBalance.bind(this.node))(addresses, options);
  if(err) throw err;
  return result;
};



module.exports = LocalDaemon;
