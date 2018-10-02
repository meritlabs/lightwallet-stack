'use strict';

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var util = require('util');
var mkdirp = require('mkdirp');
var bitcore = require('meritcore-lib');
var zmq = require('zmq');
var async = require('async');
var LRU = require('lru-cache');
var MeritRPC = require('meritd-rpc');
var $ = bitcore.util.preconditions;
var _  = bitcore.deps._;
var Transaction = bitcore.Transaction;
var Referral = bitcore.Referral;

var index = require('../');
var errors = index.errors;
var log = index.log;
var utils = require('../utils');
var Service = require('../service');

/**
 * Provides a friendly event driven API to meritd in Node.js. Manages starting and
 * stopping meritd as a child process for application support, as well as connecting
 * to multiple meritd processes for server infrastructure. Results are cached in an
 * LRU cache for improved performance and methods added for common queries.
 *
 * @param {Object} options
 * @param {Node} options.node - A reference to the node
 */
function Merit(options) {
  if (!(this instanceof Merit)) {
    return new Merit(options);
  }

  Service.call(this, options);
  this.options = options;

  this._initCaches();

  // meritd child process
  this.spawn = false;

  // event subscribers
  this.subscriptions = {};
  this.subscriptions.rawtransaction = [];
  this.subscriptions.hashblock = [];
  this.subscriptions.address = {};
  this.subscriptions.rawreferraltx = [];
  this.subscriptions.hashreferraltx = [];

  // set initial settings
  this._initDefaults(options);

  // available meritd nodes
  this._initClients();

  // for testing purposes
  this._process = options.process || process;

  this.on('error', function(err) {
    log.error(err.stack);
  });
}
util.inherits(Merit, Service);

Merit.dependencies = [];

Merit.DEFAULT_MAX_TXIDS = 1000;
Merit.DEFAULT_MAX_HISTORY = 50;
Merit.DEFAULT_SHUTDOWN_TIMEOUT = 15000;
Merit.DEFAULT_ZMQ_SUBSCRIBE_PROGRESS = 0.9999;
Merit.DEFAULT_MAX_ADDRESSES_QUERY = 10000;
Merit.DEFAULT_SPAWN_RESTART_TIME = 5000;
Merit.DEFAULT_SPAWN_STOP_TIME = 10000;
Merit.DEFAULT_TRY_ALL_INTERVAL = 1000;
Merit.DEFAULT_REINDEX_INTERVAL = 10000;
Merit.DEFAULT_START_RETRY_INTERVAL = 5000;
Merit.DEFAULT_TIP_UPDATE_INTERVAL = 15000;
Merit.DEFAULT_TRANSACTION_CONCURRENCY = 5;
Merit.DEFAULT_CONFIG_SETTINGS = {
  server: 1,
  whitelist: '127.0.0.1',
  txindex: 1,
  addressindex: 1,
  timestampindex: 1,
  spentindex: 1,
  zmqpubrawtx: 'tcp://127.0.0.1:28332',
  zmqpubhashblock: 'tcp://127.0.0.1:28332',
  zmqpubrawreferraltx: 'tcp://127.0.0.1:28332',
  rpcallowip: '127.0.0.1',
  rpcuser: 'merit',
  rpcpassword: 'local321',
  uacomment: 'bitcore'
};

Merit.prototype._initDefaults = function(options) {
  /* jshint maxcomplexity: 15 */

  // limits
  this.maxTxids = options.maxTxids || Merit.DEFAULT_MAX_TXIDS;
  this.maxTransactionHistory = options.maxTransactionHistory || Merit.DEFAULT_MAX_HISTORY;
  this.maxReferralHistory = options.maxReferralHistory || Merit.DEFAULT_MAX_HISTORY;
  this.maxAddressesQuery = options.maxAddressesQuery || Merit.DEFAULT_MAX_ADDRESSES_QUERY;
  this.shutdownTimeout = options.shutdownTimeout || Merit.DEFAULT_SHUTDOWN_TIMEOUT;

  // spawn restart setting
  this.spawnRestartTime = options.spawnRestartTime || Merit.DEFAULT_SPAWN_RESTART_TIME;
  this.spawnStopTime = options.spawnStopTime || Merit.DEFAULT_SPAWN_STOP_TIME;

  // try all interval
  this.tryAllInterval = options.tryAllInterval || Merit.DEFAULT_TRY_ALL_INTERVAL;
  this.startRetryInterval = options.startRetryInterval || Merit.DEFAULT_START_RETRY_INTERVAL;

  // rpc limits
  this.transactionConcurrency = options.transactionConcurrency || Merit.DEFAULT_TRANSACTION_CONCURRENCY;

  // sync progress level when zmq subscribes to events
  this.zmqSubscribeProgress = options.zmqSubscribeProgress || Merit.DEFAULT_ZMQ_SUBSCRIBE_PROGRESS;
};

Merit.prototype._initCaches = function() {
  // caches valid until there is a new block
  this.utxosCache = LRU(50000);
  this.txidsCache = LRU(50000);
  this.referralsCache = LRU(50000);
  this.referralCache = LRU(100000);
  this.balanceCache = LRU(50000);
  this.summaryCache = LRU(50000);
  this.blockOverviewCache = LRU(144);
  this.transactionDetailedCache = LRU(100000);
  this.anvCache = LRU(50000);
  this.rewardsCache = LRU(50000);



  // caches valid indefinitely
  this.transactionCache = LRU(100000);
  this.rawTransactionCache = LRU(50000);
  this.blockCache = LRU(144);
  this.rawBlockCache = LRU(72);
  this.blockHeaderCache = LRU(288);
  this.zmqKnownTransactions = LRU(5000);
  this.zmqKnownBlocks = LRU(50);
  this.zmqKnownRawReferrals = LRU(5000);
  this.zmqKnownHashReferrals = LRU(5000);
  this.lastTip = 0;
  this.lastTipTimeout = false;
};

Merit.prototype._initClients = function() {
  var self = this;
  this.nodes = [];
  this.nodesIndex = 0;
  Object.defineProperty(this, 'client', {
    get: function() {
      var client = self.nodes[self.nodesIndex].client;
      self.nodesIndex = (self.nodesIndex + 1) % self.nodes.length;
      return client;
    },
    enumerable: true,
    configurable: false
  });
};

/**
 * Called by Node to determine the available API methods.
 */
Merit.prototype.getAPIMethods = function() {
  var methods = [
    // Merit RPC
    ['getBlock', this, this.getBlock, 1],
    ['getRawBlock', this, this.getRawBlock, 1],
    ['getBlockHeader', this, this.getBlockHeader, 1],
    ['getBlockOverview', this, this.getBlockOverview, 1],
    ['getBlockHashesByTimestamp', this, this.getBlockHashesByTimestamp, 2],
    ['getBestBlockHash', this, this.getBestBlockHash, 0],
    ['getSpentInfo', this, this.getSpentInfo, 1],
    ['getInfo', this, this.getInfo, 0],
    ['syncPercentage', this, this.syncPercentage, 0],
    ['isSynced', this, this.isSynced, 0],
    ['getRawTransaction', this, this.getRawTransaction, 1],
    ['getTransaction', this, this.getTransaction, 1],
    ['getDetailedTransaction', this, this.getDetailedTransaction, 1],
    ['sendTransaction', this, this.sendTransaction, 1],
    ['estimateSmartFee', this, this.estimateSmartFee, 1],
    ['getAddressTxids', this, this.getAddressTxids, 2],
    ['getAddressBalance', this, this.getAddressBalance, 1],
    ['getAddressUnspentOutputs', this, this.getAddressUnspentOutputs, 2],
    ['getAddressHistory', this, this.getAddressHistory, 2],
    ['getAddressSummary', this, this.getAddressSummary, 1],
    ['generateBlock', this, this.generateBlock, 1],
    ['validateAddress', this, this.validateAddress, 1],

    // Merit Specific RPC
    ['getInputForEasySend', this, this.getInputForEasySend, 1],
    ['getanv',                this, this.getANV, 1],
    ['getrewards',     this, this.getRewards, 1],
    ['sendReferral', this, this.sendReferral, 1],
    ['getReferral', this, this.getReferral, 1],
    ['getAddressReferrals', this, this.getAddressReferrals, 1],
    ['getcommunityinfo', this, this.getCommunityInfo, 1],

    ['getMempoolReferrals', this, this.getMempoolReferrals, 1],
    ['getBlockchainReferrals', this, this.getBlockchainReferrals, 1],
    ['getAddressMempool', this, this.getAddressMempool, 1],
    ['getCommunityRank', this, this.getCommunityRank, 1],
    ['getCommunityLeaderboard', this, this.getCommunityLeaderboard, 1],
  ];
  return methods;
};

/**
 * Called by the Bus to determine the available events.
 */
Merit.prototype.getPublishEvents = function() {
  return [
    {
      name: 'meritd/rawtransaction',
      scope: this,
      subscribe: this.subscribe.bind(this, 'rawtransaction'),
      unsubscribe: this.unsubscribe.bind(this, 'rawtransaction')
    },
    {
      name: 'meritd/hashblock',
      scope: this,
      subscribe: this.subscribe.bind(this, 'hashblock'),
      unsubscribe: this.unsubscribe.bind(this, 'hashblock')
    },
    {
      name: 'meritd/addresstxid',
      scope: this,
      subscribe: this.subscribeAddress.bind(this),
      unsubscribe: this.unsubscribeAddress.bind(this)
    },
    {
      name: 'meritd/rawreferraltx',



      scope: this,
      subscribe: this.subscribe.bind(this, 'rawreferraltx'),
      unsubscribe: this.unsubscribe.bind(this, 'rawreferraltx')
    },
    {
      name: 'meritd/hashreferraltx',
      scope: this,
      subscribe: this.subscribe.bind(this, 'hashreferraltx'),
      unsubscribe: this.unsubscribe.bind(this, 'hashreferraltx')
    },
  ];
};

