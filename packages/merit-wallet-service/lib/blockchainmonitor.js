'use strict';

var $ = require('preconditions').singleton();
var _ = require('lodash');
var async = require('async');
var log = require('npmlog');
log.debug = log.verbose;

var Meritcore = require('meritcore-lib');
var BlockchainExplorer = require('./blockchainexplorer');
var Storage = require('./storage');
var MessageBroker = require('./messagebroker');
var Lock = require('./lock');

var Notification = require('./model/notification');

var WalletService = require('./server');

function BlockchainMonitor() {}

BlockchainMonitor.prototype.start = function(opts, cb) {
  console.warn('**** Starting Blockchain Monitor');
  opts = opts || {};

  var self = this;

  self.pushNotificationServiceEnabled = !!opts.pushNotificationsOpts;
  self.emailNotificationServiceEnabled = !!opts.emailOpts;

  async.parallel(
    [
      function(done) {
        self.explorers = {};
        _.map(['testnet'], function(network) {
          var explorer;
          if (opts.blockchainExplorers) {
            explorer = opts.blockchainExplorers[network];
          } else {
            var config = {};
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
          self.storage.connect(
            opts.storageOpts,
            done,
          );
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
    ],
    function(err) {
      if (err) {
        log.error(err);
      }
      return cb(err);
    },
  );
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

  socket.on('tx', _.bind(self._handleIncomingTx, self, network));
  socket.on('block', _.bind(self._handleNewBlock, self, network));
  socket.on('referral', _.bind(self._handleIncomingReferral, self));
};

BlockchainMonitor.prototype._handleIncomingTx = function(network, data) {
  const self = this;

  const identity = {
    type: 'INCOMING_TX',
    txid: data.txid,
    blockHash: null,
  };
  self._uniqueMessageProcessing(identity, function() {
    self._handleThirdPartyBroadcasts(data);
    self._handleIncomingPayments(data, network);
  });
};

BlockchainMonitor.prototype._handleNewBlock = function(network, hash) {
  const self = this;
  const identity = {
    type: 'NEW_BLOCK',
    blockHash: hash,
    txid: null,
  };
  self._uniqueMessageProcessing(identity, function() {
    self._notifyNewBlock(network, hash);

    const explorer = self.explorers[network];
    if (!explorer) {
      return;
    }

    explorer.getBlock(hash, (err, block) => {
      if (err) {
        log.error('Could not fetch block', hash, err);
        return;
      }

      self._handleTxConfirmations(network, block.tx);
      self._handleReferralConfirmations(network, block.referrals);
      self._handleVaultConfirmations(network, block.tx);
      self._handleMinedInvites(network, block.invites);
    });
  });
};

/**
 * Handles mined invites for a new block
 * @param network {string} Type of network. Can be either "livenet" or "testnet"
 * @param invites {Array<string>} Array of transaction IDs of the mined invites.
 * @private
 */
BlockchainMonitor.prototype._handleMinedInvites = function(network, invites) {
  if (!invites || !invites.length) {
    // Nothing to process
    return;
  }

  const explorer = this.explorers[network];

  if (!explorer) {
    return;
  }

  invites.forEach(inviteTxId => {
    explorer.getTransaction(inviteTxId, (err, tx) => {
      if (err || !tx) {
        console.log('Unable to fetch invite transaction: ', inviteTxId);
        console.log(err);
        return;
      }

      this._handleIncomingPayments(tx, network);
    });
  });
};

BlockchainMonitor.prototype._handleIncomingReferral = function(data) {
  const self = this;

  if (!data) return;

  const identity = {
    type: 'INCOMING_REFERRAL',
    txid: data.hash,
    blockHash: null,
  };
  self._uniqueMessageProcessing(identity, function() {
    self.storage.fetchReferralByCodeHash(data.address, function(err, referral) {
      if (err) {
        log.error('Could not fetch referral from the db');
        return;
      }

      if (!referral) {
        log.info(`_handleIncomingReferral: referral ${data.hash} not found`);
        return;
      }

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
  });
};

BlockchainMonitor.prototype._uniqueMessageProcessing = function(identity, cb) {
  const self = this;

  self.storage.checkKnownMessages(identity, function(err, found) {
    if (err && err.code == 11000) { //Duplicate entry code
      log.info('Message is already processed');
      return;
    }

    if (err) {
      log.warn('Could not check message', identity, err);
      return;
    }

    if (found) {
      const logData = identity.txid ? `transaction ${identity.txid}` : `block ${identity.blockHash}`;
      log.info(`Message of type ${identity.type} for ${logData} is already processed`);
      return;
    }

    return cb();
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

    if (!txp || txp.status != 'accepted') {
      log.info('Transaction is not in accepted state, skipping');
      return;
    }

    var walletId = txp.walletId;

    if (!processIt) {
      log.info(
        `Detected broadcast ${data.txid} of an accepted txp [${txp.id}] for wallet ${walletId} [${txp.amount} ${
          !txp.isInvite ? 'micros' : 'invites'
        } ]`,
      );
      return setTimeout(self._handleThirdPartyBroadcasts.bind(self, data, true), 20 * 1000);
    }

    log.info(
      `Processing accepted txp [${txp.id}] for wallet ${walletId} [ ${txp.amount} ${
        !txp.isInvite ? 'micros' : 'invites'
      } ]`,
    );

    txp.setBroadcasted();

    self.storage.softResetTxHistoryCache(walletId, function() {
      self.storage.storeTx(self.walletId, txp, function(err) {
        if (err) log.error('Could not save TX');

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

BlockchainMonitor.prototype._handleIncomingPayments = function(data, network) {
  const self = this;

  if (!data || !data.vout) return;

  // Let's format the object to be easier to process below.
  const outs = _.reduce(
    data.vout,
    function(acc, out, index) {
      if (out.isChangeOutput) {
        return acc;
      }

      const address = _.keys(out)[0];
      const amount = out[address];

      return acc.concat({
        address,
        amount,
        index,
      });
    },
    [],
  );

  // Let's roll up any vouts that go to the same address.
  // TODO: Probably a more efficient way to do the below.
  //
  const filteredOutputs = [];

  _.forEach(outs, out => {
    const oIndex = _.findIndex(filteredOutputs, {
      address: out.address,
    });

    if (filteredOutputs[oIndex]) {
      const accumulatedOutput = filteredOutputs[oIndex];
      accumulatedOutput.amount += out.amount;
      filteredOutputs.splice(oIndex, 1, accumulatedOutput);
    } else {
      filteredOutputs.push(out);
    }
  });

  if (_.isEmpty(filteredOutputs)) return;

  const explorer = this.explorers[network];

  async.eachSeries(
    filteredOutputs,
    function(out, next) {
      let address, isAddressConfirmed;

      async.series(
        [
          // 1. Fetch the address from storage
          cb => {
            self.storage.fetchAddress(out.address, (err, addr) => {
              if (err || !addr) {
                log.error('Could not fetch addresses from the db');
                return cb(err || 'Address not found');
              }

              if (addr.isChange) {
                log.info('Address is not registered for notifications, skipping');
                return cb('Address not registered for notifications');
              }

              address = addr;
              cb();
            });
          },

          // 2. Check if the address is confirmed IF NEEDED
          cb => {
            // we only need to know if the address is confirmed if we're handling invites
            if (!data.isInvite) {
              return cb();
            }

            explorer.getUtxos([out.address], true, (err, utxos) => {
              utxos = utxos || [];

              // Check if the recipient address is unlocked; by checking if it has
              // received any invites in the past.
              isAddressConfirmed = utxos.some(u => u.isInvite && u.txid !== data.txid);

              cb();
            });
          },

          // 3. Set the appropriate notification type
          cb => {
            const walletId = address.walletId;

            let notificationType = '';

            if (data.isCoinbase) {
              if (data.isInvite) {
                notificationType = 'MinedInvite';
              } else if (out.index === 0) {
                notificationType = 'MiningReward';
              } else {
                notificationType = 'GrowthReward';
              }
            } else if (data.isInvite) {
              if (isAddressConfirmed) {
                notificationType = 'IncomingInvite';
              } else {
                notificationType = 'WalletUnlocked';
              }
            } else {
              notificationType = 'IncomingTx';
            }

            log.info(
              `${notificationType} for wallet ${walletId} [ ${out.amount} ${!data.isInvite ? 'micros' : 'invites'} -> ${
                out.address
              } ]`,
            );

            const fromTs = Date.now() - 24 * 3600 * 1000;
            self.storage.fetchNotifications(walletId, null, fromTs, function(err, notifications) {
              if (err) return cb(err);

              const alreadyNotified = _.some(
                notifications,
                n => n.type === notificationType && n.data && n.data.txid === data.txid,
              );

              if (alreadyNotified) {
                log.info(`The incoming tx ${data.txid} was already notified`);
                return cb();
              }

              const notification = Notification.create({
                type: notificationType,
                data: {
                  txid: data.txid,
                  address: out.address,
                  amount: out.amount,
                  isInvite: data.isInvite,
                },
                walletId: walletId,
              });

              self.storage.softResetTxHistoryCache(walletId, function() {
                self._updateActiveAddress(address, function() {
                  self._storeAndBroadcastNotification(notification, cb);
                });
              });
            });
          },
        ],
        err => {
          if (err) {
            // If an error occurs in our async.series,
            // let's send it up the chain to async.seriesEach
            next(err);
          } else {
            next(null);
          }
        },
      );
    },
    err => {},
  );
};

BlockchainMonitor.prototype._updateActiveAddress = function(address, cb) {
  var self = this;

  var addrs = [address.address];
  self.storage.storeActiveAddresses(address.walletId, addrs, function(err) {
    if (err) {
      log.warn('Could not update wallet cache', err);
    }
    return cb(err);
  });
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

// handle txs that were confirmed (i.e. added to a block)
// set these subscriptions as inactive
// and send TxConfirmation notification
BlockchainMonitor.prototype._handleTxConfirmations = function(network, txids) {
  const processTriggeredSubs = (subs, cb) => {
    async.each(subs, function(sub, cb) {
      log.info('New tx confirmation ' + sub.txid);
      sub.isActive = false;

      this.storage.storeTxConfirmationSub(sub, err => {
        if (err) {
          return cb(err);
        }

        const notification = Notification.create({
          type: 'TxConfirmation',
          walletId: sub.walletId,
          creatorId: sub.copayerId,
          data: {
            txid: sub.txid,
            network: network,
            // TODO: amount
          },
        });

        this._storeAndBroadcastNotification(notification, cb);
      });
      return cb(null);
    });
  };

  this.storage.fetchActiveTxConfirmationSubs(null, function(err, subs) {
    if (err) return;
    if (_.isEmpty(subs)) return;
    const indexedSubs = _.keyBy(subs, 'txid');
    const triggered = [];
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
};

// TODO: update this method and methods to set subscriptions
// to use hash or address of referral instead codeHash
BlockchainMonitor.prototype._handleReferralConfirmations = function(network, referrals) {
  if (_.isEmpty(referrals)) {
    return;
  }

  this.storage.fetchActiveReferralConfirmationSubs((err, subs) => {
    if (err) {
      log.error('Could not fetch referral confirmation subscriptions');
      return;
    }

    const indexedSubs = _.keyBy(subs, 'address');
    const triggered = _.reduce(
      referrals,
      function(acc, reftx) {
        if (!indexedSubs[reftx]) return acc;

        acc.push(indexedSubs[reftx]);
        return acc;
      },
      [],
    );

    async.each(triggered, (sub, cb) => {
      log.info('New referral confirmation ' + sub.address);
      sub.isActive = false;
      this.storage.storeTxConfirmationSub(sub, err => {
        if (err) {
          log.error(`Could not update confirmation with address: ${sub.address}`);
          return cb(err);
        }

        const notification = Notification.create({
          type: 'ReferralConfirmation',
          creatorId: sub.copayerId,
          walletId: sub.walletId,
          data: sub,
        });

        this._storeAndBroadcastNotification(notification, () => {
          log.info(`Referral confirmation with code ${sub.address} successfully sent`);
        });
      });
      return cb(null);
    });
  });
};

BlockchainMonitor.prototype._handleVaultConfirmations = function(network, txids) {
  async.each(txids, (txId, cb) => {
    log.info(`Checking if TX with id ${txId} is vault TX`);

    this.storage.fetchVaultByInitialTxId(txId, (err, tx) => {
      if (err) {
        log.error(`Error while fetching data for vault with txid: ${txId}`);
        return;
      }

      if (!tx) {
        return;
      }

      this.storage.setVaultConfirmed(tx, (err, result) => {
        if (err) {
          log.error(err);
          log.error(`Could not update vault with txId: ${txId}`);
          return;
        }

        const notification = Notification.create({
          type: 'VaultConfirmation',
          creatorId: tx.copayerId,
          walletId: tx.walletId,
          data: result,
        });

        this._storeAndBroadcastNotification(notification, function() {
          log.info(`Vault confirmation with code ${txId} successfully sent`);
        });
      });
    });

    return cb(null);
  });
};

BlockchainMonitor.prototype._storeAndBroadcastNotification = function(notification, cb) {
  if (!(this.pushNotificationServiceEnabled || this.emailNotificationServiceEnabled)) {
    return cb();
  }

  this.storage.storeNotification(notification, (err, created) => {
    if (created) {
      log.info('Notification is created, broadcasting.');
      this.messageBroker.send(notification);
    } else {
      log.info('Notification is already created, skipping.');
    }
    if (cb) {
      return cb();
    }
  });
};

module.exports = BlockchainMonitor;
