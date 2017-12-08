'use strict';

var $ = require('preconditions').singleton();
var _ = require('lodash');
var async = require('async');
var log = require('npmlog');
log.debug = log.verbose;

var BlockchainExplorer = require('./blockchainexplorer');
var Storage = require('./storage');
var MessageBroker = require('./messagebroker');
var Lock = require('./lock');

var Notification = require('./model/notification');

var WalletService = require('./server');

function BlockchainMonitor() {};

BlockchainMonitor.prototype.start = function(opts, cb) {
  console.warn("**** Starting Blockchain Monitor");
  opts = opts || {};

  var self = this;

  async.parallel([

    function(done) {
      self.explorers = {};
      _.map(['testnet'], function(network) {
        var explorer;
        if (opts.blockchainExplorers) {
          explorer = opts.blockchainExplorers[network];
        } else {
          var config = {}
          if (opts.blockchainExplorerOpts && opts.blockchainExplorerOpts[network]) {
            config = opts.blockchainExplorerOpts[network];
          }
          var explorer = new BlockchainExplorer({
            provider: config.provider,
            network: network,
            url: config.url,
            userAgent: WalletService.getServiceVersion(),
          });
        }
        $.checkState(explorer);
        self._initExplorer(network, explorer);
        self.explorers[network] = explorer;
      });
      done();
    },
    function(done) {
      if (opts.storage) {
        self.storage = opts.storage;
        done();
      } else {
        self.storage = new Storage();
        self.storage.connect(opts.storageOpts, done);
      }
    },
    function(done) {
      self.messageBroker = opts.messageBroker || new MessageBroker(opts.messageBrokerOpts);
      done();
    },
    function(done) {
      self.lock = opts.lock || new Lock(opts.lockOpts);
      done();
    },
  ], function(err) {
    if (err) {
      log.error(err);
    }
    return cb(err);
  });
};

BlockchainMonitor.prototype._initExplorer = function(network, explorer) {
  var self = this;

  var socket = explorer.initSocket();

  socket.on('connect', function() {
    log.info('Connected to ' + explorer.getConnectionInfo());
    socket.emit('subscribe', 'inv');
  });
  socket.on('connect_error', function() {
    log.error('Error connecting to ' + explorer.getConnectionInfo());
  });
  socket.on('tx', _.bind(self._handleIncomingTx, self));
  socket.on('block', _.bind(self._handleNewBlock, self, network));
  socket.on('rawreferraltx', _.bind(self._handleReferral, self));
};

BlockchainMonitor.prototype._handleReferral = function(data) {
  const self = this;

  if (!data) return;

  self.storage.fetchReferralByCodeHash(data.codeHash, function(err, rtx) {
    if (err) {
      log.error('Could not fetch referral from the db');
      return;
    }

    if (!rtx) return;

    self.storage.storeReferral(data, function(err) {
      if (err) log.error('Could not store referral');

      const args = data;

      const notification = Notification.create({
        type: 'NewIncomingReferralTx',
        data: args,
      });
      self._storeAndBroadcastNotification(notification);
    });
  });
};

BlockchainMonitor.prototype._handleThirdPartyBroadcasts = function(data, processIt) {
  var self = this;
  if (!data || !data.txid) return;

  self.storage.fetchTxByHash(data.txid, function(err, txp) {
    if (err) {
      log.error('Could not fetch tx from the db');
      return;
    }
    if (!txp || txp.status != 'accepted') return;

    var walletId = txp.walletId;

    if (!processIt) {
      log.info('Detected broadcast ' + data.txid + ' of an accepted txp [' + txp.id + '] for wallet ' + walletId + ' [' + txp.amount + 'micros ]');
      return setTimeout(self._handleThirdPartyBroadcasts.bind(self, data, true), 20 * 1000);
    }

    log.info('Processing accepted txp [' + txp.id + '] for wallet ' + walletId + ' [' + txp.amount + 'micros ]');

    txp.setBroadcasted();

    self.storage.softResetTxHistoryCache(walletId, function() {
      self.storage.storeTx(self.walletId, txp, function(err) {
        if (err)
          log.error('Could not save TX');

        var args = {
          txProposalId: txp.id,
          txid: data.txid,
          amount: txp.getTotalAmount(),
        };

        var notification = Notification.create({
          type: 'OutgoingTxByThirdParty',
          data: args,
          walletId: walletId,
        });
        self._storeAndBroadcastNotification(notification);
      });
    });
  });
};