Merit.prototype.subscribe = function(name, emitter) {
  this.subscriptions[name].push(emitter);
  log.info(emitter.remoteAddress, 'subscribe:', 'meritd/' + name, 'total:', this.subscriptions[name].length);
};

Merit.prototype.unsubscribe = function(name, emitter) {
  var index = this.subscriptions[name].indexOf(emitter);
  if (index > -1) {
    this.subscriptions[name].splice(index, 1);
  }
  log.info(emitter.remoteAddress, 'unsubscribe:', 'meritd/' + name, 'total:', this.subscriptions[name].length);
};

Merit.prototype.subscribeAddress = function(emitter, addresses) {
  var self = this;

  function addAddress(addressStr) {
    if(self.subscriptions.address[addressStr]) {
      var emitters = self.subscriptions.address[addressStr];
      var index = emitters.indexOf(emitter);
      if (index === -1) {
        self.subscriptions.address[addressStr].push(emitter);
      }
    } else {
      self.subscriptions.address[addressStr] = [emitter];
    }
  }

  for(var i = 0; i < addresses.length; i++) {
    if (bitcore.Address.isValid(addresses[i], this.node.network)) {
      addAddress(addresses[i]);
    }
  }

  log.info(emitter.remoteAddress, 'subscribe:', 'meritd/addresstxid', 'total:', _.size(this.subscriptions.address));
};

Merit.prototype.unsubscribeAddress = function(emitter, addresses) {
  var self = this;
  if(!addresses) {
    return this.unsubscribeAddressAll(emitter);
  }

  function removeAddress(addressStr) {
    var emitters = self.subscriptions.address[addressStr];
    var index = emitters.indexOf(emitter);
    if(index > -1) {
      emitters.splice(index, 1);
      if (emitters.length === 0) {
        delete self.subscriptions.address[addressStr];
      }
    }
  }

  for(var i = 0; i < addresses.length; i++) {
    if(this.subscriptions.address[addresses[i]]) {
      removeAddress(addresses[i]);
    }
  }

  log.info(emitter.remoteAddress, 'unsubscribe:', 'meritd/addresstxid', 'total:', _.size(this.subscriptions.address));
};

/**
 * A helper function for the `unsubscribe` method to unsubscribe from all addresses.
 * @param {String} name - The name of the event
 * @param {EventEmitter} emitter - An instance of an event emitter
 */
Merit.prototype.unsubscribeAddressAll = function(emitter) {
  for(var hashHex in this.subscriptions.address) {
    var emitters = this.subscriptions.address[hashHex];
    var index = emitters.indexOf(emitter);
    if(index > -1) {
      emitters.splice(index, 1);
    }
    if (emitters.length === 0) {
      delete this.subscriptions.address[hashHex];
    }
  }
  log.info(emitter.remoteAddress, 'unsubscribe:', 'meritd/addresstxid', 'total:', _.size(this.subscriptions.address));
};

Merit.prototype._getDefaultConfig = function() {
  var config = '';
  var defaults = Merit.DEFAULT_CONFIG_SETTINGS;
  for(var key in defaults) {
    config += key + '=' + defaults[key] + '\n';
  }
  return config;
};

Merit.prototype._parseMeritConf = function(configPath) {
  var options = {};
  var file = fs.readFileSync(configPath);
  var unparsed = file.toString().split('\n');
  for(var i = 0; i < unparsed.length; i++) {
    var line = unparsed[i];
    if (!line.match(/^\#/) && line.match(/\=/)) {
      var option = line.split('=');
      var value;
      if (!Number.isNaN(Number(option[1]))) {
        value = Number(option[1]);
      } else {
        value = option[1];
      }
      options[option[0]] = value;
    }
  }
  return options;
};

Merit.prototype._expandRelativeDatadir = function() {
  if (!utils.isAbsolutePath(this.options.spawn.datadir)) {
    $.checkState(this.node.configPath);
    $.checkState(utils.isAbsolutePath(this.node.configPath));
    var baseConfigPath = path.dirname(this.node.configPath);
    this.options.spawn.datadir = path.resolve(baseConfigPath, this.options.spawn.datadir);
  }
};

Merit.prototype._loadSpawnConfiguration = function(node) {
  /* jshint maxstatements: 25 */

  $.checkArgument(this.options.spawn, 'Please specify "spawn" in meritd config options');
  $.checkArgument(this.options.spawn.datadir, 'Please specify "spawn.datadir" in meritd config options');

  this._expandRelativeDatadir();

  var spawnOptions = this.options.spawn;
  var configPath = path.resolve(spawnOptions.datadir, './merit.conf');

  log.info('Using Merit config file:', configPath);

  this.spawn = {};
  this.spawn.datadir = this.options.spawn.datadir;
  this.spawn.exec = this.options.spawn.exec;
  this.spawn.configPath = configPath;
  this.spawn.config = {};

  if (!fs.existsSync(spawnOptions.datadir)) {
    mkdirp.sync(spawnOptions.datadir);
  }

  if (!fs.existsSync(configPath)) {
    var defaultConfig = this._getDefaultConfig();
    fs.writeFileSync(configPath, defaultConfig);
  }

  _.extend(this.spawn.config, this._getDefaultConf());
  _.extend(this.spawn.config, this._parseMeritConf(configPath));

  var networkConfigPath = this._getNetworkConfigPath();
  if (networkConfigPath && fs.existsSync(networkConfigPath)) {
    _.extend(this.spawn.config, this._parseMeritConf(networkConfigPath));
  }

  var spawnConfig = this.spawn.config;

  this._checkConfigIndexes(spawnConfig, node);

};

Merit.prototype._checkConfigIndexes = function(spawnConfig, node) {
  $.checkState(
    spawnConfig.txindex && spawnConfig.txindex === 1,
    '"txindex" option is required in order to use transaction query features of merit-node. ' +
      'Please add "txindex=1" to your configuration and reindex an existing database if ' +
      'necessary with reindex=1'
  );

  $.checkState(
    spawnConfig.addressindex && spawnConfig.addressindex === 1,
    '"addressindex" option is required in order to use address query features of merit-node. ' +
      'Please add "addressindex=1" to your configuration and reindex an existing database if ' +
      'necessary with reindex=1'
  );

  $.checkState(
    spawnConfig.spentindex && spawnConfig.spentindex === 1,
    '"spentindex" option is required in order to use spent info query features of merit-node. ' +
      'Please add "spentindex=1" to your configuration and reindex an existing database if ' +
      'necessary with reindex=1'
  );

  $.checkState(
    spawnConfig.server && spawnConfig.server === 1,
    '"server" option is required to communicate to meritd from bitcore. ' +
      'Please add "server=1" to your configuration and restart'
  );

  $.checkState(
    spawnConfig.zmqpubrawtx,
    '"zmqpubrawtx" option is required to get event updates from meritd. ' +
      'Please add "zmqpubrawtx=tcp://127.0.0.1:<port>" to your configuration and restart'
  );

  $.checkState(
    spawnConfig.zmqpubhashblock,
    '"zmqpubhashblock" option is required to get event updates from meritd. ' +
      'Please add "zmqpubhashblock=tcp://127.0.0.1:<port>" to your configuration and restart'
  );

  $.checkState(
    spawnConfig.zmqpubrawreferraltx,
    '"zmqpubrawreferraltx" option is required to get event updates from meritd. ' +
      'Please add "zmqpubrawreferraltx=tcp://127.0.0.1:<port>" to your configuration and restart'
  );

  $.checkState(
    (spawnConfig.zmqpubhashblock === spawnConfig.zmqpubrawtx &&
     spawnConfig.zmqpubrawtx === spawnConfig.zmqpubrawreferraltx),
    '"zmqpubrawtx", "zmqpubhashblock", "zmqpubrawreferraltx" are expected to the same host and port in merit.conf'
  );

  if (spawnConfig.reindex && spawnConfig.reindex === 1) {
    log.warn('Reindex option is currently enabled. This means that meritd is undergoing a reindex. ' +
             'The reindex flag will start the index from beginning every time the node is started, so it ' +
             'should be removed after the reindex has been initiated. Once the reindex is complete, the rest ' +
             'of merit-node services will start.');
    node._reindex = true;
  }
};

Merit.prototype._resetCaches = function() {
  this.transactionDetailedCache.reset();
  this.utxosCache.reset();
  this.txidsCache.reset();
  this.referralsCache.reset();
  this.balanceCache.reset();
  this.summaryCache.reset();
  this.blockOverviewCache.reset();
  this.anvCache.reset();
  this.rewardsCache.reset();
};

Merit.prototype._tryAllClients = function(func, callback) {
  var self = this;
  var nodesIndex = this.nodesIndex;
  var retry = function(done) {
    var client = self.nodes[nodesIndex].client;
    nodesIndex = (nodesIndex + 1) % self.nodes.length;
    func(client, done);
  };
  async.retry({times: this.nodes.length, interval: this.tryAllInterval || 1000}, retry, callback);
};

Merit.prototype._wrapRPCError = function(errObj) {
  var err = new errors.RPCError(errObj.message);
  err.code = errObj.code;
  return err;
};

Merit.prototype._initChain = function(callback) {
  var self = this;

  self.client.getBestBlockHash(function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }

    self.client.getBlock(response.result, function(err, response) {
      if (err) {
        return callback(self._wrapRPCError(err));
      }

      self.height = response.result.height;

      self.client.getBlockHash(0, function(err, response) {
        if (err) {
          return callback(self._wrapRPCError(err));
        }
        var blockhash = response.result;
        self.getRawBlock(blockhash, function(err, blockBuffer) {
          if (err) {
            return callback(err);
          }
          self.genesisBuffer = blockBuffer;
          self.emit('ready');
          log.info('Merit Daemon Ready');
          callback();
        });
      });

    });
  });
};

