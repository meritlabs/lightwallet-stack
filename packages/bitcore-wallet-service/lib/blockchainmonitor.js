'use strict';

var $ = require('preconditions').singleton();
var _ = require('lodash');
var async = require('async');
var log = require('npmlog');
log.debug = log.verbose;

var Bitcore = require('bitcore-lib');
var BlockchainExplorer = require('./blockchainexplorer');
var Storage = require('./storage');

var WalletService = require('./server');

function BlockchainMonitor() {}

BlockchainMonitor.prototype.start = function (opts, cb) {
  console.warn('**** Starting Blockchain Monitor');
  opts = opts || {};

  var self = this;

  async.parallel(
    [
      function (done) {
        self.explorers = {};
        _.map(['testnet'], function (network) {
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
      function (done) {
        if (opts.storage) {
          self.storage = opts.storage;
          done();
        } else {
          self.storage = new Storage();
          self.storage.connect(opts.storageOpts, done);
        }
      },
    ],
    function (err) {
      if (err) {
        log.error(err);
      }
      return cb(err);
    },
  );
};

BlockchainMonitor.prototype._initExplorer = function (network, explorer) {
  var self = this;

  var socket = explorer.initSocket();

  socket.on('connect', function () {
    log.info('Connected to ' + explorer.getConnectionInfo());
    socket.emit('subscribe', 'inv');
  });
  socket.on('connect_error', function () {
    log.error('Error connecting to ' + explorer.getConnectionInfo());
  });

  socket.on('tx', _.bind(self._handleIncomingTx, self, network));
  socket.on('block', _.bind(self._handleNewBlock, self, network));
  socket.on('referral', _.bind(self._handleIncomingReferral, self));
};

BlockchainMonitor.prototype._handleIncomingTx = function (network, data) {
  const self = this;

  const identity = {
    type: 'INCOMING_TX',
    txid: data.txid,
    blockHash: null,
  };
  self._uniqueMessageProcessing(identity, function () {
    self._handleThirdPartyBroadcasts(data);
    self._handleIncomingPayments(data, network);
  });
};

BlockchainMonitor.prototype._handleNewBlock = function (network, hash) {
  const self = this;
  const identity = {
    type: 'NEW_BLOCK',
    blockHash: hash,
    txid: null,
  };
  self._uniqueMessageProcessing(identity, function () {
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

  invites.forEach((inviteTxId) => {
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

BlockchainMonitor.prototype._uniqueMessageProcessing = function (identity, cb) {
  const self = this;

  self.storage.checkKnownMessages(identity, function (err, found) {
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

BlockchainMonitor.prototype._handleThirdPartyBroadcasts = function (data, processIt) {
  var self = this;
  if (!data || !data.txid) return;

  self.storage.fetchTxByHash(data.txid, function (err, txp) {
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

    self.storage.softResetTxHistoryCache(walletId);
  });
};

BlockchainMonitor.prototype._handleIncomingPayments = function (data, network) {
  const self = this;

  if (!data || !data.vout) return;

  // Let's format the object to be easier to process below.
  const outs = _.reduce(
    data.vout,
    function (acc, out, index) {
      if (out.isChangeOutput) {
        return acc;
      }

      const address = _.keys(out)[0];
      const amount = out[address];

      return acc.concat({
        address,
        amount,
        index
      });
    },
    []
  );

  // Let's roll up any vouts that go to the same address.
  // TODO: Probably a more efficient way to do the below.
  //
  const filteredOutputs = [];

  _.forEach(outs, out => {
    const oIndex = _.findIndex(filteredOutputs, {
      address: out.address
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

  async.eachSeries(
    filteredOutputs,
    function (out, next) {
      self.storage.fetchAddress(out.address, (err, addr) => {
        if (err || !addr) {
          log.error('Could not fetch addresses from the db');
          return cb(err || 'Address not found');
        }

        if (addr.isChange) {
          log.info('Address is not registered for notifications, skipping');
          return cb('Address not registered for notifications');
        }

        const walletId = addr.walletId;

        self.storage.softResetTxHistoryCache(walletId, function () {
          self._updateActiveAddress(address, next);
        });
      });
    },
    err => {}
  );
};

BlockchainMonitor.prototype._updateActiveAddress = function (address, cb) {
  var self = this;

  var addrs = [address.address];
  self.storage.storeActiveAddresses(address.walletId, addrs, function (err) {
    if (err) {
      log.warn('Could not update wallet cache', err);
    }
    return cb(err);
  });
};

BlockchainMonitor.prototype._notifyNewBlock = function () {
  this.storage.softResetAllTxHistoryCache();
};


BlockchainMonitor.prototype._handleVaultConfirmations = function (network, txids) {
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

        // TODO(ibby) make a call to notifications service

        // const notification = Notification.create({
        //   type: 'VaultConfirmation',
        //   creatorId: tx.copayerId,
        //   walletId: tx.walletId,
        //   data: result,
        // });
      });
    });

    return cb(null);
  });
};

module.exports = BlockchainMonitor;