BlockchainMonitor.prototype._handleIncomingPayments = function(data) {
  var self = this;
  if (!data || !data.vout) return;

  // Let's format the object to be easier to process below.
  var outs = _.compact(_.map(data.vout, function(v) {
        var addr = _.keys(v)[0];

        return {
          address: addr,
          amount: +v[addr]
        };
  }));

  // Let's roll up any vouts that go to the same address.
  // TODO: Probably a more efficient way to do the below.
  var filteredOutputs = [];
  _.forEach(outs, (out) => {
    var oIndex = _.findIndex(filteredOutputs, {address: out.address});
    if (filteredOutputs[oIndex]) {
      var accumulatedOutput = filteredOutputs[oIndex];
      accumulatedOutput.amount += out.amount;
      filteredOutputs.splice(oIndex, 1, accumulatedOutput);
    } else {
      filteredOutputs.push(out);
    }   
  });

  if (_.isEmpty(filteredOutputs)) return;

  async.each(filteredOutputs, function(out, next) {
    self.storage.fetchAddress(out.address, function(err, address) {
      if (err) {
        log.error('Could not fetch addresses from the db');
        return next(err);
      }
      if (!address || address.isChange) return next(null);

      var walletId = address.walletId;
      var notificationType = data.isCoinbase ? 'IncomingCoinbase' : 'IncomingTx';
      
      log.info(notificationType + ' for wallet ' + walletId + ' [' + out.amount + ' micros -> ' + out.address + ']');

      var fromTs = Date.now() - 24 * 3600 * 1000;
      self.storage.fetchNotifications(walletId, null, fromTs, function(err, notifications) {
        if (err) return next(err);
        var alreadyNotified = _.some(notifications, function(n) {
          return n.type == notificationType && n.data && n.data.txid == data.txid;
        });
        if (alreadyNotified) {
          log.info('The incoming tx ' + data.txid + ' was already notified');
          return next(null);
        }

        var notification = Notification.create({
          type: notificationType,
          data: {
            txid: data.txid,
            address: out.address,
            amount: out.amount,
          },
          walletId: walletId,
        });
        self.storage.softResetTxHistoryCache(walletId, function() {
          self._updateActiveAddresses(address, function() {
            self._storeAndBroadcastNotification(notification, next);
          });
        });
      });
    });
  }, function(err) {
    return;
  });
};

BlockchainMonitor.prototype._updateActiveAddresses = function(address, cb) {
  var self = this;

  self.storage.storeActiveAddresses(address.walletId, address.address, function(err) {
    if (err) {
      log.warn('Could not update wallet cache', err);
    }
    return cb(err);
  });
};

BlockchainMonitor.prototype._handleIncomingTx = function(data) {
  this._handleThirdPartyBroadcasts(data);
  this._handleIncomingPayments(data);
};

BlockchainMonitor.prototype._notifyNewBlock = function(network, hash) {
  var self = this;

  log.info('New ' + network + ' block: ' + hash);
  var notification = Notification.create({
    type: 'NewBlock',
    walletId: network, // use network name as wallet id for global notifications
    data: {
      hash: hash,
      network: network,
    },
  });

  self.storage.softResetAllTxHistoryCache(function() {
    self._storeAndBroadcastNotification(notification, function(err) {
      return;
    });
  });
};