Merit.prototype._getDefaultConf = function() {
  var networkOptions = {
    rpcport: 8332,
  };
  if (this.node.network === bitcore.Networks.testnet) {
    networkOptions.rpcport = 18332;
  }
  return networkOptions;
};

Merit.prototype._getNetworkConfigPath = function() {
  var networkPath;
  if (this.node.network === bitcore.Networks.testnet) {
    networkPath = 'testnet3/merit.conf';
    if (this.node.network.regtestEnabled) {
      networkPath = 'regtest/merit.conf';
    }
  }
  return networkPath;
};

Merit.prototype._getNetworkOption = function() {
  var networkOption;
  if (this.node.network === bitcore.Networks.testnet) {
    networkOption = '--testnet';
    if (this.node.network.regtestEnabled) {
      networkOption = '--regtest';
    }
  }
  return networkOption;
};

Merit.prototype._zmqBlockHandler = function(node, message) {
  var self = this;

  // Update the current chain tip
  self._rapidProtectedUpdateTip(node, message);

  // Notify block subscribers
  var id = message.toString('binary');
  if (!self.zmqKnownBlocks.get(id)) {
    self.zmqKnownBlocks.set(id, true);
    self.emit('block', message);

    for (var i = 0; i < this.subscriptions.hashblock.length; i++) {
      this.subscriptions.hashblock[i].emit('meritd/hashblock', message.toString('hex'));
    }
  }

};

Merit.prototype._rapidProtectedUpdateTip = function(node, message) {
  var self = this;

  // Prevent a rapid succession of tip updates
  if (new Date() - self.lastTip > 1000) {
    self.lastTip = new Date();
    self._updateTip(node, message);
  } else {
    clearTimeout(self.lastTipTimeout);
    self.lastTipTimeout = setTimeout(function() {
      self._updateTip(node, message);
    }, 1000);
  }
};

Merit.prototype._updateTip = function(node, message) {

  console.log("\nUPDATE TIP\n", message);

  var self = this;

  var hex = message.toString('hex');
  if (hex !== self.tiphash) {
    self.tiphash = message.toString('hex');

    // reset block valid caches
    self._resetCaches();

    node.client.getBlock(self.tiphash, function(err, response) {
      if (err) {
        var error = self._wrapRPCError(err);
        self.emit('error', error);
      } else {
        self.height = response.result.height;
        $.checkState(self.height >= 0);
        self.emit('tip', self.height);
      }
    });

    if(!self.node.stopping) {
      self.syncPercentage(function(err, percentage) {
        if (err) {
          self.emit('error', err);
        } else {
          if (Math.round(percentage) >= 100) {
            self.emit('synced', self.height);
          }
          log.info('Merit Height:', self.height, 'Percentage:', percentage.toFixed(2));
        }
      });
    }
  }
};

Merit.prototype._getAddressesFromTransaction = function(transaction) {
  var addresses = [];

  for (var i = 0; i < transaction.inputs.length; i++) {
    var input = transaction.inputs[i];
    if (input.script) {
      var inputAddress = input.script.toAddress(this.node.network);
      if (inputAddress) {
        addresses.push(inputAddress.toString());
      }
    }
  }

  for (var j = 0; j < transaction.outputs.length; j++) {
    var output = transaction.outputs[j];
    if (output.script) {
      var outputAddress = output.script.toAddress(this.node.network);
      if (outputAddress) {
        addresses.push(outputAddress.toString());
      }
    }
  }

  return _.uniq(addresses);
};

Merit.prototype._notifyAddressTxidSubscribers = function(txid, transaction) {
  var addresses = this._getAddressesFromTransaction(transaction);
  for (var i = 0; i < addresses.length; i++) {
    var address = addresses[i];
    if(this.subscriptions.address[address]) {
      var emitters = this.subscriptions.address[address];
      for(var j = 0; j < emitters.length; j++) {
        emitters[j].emit('meritd/addresstxid', {
          address: address,
          txid: txid
        });
      }
    }
  }
};

Merit.prototype._zmqTransactionHandler = function(node, message) {
  var self = this;
  var hash = bitcore.crypto.Hash.sha256sha256(message);
  var id = hash.toString('binary');
  if (!self.zmqKnownTransactions.get(id)) {
    self.zmqKnownTransactions.set(id, true);
    self.emit('tx', message);

    // Notify transaction subscribers
    for (var i = 0; i < this.subscriptions.rawtransaction.length; i++) {
      this.subscriptions.rawtransaction[i].emit('meritd/rawtransaction', message.toString('hex'));
    }

    var tx = bitcore.Transaction();
    tx.fromString(message);
    var txid = bitcore.util.buffer.reverse(hash).toString('hex');
    self._notifyAddressTxidSubscribers(txid, tx);

  }
};

Merit.prototype._zmqRawReferralsHandler = function(node, message) {
  const self = this;
  const hash = bitcore.crypto.Hash.sha256sha256(message);
  const id = hash.toString('binary');
  if (!self.zmqKnownRawReferrals.get(id)) {
    self.zmqKnownRawReferrals.set(id, true);
    self.emit('rawreferraltx', message);

    // Notify rawreferraltx subscribers
    log.info('rawreferraltx subscribers: ', this.subscriptions.rawreferraltx.length);
    for (let i = 0; i < this.subscriptions.rawreferraltx.length; i++) {
      log.warn('rawreferraltx sending message:', message.toString('hex'));
      this.subscriptions.rawreferraltx[i].emit('meritd/rawreferraltx', message.toString('hex'));
    }
  }
};

Merit.prototype._zmqHashReferralsHandler = function(node, message) {
  const self = this;
  const hash = bitcore.crypto.Hash.sha256sha256(message);
  const id = hash.toString('binary');
  if (!self.zmqKnownHashReferrals.get(id)) {
    self.zmqKnownHashReferrals.set(id, true);
    self.emit('hashreferraltx', message);

    // Notify hashreferraltx subscribers
    log.info('hashreferraltx subscribers: ', this.subscriptions.hashreferraltx.length);
    for (let i = 0; i < this.subscriptions.hashreferraltx.length; i++) {
      log.warn('hashreferraltx sending message:', message.toString('hex'));
      this.subscriptions.hashreferraltx[i].emit('meritd/hashreferraltx', message.toString('hex'));
    }
  }
};

Merit.prototype._checkSyncedAndSubscribeZmqEvents = function(node) {
  var self = this;
  var interval;

  function checkAndSubscribe(callback) {
    // update tip
    node.client.getBestBlockHash(function(err, response) {
      if (err) {
        return callback(self._wrapRPCError(err));
      }
      var blockhash = new Buffer(response.result, 'hex');
      self.emit('block', blockhash);
      self._updateTip(node, blockhash);

      // check if synced
      node.client.getBlockchainInfo(function(err, response) {
        if (err) {
          return callback(self._wrapRPCError(err));
        }
        var progress = response.result.verificationprogress;
        if (progress >= self.zmqSubscribeProgress) {
          // subscribe to events for further updates
          self._subscribeZmqEvents(node);
          clearInterval(interval);
          callback(null, true);
        } else {
          callback(null, false);
        }
      });
    });
  }

  checkAndSubscribe(function(err, synced) {
    if (err) {
      log.error(err);
    }
    if (!synced) {
      interval = setInterval(function() {
        if (self.node.stopping) {
          return clearInterval(interval);
        }
        checkAndSubscribe(function(err) {
          if (err) {
            log.error(err);
          }
        });
      }, node._tipUpdateInterval || Merit.DEFAULT_TIP_UPDATE_INTERVAL);
    }
  });

};

Merit.prototype._subscribeZmqEvents = function(node) {
  const self = this;
  node.zmqSubSocket.subscribe('hashblock');
  node.zmqSubSocket.subscribe('rawtx');
  node.zmqSubSocket.subscribe('rawreferraltx');
  node.zmqSubSocket.subscribe('hashreferraltx');

  node.zmqSubSocket.on('message', function(topic, message) {
    const topicString = topic.toString('utf8');
    log.info(`message received in topic: ${topicString}`);
    switch(topicString) {
    case 'rawtx':
      self._zmqTransactionHandler(node, message);
      break;
    case 'hashblock':
      self._zmqBlockHandler(node, message);
      break;
    case 'rawreferraltx':
      self._zmqRawReferralsHandler(node, message);
      break;
    case 'hashreferraltx':
      self._zmqHashReferralsHandler(node, message);
      break;
    default:
      log.error('Error in ZMQ message parsing: cannot determine topic.')
      break;
    };
  });
};

Merit.prototype._initZmqSubSocket = function(node, zmqUrl) {
  node.zmqSubSocket = zmq.socket('sub');

  node.zmqSubSocket.on('connect', function(fd, endPoint) {
    log.info('ZMQ connected to:', endPoint);
  });

  node.zmqSubSocket.on('connect_delay', function(fd, endPoint) {
    log.warn('ZMQ connection delay:', endPoint);
  });

  node.zmqSubSocket.on('disconnect', function(fd, endPoint) {
    log.warn('ZMQ disconnect:', endPoint);
  });

  node.zmqSubSocket.on('monitor_error', function(err) {
    log.error('Error in monitoring: %s, will restart monitoring in 5 seconds', err);
    setTimeout(function() {
      node.zmqSubSocket.monitor(500, 0);
    }, 5000);
  });

  node.zmqSubSocket.monitor(500, 0);
  node.zmqSubSocket.connect(zmqUrl);
};

Merit.prototype._checkReindex = function(node, callback) {
  var self = this;
  var interval;
  function finish(err) {
    clearInterval(interval);
    callback(err);
  }
  if (node._reindex) {
    interval = setInterval(function() {
      node.client.getBlockchainInfo(function(err, response) {
        if (err) {
          return finish(self._wrapRPCError(err));
        }
        var percentSynced = response.result.verificationprogress * 100;

        log.info('Merit Core Daemon Reindex Percentage: ' + percentSynced.toFixed(2));

        if (Math.round(percentSynced) >= 100) {
          node._reindex = false;
          finish();
        }
      });
    }, node._reindexWait || Merit.DEFAULT_REINDEX_INTERVAL);
  } else {
    callback();
  }
};

Merit.prototype._loadTipFromNode = function(node, callback) {
  var self = this;
  node.client.getBestBlockHash(function(err, response) {
    if (err && err.code === -28) {
      log.warn(err.message);
      return callback(self._wrapRPCError(err));
    } else if (err) {
      return callback(self._wrapRPCError(err));
    }
    node.client.getBlock(response.result, function(err, response) {
      if (err) {
        return callback(self._wrapRPCError(err));
      }
      self.height = response.result.height;
      $.checkState(self.height >= 0);
      self.emit('tip', self.height);
      callback();
    });
  });
};

Merit.prototype._stopSpawnedMerit = function(callback) {
  var self = this;
  var spawnOptions = this.options.spawn;
  var pidPath = spawnOptions.datadir + '/meritd.pid';

  function stopProcess() {
    fs.readFile(pidPath, 'utf8', function(err, pid) {
      if (err && err.code === 'ENOENT') {
        // pid file doesn't exist we can continue
        return callback(null);
      } else if (err) {
        return callback(err);
      }
      pid = parseInt(pid);
      if (!Number.isFinite(pid)) {
        // pid doesn't exist we can continue
        return callback(null);
      }
      try {
        log.warn('Stopping existing spawned Merit process with pid: ' + pid);
        self._process.kill(pid, 'SIGINT');
      } catch(err) {
        if (err && err.code === 'ESRCH') {
          log.warn('Unclean Merit process shutdown, process not found with pid: ' + pid);
          return callback(null);
        } else if(err) {
          return callback(err);
        }
      }
      setTimeout(function() {
        stopProcess();
      }, self.spawnStopTime);
    });
  }

  if(spawnOptions.exec) {
    stopProcess();
  } else {
    callback(null);
  }
};

Merit.prototype._spawnChildProcess = function(callback) {
  var self = this;

  var node = {};
  node._reindex = false;
  node._reindexWait = 10000;

  try {
    self._loadSpawnConfiguration(node);
  } catch(e) {
    return callback(e);
  }

  var options = [
    '--conf=' + this.spawn.configPath,
    '--datadir=' + this.spawn.datadir,
  ];

  if (self._getNetworkOption()) {
    options.push(self._getNetworkOption());
  }

  self._stopSpawnedMerit(function(err) {
    if (err) {
      return callback(err);
    }

    log.info('Starting Meritd process');
    if(self.spawn.exec) {
      self.spawn.process = spawn(self.spawn.exec, options, {stdio: 'inherit'});

      self.spawn.process.on('error', function(err) {
        self.emit('error', err);
      });

      self.spawn.process.once('exit', function(code) {
        if (!self.node.stopping) {
          log.warn('Merit process unexpectedly exited with code:', code);
          log.warn('Restarting Merit child process in ' + self.spawnRestartTime + 'ms');
          setTimeout(function() {
            self._spawnChildProcess(function(err) {
              if (err) {
                return self.emit('error', err);
              }
              log.warn('Merit process restarted');
            });
          }, self.spawnRestartTime);
        }
      });
    }

    var exitShutdown = false;

    async.retry({times: 60, interval: self.startRetryInterval}, function(done) {
      if (self.node.stopping) {
        exitShutdown = true;
        return done();
      }

      node.client = new MeritRPC({
        protocol: 'http',
        host: '127.0.0.1',
        port: self.spawn.config.rpcport,
        user: self.spawn.config.rpcuser,
        pass: self.spawn.config.rpcpassword,
        queue: self.spawn.config.rpcqueue,
      });

      self._loadTipFromNode(node, done);

    }, function(err) {
      if (err) {
        return callback(err);
      }
      if (exitShutdown) {
        return callback(new Error('Stopping while trying to spawn meritd.'));
      }

      self._initZmqSubSocket(node, self.spawn.config.zmqpubrawtx);

      self._checkReindex(node, function(err) {
        if (err) {
          return callback(err);
        }
        self._checkSyncedAndSubscribeZmqEvents(node);
        callback(null, node);
      });

    });

  });

};

Merit.prototype._connectProcess = function(config, callback) {
  var self = this;
  var node = {};
  var exitShutdown = false;

  async.retry({times: 60, interval: self.startRetryInterval}, function(done) {
    if (self.node.stopping) {
      exitShutdown = true;
      return done();
    }

    node.client = new MeritRPC({
      protocol: config.rpcprotocol || 'http',
      host: config.rpchost || '127.0.0.1',
      port: config.rpcport,
      user: config.rpcuser,
      pass: config.rpcpassword,
      rejectUnauthorized: _.isUndefined(config.rpcstrict) ? true : config.rpcstrict,
      queue: config.rpcqueue,
    });

    self._loadTipFromNode(node, done);

  }, function(err) {
    if (err) {
      return callback(err);
    }
    if (exitShutdown) {
      return callback(new Error('Stopping while trying to connect to meritd.'));
    }

    self._initZmqSubSocket(node, config.zmqpubrawtx);
    self._subscribeZmqEvents(node);

    callback(null, node);
  });
};

/**
 * Called by Node to start the service
 * @param {Function} callback
 */
Merit.prototype.start = function(callback) {
  var self = this;

  async.series([
    function(next) {
      if (self.options.spawn) {
        self._spawnChildProcess(function(err, node) {
          if (err) {
            return next(err);
          }
          self.nodes.push(node);
          next();
        });
      } else {
        next();
      }
    },
    function(next) {
      if (self.options.connect) {
        async.map(self.options.connect, self._connectProcess.bind(self), function(err, nodes) {
          if (err) {
            return callback(err);
          }
          for(var i = 0; i < nodes.length; i++) {
            self.nodes.push(nodes[i]);
          }
          next();
        });
      } else {
        next();
      }
    }
  ], function(err) {
    if (err) {
      return callback(err);
    }
    if (self.nodes.length === 0) {
      return callback(new Error('Merit configuration options "spawn" or "connect" are expected'));
    }
    self._initChain(callback);
  });

};

/**
 * Helper to determine the state of the database.
 * @param {Function} callback
 */
Merit.prototype.isSynced = function(callback) {
  this.syncPercentage(function(err, percentage) {
    if (err) {
      return callback(err);
    }
    if (Math.round(percentage) >= 100) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
};

/**
 * Helper to determine the progress of the database.
 * @param {Function} callback
 */
Merit.prototype.syncPercentage = function(callback) {
  var self = this;
  this.client.getBlockchainInfo(function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }
    var percentSynced = response.result.verificationprogress * 100;
    callback(null, percentSynced);
  });
};

Merit.prototype._normalizeAddressArg = function(addressArg) {
  var addresses;
  if (Array.isArray(addressArg)) {
    addresses = addressArg;
  } else {
    addresses = [addressArg];
  }
  return addresses;
};

/**
 * Will get the balance for an address or multiple addresses
 * @param {String|Address|Array} addressArg - An address string, Merit address, or array of addresses
 * @param {Object} options
 * @param {Function} callback
 */
Merit.prototype.getAddressBalance = function(addressArg, options, callback) {
  var self = this;
  var addresses = self._normalizeAddressArg(addressArg);
  var cacheKeySuffix = addresses.join('');
  var cacheKey = options.invites ? 'i' + cacheKeySuffix: cacheKeySuffix;
  var balance = self.balanceCache.get(cacheKey);
  if (balance) {
    return setImmediate(function() {
      callback(null, balance);
    });
  } else {
    let req = {addresses, invites: options.invites, detailed: options.detailed};
    this.client.getAddressBalance(req, function(err, response) {
      if (err) {
        return callback(self._wrapRPCError(err));
      }
      self.balanceCache.set(cacheKey, {result: response.result});
      callback(null, {result: response.result});
    });
  }
};