BlockchainMonitor.prototype._handleTxConfirmations = function(network, hash) {
  var self = this;

  function processTriggeredSubs(subs, cb) {
    async.each(subs, function(sub, cb) {
      log.info('New tx confirmation ' + sub.txid);
      sub.isActive = false;
      self.storage.storeTxConfirmationSub(sub, function(err) {
        if (err) return cb(err);

        var notification = Notification.create({
          type: 'TxConfirmation',
          walletId: sub.walletId,
          creatorId: sub.copayerId,
          data: {
            txid: sub.txid,
            network: network,
            // TODO: amount
          },
        });
        self._storeAndBroadcastNotification(notification, cb);
      });
      return cb(null);
    });
  };

  var explorer = self.explorers[network];
  if (!explorer) return;

  explorer.getTxidsInBlock(hash, function(err, txids) {
    if (err) {
      log.error('Could not fetch txids from block ' + hash, err);
      return;
    }

    self.storage.fetchActiveTxConfirmationSubs(null, function(err, subs) {
      if (err) return;
      if (_.isEmpty(subs)) return;
      var indexedSubs = _.keyBy(subs, 'txid');
      var triggered = [];
      _.each(txids, function(txid) {
        if (indexedSubs[txid]) triggered.push(indexedSubs[txid]);
      });
      processTriggeredSubs(triggered, function(err) {
        if (err) {
          log.error('Could not process tx confirmations', err);
        }
        return;
      });
    });
  });
};

BlockchainMonitor.prototype._handleReferralConfirmations = function(network, hash) {
  const self = this;

  const explorer = self.explorers[network];
  if (!explorer) return;

  explorer.getReferralsInBlock(hash, function(err, referrals) {
    if (err) {
      log.error('Could not fetch referrals for block');
      return;
    }
    if (_.isEmpty(referrals)) return;

    self.storage.fetchActiveReferralConfirmationSubs(function (err, subs) {
      if (err) {
        log.error('Could not fetch referral confirmation subscriptions');
        return;
      }

      const indexedSubs = _.keyBy(subs, 'codeHash');
      const triggered = _.reduce(referrals, function(acc, reftx) {
        if (!indexedSubs[reftx]) return acc;

        acc.push(indexedSubs[reftx]);
        return acc;
      }, []);

      async.each(triggered, function(sub, cb) {
        log.info('New referral confirmation ' + sub.codeHash);
        sub.isActive = false;
        self.storage.storeTxConfirmationSub(sub, function(err) {
          if (err) {
            log.error(`Could not update confirmation with codeHash: ${sub.codeHash}`);
            return cb(err);
          }

          const notification = Notification.create({
            type: 'ReferralConfirmation',
            creatorId: sub.copayerId,
            walletId: sub.walletId,
            data: sub,
          });
          self._storeAndBroadcastNotification(notification, function () {
            log.info(`Referral confirmation with code ${sub.codeHash} successfully sent`);
          });
        });
        return cb(null);
      });
    });
  });
};

BlockchainMonitor.prototype._handleVaultConfirmations = function(network, hash) {
  const self = this;

  const explorer = self.explorers[network];
  if (!explorer) return;

  explorer.getTxidsInBlock(hash, function(err, txids) {
    if (err) {
      log.error('Could not fetch txids from block ' + hash, err);
      return;
    }

    log.info('Received tx in block to check vaults: ', txids);
    async.each(txids, function(txId, cb) {
      log.info(`Checking if TX with id ${txId} is vault TX`);

      self.storage.fetchVaultByInitialTxId(txId, function(err, tx) {
        if (err) {
          log.error(`Error while fetching data for vault with txid: ${txId}`);
          return;
        }

        if (!tx) {
          return;
        }

        self.storage.setVaultConfirmed(tx, txId, function (err, result) {
          if (err) {
            log.error(err);
            log.error(`Could not update vault with txId: ${txId}`)
            return;
          }

          const notification = Notification.create({
            type: 'VaultConfirmation',
            creatorId: tx.copayerId,
            walletId: tx.walletId,
            data: result,
          });

          self._storeAndBroadcastNotification(notification, function () {
            log.info(`Vault confirmation with code ${txId} successfully sent`);
          });
        });
      });
      return cb(null);
    });
  });
};

BlockchainMonitor.prototype._handleNewBlock = function(network, hash) {
  this._notifyNewBlock(network, hash);
  this._handleTxConfirmations(network, hash);
  this._handleReferralConfirmations(network, hash);
  this._handleVaultConfirmations(network, hash);
};

BlockchainMonitor.prototype._storeAndBroadcastNotification = function(notification, cb) {
  var self = this;

  self.storage.storeNotification(notification.walletId, notification, function() {
    self.messageBroker.send(notification)
    if (cb) return cb();
  });
};

module.exports = BlockchainMonitor;