/**
 * Will get the unspent outputs for an address or multiple addresses
 * @param {String|Address|Array} addressArg - An address string, Merit address, or array of addresses
 * @param {Object} options
 * @param {Function} callback
 */
Merit.prototype.getAddressUnspentOutputs = function(addressArg, options, callback) {
  var self = this;
  var queryMempool = _.isUndefined(options.queryMempool) ? true : options.queryMempool;
  var invites = !!options.invites;
  var addresses = self._normalizeAddressArg(addressArg);
  var cacheKey = (options.invites ? 'i:' : '') + addresses.join('');
  var utxos = self.utxosCache.get(cacheKey);

  function updateWithMempool(confirmedUtxos, mempoolDeltas) {
    /* jshint maxstatements: 20 */
    if (!mempoolDeltas || !mempoolDeltas.length) {
      return confirmedUtxos;
    }
    var isSpentOutputs = false;
    var mempoolUnspentOutputs = [];
    var spentOutputs = [];

    for (var i = 0; i < mempoolDeltas.length; i++) {
      var delta = mempoolDeltas[i];
      if (delta.prevtxid && delta.satoshis <= 0) {
        if (!spentOutputs[delta.prevtxid]) {
          spentOutputs[delta.prevtxid] = [delta.prevout];
        } else {
          spentOutputs[delta.prevtxid].push(delta.prevout);
        }
        isSpentOutputs = true;
      } else {
        mempoolUnspentOutputs.push(delta);
      }
    }

    var utxos = mempoolUnspentOutputs.reverse().concat(confirmedUtxos);

    if (isSpentOutputs) {
      return utxos.filter(function(utxo) {
        if (!spentOutputs[utxo.txid]) {
          return true;
        } else {
          return (spentOutputs[utxo.txid].indexOf(utxo.outputIndex) === -1);
        }
      });
    }

    return utxos;
  }

  function finish(mempoolDeltas) {
    if (utxos) {
      return setImmediate(function() {
        callback(null, updateWithMempool(utxos, mempoolDeltas));
      });
    } else {
      self.client.getAddressUtxos({ addresses, invites }, function(err, response) {
        if (err) {
          return callback(self._wrapRPCError(err));
        }
        var utxos = response.result.reverse();
        self.utxosCache.set(cacheKey, utxos);
        callback(null, updateWithMempool(utxos, mempoolDeltas));
      });
    }
  }

  if (queryMempool) {
    self.client.getAddressMempool({ addresses }, function(err, response) {
      if (err) {
        return callback(self._wrapRPCError(err));
      }

      const txs = response.result.filter(tx => tx.isInvite == invites);

      finish(txs);
    });
  } else {
    finish();
  }

};

Merit.prototype._getBalanceFromMempool = function(deltas) {
  var micros = 0;
  for (var i = 0; i < deltas.length; i++) {
    micros += deltas[i].micros;
  }
  return micros;
};

Merit.prototype._getTxidsFromMempool = function(deltas) {
  var mempoolTxids = [];
  var mempoolTxidsKnown = {};
  for (var i = 0; i < deltas.length; i++) {
    var txid = deltas[i].txid;
    if (!mempoolTxidsKnown[txid]) {
      mempoolTxids.push(txid);
      mempoolTxidsKnown[txid] = true;
    }
  }
  return mempoolTxids;
};

Merit.prototype._getHeightRangeQuery = function(options, clone) {
  if (options.start >= 0 && options.end >= 0) {
    if (options.end > options.start) {
      throw new TypeError('"end" is expected to be less than or equal to "start"');
    }
    if (clone) {
      // reverse start and end as the order in Merit is most recent to less recent
      clone.start = options.end;
      clone.end = options.start;
    }
    return true;
  }
  return false;
};

/**
 * Will get the txids for an address or multiple addresses
 * @param {String|Address|Array} addressArg - An address string, Merit address, or array of addresses
 * @param {Object} options
 * @param {Function} callback
 */
Merit.prototype.getAddressTxids = function(addressArg, options, callback) {
  /* jshint maxstatements: 20 */
  var self = this;
  var queryMempool = _.isUndefined(options.queryMempool) ? true : options.queryMempool;
  var queryMempoolOnly = _.isUndefined(options.queryMempoolOnly) ? false : options.queryMempoolOnly;
  var rangeQuery = false;
  try {
    rangeQuery = self._getHeightRangeQuery(options);
  } catch(err) {
    return callback(err);
  }
  if (rangeQuery) {
    queryMempool = false;
  }
  if (queryMempoolOnly) {
    queryMempool = true;
    rangeQuery = false;
  }
  var addresses = self._normalizeAddressArg(addressArg);
  var cacheKey = addresses.join('');
  var mempoolTxids = [];
  var txids = queryMempoolOnly ? false : self.txidsCache.get(cacheKey);

  function finish() {
    if (queryMempoolOnly) {
      return setImmediate(function() {
        callback(null, mempoolTxids.reverse());
      });
    }
    if (txids && !rangeQuery) {
      var allTxids = mempoolTxids.reverse().concat(txids);
      return setImmediate(function() {
        callback(null, allTxids);
      });
    } else {
      var txidOpts = {
        addresses: addresses
      };
      if (rangeQuery) {
        self._getHeightRangeQuery(options, txidOpts);
      }
      self.client.getAddressTxids(txidOpts, function(err, response) {
        if (err) {
          return callback(self._wrapRPCError(err));
        }
        response.result.reverse();
        if (!rangeQuery) {
          self.txidsCache.set(cacheKey, response.result);
        }
        var allTxids = mempoolTxids.reverse().concat(response.result);
        return callback(null, allTxids);
      });
    }
  }

  if (queryMempool) {
    self.client.getAddressMempool({addresses: addresses}, function(err, response) {
      if (err) {
        return callback(self._wrapRPCError(err));
      }
      mempoolTxids = self._getTxidsFromMempool(response.result);
      finish();
    });
  } else {
    finish();
  }

};

Merit.prototype._getConfirmationsDetail = function(transaction) {
  $.checkState(this.height > 0, 'current height is unknown');
  var confirmations = 0;
  if (transaction.height >= 0) {
    confirmations = this.height - transaction.height + 1;
  }
  if (confirmations < 0) {
    log.warn('Negative confirmations calculated for transaction:', transaction.hash);
  }
  return Math.max(0, confirmations);
};

Merit.prototype._getAddressDetailsForInput = function(input, inputIndex, result, addressStrings) {
  if (!input.address) {
    return;
  }
  var address = input.address;
  if (addressStrings.indexOf(address) >= 0) {
    if (!result.addresses[address]) {
      result.addresses[address] = {
        inputIndexes: [inputIndex],
        outputIndexes: []
      };
    } else {
      result.addresses[address].inputIndexes.push(inputIndex);
    }
    result.micros -= input.micros;
  }
};

Merit.prototype._getAddressDetailsForOutput = function(output, outputIndex, result, addressStrings) {
  if (!output.address) {
    return;
  }
  var address = output.address;
  if (addressStrings.indexOf(address) >= 0) {
    if (!result.addresses[address]) {
      result.addresses[address] = {
        inputIndexes: [],
        outputIndexes: [outputIndex]
      };
    } else {
      result.addresses[address].outputIndexes.push(outputIndex);
    }
    result.micros += output.micros;
  }
};

Merit.prototype._getAddressDetailsForTransaction = function(transaction, addressStrings) {
  var result = {
    addresses: {},
    micros: 0
  };

  for (var inputIndex = 0; inputIndex < transaction.inputs.length; inputIndex++) {
    var input = transaction.inputs[inputIndex];
    this._getAddressDetailsForInput(input, inputIndex, result, addressStrings);
  }

  for (var outputIndex = 0; outputIndex < transaction.outputs.length; outputIndex++) {
    var output = transaction.outputs[outputIndex];
    this._getAddressDetailsForOutput(output, outputIndex, result, addressStrings);
  }

  $.checkState(Number.isFinite(result.micros));

  return result;
};

/**
 * Will expand into a detailed transaction from a txid
 * @param {Object} txid - A Merit transaction id
 * @param {Function} callback
 */
Merit.prototype._getAddressDetailedTransaction = function(txid, options, next) {
  var self = this;

  self.getDetailedTransaction(
    txid,
    function(err, transaction) {
      if (err) {
        return next(err);
      }
      var addressDetails = self._getAddressDetailsForTransaction(transaction, options.addressStrings);

      var details = {
        addresses: addressDetails.addresses,
        micros: addressDetails.micros,
        confirmations: self._getConfirmationsDetail(transaction),
        tx: transaction
      };
      next(null, details);
    }
  );
};

Merit.prototype._getAddressStrings = function(addresses) {
  var addressStrings = [];
  for (var i = 0; i < addresses.length; i++) {
    var address = addresses[i];
    if (address instanceof bitcore.Address) {
      addressStrings.push(address.toString());
    } else if (_.isString(address)) {
      addressStrings.push(address);
    } else {
      throw new TypeError('Addresses are expected to be strings');
    }
  }
  return addressStrings;
};

Merit.prototype._paginateTxids = function(fullTxids, fromArg, toArg) {
  var txids;
  var from = parseInt(fromArg);
  var to = parseInt(toArg);
  $.checkState(from < to, '"from" (' + from + ') is expected to be less than "to" (' + to + ')');
  txids = fullTxids.slice(from, to);
  return txids;
};

/**
 * Will detailed transaction history for an address or multiple addresses
 * @param {String|Address|Array} addressArg - An address string, Merit address, or array of addresses
 * @param {Object} options
 * @param {Function} callback
 */
Merit.prototype.getAddressHistory = function(addressArg, options, callback) {
  var self = this;
  var addresses = self._normalizeAddressArg(addressArg);
  if (addresses.length > this.maxAddressesQuery) {
    return callback(new TypeError('Maximum number of addresses (' + this.maxAddressesQuery + ') exceeded'));
  }

  var queryMempool = _.isUndefined(options.queryMempool) ? true : options.queryMempool;
  var addressStrings = this._getAddressStrings(addresses);

  var fromArg = parseInt(options.from || 0);
  var toArg = parseInt(options.to || self.maxTransactionHistory);

  if ((toArg - fromArg) > self.maxTransactionHistory) {
    return callback(new Error(
      '"from" (' + options.from + ') and "to" (' + options.to + ') range should be less than or equal to ' +
        self.maxTransactionHistory
    ));
  }

  self.getAddressTxids(addresses, options, function(err, txids) {
    if (err) {
      return callback(err);
    }

    var totalCount = txids.length;
    try {
      txids = self._paginateTxids(txids, fromArg, toArg);
    } catch(e) {
      return callback(e);
    }

    async.mapLimit(
      txids,
      self.transactionConcurrency,
      function(txid, next) {
        self._getAddressDetailedTransaction(txid, {
          queryMempool: queryMempool,
          addressStrings: addressStrings
        }, next);
      },
      function(err, transactions) {
        if (err) {
          return callback(err);
        }
        callback(null, {
          totalCount: totalCount,
          items: transactions
        });
      }
    );
  });
};

/**
 * Will get a referral as a Merit Referral. Results include the mempool.
 * @param {String} refid - Referral hash, address or alias
 * @param {Function} callback
 */
Merit.prototype.getReferral = function(refid, callback) {
    var self = this;
    var referral = self.referralCache.get(refid);
    if (referral) {
        return setImmediate(function() {
            callback(null, referral);
        });
    } else {
        self._tryAllClients(function(client, done) {
            client.getRawReferral(refid, function(err, response) {

                if (err) {
                    return done(self._wrapRPCError(err));
                }
                var referral = Referral(response.result, self.node.getNetworkName());
                self.referralCache.set(refid, referral);
                done(null, referral);
            });
        }, callback);
    }
};

/**
 * Will detailed referrals history for an address or multiple addresses
 * @param {String|Address|Array} addressArg - An address string, Merit address, or array of addresses
 * @param {Object} options
 * @param {Function} callback
 */
Merit.prototype.getAddressReferrals = function(addressArg, options, callback) {
    var self = this;

    var addresses = self._normalizeAddressArg(addressArg);
    if (addresses.length > this.maxAddressesQuery) {
        return callback(new TypeError('Maximum number of addresses (' + this.maxAddressesQuery + ') exceeded'));
    }

    var cacheKey = addresses.join('');

    function loadFromMempool(cb) {
      return self.client.getaddressmempoolreferrals({addresses: addresses}, function (err, response) {
          if (err) {
            return cb(self._wrapRPCError(err));
          }

          console.log('mempool', response.result);
          return cb(null, response.result);
      });
    }

    function loadFromBc(cb) {
      return self.client.getaddressreferrals({addresses: addresses}, function (err, response) {
        if (err) {
          return cb(self._wrapRPCError(err));
        }

        return cb(null, response.result);
      });
    }

    function finish(referrals) {
        return callback(null, {
            totalCount: referrals.length,
            items: referrals
        });
    }

    return loadFromMempool(function(err, mempoolReferrals) {
        mempoolReferrals = mempoolReferrals || [];
        var cachedReferrals = self.referralsCache.get(cacheKey);
        if (cachedReferrals) {
            var referrals = mempoolReferrals.concat(cachedReferrals);
            console.log(cachedReferrals.length+' referrals read from  cache + '+mempoolReferrals.length+' from mempool');
            finish(referrals);
        } else {
            loadFromBc(function(err, bcReferrals) {
              var referrals = [];
              if (!err) {
                self.referralsCache.set(cacheKey, bcReferrals);
                referrals = mempoolReferrals.concat(bcReferrals);
                log.info(bcReferrals.length +' referrals read from  bc + ');
                log.info(mempoolReferrals.length + ' from mempool');
              } else {
                log.info('error in loadFromBc: ', err);
              }
              referrals = _.uniqBy(referrals, 'refid');
              finish(referrals);
            });
        }
    });
};


/**
 * Will get the summary including txids and balance for an address or multiple addresses
 * @param {String|Address|Array} addressArg - An address string, Merit address, or array of addresses
 * @param {Object} options
 * @param {Function} callback
 */
Merit.prototype.getAddressSummary = function(addressArg, options, callback) {
  var self = this;
  var summary = {};
  var queryMempool = _.isUndefined(options.queryMempool) ? true : options.queryMempool;
  var summaryTxids = [];
  var mempoolTxids = [];
  var addresses = self._normalizeAddressArg(addressArg);
  var cacheKey = addresses.join('');

  function finishWithTxids() {
    if (!options.noTxList) {
      var allTxids = mempoolTxids.reverse().concat(summaryTxids);
      var fromArg = parseInt(options.from || 0);
      var toArg = parseInt(options.to || self.maxTxids);

      if ((toArg - fromArg) > self.maxTxids) {
        return callback(new Error(
          '"from" (' + fromArg + ') and "to" (' + toArg + ') range should be less than or equal to ' +
            self.maxTxids
        ));
      }
      var paginatedTxids;
      try {
        paginatedTxids = self._paginateTxids(allTxids, fromArg, toArg);
      } catch(e) {
        return callback(e);
      }

      var allSummary = _.clone(summary);
      allSummary.txids = paginatedTxids;
      callback(null, allSummary);
    } else {
      callback(null, summary);
    }
  }

  function querySummary() {
    async.parallel([
      function getTxList(done) {
        self.getAddressTxids(addresses, {queryMempool: false}, function(err, txids) {
          if (err) {
            return done(err);
          }
          summaryTxids = txids;
          summary.appearances = txids.length;
          done();
        });
      },
      function getBalance(done) {
        self.getAddressBalance(addresses, options, function(err, data) {
          if (err) {
            return done(err);
          }
          summary.totalReceived = data.received;
          summary.totalSpent = data.received - data.balance;
          summary.balance = data.balance;
          done();
        });
      },
      function getMempool(done) {
        if (!queryMempool) {
          return done();
        }
        self.client.getAddressMempool({'addresses': addresses}, function(err, response) {
          if (err) {
            return done(self._wrapRPCError(err));
          }
          mempoolTxids = self._getTxidsFromMempool(response.result);
          summary.unconfirmedAppearances = mempoolTxids.length;
          summary.unconfirmedBalance = self._getBalanceFromMempool(response.result);
          done();
        });
      },
    ], function(err) {
      if (err) {
        return callback(err);
      }
      self.summaryCache.set(cacheKey, summary);
      finishWithTxids();
    });
  }

  if (options.noTxList) {
    var summaryCache = self.summaryCache.get(cacheKey);
    if (summaryCache) {
      callback(null, summaryCache);
    } else {
      querySummary();
    }
  } else {
    querySummary();
  }

};

Merit.prototype._maybeGetBlockHash = function(blockArg, callback) {
  var self = this;
  if (_.isNumber(blockArg) || (blockArg.length < 40 && /^[0-9]+$/.test(blockArg))) {
    self._tryAllClients(function(client, done) {
      client.getBlockHash(blockArg, function(err, response) {
        if (err) {
          return done(self._wrapRPCError(err));
        }
        done(null, response.result);
      });
    }, callback);
  } else {
    callback(null, blockArg);
  }
};

/**
 * Will retrieve a block as a Node.js Buffer
 * @param {String|Number} block - A block hash or block height number
 * @param {Function} callback
 */
Merit.prototype.getRawBlock = function(blockArg, callback) {
  // TODO apply performance patch to the RPC method for raw data
  var self = this;

  function queryBlock(err, blockhash) {
    if (err) {
      return callback(err);
    }
    self._tryAllClients(function(client, done) {
      self.client.getBlock(blockhash, false, function(err, response) {
        if (err) {
          return done(self._wrapRPCError(err));
        }
        var buffer = new Buffer(response.result, 'hex');
        self.rawBlockCache.set(blockhash, buffer);
        done(null, buffer);
      });
    }, callback);
  }

  var cachedBlock = self.rawBlockCache.get(blockArg);
  if (cachedBlock) {
    return setImmediate(function() {
      callback(null, cachedBlock);
    });
  } else {
    self._maybeGetBlockHash(blockArg, queryBlock);
  }
};

/**
 * Will retrieve a block as a Merit object
 * @param {String|Number} block - A block hash or block height number
 * @param {Function} callback
 */
Merit.prototype.getBlock = function(blockArg, callback) {
  // TODO apply performance patch to the RPC method for raw data
  var self = this;

  function queryBlock(err, blockhash) {
    if (err) {
      return callback(err);
    }

    self._tryAllClients(function(client, done) {
      client.getBlock(blockhash, false, function(err, response) {
        if (err) {
          return done(self._wrapRPCError(err));
        }
        var blockObj = bitcore.Block.fromString(response.result, self.node.getNetworkName());
        self.blockCache.set(blockhash, blockObj);
        done(null, blockObj);
      });
    }, callback);
  }

  var cachedBlock = self.blockCache.get(blockArg);
  if (cachedBlock) {
    return setImmediate(function() {
      callback(null, cachedBlock);
    });
  } else {
    self._maybeGetBlockHash(blockArg, queryBlock);
  }
};

/**
 * Similar to getBlockHeader but will include a list of txids
 * @param {String|Number} block - A block hash or block height number
 * @param {Function} callback
 */
Merit.prototype.getBlockOverview = function(blockArg, callback) {
  var self = this;

  function queryBlock(err, blockhash) {
    if (err) {
      return callback(err);
    }
    var cachedBlock = self.blockOverviewCache.get(blockhash);
    if (cachedBlock) {
      return setImmediate(function() {
        callback(null, cachedBlock);
      });
    } else {
      self._tryAllClients(function(client, done) {
        client.getBlock(blockhash, true, function(err, response) {
          if (err) {
            return done(self._wrapRPCError(err));
          }
          var result = response.result;
          var blockOverview = {
            hash: result.hash,
            version: result.version,
            confirmations: result.confirmations,
            height: result.height,
            chainWork: result.chainwork,
            prevHash: result.previousblockhash,
            nextHash: result.nextblockhash,
            merkleRoot: result.merkleroot,
            time: result.time,
            medianTime: result.mediantime,
            nonce: result.nonce,
            bits: result.bits,
            difficulty: result.difficulty,
            txids: result.tx
          };
          self.blockOverviewCache.set(blockhash, blockOverview);
          done(null, blockOverview);
        });
      }, callback);
    }
  }

  self._maybeGetBlockHash(blockArg, queryBlock);
};

/**
 * Will retrieve an array of block hashes within a range of timestamps
 * @param {Number} high - The more recent timestamp in seconds
 * @param {Number} low - The older timestamp in seconds
 * @param {Function} callback
 */
Merit.prototype.getBlockHashesByTimestamp = function(high, low, options, callback) {
  var self = this;
  if (_.isFunction(options)) {
    callback = options;
    options = {};
  }
  self.client.getBlockHashes(high, low, options, function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }
    callback(null, response.result);
  });
};

/**
 * Will return the block index information, the output will have the format:
 * {
 *   hash: '0000000000000a817cd3a74aec2f2246b59eb2cbb1ad730213e6c4a1d68ec2f6',
 *   confirmations: 5,
 *   height: 828781,
 *   chainWork: '00000000000000000000000000000000000000000000000ad467352c93bc6a3b',
 *   prevHash: '0000000000000504235b2aff578a48470dbf6b94dafa9b3703bbf0ed554c9dd9',
 *   nextHash: '00000000000000eedd967ec155f237f033686f0924d574b946caf1b0e89551b8'
 *   version: 536870912,
 *   merkleRoot: '124e0f3fb5aa268f102b0447002dd9700988fc570efcb3e0b5b396ac7db437a9',
 *   time: 1462979126,
 *   medianTime: 1462976771,
 *   nonce: 2981820714,
 *   bits: '1a13ca10',
 *   difficulty: 847779.0710240941,
 * }
 * @param {String|Number} block - A block hash or block height
 * @param {Function} callback
 */
Merit.prototype.getBlockHeader = function(blockArg, callback) {
  var self = this;

  function queryHeader(err, blockhash) {
    if (err) {
      return callback(err);
    }
    self._tryAllClients(function(client, done) {
      client.getBlockHeader(blockhash, function(err, response) {
        if (err) {
          return done(self._wrapRPCError(err));
        }
        var result = response.result;
        var header = {
          hash: result.hash,
          version: result.version,
          confirmations: result.confirmations,
          height: result.height,
          chainWork: result.chainwork,
          prevHash: result.previousblockhash,
          nextHash: result.nextblockhash,
          merkleRoot: result.merkleroot,
          time: result.time,
          medianTime: result.mediantime,
          nonce: result.nonce,
          bits: result.bits,
          difficulty: result.difficulty
        };
        done(null, header);
      });
    }, callback);
  }

  self._maybeGetBlockHash(blockArg, queryHeader);
};


/**
 * Will estimate the fee per kilobyte.
 * @param {Number} blocks - The number of blocks for the transaction to be confirmed.
 * @param {Function} callback
 */
Merit.prototype.estimateSmartFee = function(blocks, callback) {
  var self = this;
  this.client.estimateSmartFee(blocks, function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }
    callback(null, response.result);
  });
};

/**
 * Will add a transaction to the mempool and relay to connected peers
 * @param {String|Transaction} transaction - The hex string of the transaction
 * @param {Object=} options
 * @param {Boolean=} options.allowAbsurdFees - Enable large fees
 * @param {Function} callback
 */
Merit.prototype.sendTransaction = function(tx, options, callback) {
  var self = this;
  var allowAbsurdFees = false;
  if (_.isFunction(options) && _.isUndefined(callback)) {
    callback = options;
  } else if (_.isObject(options)) {
    allowAbsurdFees = options.allowAbsurdFees;
  }

  this.client.sendRawTransaction(tx, allowAbsurdFees, function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }
    callback(null, response.result);
  });

};

/**
 * Will get a transaction as a Node.js Buffer. Results include the mempool.
 * @param {String} txid - The transaction hash
 * @param {Function} callback
 */
Merit.prototype.getRawTransaction = function(txid, callback) {
  var self = this;
  var tx = self.rawTransactionCache.get(txid);
  if (tx) {
    return setImmediate(function() {
      callback(null, tx);
    });
  } else {
    self._tryAllClients(function(client, done) {
      client.getRawTransaction(txid, function(err, response) {
        if (err) {
          return done(self._wrapRPCError(err));
        }
        var buffer = new Buffer(response.result, 'hex');
        self.rawTransactionCache.set(txid, buffer);
        done(null, buffer);
      });
    }, callback);
  }
};

/**
 * Will get a transaction as a Merit Transaction. Results include the mempool.
 * @param {String} txid - The transaction hash
 * @param {Boolean} queryMempool - Include the mempool
 * @param {Function} callback
 */
Merit.prototype.getTransaction = function(txid, callback) {
  var self = this;
  var tx = self.transactionCache.get(txid);
  if (tx) {
    return setImmediate(function() {
      callback(null, tx);
    });
  } else {
    self._tryAllClients(function(client, done) {
      client.getRawTransaction(txid, function(err, response) {
        if (err) {
          return done(self._wrapRPCError(err));
        }
        var tx = Transaction();
        tx.fromString(response.result);
        self.transactionCache.set(txid, tx);
        done(null, tx);
      });
    }, callback);
  }
};

/**
 * Will get a detailed view of a transaction including addresses, amounts and fees.
 *
 * Example result:
 * {
 *   blockHash: '000000000000000002cd0ba6e8fae058747d2344929ed857a18d3484156c9250',
 *   height: 411462,
 *   blockTimestamp: 1463070382,
 *   version: 1,
 *   hash: 'de184cc227f6d1dc0316c7484aa68b58186a18f89d853bb2428b02040c394479',
 *   locktime: 411451,
 *   coinbase: true,
 *   inputs: [
 *     {
 *       prevTxId: '3d003413c13eec3fa8ea1fe8bbff6f40718c66facffe2544d7516c9e2900cac2',
 *       outputIndex: 0,
 *       sequence: 123456789,
 *       script: [hexString],
 *       scriptAsm: [asmString],
 *       address: '1LCTmj15p7sSXv3jmrPfA6KGs6iuepBiiG',
 *       micros: 771146
 *     }
 *   ],
 *   outputs: [
 *     {
 *       micros: 811146,
 *       script: '76a914d2955017f4e3d6510c57b427cf45ae29c372c99088ac',
 *       scriptAsm: 'OP_DUP OP_HASH160 d2955017f4e3d6510c57b427cf45ae29c372c990 OP_EQUALVERIFY OP_CHECKSIG',
 *       address: '1LCTmj15p7sSXv3jmrPfA6KGs6iuepBiiG',
 *       spentTxId: '4316b98e7504073acd19308b4b8c9f4eeb5e811455c54c0ebfe276c0b1eb6315',
 *       spentIndex: 1,
 *       spentHeight: 100
 *     }
 *   ],
 *   inputMicros: 771146,
 *   outputMicros: 811146,
 *   feeMicros: 40000
 * };
 *
 * @param {String} txid - The hex string of the transaction
 * @param {Function} callback
 */
Merit.prototype.getDetailedTransaction = function(txid, callback) {
  var self = this;
  var tx = self.transactionDetailedCache.get(txid);

  function getMicros (input, isInvite) {
    if (input.valueSat) {
      return input.valueSat;
    }

    if (isInvite && input.value) {
      return input.value;
    }

    return null;
  }

  // ToDo: valueSat must be valueXXX after renaming in merit-cli
  function addInputsToTx(tx, result) {
    tx.inputs = [];
    tx.inputMicros = 0;
    for(var inputIndex = 0; inputIndex < result.vin.length; inputIndex++) {
      var input = result.vin[inputIndex];
      if (!tx.isCoinbase && input.valueSat) {
        tx.inputMicros += input.valueSat; // TODO: rename sat
      }
      if (!tx.isCoinbase && tx.isInvite) {
        tx.inputMicros += input.value; // TODO: rename sat
      }
      var script = null;
      var scriptAsm = null;
      if (input.scriptSig) {
        script = input.scriptSig.hex;
        scriptAsm = input.scriptSig.asm;
      } else if (input.isCoinbase) {
        script = input.isCoinbase;
      }
      tx.inputs.push({
        prevTxId: input.txid || null,
        outputIndex: _.isUndefined(input.vout) ? null : input.vout,
        script: script,
        scriptAsm: scriptAsm || null,
        sequence: input.sequence,
        address: input.address || null,
        alias: input.alias || null,
        micros: getMicros(input, tx), // TODO: rename sat
      });
    }
  }

  function addOutputsToTx(tx, result) {
    tx.outputs = [];
    tx.outputMicros = 0;
    for(var outputIndex = 0; outputIndex < result.vout.length; outputIndex++) {
      var out = result.vout[outputIndex];
      tx.outputMicros += !tx.isInvite ? out.valueSat : out.value; // TODO: rename sat
      var address = null;
      var alias = null;
      if (out.scriptPubKey && out.scriptPubKey.addresses && out.scriptPubKey.addresses.length === 1) {
        address = out.scriptPubKey.addresses[0];
        alias = out.scriptPubKey.aliases && out.scriptPubKey.aliases.length ? out.scriptPubKey.aliases[0] : null;
      }
      tx.outputs.push({
        micros: !tx.isInvite ? out.valueSat : out.value, // TODO: rename sat
        script: out.scriptPubKey.hex,
        scriptAsm: out.scriptPubKey.asm,
        spentTxId: out.spentTxId,
        spentIndex: out.spentIndex,
        spentHeight: out.spentHeight,
        address,
        alias
      });
    }
  }

  if (tx) {
    return setImmediate(function() {
      callback(null, tx);
    });
  } else {
    self._tryAllClients(function(client, done) {
      client.getRawTransaction(txid, 1, function(err, response) {
        if (err) {
          return done(self._wrapRPCError(err));
        }
        var result = response.result;
        var tx = {
          size: result.size,
          blockHash: result.blockhash,
          height: result.height ? result.height : -1,
          blockTimestamp: result.time,
          version: result.version,
          hash: txid,
          locktime: result.locktime,
          isInvite: result.version === bitcore.Transaction.INVITE_VERSION,
        };

        if (result.vin[0] && result.vin[0].coinbase) {
          tx.isCoinbase = true;
        }

        addInputsToTx(tx, result);
        addOutputsToTx(tx, result);

        if (!tx.isCoinbase) {
          tx.feeMicros = tx.inputMicros - tx.outputMicros;
        } else {
          tx.feeMicros = 0;
        }

        self.transactionDetailedCache.set(txid, tx);

        done(null, tx);
      });
    }, callback);
  }
};

/**
 * Will get the best block hash for the chain.
 * @param {Function} callback
 */
Merit.prototype.getBestBlockHash = function(callback) {
  var self = this;
  this.client.getBestBlockHash(function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }
    callback(null, response.result);
  });
};

/**
 * Will give the txid and inputIndex that spent an output
 * @param {Function} callback
 */
Merit.prototype.getSpentInfo = function(options, callback) {
  var self = this;
  this.client.getSpentInfo(options, function(err, response) {
    if (err && err.code === -5) {
      return callback(null, {});
    } else if (err) {
      return callback(self._wrapRPCError(err));
    }
    callback(null, response.result);
  });
};

/**
 * This will return information about the database in the format:
 * {
 *   version: 110000,
 *   protocolVersion: 70002,
 *   blocks: 151,
 *   timeOffset: 0,
 *   connections: 0,
 *   difficulty: 4.6565423739069247e-10,
 *   testnet: false,
 *   network: 'testnet'
 *   relayFee: 1000,
 *   errors: ''
 * }
 * @param {Function} callback
 */
Merit.prototype.getInfo = function(callback) {
  var self = this;
  this.client.getInfo(function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }
    var result = response.result;
    var info = {
      version: result.version,
      protocolVersion: result.protocolversion,
      blocks: result.blocks,
      timeOffset: result.timeoffset,
      connections: result.connections,
      proxy: result.proxy,
      difficulty: result.difficulty,
      testnet: result.testnet,
      relayFee: result.relayfee,
      errors: result.errors,
      network: self.node.getNetworkName()
    };
    callback(null, info);
  });
};

Merit.prototype.generateBlock = function(num, callback) {
  var self = this;
  this.client.generate(num, function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }
    callback(null, response.result);
  });
};

Merit.prototype.validateAddress = function(address, callback) {
  const self = this;

  if (typeof address === 'string' || address instanceof String) {
    self.client.validateaddress(address, function(err, response) {
      if (err) {
        return callback(self._wrapRPCError(err));
      } else {
        callback(null, response);
      }
    });
  } else {
    var err = new errors.RPCError('Address was missing or incorrect');
    err.code = -8;

    return callback(self._wrapRPCError(err));
  }
};

/**
 * Checks if an easyScript is on the blockChain.
 * @param {String} easyScript - The full easyScript value.
 */
 Merit.prototype.getInputForEasySend = function(easyScript, callback) {
   log.info('ValidateEasyScript RPC called: ', easyScript);

   const self = this;

  if (typeof easyScript == 'string' || easyScript instanceof String) {
    self.client.getInputForEasySend(easyScript, function(err, response) {
      if (err) {
        return callback(self._wrapRPCError(err));
      } else {
        callback(null, response);
      }
    });
   } else {
     var err = new errors.RPCError('EasyScript was missing or incorrect');
     err.code = -8;
     return callback(self._wrapRPCError(err));
   }
 };

/**
 * Get ANV for array of keys
 * @param {Array} keys
 * @param {Function} callback
 */
Merit.prototype.getANV = function(addressArg, callback) {
  var self = this;
  var addresses = self._normalizeAddressArg(addressArg);
  var cacheKey = addresses.join('');
  var anv = self.anvCache.get(cacheKey);

  if (anv) {
    return setImmediate(function() {
      callback(null, anv);
    });
  }

  self.client.getaddressanv({ addresses: addresses }, function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }

    self.anvCache.set(cacheKey, response.result);
    callback(null, response.result);
  });
}

Merit.prototype.getCommunityInfo = function(addressArg, callback) {
  const address = this._normalizeAddressArg(addressArg);

  this.client.getcommunityinfo(address, (err, res) => {
    if (err) {
      return callback(this._wrapRPCError(err));
    }

    callback(null, res.result);
  });
};

/**
 * Get Rewards for array of addresses
 * @param {Array} keys
 * @param {Function} callback
 */
Merit.prototype.getRewards = function(addressArg, callback) {
  var self = this;
  var addresses = self._normalizeAddressArg(addressArg);
  var cacheKey = addresses.join('');
  var rewards = self.rewardsCache.get(cacheKey);


  if (rewards) {
    return setImmediate(function() {
      callback(null, rewards);
    });
  }

  this.client.getaddressrewards({ addresses: addresses }, function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }

    self.rewardsCache.set(cacheKey, response.result);
    callback(null, response.result);
  });
}

/**
 * Send raw referral to nodes
 * @param {String|Referral} referral - The hex string of the referral
 * @param {Function} callback
 */
Merit.prototype.sendReferral = function(referral, callback) {
  var self = this;

  this.client.sendRawReferral(referral, function(err, response) {
    if (err) {
      return callback(self._wrapRPCError(err));
    }
    callback(null, response.result);
  });

}

/**
 * Called by Node to stop the service.
 * @param {Function} callback
 */
Merit.prototype.stop = function(callback) {
  if (this.spawn && this.spawn.process) {
    var exited = false;
    this.spawn.process.once('exit', function(code) {
      if (!exited) {
        exited = true;
        if (code !== 0) {
          var error = new Error('meritd spawned process exited with status code: ' + code);
          error.code = code;
          return callback(error);
        } else {
          return callback();
        }
      }
    });
    this.spawn.process.kill('SIGINT');
    setTimeout(function() {
      if (!exited) {
        exited = true;
        return callback(new Error('meritd process did not exit'));
      }
    }, this.shutdownTimeout).unref();
  } else {
    callback();
  }
};

const { promisify } = require('util');
Merit.prototype.getMempoolReferrals = async function(addresses) {
    const {err, result} = await promisify(this.client.getaddressmempoolreferrals.bind(this.client))({addresses: addresses});
    if (err) throw err;
    return result;
};

Merit.prototype.getBlockchainReferrals = async function(addresses) {
    const {err, result} = await promisify(this.client.getaddressreferrals.bind(this.client))({addresses: addresses});
    if (err) throw err;
    return result;
};

Merit.prototype.getAddressMempool = async function(addresses) {
    const {err, result} = await promisify(this.client.getAddressMempool.bind(this.client))({addresses: addresses});
    if (err) throw err;
    return result;
};

Merit.prototype.getCommunityRank = async function(addresses) {
    const {err, result} = await promisify(this.client.getaddressrank.bind(this.client))({addresses: addresses});
    if (err) throw err;
    return result;
};

Merit.prototype.getCommunityLeaderboard = async function(limit) {
    const {err, result} = await promisify(this.client.getaddressleaderboard.bind(this.client))(limit);
    if (err) throw err;
    return result;
};


module.exports = Merit;
