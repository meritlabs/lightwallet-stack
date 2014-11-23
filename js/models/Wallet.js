'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var preconditions = require('preconditions').singleton();
var inherits = require('inherits');
var events = require('events');
var async = require('async');

var bitcore = require('bitcore');
var BIP21 = bitcore.BIP21;
var bignum = bitcore.Bignum;
var coinUtil = bitcore.util;
var buffertools = bitcore.buffertools;
var Builder = bitcore.TransactionBuilder;
var SecureRandom = bitcore.SecureRandom;
var Base58Check = bitcore.Base58.base58Check;
var Address = bitcore.Address;
var PayPro = bitcore.PayPro;
var Transaction = bitcore.Transaction;

var log = require('../log');
var cryptoUtil = require('../util/crypto');
var httpUtil = require('../util/HTTP');
var HDParams = require('./HDParams');
var PublicKeyRing = require('./PublicKeyRing');
var TxProposal = require('./TxProposal');
var TxProposals = require('./TxProposals');
var PrivateKey = require('./PrivateKey');
var Async = require('./Async');
var Insight = module.exports.Insight = require('./Insight');
var copayConfig = require('../../config');

var TX_MAX_INS = 70;


/**
 * @desc
 * Wallet manages a private key for Copay, network, storage of the wallet for
 * persistance, and blockchain information.
 *
 * @TODO: Split this leviathan.
 *
 * @param {Object} opts
 * @param {Network} opts.network - used to send and retrieve messages from
 *                                 copayers
 * @param {Blockchain} opts.blockchain - source of truth for what happens in
 *                                       the blockchain (utxos, balances)
 * @param {number} opts.requiredCopayers - number of required copayers to
 *                                         release funds
 * @param {number} opts.totalCopayers - number of copayers in the wallet
 * @param {boolean} opts.spendUnconfirmed - whether it's safe to spend
 *                                          unconfirmed outputs or not
 * @param {PublicKeyRing} opts.publicKeyRing - an instance of {@link PublicKeyRing}
 * @param {TxProposals} opts.txProposals - an instance of {@link TxProposals}
 * @param {PrivateKey} opts.privateKey - an instance of {@link PrivateKey}
 * @param {string} opts.version - the version of copay where this wallet was
 *                                created
 * @TODO: figure out if reconnectDelay is set in milliseconds
 * @param {number} opts.reconnectDelay - amount of seconds to wait before
 *                                       attempting to reconnect
 * @constructor
 */
function Wallet(opts) {
  var self = this;
  preconditions.checkArgument(opts);

  opts.reconnectDelay = opts.reconnectDelay || 500;

  var networkName = Wallet.obtainNetworkName(opts);
  preconditions.checkState((opts.network && opts.blockchain) || networkName);

  opts.network = opts.network || Wallet._newAsync(opts.networkOpts[networkName]);
  opts.blockchain = opts.blockchain || Wallet._newInsight(opts.blockchainOpts[networkName]);;
  this.httpUtil = opts.httpUtil || httpUtil;

  //required params
  ['network', 'blockchain',
    'requiredCopayers', 'totalCopayers', 'spendUnconfirmed',
    'publicKeyRing', 'txProposals', 'privateKey', 'version',
    'reconnectDelay'
  ].forEach(function(k) {
    preconditions.checkArgument(!_.isUndefined(opts[k]), 'MISSOPT: missing required option for Wallet: ' + k);
    self[k] = opts[k];
  });


  this.id = opts.id || Wallet.getRandomId();
  this.secretNumber = opts.secretNumber || Wallet.getRandomSecretNumber();
  // TODO
  //  this.lock = new WalletLock(this.storage, this.id, opts.lockTimeOutMin);
  this.settings = opts.settings || copayConfig.wallet.settings;
  this.name = opts.name;

  this.publicKeyRing.walletId = this.id;
  this.txProposals.walletId = this.id;
  this.registeredPeerIds = [];
  this.addressBook = opts.addressBook || {};
  this.publicKey = this.privateKey.publicHex;
  this.focusedTimestamp = opts.focusedTimestamp || 0;
  this.syncedTimestamp = opts.syncedTimestamp || 0;
  this.lastMessageFrom = {};

  this.paymentRequests = opts.paymentRequests || {};

  var networkName = Wallet.obtainNetworkName(opts);

  preconditions.checkArgument(this.network.setHexNonce, 'Incorrect network parameter');
  preconditions.checkArgument(this.blockchain.getTransaction, 'Incorrect blockchain parameter');


  this.network.maxPeers = this.totalCopayers;
  this.network.secretNumber = this.secretNumber;

  //network nonces are 8 byte buffers, representing a big endian number
  //one nonce for oneself, and then one nonce for each copayer
  this.network.setHexNonce(opts.networkNonce);
  this.network.setHexNonces(opts.networkNonces);
}

inherits(Wallet, events.EventEmitter);


Wallet.TX_BROADCASTED = 'txBroadcasted';
Wallet.TX_PROPOSAL_SENT = 'txProposalSent';
Wallet.TX_SIGNED = 'txSigned';

Wallet.prototype.emitAndKeepAlive = function(args) {
  var args = Array.prototype.slice.call(arguments);
  log.debug('Wallet Emitting:', args);
  this.keepAlive();
  this.emit.apply(this, arguments);
};

/**
 * @TODO: Document this. Its usage is kind of weird
 *
 * @static
 * @property lockTime
 * @property signhash
 * @property fee
 * @property feeSat
 */
Wallet.builderOpts = {
  lockTime: null,
  signhash: bitcore.Transaction.SIGHASH_ALL,
  fee: undefined,
  feeSat: undefined,
};

/**
 * @desc static list with persisted properties of a wallet.
 * These are the properties that get stored/read from localstorage
 */
Wallet.PERSISTED_PROPERTIES = [
  'opts',
  'settings',
  'publicKeyRing',
  'txProposals',
  'privateKey',
  'addressBook',
  'focusedTimestamp',
  'syncedTimestamp',
  'secretNumber',
];

Wallet.COPAYER_PAIR_LIMITS = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 4,
  6: 3,
  7: 3,
  8: 2,
  9: 2,
  10: 2,
  11: 1,
  12: 1,
};

Wallet.getStoragePrefix = function() {
  return 'wallet::';
};

Wallet.getStorageKey = function(str) {
  return Wallet.getStoragePrefix() + str;
};

Wallet.prototype.getStorageKey = function() {
  return Wallet.getStorageKey(this.getId());
};

/* for stubbing */
Wallet._newInsight = function(opts) {
  return new Insight(opts);
};

/* for stubbing */
Wallet._newAsync = function(opts) {
  return new Async(opts);
};

/**
 * @desc Retrieve a random id for the wallet
 * @TODO: Discuss changing to a UUID
 * @return {string} 8 bytes, hexa encoded
 */
Wallet.getRandomId = function() {
  var r = bitcore.SecureRandom.getPseudoRandomBuffer(8).toString('hex');
  return r;
};

/**
 * @desc Retrieve a random secret number to secure wallet secret
 * @return {string} 5 bytes, hexa encoded
 */
Wallet.getRandomSecretNumber = function() {
  var r = bitcore.SecureRandom.getPseudoRandomBuffer(5).toString('hex')
  return r;
};

/**
 * @desc
 * Get the maximum allowed number of required copayers.
 * This is a limit imposed by the maximum allowed size of the scriptSig.
 * @param {number} totalCopayers - the total number of copayers
 * @return {number}
 */
Wallet.getMaxRequiredCopayers = function(totalCopayers) {
  return Wallet.COPAYER_PAIR_LIMITS[totalCopayers];
};

/**
 * @desc obtain network name from serialized wallet
 * @param {Object} wallet object
 * @return {string} network name
 */
Wallet.obtainNetworkName = function(obj) {
  return obj.networkName ||
    (obj.opts ? obj.opts.networkName : null) ||
    (obj.publicKeyRing ? (obj.publicKeyRing.networkName || obj.publicKeyRing.network.name) : null) ||
    (obj.privateKey ? obj.privateKey.networkName : null);
};



/**
 * @desc Set the copayer id for the owner of this wallet
 * @param {string} pubkey - the pubkey to set to the {@link Wallet#seededCopayerId} property
 */
Wallet.prototype.seedCopayer = function(pubKey) {
  this.seededCopayerId = pubKey;
};


Wallet.prototype._newAddresses = function(dontUpdateUx) {
  this.subscribeToAddresses();
  this.emitAndKeepAlive('newAddresses', dontUpdateUx);
};


/**
 * @desc Handles an 'indexes' message.
 *
 * Processes the data using {@link HDParams#fromList} and merges it with the
 * {@link Wallet#publicKeyRing}.
 *
 * @param {string} senderId - the sender id
 * @param {Object} data - the data recived, {@see HDParams#fromList}
 */
Wallet.prototype._onIndexes = function(senderId, data) {
  var inIndexes = HDParams.fromList(data.indexes);
  var hasChanged = this.publicKeyRing.mergeIndexes(inIndexes);
  if (hasChanged) {
    this._newAddresses();
  }
};

/**
 * @desc
 * Changes wallet settings. The settings format is:
 *
 *   var settings = {
 *     unitName: 'bits',
 *     unitToSatoshi: 100,
 *     alternativeName: 'US Dollar',
 *     alternativeIsoCode: 'USD',
 *   };
 */
Wallet.prototype.changeSettings = function(settings) {
  this.settings = settings;
  this.emitAndKeepAlive('settingsUpdated');
};

/**
 * @desc
 * Handles a 'PUBLICKEYRING' message from <tt>senderId</tt>.
 *
 * <tt>data.publicKeyRing</tt> is expected to be processed correctly by
 * {@link PublicKeyRing#fromObj}.
 *
 * After successful deserialization, {@link Wallet#publicKeyRing} is merged
 * with the received data, a call to {@link Wallet#store} is performed if the
 * internal state has changed.
 *
 * This locks new incoming connections in case the public key ring is completed
 *
 * @param {string} senderId - the sender id
 * @param {Object} data - the data recived, {@see HDParams#fromList}
 * @param {Object} data.publicKeyRing - data to be deserialized into a {@link PublicKeyRing}
 *                                      using {@link PublicKeyRing#fromObj}
 * @emits connectionError
 */
Wallet.prototype._onPublicKeyRing = function(senderId, data) {
  log.debug('Wallet:' + this.id + ' RECV PUBLICKEYRING:', data);

  var inPKR = PublicKeyRing.fromObj(data.publicKeyRing);
  var wasIncomplete = !this.publicKeyRing.isComplete();
  var hasChanged;

  try {
    hasChanged = this.publicKeyRing.merge(inPKR, true);
  } catch (e) {
    log.debug('Wallet:' + this.id + '## WALLET ERROR', e);
    this.emitAndKeepAlive('connectionError', e.message);
    return;
  }
  if (hasChanged) {
    if (wasIncomplete) {
      this.sendPublicKeyRing();
    }
    if (this.publicKeyRing.isComplete()) {
      this._lockIncomming();
    }

    this.emitAndKeepAlive('publicKeyRingUpdated');
  }
};

/**
 * @desc
 * Demultiplexes calls to update TxProposal updates
 *
 * @param {string} senderId - the copayer that sent this event
 * @param {Object} m - the data received
 * @emits txProposalEvent
 */
Wallet.prototype._processProposalEvents = function(senderId, m) {
  var ev;
  if (m) {
    if (m.new) {
      ev = {
        type: 'new',
        cId: senderId
      }
    } else if (m.newCopayer.length) {
      ev = {
        type: 'signed',
        cId: m.newCopayer[0]
      };
    }
  } else {
    ev = {
      type: 'corrupt',
      cId: senderId
    };
  }
  if (ev)
    this.emitAndKeepAlive('txProposalEvent', ev);
};


/* OTDO
   events.push({
type: 'signed',
cId: k,
txId: ntxid
});
*/
/**
 * @desc
 * Retrieves a keymap from from a transaction proposal set extracts a maps from
 * public key to cosignerId for each signed input of the transaction proposal.
 *
 * @param {TxProposals} txp - the transaction proposals
 * @return {Object}
 */
Wallet.prototype._getKeyMap = function(txp) {
  preconditions.checkArgument(txp);
  var inSig0, keyMapAll = {};

  for (var i in txp._inputSigners) {
    var keyMap = this.publicKeyRing.copayersForPubkeys(txp._inputSigners[i], txp.inputChainPaths);

    if (_.size(keyMap) !== _.size(txp._inputSigners[i]))
      throw new Error('Signature does not match known copayers');

    for (var j in keyMap) {
      keyMapAll[j] = keyMap[j];
    }

    // From here -> only to check that all inputs have the same sigs
    var inSigArr = [];
    _.each(keyMap, function(value, key) {
      inSigArr.push(value);
    });
    var inSig = JSON.stringify(inSigArr.sort());
    if (i === '0') {
      inSig0 = inSig;
      continue;
    }
    if (inSig !== inSig0)
      throw new Error('found inputs with different signatures');
  }
  return keyMapAll;
};

/**
 * @callback transactionCallback
 * @param {false|Transaction} returnValue
 */

/**
 * @desc
 * Asyncchronously check with the blockchain if a given transaction was sent.
 *
 * @param {string} ntxid - the transaction
 * @param {transactionCallback} cb
 */
Wallet.prototype._checkSentTx = function(ntxid, cb) {
  var txp = this.txProposals.get(ntxid);
  var tx = txp.builder.build();

  var txHex = tx.serialize().toString('hex');

  //Use calcHash NOT getHash which could be cached.
  var txid = bitcore.util.formatHashFull(tx.calcHash());
  this.blockchain.getTransaction(txid, function(err, tx) {
    if (err) return cb(false);
    return cb(txid);
  });
};

Wallet.prototype._processTxProposalSeen = function(ntxid) {
  var txp = this.txProposals.get(ntxid);
  if (!txp.getSeen(this.getMyCopayerId())) {
    txp.setSeen(this.getMyCopayerId());
    this.sendSeen(ntxid);
  }
};



Wallet.prototype._checkIfTxProposalIsSent = function(ntxid, cb) {
  var self = this;
  var txp = this.txProposals.get(ntxid);

  this._checkSentTx(ntxid, function(txid) {
    if (txid) {
      if (!txp.getSent()) {
        txp.setSent(txid);
      }
    }
    self.emitAndKeepAlive('txProposalsUpdated');
    if (cb) return cb(null, txid, txid ? Wallet.TX_BROADCASTED : null);
  });
};


Wallet.prototype._processTxProposalPayPro = function(mergeInfo, cb) {
  var self = this;
  var txp = mergeInfo.txp;
  var isNew = mergeInfo.new;
  var ntxid = mergeInfo.ntxid;

  if (!isNew || !txp.paymentProtocolURL)
    return cb();

  log.info('Received a Payment Protocol TX Proposal');
  self.fetchPaymentRequest({
    url: txp.paymentProtocolURL
  }, function(err, merchantData) {
    if (err) return cb(err);

    // This will verify current TXP data vs. merchantData (e.g., out addresses)
    try {
      txp.addMerchantData(merchantData);
    } catch (e) {
      log.error(e);
      err = 'BADPAYPRO: ' + e.toString();
    }
    return cb(err);
  });
};

Wallet.prototype._processIncomingTxProposal = function(mergeInfo, cb) {
  if (!mergeInfo) return cb();
  var self = this;

  self._processTxProposalPayPro(mergeInfo, function(err) {
    if (err) return cb(err);

    self._processTxProposalSeen(mergeInfo.ntxid);

    var tx = mergeInfo.txp.builder.build();
    if (tx.isComplete())
      self._checkIfTxProposalIsSent(mergeInfo.ntxid);
    else {
      self.emitAndKeepAlive('txProposalsUpdated');
    }
    return cb();
  });
};

/**
 * @desc
 * Handles a 'TXPROPOSAL' network message
 *
 * @param {string} senderId - the id of the sender
 * @param {Object} data - the data received
 * @param {Object} data.txProposal - first parameter for {@link TxProposals#merge}
 * @emits txProposalsUpdated
 */
Wallet.prototype._onTxProposal = function(senderId, data) {
  var self = this;
  var m;

  try {
    m = this.txProposals.merge(data.txProposal, Wallet.builderOpts);
    var keyMap = this._getKeyMap(m.txp);
    m.newCopayer = m.txp.setCopayers(senderId, keyMap);
  } catch (e) {
    log.error('Corrupt TX proposal received from:', senderId, e.toString());
    if (m && m.ntxid)
      this.txProposals.deleteOne(m.ntxid);
    m = null;
  }

  this._processIncomingTxProposal(m, function(err) {
    if (err) {
      log.error('Corrupt TX proposal received from:', senderId, err.toString());
      if (m && m.ntxid)
        self.txProposals.deleteOne(m.ntxid);
      m = null;
    } else {
      if (m && m.hasChanged)
        self.sendTxProposal(m.ntxid);
    }
    self._processProposalEvents(senderId, m);
  });
};

/**
 * @desc
 * Handle a REJECT message received
 *
 * @param {string} senderId
 * @param {Object} data
 * @param {string} data.ntxid
 * @emits txProposalsUpdated
 * @emits txProposalEvent
 */
Wallet.prototype._onReject = function(senderId, data) {
  preconditions.checkState(data.ntxid);
  log.debug('Wallet:' + this.id + ' RECV REJECT:', data);

  var txp = this.txProposals.get(data.ntxid);

  if (!txp)
    throw new Error('Received Reject for an unknown TX from:' + senderId);

  if (txp.signedBy[senderId])
    throw new Error('Received Reject for an already signed TX from:' + senderId);

  txp.setRejected(senderId);
  this.emitAndKeepAlive('txProposalEvent', {
    type: 'rejected',
    cId: senderId,
    txId: data.ntxid
  });
};

/**
 * @desc
 * Handle a SEEN message received
 *
 * @param {string} senderId
 * @param {Object} data
 * @param {string} data.ntxid
 * @emits txProposalsUpdated
 * @emits txProposalEvent
 */
Wallet.prototype._onSeen = function(senderId, data) {
  preconditions.checkState(data.ntxid);
  var txp = this.txProposals.get(data.ntxid);
  txp.setSeen(senderId);
  this.emitAndKeepAlive('txProposalEvent', {
    type: 'seen',
    cId: senderId,
    txId: data.ntxid
  });

};

/**
 * @desc
 * Handle a ADDRESSBOOK message received
 *
 * @param {string} senderId
 * @param {Object} data
 * @param {Object} data.addressBook
 * @emits addressBookUpdated
 * @emits txProposalEvent
 */
Wallet.prototype._onAddressBook = function(senderId, data) {
  if (!data.addressBook || !_.isObject(data.addressBook))
    return;

  var self = this, hasChange;
  _.each(data.addressBook, function(value, key) {
    if (!self.addressBook[key] && Address.validate(key)) {

      self.addressBook[key] = _.pick(value, ['createdTs', 'label']);

      // Force author to senderId.
      self.addressBook[key].copayerId = senderId;

      hasChange = true;
    }
  });
console.log('[Wallet.js.635:hasChange:]',hasChange); //TODO

  if (hasChange) {
    this.emitAndKeepAlive('addressBookUpdated');
  }
};

/**
 * @desc Updates the wallet's last modified timestamp and triggers a save
 * @param {number} ts - the timestamp
 */
Wallet.prototype.updateFocusedTimestamp = function(ts) {
  preconditions.checkArgument(ts);
  preconditions.checkArgument(_.isNumber(ts));
  preconditions.checkArgument(ts > 2999999999, 'use miliseconds');
  this.focusedTimestamp = ts;
};


Wallet.prototype.updateSyncedTimestamp = function(ts) {
  preconditions.checkArgument(ts);
  preconditions.checkArgument(_.isNumber(ts));
  preconditions.checkArgument(ts > 2999999999999, 'use microseconds');
  this.syncedTimestamp = ts;
};


/**
 * @desc Called when there are no messages in the server
 * Triggers a call to {@link Wallet#sendWalletReady}
 */
Wallet.prototype._onNoMessages = function() {
  log.debug('Wallet:' + this.id + ' No messages at the server. Requesting peer sync from: ' + (this.syncedTimestamp + 1));
  this.sendWalletReady(null, parseInt((this.syncedTimestamp + 1) / 1000000));
};

/**
 * @desc Demultiplexes a new message received through the wire
 *
 * @param {string} senderId - the sender id
 * @param {Object} data - the received object
 * @param {number} ts - the timestamp when this object was received
 *
 * @emits corrupt
 */
Wallet.prototype._onData = function(senderId, data, ts) {
console.log('[Wallet.js.533]0', this.txProposals.txps); //TODO
  preconditions.checkArgument(senderId);
  preconditions.checkArgument(data);
  preconditions.checkArgument(data.type);
  preconditions.checkArgument(ts);
  preconditions.checkArgument(_.isNumber(ts));

  log.debug('Wallet:' + this.getName() + ' RECV:', data.type, data, senderId);

  this.updateSyncedTimestamp(ts);

  if (data.type !== 'walletId' && this.id !== data.walletId) {
    log.debug('Wallet:' + this.id + ' Received corrupt message:', data)
    this.emitAndKeepAlive('corrupt', senderId);
    return;
  }

  switch (data.type) {
    // This handler is repeaded on WalletFactory (#join). TODO
    case 'walletId':
      this.sendWalletReady(senderId);
      break;
    case 'walletReady':
      if (this.lastMessageFrom[senderId] !== 'walletReady') {
        log.debug('Wallet:' + this.id + ' peer Sync received. since: ' + (data.sinceTs || 0));
        this.sendPublicKeyRing(senderId);
        this.sendAddressBook(senderId);
        this.sendAllTxProposals(senderId, data.sinceTs); // send old txps
      }
      break;
    case 'publicKeyRing':
      this._onPublicKeyRing(senderId, data);
      break;
    case 'reject':
      this._onReject(senderId, data);
      break;
    case 'seen':
      this._onSeen(senderId, data);
      break;
    case 'txProposal':
      this._onTxProposal(senderId, data);
      break;
    case 'indexes':
      this._onIndexes(senderId, data);
      break;
    case 'addressbook':
      this._onAddressBook(senderId, data);
      break;
      // unused messages
    case 'disconnect':
      //case 'an other unused message':
      break;
    default:
      throw new Error('unknown message type received: ' + data.type + ' from: ' + senderId)
  }
  this.lastMessageFrom[senderId] = data.type;

};

/**
 * @desc Handles a connect message
 * @param {string} newCopayerId - the new copayer in the wallet
 * @emits connect
 */
Wallet.prototype._onConnect = function(newCopayerId) {
  if (newCopayerId) {
    log.debug('Wallet:' + this.id + '#### Setting new COPAYER:', newCopayerId);
    this.sendWalletId(newCopayerId);
  }

  var peerID = this.network.peerFromCopayer(newCopayerId);
  this.emitAndKeepAlive('connect', peerID);
};

/**
 * @desc Returns the network name for this wallet ('testnet' or 'livenet')
 * @return {string}
 */
Wallet.prototype.getNetworkName = function() {
  return this.publicKeyRing.network.name;
};

/**
 * @return {bool}
 */
Wallet.prototype.isTestnet = function() {
  return this.publicKeyRing.network.name === 'testnet';
};



/**
 * @desc Serialize options into an object
 * @return {Object} with keys <tt>id</tt>, <tt>spendUnconfirmed</tt>,
 * <tt>requiredCopayers</tt>, <tt>totalCopayers</tt>, <tt>name</tt>,
 * <tt>version</tt>
 */
Wallet.prototype._optsToObj = function() {
  var obj = {
    id: this.id,
    spendUnconfirmed: this.spendUnconfirmed,
    requiredCopayers: this.requiredCopayers,
    totalCopayers: this.totalCopayers,
    name: this.name,
    version: this.version,
    networkName: this.getNetworkName(),
  };

  return obj;
};

/**
 * @desc Retrieve the copayerId pubkey for a given index
 * @param {number=} index - the index of the copayer, ours by default
 * @return {string} hex-encoded pubkey
 */
Wallet.prototype.getCopayerId = function(index) {
  return this.publicKeyRing.getCopayerId(index || 0);
};

/**
 * @desc Get my own pubkey
 * @return {string} hex-encoded pubkey
 */
Wallet.prototype.getMyCopayerId = function() {
  return this.getCopayerId(0); //copayer id is hex of a public key
};

/**
 * @desc Retrieve my private key
 * @return {string} hex-encoded private key
 */
Wallet.prototype.getMyCopayerIdPriv = function() {
  return this.privateKey.getIdPriv(); //copayer idpriv is hex of a private key
};

/**
 * @desc Get my own nickname
 * @return {string} copayer nickname
 */
Wallet.prototype.getMyCopayerNickname = function() {
  return this.publicKeyRing.nicknameForCopayer(this.getMyCopayerId());
};

/**
 * @desc Returns the secret value for other users to join this wallet
 * @return {string} my own pubkey, base58 encoded
 */
Wallet.prototype.getSecretNumber = function() {
  return this.secretNumber;
};

/**
 * @desc Returns the secret number used to prevent MitM attacks from Insight
 * @return {string}
 */
Wallet.prototype.getSecret = function() {
  var buf = new Buffer(
    this.getMyCopayerId() +
    this.getSecretNumber() +
    (this.getNetworkName() === 'livenet' ? '00' : '01'),
    'hex');
  var str = Base58Check.encode(buf);
  return str;
};

/**
 * @desc Returns an object with a <tt>pubKey</tt> value, an hex representation
 * of a public key
 * @param {string} secretB - the secret to be base58-decoded
 * @return {Object}
 */
Wallet.decodeSecret = function(secretB) {
  try {
    var secret = Base58Check.decode(secretB);
    var pubKeyBuf = secret.slice(0, 33);
    var secretNumber = secret.slice(33, 38);
    var networkName = secret.slice(38, 39).toString('hex') === '00' ? 'livenet' : 'testnet';
    return {
      pubKey: pubKeyBuf.toString('hex'),
      secretNumber: secretNumber.toString('hex'),
      networkName: networkName,
    }
  } catch (e) {
    log.debug(e.message);
    return false;
  }
};

/**
 * @desc Locks other sessions from connecting to the wallet
 * @see Async#lockIncommingConnections
 */
Wallet.prototype._lockIncomming = function() {
  this.network.lockIncommingConnections(this.publicKeyRing.getAllCopayerIds());
};

Wallet.prototype._setBlockchainListeners = function() {
  var self = this;
  self.blockchain.removeAllListeners();
  self.subscribeToAddresses();

  log.debug('Setting Blockchain listeners for', this.getName());
  self.blockchain.on('reconnect', function(attempts) {
    log.debug('Wallet:' + self.id + 'blockchain reconnect event');
    self.emitAndKeepAlive('insightReconnected');
  });

  self.blockchain.on('disconnect', function() {
    log.debug('Wallet:' + self.id + 'blockchain disconnect event');
    self.emitAndKeepAlive('insightError');
  });
  self.blockchain.on('tx', function(tx) {
    log.debug('Wallet:' + self.id + ' blockchain tx event');
    var addresses = self.getAddressesInfo();
    var addr = _.findWhere(addresses, {
      addressStr: tx.address
    });
    if (addr) {
      self.emitAndKeepAlive('tx', tx.address, addr.isChange);
    }
  });

  if (!self.spendUnconfirmed) {
    self.blockchain.on('block', self.emitAndKeepAlive.bind(self, 'balanceUpdated'));
  }
}

/**
 * @desc Sets up the networking with other peers.
 *
 * @emits connect
 * @emits data
 *
 * @emits ready
 * @emits txProposalsUpdated
 *
 * @TODO: FIX PROTOCOL -- emit with a space is shitty
 * @emits no messages
 */
Wallet.prototype.netStart = function() {
  var self = this;

  if (!this.isShared()) {
    self.emitAndKeepAlive('ready');
    return;
  }

  var net = this.network;
  net.removeAllListeners();
  net.on('connect', self._onConnect.bind(self));
  net.on('data', self._onData.bind(self));
  net.on('no messages', self._onNoMessages.bind(self));
  net.on('connect_error', function() {
    self.emitAndKeepAlive('connectionError');
  });

  if (this.publicKeyRing.isComplete()) {
    this._lockIncomming();
  }



  if (net.started) {
    log.debug('Wallet:' + self.getName() + ': Wallet networking was ready')
    self.emitAndKeepAlive('ready', net.getPeer());
    return;
  }



  var myId = self.getMyCopayerId();
  var myIdPriv = self.getMyCopayerIdPriv();

  var startOpts = {
    copayerId: myId,
    privkey: myIdPriv,
    maxPeers: self.totalCopayers,
    syncedTimestamp: this.syncedTimestamp || 0,
    secretNumber: self.secretNumber,
  };


  log.debug('Wallet:' + self.id + ' Starting network.');
  net.start(startOpts, function() {
    self._setBlockchainListeners();
    self.emitAndKeepAlive('ready', net.getPeer());
  });
};

/**
 * @desc Retrieves the public keys of all the copayers in the ring
 * @return {string[]} hex-encoded public keys of copayers
 */
Wallet.prototype.getRegisteredCopayerIds = function() {
  var l = this.publicKeyRing.registeredCopayers();
  var copayers = [];
  for (var i = 0; i < l; i++) {
    var cid = this.getCopayerId(i);
    copayers.push(cid);
  }
  return copayers;
};

/**
 * @desc Retrieves the public keys of all the peers in the network
 * @TODO: Isn't this deprecated? Now that we don't use peerjs
 *
 * @return {string[]} hex-encoded public keys of copayers
 */
Wallet.prototype.getRegisteredPeerIds = function() {
  var l = this.publicKeyRing.registeredCopayers();
  if (this.registeredPeerIds.length !== l) {
    this.registeredPeerIds = [];
    var copayers = this.getRegisteredCopayerIds();
    for (var i = 0; i < l; i++) {
      var cid = copayers[i];
      var pid = this.network.peerFromCopayer(cid);
      this.registeredPeerIds.push({
        peerId: pid,
        copayerId: cid,
        nick: this.publicKeyRing.nicknameForCopayer(cid),
        index: i,
      });
    }
  }
  return this.registeredPeerIds;
};

/**
 * @TODO: Review design of this call
 * @desc Send a keepalive to this wallet's {@link WalletLock} instance.
 *
 * @emits locked - in case the wallet is opened in another instance
 */
Wallet.prototype.keepAlive = function() {
  var self = this;


  // this.lock.keepAlive(function(err) {
  //   if (err) {
  //     log.debug(err);
  //     self.emitAndKeepAlive('locked', null, 'Wallet appears to be openned on other browser instance. Closing this one.');
  //   }
  // });
};



Wallet.prototype.getId = function() {
  return this.id;
};

/**
 * @desc Serialize the wallet into a plain object.
 * @return {Object}
 */
Wallet.prototype.toObj = function() {
  var optsObj = this._optsToObj();

  var walletObj = {
    opts: optsObj,
    settings: this.settings,
    networkNonce: this.network.getHexNonce(), //yours
    networkNonces: this.network.getHexNonces(), //copayers
    publicKeyRing: this.publicKeyRing.toObj(),
    txProposals: this.txProposals.toObj(),
    privateKey: this.privateKey ? this.privateKey.toObj() : undefined,
    addressBook: this.addressBook,
    syncedTimestamp: this.syncedTimestamp || 0,
    focusedTimestamp: this.focusedTimestamp || 0,
    secretNumber: this.secretNumber,
  };

  return walletObj;
};


Wallet.fromUntrustedObj = function(obj, readOpts) {
  obj = _.clone(obj);
  var o = {};
  _.each(Wallet.PERSISTED_PROPERTIES, function(p) {
    o[p] = obj[p];
  });

  return Wallet.fromObj(o, readOpts);
};

/**
 * @desc Retrieve the wallet state from a trusted object
 *
 * @param {Object} o
 * @param {Object[]} o.addressBook - Stores known associations of bitcoin addresses to names
 * @param {Object} o.privateKey - Private key to be deserialized by {@link PrivateKey#fromObj}
 * @param {string} o.networkName - 'livenet' or 'testnet'
 * @param {Object} o.publicKeyRing - PublicKeyRing to be deserialized by {@link PublicKeyRing#fromObj}
 * @param {number} o.syncedTimestamp - ts of the last synced message with insifht (in microseconds, as insight returns ts)
 * @param {number} o.focusedTimestamp - last time this wallet was focused (open) by a user (in miliseconds)
 * @param {Object} o.txProposals - TxProposals to be deserialized by {@link TxProposals#fromObj}
 * @param {string} o.nickname - user's nickname
 *
 * @param readOpts.network
 * @param readOpts.blockchain
 * @param readOpts.{string[]} skipFields - parameters to ignore when importing
 */
Wallet.fromObj = function(o, readOpts) {

  preconditions.checkArgument(readOpts.networkOpts);
  preconditions.checkArgument(readOpts.blockchainOpts);

  var networkOpts = readOpts.networkOpts;
  var blockchainOpts = readOpts.blockchainOpts;
  var skipFields = readOpts.skipFields || [];


  if (skipFields) {
    _.each(skipFields, function(k) {
      if (o[k]) {
        delete o[k];
      } else {
        throw new Error('unknown field:' + k);
      }
    });
  }

  var networkName = Wallet.obtainNetworkName(o);


  // TODO Why moving everything to opts. This needs refactoring.
  //
  // clone opts

  if (!o.opts) {
    return null;
  }

  var opts = JSON.parse(JSON.stringify(o.opts));
  opts.addressBook = o.addressBook;
  opts.settings = o.settings;


  if (o.privateKey) {
    opts.privateKey = PrivateKey.fromObj(o.privateKey);
  } else {
    opts.privateKey = new PrivateKey({
      networkName: networkName
    });
  }

  opts.secretNumber = o.secretNumber;

  if (o.publicKeyRing) {
    opts.publicKeyRing = PublicKeyRing.fromObj(o.publicKeyRing);
  } else {
    opts.publicKeyRing = new PublicKeyRing({
      networkName: networkName,
      requiredCopayers: opts.requiredCopayers,
      totalCopayers: opts.totalCopayers,
    });
    opts.publicKeyRing.addCopayer(
      opts.privateKey.deriveBIP45Branch().extendedPublicKeyString(),
      opts.nickname
    );
  }

  if (o.txProposals) {
    opts.txProposals = TxProposals.fromObj(o.txProposals, Wallet.builderOpts);
  } else {
    opts.txProposals = new TxProposals({
      networkName: networkName,
    });
  }

  opts.syncedTimestamp = o.syncedTimestamp || 0;
  opts.focusedTimestamp = o.focusedTimestamp || 0;

  opts.blockchainOpts = readOpts.blockchainOpts;
  opts.networkOpts = readOpts.networkOpts;

  return new Wallet(opts);
};


/**
 * @desc sendToPeers a message to other peers
 * @param {string[]} recipients - the pubkey of the recipients of the message
 * @param {Object} obj - the data to be sent to them
 */
Wallet.prototype._sendToPeers = function(recipients, obj) {
  if (!this.isShared()) return;

  log.info('Wallet:' + this.getName() + ' ### Sending ' + obj.type);
  log.debug('Sending obj', obj);

  this.network.send(recipients, obj);
};

/**
 * @desc Send the set of TxProposals to some peers
 * @param {string[]} recipients - the pubkeys of the recipients
 */
Wallet.prototype.sendAllTxProposals = function(recipients, sinceTs) {
  var ntxids = sinceTs ? this.txProposals.getNtxidsSince(sinceTs) : this.txProposals.getNtxids();
  var self = this;
  _.each(ntxids, function(ntxid, key) {
    self.sendTxProposal(ntxid, recipients);
  });
};

/**
 * @desc Send a TxProposal identified by transaction id to a set of recipients
 * @param {string} ntxid - the transaction proposal id
 * @param {string[]} [recipients] - the pubkeys of the recipients
 */
Wallet.prototype.sendTxProposal = function(ntxid, recipients) {
  preconditions.checkArgument(ntxid);
  this._sendToPeers(recipients, {
    type: 'txProposal',
    txProposal: this.txProposals.get(ntxid).toObjTrim(),
    walletId: this.id,
  });
};

/**
 * @desc Notifies other peers that a transaction proposal was seen
 * @param {string} ntxid
 */
Wallet.prototype.sendSeen = function(ntxid) {
  preconditions.checkArgument(ntxid);
  this._sendToPeers(null, {
    type: 'seen',
    ntxid: ntxid,
    walletId: this.id,
  });
};

/**
 * @desc Notifies other peers that a transaction proposal was rejected
 * @param {string} ntxid
 */
Wallet.prototype.sendReject = function(ntxid) {
  preconditions.checkArgument(ntxid);

  this._sendToPeers(null, {
    type: 'reject',
    ntxid: ntxid,
    walletId: this.id,
  });
};

/**
 * @desc Notify other peers that a wallet has been backed up and it's ready to be used
 * @param {string[]} [recipients] - the pubkeys of the recipients
 */
Wallet.prototype.sendWalletReady = function(recipients, sinceTs) {
  this._sendToPeers(recipients, {
    type: 'walletReady',
    walletId: this.id,
    sinceTs: sinceTs,
  });
};

/**
 * @desc Notify other peers of the walletId
 * @TODO: Why is this needed? Can't everybody just calculate the walletId?
 * @param {string[]} [recipients] - the pubkeys of the recipients
 */
Wallet.prototype.sendWalletId = function(recipients) {
  log.debug('Wallet:' + this.id + ' ### SENDING walletId TO:', recipients || 'All', this.id);

  this._sendToPeers(recipients, {
    type: 'walletId',
    walletId: this.id,
    opts: this._optsToObj(),
    networkName: this.getNetworkName(),
  });
};

/**
 * @desc Send the current PublicKeyRing to other recipients
 * @param {string[]} [recipients] - the pubkeys of the recipients
 */
Wallet.prototype.sendPublicKeyRing = function(recipients) {
  var publicKeyRingObj = this.publicKeyRing.toObj();

  this._sendToPeers(recipients, {
    type: 'publicKeyRing',
    publicKeyRing: publicKeyRingObj,
    walletId: this.id,
  });
};

/**
 * @desc Send the current indexes of our public key ring to other peers
 * @param {string[]} recipients - the pubkeys of the recipients
 */
Wallet.prototype.sendIndexes = function(recipients) {
  var indexes = HDParams.serialize(this.publicKeyRing.indexes);
  this._sendToPeers(recipients, {
    type: 'indexes',
    indexes: indexes,
    walletId: this.id,
  });
};

/**
 * sendAddressBook
 * @desc Send our addressBook to other recipients
 *
 * @param {string[]} recipients - the pubkeys of the recipients
 * @param onlyKey
 * @return {undefined}
 */
Wallet.prototype.sendAddressBook = function(recipients, onlyKey) {
  var toSend = [],
    myId = this.getMyCopayerId();

  if (onlyKey && this.addressBook[onlyKey]) {
    toSend = {};
    toSend[onlyKey] = this.addressBook[onlyKey];
  } else {
    toSend = _.filter(this.addressBook, function(entry) {
      return entry.copayerId === myId;
    });
  }
  if (_.isEmpty(toSend)) return;

  this._sendToPeers(recipients, {
    type: 'addressbook',
    addressBook: toSend,
    walletId: this.id,
  });
};

/**
 * @desc Retrieve this wallet's name
 * @return {string}
 */
Wallet.prototype.getName = function() {
  return this.name || this.id;
};

/**
 * @desc Generate a new address
 * @param {boolean} isChange - whether to generate a change address or a receive address
 * @return {string[]} a list of all the addresses generated so far for the wallet
 */
Wallet.prototype._doGenerateAddress = function(isChange) {
  return this.publicKeyRing.generateAddress(isChange, this.publicKey);
};

/**
 * @callback addressCallback
 * @param {string} addr - all the addresses of the wallet
 */
/**
 * @desc Generate a new address
 * @param {boolean} isChange - whether to generate a change address or a receive address
 * @param {addressCallback} cb
 * @return {string[]} a list of all the addresses generated so far for the wallet
 */
Wallet.prototype.generateAddress = function(isChange, cb) {
  var addr = this._doGenerateAddress(isChange);
  this.sendIndexes();
  this._newAddresses();
  if (cb) return cb(addr);
  return addr;
};

/**
 * @desc Retrieve all the Transaction proposals (see {@link TxProposals})
 * @return {Object[]} each object returned represents a transaction proposal, with two additional
 * booleans: <tt>signedByUs</tt> and <tt>rejectedByUs</tt>. An optional third boolean signals
 * whether the transaction was finally rejected (<tt>finallyRejected</tt> set to true).
 */
Wallet.prototype.getTxProposals = function() {
  var ret = [];
  var copayers = this.getRegisteredCopayerIds();
  for (var ntxid in this.txProposals.txps) {
    var txp = this.txProposals.getTxProposal(ntxid, copayers);

    txp.signedByUs = txp.signedBy[this.getMyCopayerId()] ? true : false;
    txp.rejectedByUs = txp.rejectedBy[this.getMyCopayerId()] ? true : false;
    txp.finallyRejected = this.totalCopayers - txp.rejectCount < this.requiredCopayers;
    txp.isPending = !txp.finallyRejected && !txp.sentTxid;

    // si no gastada
    // y si no esta expirada;

    if (!txp.readonly || txp.finallyRejected || txp.sentTs) {
      ret.push(txp);
    }
  }
  return ret;
};

/**
 * @desc get list of actions (see {@link getPendingTxProposals})
 */
Wallet.prototype._getActionList = function(actions) {
  if (!actions) return;
  var peers = Object.keys(actions).map(function(i) {
    return {
      cId: i,
      actions: actions[i]
    }
  });

  return peers.sort(function(a, b) {
    return !!b.actions.create - !!a.actions.create;
  });
};

/**
 * @desc Retrieve Pendings Transaction proposals (see {@link TxProposals})
 * @return {Object[]} each object returned represents a transaction proposal
 */
Wallet.prototype.getPendingTxProposals = function() {
  var self = this;
  var ret = [];
  ret.txs = [];
  var pendingForUs = 0;
  var txps = this.getTxProposals();
  var satToUnit = 1 / this.settings.unitToSatoshi;

  _.each(_.where(txps, 'isPending'), function(txp) {
    pendingForUs++;
    var addresses = {};
    var outs = JSON.parse(txp.builder.vanilla.outs);
    outs.forEach(function(o) {
      if (!self.publicKeyRing.addressToPath[o.Straddress]) {
        if (!addresses[o.address]) addresses[o.address] = 0;
        addresses[o.address] += (o.amountSatStr || Math.round(o.amount * bitcore.util.COIN));
      };
    });
    txp.outs = [];
    _.each(addresses, function(value, address) {
      txp.outs.push({
        address: address,
        value: value * satToUnit
      });
    });
    // extra fields
    txp.fee = txp.builder.feeSat * satToUnit;
    txp.missingSignatures = txp.builder.build().countInputMissingSignatures(0);
    txp.actionList = self._getActionList(txp.peerActions);
    ret.txs.push(txp);
  });

  ret.pendingForUs = pendingForUs;
  return ret;
};

/**
 * @desc Removes old transactions
 * @param {boolean} deleteAll - if true, remove all the transactions
 * @return {number} the number of deleted proposals
 */
Wallet.prototype.purgeTxProposals = function(deleteAll) {
  var deleted = this.txProposals.purge(deleteAll, this.maxRejectCount());
  if (deleted) {
    this.emitAndKeepAlive('txProposalsUpdated');
  }
  return deleted;
};

/**
 * @desc Reject a proposal
 * @param {string} ntxid the id of the transaction proposal to reject
 * @emits txProposalsUpdated
 */
Wallet.prototype.reject = function(ntxid) {
  var txp = this.txProposals.get(ntxid);
  txp.setRejected(this.getMyCopayerId());
  this.sendReject(ntxid);
  this.emitAndKeepAlive('txProposalsUpdated');
};

/**
 * @desc Sign a proposal
 * @param {string} ntxid the id of the transaction proposal to sign
 * @emits txProposalsUpdated
 * @throws {Error} Could not sign proposal
 * @throws {Error} Bad payment request
 * @return {boolean} true if signing actually incremented the number of signatures
 */
Wallet.prototype.sign = function(ntxid) {
  preconditions.checkState(!_.isUndefined(this.getMyCopayerId()));

  var txp = this.txProposals.get(ntxid);
  var keys = this.privateKey.getForPaths(txp.inputChainPaths);

  var signaturesAdded = txp.sign(keys, this.getMyCopayerId());
  if (!signaturesAdded)
    return false;

  this.emitAndKeepAlive('txProposalsUpdated');
  return true;
};


Wallet.prototype.signAndSend = function(ntxid, cb) {
  if (this.sign(ntxid)) {
    var txp = this.txProposals.get(ntxid);
    if (txp.isFullySigned()) {
      return this.broadcastTx(ntxid, cb);
    } else {
      this.sendTxProposal(ntxid);
      return cb(null, ntxid, Wallet.TX_SIGNED );
    }
  } else {
    return cb(new Error('Could not sign the proposal'));
  }
};

/**
 * @desc Broadcasts a transaction to the blockchain
 * @param {string} ntxid - the transaction proposal id
 * @param {broadcastCallback} cb
 * @callback broadcastCallback
 * @param {string} txid - the transaction id on the blockchain
 */
Wallet.prototype.broadcastTx = function(ntxid, cb) {
  var self = this;

  var txp = this.txProposals.get(ntxid);
  var tx = txp.builder.build();
  if (!tx.isComplete())
    throw new Error('Tx is not complete. Can not broadcast');

  log.info('Wallet:' + this.id + ' Broadcasting Transaction ntxid:' + ntxid);

  var serializedTx = tx.serialize();

  if (txp.merchant) {
    this.sendPaymentTx(ntxid, serializedTx);
  }

  var txHex = serializedTx.toString('hex');
  log.debug('\tRaw transaction: ', txHex);

  this.blockchain.broadcast(txHex, function(err, txid) {
    if (err)
      log.error('Error sending TX:', err);

    if (txid) {
      log.debug('Wallet:' + self.getName() + ' broadcasted a TX. BITCOIND txid:', txid);
      var txp = self.txProposals.get(ntxid);
      txp.setSent(txid);
      self.sendTxProposal(ntxid);
      self.emitAndKeepAlive('txProposalsUpdated');
      return cb(null, txid, Wallet.TX_BROADCASTED);
    } else {
      log.info('Wallet:' + self.getName() + '. Sent failed. Checking if the TX was sent already');
      self._checkIfTxProposalIsSent(ntxid, cb);
    }
  });
};

/**
 * @desc Create a Payment Protocol transaction
 * @param {Object|string} options - if it's a string, parse it as the url
 * @param {string} options.url the url for the transaction
 * @param {Function} cb
 */
Wallet.prototype.fetchPaymentRequest = function(options, cb) {
  preconditions.checkArgument(_.isObject(options));
  preconditions.checkArgument(options.url);
  preconditions.checkArgument(options.url.indexOf('http') == 0, 'Bad PayPro URL given:' + options.url);

  var self = this;

  this.httpUtil.request({
    method: 'GET',
    url: options.url,
    headers: {
      'Accept': PayPro.PAYMENT_REQUEST_CONTENT_TYPE
    },
    responseType: 'arraybuffer'
  })
    .success(function(rawData) {
      log.info('PayPro Request done successfully. Parsing response')

      var merchantData, err;
      try {
        merchantData = self.parsePaymentRequest(options, rawData);
      } catch (e) {
        err = e
      };

      log.debug('PayPro request data', merchantData);
      return cb(err, merchantData);
    })
    .error(function(data, status) {
      log.debug('Server did not return PaymentRequest.\nXHR status: ' + status);
      return cb(new Error('Status: ' + status));
    });
};

/* 
 * addOutputsToMerchantData
 *
 * NOTE: We use to: set the TX scripts with the payment request scripts:
 * but this is a hack around transaction builder, so we dont do it anymore.
 * See Readme.md. For now we only support p2scripthash or p2pubkeyhash
    merchantData.pr.pd.outputs.forEach(function(output, i) {
      var script = {
        offset: output.script.offset,
        limit: output.script.limit,
        buffer: new Buffer(output.script.buffer, 'hex')
      };
      var s = script.buffer.slice(script.offset, script.limit);
      b.tx.outs[i].s = s;
    });
 *
 */

Wallet.prototype._addOutputsToMerchantData = function(merchantData) {

  var total = bignum(0);
  var outs = {};

  _.each(merchantData.pr.pd.outputs, function(output) {
    var amount = output.amount;

    // big endian
    var v = new Buffer(8);
    v[0] = (amount.high >> 24) & 0xff;
    v[1] = (amount.high >> 16) & 0xff;
    v[2] = (amount.high >> 8) & 0xff;
    v[3] = (amount.high >> 0) & 0xff;
    v[4] = (amount.low >> 24) & 0xff;
    v[5] = (amount.low >> 16) & 0xff;
    v[6] = (amount.low >> 8) & 0xff;
    v[7] = (amount.low >> 0) & 0xff;

    var script = {
      offset: output.script.offset,
      limit: output.script.limit,
      buffer: new Buffer(output.script.buffer, 'hex')
    };
    var s = script.buffer.slice(script.offset, script.limit);
    var network = merchantData.pr.pd.network === 'main' ? 'livenet' : 'testnet';
    var addr = bitcore.Address.fromScriptPubKey(new bitcore.Script(s), network);

    var a = addr[0].toString();
    outs[a] = bignum.fromBuffer(v, {
      endian: 'big',
      size: 1
    }).add(outs[a] || bignum(0));

    total = total.add(bignum.fromBuffer(v, {
      endian: 'big',
      size: 1
    }));
  });

  // for now we only support PayPro with 1 output.
  if (_.size(outs) !== 1)
    throw new Error('PayPro: Unsupported outputs');

  var out = _.pairs(outs)[0];

  merchantData.outs = [{
    address: out[0],
    amountSatStr: out[1].toString(10),
  }];
  merchantData.total = total.toString(10);

  // If user is granted the privilege of choosing
  // their own amount, add it to the tx.
  if (merchantData.total === 0 && options.amount) {
    merchant.outs[0].amountSatStr = merchantData.total = outions.amount;
  }
};

/**
 * @desc Analyzes a payment request and generate merchantData
 * @param {Object} options
 * @param {string} options.url url where the pay request was acquired
 * @param {string} options.amount Only used if pay requesst allow user to set the amount
 * @param {PayProRequest} rawData
 */
Wallet.prototype.parsePaymentRequest = function(options, rawData) {
  var self = this;

  var data = PayPro.PaymentRequest.decode(rawData);
  var paypro = new PayPro();
  var pr = paypro.makePaymentRequest(data);
  var ver = pr.get('payment_details_version');
  var pki_type = pr.get('pki_type');
  var pki_data = pr.get('pki_data');
  var details = pr.get('serialized_payment_details');
  var sig = pr.get('signature');

  var certs = PayPro.X509Certificates.decode(pki_data);
  certs = certs.certificate;

  // Verify Signature
  var trust = pr.verify(true);

  if (!trust.verified) {
    throw new Error('Server sent a bad signature.');
  }

  details = PayPro.PaymentDetails.decode(details);
  var pd = new PayPro();
  pd = pd.makePaymentDetails(details);

  var network = pd.get('network');
  var outputs = pd.get('outputs');
  var time = pd.get('time');
  var expires = pd.get('expires');
  var memo = pd.get('memo');
  var payment_url = pd.get('payment_url');
  var merchant_data = pd.get('merchant_data');

  var merchantData = {
    pr: {
      payment_details_version: ver,
      pki_type: pki_type,
      pki_data: certs,
      pd: {
        network: network,
        outputs: outputs.map(function(output) {
          return {
            amount: output.get('amount'),
            script: {
              offset: output.get('script').offset,
              limit: output.get('script').limit,
              // NOTE: For some reason output.script.buffer
              // is only an ArrayBuffer
              buffer: new Buffer(new Uint8Array(
                output.get('script').buffer)).toString('hex')
            }
          };
        }),
        time: time,
        expires: expires,
        memo: memo || 'This server would like some BTC from you.',
        payment_url: payment_url,
        merchant_data: merchant_data ? merchant_data.toString('hex') : null
      },
      signature: sig.toString('hex'),
      ca: trust.caName,
      untrusted: !trust.caTrusted,
      selfSigned: trust.selfSigned
    },
    expires: expires,
    request_url: options.url,
    total: bignum('0', 10).toString(10),
  };
  this._addOutputsToMerchantData(merchantData, options.amount);
  return merchantData;
};

/**
 * @desc Send a payment transaction to a server, complying with BIP70
 *
 * @param {string} ntxid - the transaction proposal id
 * @param {Function} txHex
 *
 * emits paymentACK(server's memo)
 */
Wallet.prototype.sendPaymentTx = function(ntxid, txHex) {
  var self = this;

  var refund_outputs = [];
  options.refund_to = this.publicKeyRing.getPubKeys(0, false, this.getMyCopayerId())[0];

  if (options.refund_to) {
    var total = txp.merchant.pr.pd.outputs.reduce(function(total, _, i) {
      // XXX reverse endianness to work around bignum bug:
      var txv = tx.outs[i].v;
      var v = new Buffer(8);
      for (var j = 0; j < 8; j++) v[j] = txv[7 - j];
      return total.add(bignum.fromBuffer(v, {
        endian: 'big',
        size: 1
      }));
    }, bignum('0', 10));

    var rpo = new PayPro();
    rpo = rpo.makeOutput();

    // XXX Bad - the amount *has* to be a Number in protobufjs
    // Possibly does not matter - server can ignore the amount anyway.
    rpo.set('amount', +total.toString(10));

    rpo.set('script',
      Buffer.concat([
        new Buffer([
          118, // OP_DUP
          169, // OP_HASH160
          76, // OP_PUSHDATA1
          20, // number of bytes
        ]),
        // needs to be ripesha'd
        bitcore.util.sha256ripe160(options.refund_to),
        new Buffer([
          136, // OP_EQUALVERIFY
          172 // OP_CHECKSIG
        ])
      ])
    );

    refund_outputs.push(rpo.message);
  }

  // We send this to the serve after receiving a PaymentRequest
  var pay = new PayPro();
  pay = pay.makePayment();
  var merchant_data = txp.merchant.pr.pd.merchant_data;
  if (merchant_data) {
    merchant_data = new Buffer(merchant_data, 'hex');
    pay.set('merchant_data', merchant_data);
  }
  pay.set('transactions', [serializedTx]);
  pay.set('refund_to', refund_outputs);

  // Unused for now
  // options.memo = '';
  // pay.set('memo', options.memo);

  pay = pay.serialize();
  log.debug('Sending Payment Message:', pay.toString('hex'));

  var buf = new ArrayBuffer(pay.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < pay.length; i++) {
    view[i] = pay[i];
  }

  var postInfo = {
    method: 'POST',
    url: txp.merchant.pr.pd.payment_url,
    headers: {
      // BIP-71
      'Accept': PayPro.PAYMENT_ACK_CONTENT_TYPE,
      'Content-Type': PayPro.PAYMENT_CONTENT_TYPE
      // XHR does not allow these:
      // 'Content-Length': (pay.byteLength || pay.length) + '',
      // 'Content-Transfer-Encoding': 'binary'
    },
    // Technically how this should be done via XHR (used to
    // be the ArrayBuffer, now you send the View instead).
    data: view,
    responseType: 'arraybuffer'
  };

  return this.httpUtil.request(postInfo)
    .success(function(rawData) {
      var data = PayPro.PaymentACK.decode(rawData);
      var paypro = new PayPro();
      var ack = paypro.makePaymentACK(data);
      var memo = ack.get('memo');
      log.debug('Payment Acknowledged!: %s', memo);
      self.emitAndKeepAlive('paymentACK', memo);
    })
    .error(function(data, status) {
      log.error('Sending payment notification: XHR status: ' + status);
    });
};

/**
 * @desc Mark that a user has seen a given TxProposal
 * @return {boolean} true if the internal state has changed
 */
Wallet.prototype.addSeenToTxProposals = function() {
  var ret = false;
  var myId = this.getMyCopayerId();

  for (var k in this.txProposals.txps) {
    var txp = this.txProposals.txps[k];
    if (!txp.seenBy[myId]) {

      txp.seenBy[myId] = Date.now();
      ret = true;
    }
  }
  return ret;
};

/**
 * @desc Alias for {@link PublicKeyRing#getAddresses}
 * @TODO: remove this method and use getAddressesInfo everywhere
 * @return {Buffer[]}
 */
Wallet.prototype.getAddresses = function(opts) {
  return this.publicKeyRing.getAddresses(opts);
};

/**
 * @desc Retrieves all addresses as strings.
 *
 * @param {Object} opts - Same options as {@link PublicKeyRing#getAddresses}
 * @return {string[]}
 */
Wallet.prototype.getAddressesStr = function(opts) {
  return this.getAddresses(opts).map(function(a) {
    return a.toString();
  });
};

Wallet.prototype.subscribeToAddresses = function() {
  if (!this.publicKeyRing.isComplete()) return;

  var addrInfo = this.publicKeyRing.getAddressesInfo();
  this.blockchain.subscribe(_.pluck(addrInfo, 'addressStr'));
  log.debug('Subscribed to ' + addrInfo.length + ' addresses');
};

/**
 * @desc Alias for {@link PublicKeyRing#getAddressesInfo}
 */
Wallet.prototype.getAddressesInfo = function(opts) {
  return this.publicKeyRing.getAddressesInfo(opts, this.publicKey);
};
/**
 * @desc Returns true if a given address was generated by deriving our master public key
 * @return {boolean}
 */
Wallet.prototype.addressIsOwn = function(addrStr) {
  return !!this.publicKeyRing.addressToPath[addrStr];
};


/**
 * Estimate a tx fee in satoshis given its input count
 * only for spending all wallet funds
 */
Wallet.estimatedFee = function(unspentCount) {
  preconditions.checkArgument(_.isNumber(unspentCount));
  var estimatedSizeKb = Math.ceil((500 + unspentCount * 250) / 1024);
  return parseInt(estimatedSizeKb * bitcore.TransactionBuilder.FEE_PER_1000B_SAT);
};

/**
 * @callback {getBalanceCallback}
 * @param {string=} err - an error, if any
 * @param {number} balance - total number of satoshis for all addresses
 * @param {Object} balanceByAddr - maps string addresses to satoshis
 * @param {number} safeBalance - total number of satoshis in UTXOs that are not part of any TxProposal
 * @param {number} safeUnspentCount - total number of safe unspent Outputs that make this balance.
 */
/**
 * @desc Returns the balances for all addresses in Satoshis
 * @param {getBalanceCallback} cb
 */
Wallet.prototype.getBalance = function(cb) {
  var balance = 0;
  var safeBalance = 0;
  var balanceByAddr = {};
  var COIN = coinUtil.COIN;

  this.getUnspent(function(err, safeUnspent, unspent) {
    if (err) {
      return cb(err);
    }

    for (var i = 0; i < unspent.length; i++) {
      var u = unspent[i];
      var amt = u.amount * COIN;
      balance += amt;
      balanceByAddr[u.address] = (balanceByAddr[u.address] || 0) + amt;
    }

    // we multiply and divide by BIT to avoid rounding errors when adding
    for (var a in balanceByAddr) {
      balanceByAddr[a] = parseInt(balanceByAddr[a].toFixed(0), 10);
    }

    balance = parseInt(balance.toFixed(0), 10);

    var safeUnspentCount = safeUnspent.length;

    for (var i = 0; i < safeUnspentCount; i++) {
      var u = safeUnspent[i];
      var amt = u.amount * COIN;
      safeBalance += amt;
    }

    safeBalance = parseInt(safeBalance.toFixed(0), 10);
    return cb(null, balance, balanceByAddr, safeBalance, safeUnspentCount);
  });
};


// See
// https://github.com/bitpay/copay/issues/1056
//
// maxRejectCount should equal requiredCopayers
// strictly.
/**
 * @desc Get the number of copayers that need to reject a transaction so it can't be signed
 * @return {number}
 */
Wallet.prototype.maxRejectCount = function() {
  return this.totalCopayers - this.requiredCopayers;
};

/**
 * @callback getUnspentCallback
 * @TODO: Document this better
 * @param {string} error
 * @param {Object[]} safeUnspendList
 * @param {Object[]} unspentList
 */
/* @ TODO add cached?
 * @desc Get a list of unspent transaction outputs
 * @param {getUnspentCallback} cb
 */
Wallet.prototype.getUnspent = function(cb) {
  var self = this;
  this.blockchain.getUnspent(this.getAddressesStr(), function(err, unspentList) {

    if (err) {
      return cb(err);
    }

    var safeUnspendList = [];
    var uu = self.txProposals.getUsedUnspent(self.maxRejectCount());

    for (var i in unspentList) {
      var u = unspentList[i];
      var name = u.txid + ',' + u.vout;
      if (!uu[name] && (self.spendUnconfirmed || u.confirmations >= 1))
        safeUnspendList.push(u);
    }

    return cb(null, safeUnspendList, unspentList);
  });
};

// TODO. not used.
Wallet.prototype.removeTxWithSpentInputs = function(cb) {
  var self = this;

  cb = cb || function() {};

  if (!_.some(self.getTxProposals(), {
    isPending: true
  }))
    return cb();

  var proposalsChanged = false;
  this.blockchain.getUnspent(this.getAddressesStr(), function(err, unspentList) {
    if (err) return cb(err);

    var txps = _.where(self.getTxProposals(), {
      isPending: true
    });
    if (txps.length === 0) return cb();

    var inputs = _.flatten(_.map(txps, function(txp) {
      return _.map(txp.builder.utxos, function(utxo) {
        return {
          ntxid: txp.ntxid,
          txid: utxo.txid,
          vout: utxo.vout,
        };
      });
    }));

    _.each(unspentList, function(unspent) {
      _.each(inputs, function(input) {
        input.unspent = input.unspent || (input.txid === unspent.txid && input.vout === unspent.vout);
      });
    });

    _.each(inputs, function(input) {
      if (!input.unspent) {
        proposalsChanged = true;
        self.txProposals.deleteOne(input.ntxid);
      }
    });

    if (proposalsChanged) {
      self.emitAndKeepAlive('txProposalsUpdated');
    }

    return cb();
  });

};

/**
 * @desc Spends coins from the wallet
 * Create a Transaction Proposal and broadcast it or send it
 * to copayers
 */
Wallet.prototype.spend = function(opts, cb) {
  preconditions.checkArgument(_.isObject(opts));
  log.debug('create Options', opts);

  var self = this;
  var toAddress = opts.toAddress;
  var amountSat = opts.amountSat;
  var comment = opts.comment;
  var url = opts.url;

  if (url && !opts.merchantData) {
    return self.fetchPaymentRequest({
      url: url,
      memo: comment,
      amount: amountSat,
    }, function(err, merchantData) {
      if (err) return cb(err);
      opts.merchantData = merchantData;
      opts.toAddress = merchantData.outs[0].address;
      opts.amountSat = parseInt(merchantData.outs[0].amountSatStr);
      return self.spend(opts, cb);
    });
  };
  preconditions.checkArgument(amountSat, 'no amount');
  preconditions.checkArgument(toAddress, 'no address');

  this.getUnspent(function(err, safeUnspent) {
    if (err) {
      log.info(err);
      return cb(new Error('Spend: Could not get list of UTXOs'));
    }

    var ntxid, txp;
    try {
      txp = self._createTxProposal(toAddress,
        amountSat, comment, safeUnspent, opts.builderOpts);
    } catch (e) {
      log.error(e);
      return cb(e);
    }

    if (opts.merchantData) {
      txp.addMerchantData(opts.merchantData);
    }

    var ntxid = self.txProposals.add(txp);
    if (!ntxid) {
      return cb(new Error('Error creating the transaction'));
    }

    log.debug('TXP Added: ', ntxid);

    self.sendIndexes();
    // Needs only one signature? Broadcast it!
    if (!self.requiresMultipleSignatures()) {
      self.broadcastTx(ntxid, cb);
    } else {
      self.sendTxProposal(ntxid);
      self.emitAndKeepAlive('txProposalsUpdated');
      return cb(null, ntxid, Wallet.TX_PROPOSAL_SENT);
    }
  });
};

/**
 * _newAddress
 * Returns an Address object from an address string or a BIP21 URL.*
 * @param address
 * @return  { bitcore.Address }
 */

Wallet._newAddress = function(address) {
  if (/ ^ bitcoin: /g.test(address)) {
    return new BIP21(address).address;
  }
  return new Address(address);
};


Wallet.prototype._getBuilder = function(opts) {
  opts = opts || {};

  if (!opts.remainderOut) {
    opts.remainderOut = {
      address: this._doGenerateAddress(true).toString()
    };
  }
  if (_.isUndefined(opts.spendUnconfirmed)) {
    opts.spendUnconfirmed = this.spendUnconfirmed;
  }

  for (var k in Wallet.builderOpts) {
    opts[k] = Wallet.builderOpts[k];
  }

  return new Builder(opts);
};


/*
 * _createTxProposal
 * Creates a transaction proposal and run many sanity checks
 *
 * @param toAddress
 * @param amountSat
 * @param comment (optional)
 * @param utxos
 * @param builderOpts  bitcore.TransactionBuilder options(like spendUnconfirmed)
 * @return {TxProposal} The newly created transaction proposal.*
 * Throws errors on unexpected inputs.
 */

Wallet.prototype._createTxProposal = function(toAddress, amountSat, comment, utxos, builderOpts) {
  preconditions.checkArgument(toAddress);
  preconditions.checkArgument(amountSat);
  preconditions.checkArgument(_.isArray(utxos));
  preconditions.checkArgument(!comment || comment.length <= 100, 'Comment too long');

  var pkr = this.publicKeyRing;
  var priv = this.privateKey;
  var addr = Wallet._newAddress(toAddress);

  preconditions.checkState(addr && addr.data && addr.isValid(), 'Bad address:' + addr.toString());

  preconditions.checkArgument(addr.network().name === this.getNetworkName(), 'networkname mismatch');
  preconditions.checkState(pkr.isComplete(), 'pubkey ring incomplete');
  preconditions.checkState(priv, 'no private key');

  var b = this._getBuilder(builderOpts);

  b.setUnspent(utxos)
    .setOutputs([{
      address: addr.data,
      amountSatStr: amountSat,
    }]);

  var selectedUtxos = b.getSelectedUnspent();

  if (selectedUtxos.length > TX_MAX_INS)
    throw new Error('BIG: Resulting TX is too big:' + selectedUtxos.length +
      ' inputs. Aborting');


  var inputChainPaths = selectedUtxos.map(function(utxo) {
    return pkr.pathForAddress(utxo.address);
  });
  b.setHashToScriptMap(pkr.getRedeemScriptMap(inputChainPaths));


  var tx = b.build();
  var myId = this.getMyCopayerId();
  var keys = priv.getForPaths(inputChainPaths);
  return  new TxProposal({
    inputChainPaths: inputChainPaths,
    comment: comment,
    builder: b,
    creator: myId,
    signWith: keys,
  });

  return txp;
};


/**
 * @desc Updates all the indexes for the current publicKeyRing. This scans
 * the blockchain looking for transactions on derived addresses.
 *
 * @param {Function} callback - called when all indexes have been updated. Receives an error, if any, as first argument
 */
Wallet.prototype.updateIndexes = function(callback) {
  var self = this;
  if (!self.isReady())
    return callback();
  log.debug('Wallet:' + this.id + ' Updating indexes...');
  var tasks = this.publicKeyRing.indexes.map(function(index) {
    return function(callback) {
      self.updateIndex(index, callback);
    };
  });

  async.parallel(tasks, function(err) {
    if (err) callback(err);
    log.debug('Wallet:' + self.id + ' Indexes updated');
    self._newAddresses();
    callback();
  });
};

/**
 * @desc Updates the lastly used index
 * @param {Object} index - an index, as used by {@link PublicKeyRing}
 * @param {Function} callback - called with no arguments when done updating
 */
Wallet.prototype.updateIndex = function(index, callback) {
  var self = this;
  var SCANN_WINDOW = 20;
  self.indexDiscovery(index.changeIndex, true, index.copayerIndex, SCANN_WINDOW, function(err, changeIndex) {
    if (err) return callback(err);
    if (changeIndex != -1)
      index.changeIndex = changeIndex + 1;

    self.indexDiscovery(index.receiveIndex, false, index.copayerIndex, SCANN_WINDOW, function(err, receiveIndex) {
      if (err) return callback(err);
      if (receiveIndex != -1)
        index.receiveIndex = receiveIndex + 1;
      callback();
    });
  });
};

/**
 * @desc Derive addresses using the given parameters
 *
 * @param {number} index - the index to start with
 * @param {number} amount - number of addresses to derive
 * @param {boolean} isChange - derive change addresses or receive addresses
 * @param {number} copayerIndex - the index of the copayer for whom to derive addresses
 * @return {string[]} the result of calling {@link PublicKeyRing#getAddress}
 */
Wallet.prototype.deriveAddresses = function(index, amount, isChange, copayerIndex) {
  preconditions.checkArgument(amount);
  preconditions.shouldBeDefined(copayerIndex);

  var ret = new Array(amount);
  for (var i = 0; i < amount; i++) {
    ret[i] = this.publicKeyRing.getAddress(index + i, isChange, copayerIndex).toString();
  }
  return ret;
};

/**
 * @callback {indexDiscoveryCallback}
 * @param {?} err
 * @param {number} lastActivityIndex
 */
/**
 * @desc Scans the block chain for the last index with activity for a copayer
 *
 * This function scans the publicKeyRing branch starting at index @start and reports the index with last activity,
 * using a scan window of @gap. The argument @change defines the branch to scan: internal or external.
 * Returns -1 if no activity is found in range.
 * @param {number} start - the number for which to start scanning
 * @param {boolean} change - whether to search for in the change branch or the receive branch
 * @param {number} copayerIndex - the index of the copayer
 * @param {number} gap - the maximum number of addresses to scan after the last active address
 * @param {indexDiscoveryCallback} cb - callback
 * @return {number} -1 if there's no activity in the range provided
 */
Wallet.prototype.indexDiscovery = function(start, change, copayerIndex, gap, cb) {
  preconditions.shouldBeDefined(copayerIndex);
  preconditions.checkArgument(gap);
  var scanIndex = start;
  var lastActive = -1;
  var hasActivity = false;

  var self = this;
  async.doWhilst(
    function _do(next) {
      // Optimize window to minimize the derivations.
      var scanWindow = (lastActive == -1) ? gap : gap - (scanIndex - lastActive) + 1;
      var addresses = self.deriveAddresses(scanIndex, scanWindow, change, copayerIndex);
      self.blockchain.getActivity(addresses, function(err, actives) {
        if (err) throw err;

        // Check for new activities in the newlly scanned addresses
        var recentActive = actives.reduce(function(r, e, i) {
          return e ? scanIndex + i : r;
        }, lastActive);
        hasActivity = lastActive != recentActive;
        lastActive = recentActive;
        scanIndex += scanWindow;
        next();
      });
    },
    function _while() {
      return hasActivity;
    },
    function _finally(err) {
      if (err) return cb(err);
      cb(null, lastActive);
    }
  );
};

/**
 * @desc Closes the wallet and disconnects all services
 */
Wallet.prototype.close = function(cb) {
  this.network.cleanUp();
  this.blockchain.destroy();

  log.debug('## CLOSING Wallet: ' + this.id);
  // TODO
  //  this.lock.release(function() {
  if (cb) return cb();
  //  });
};

/**
 * @desc Returns the name of the network ('livenet' or 'testnet')
 * @return {string}
 */
Wallet.prototype.getNetwork = function() {
  return this.network;
};

/**
 * @desc Throws an error if an address already exists in the address book
 * @private
 */
Wallet.prototype._checkAddressBook = function(key) {
  if (this.addressBook[key] && this.addressBook[key].copayerId != -1) {
    throw new Error('This address already exists in your Address Book');
  }
};

/**
 * @desc Add an entry to the address book
 *
 * @param {string} key - the address to be added
 * @param {string} label - a name for the address
 */
Wallet.prototype.setAddressBook = function(key, label) {
  this._checkAddressBook(key);
  var copayerId = this.getMyCopayerId();
  var ts = Date.now();
  var newEntry = {
    hidden: false,
    createdTs: ts,
    copayerId: copayerId,
    label: label,
  };
  this.addressBook[key] = newEntry;
  this.sendAddressBook(null, key);
  this.emitAndKeepAlive('addressBookUpdated');
};

/**
 * @desc Hides or unhides an address book entry
 * @param {string} key - the address in the addressbook
 */
Wallet.prototype.toggleAddressBookEntry = function(key) {
  if (!key) throw new Error('Key is required');
  this.addressBook[key].hidden = !this.addressBook[key].hidden;
  this.emitAndKeepAlive('addressBookUpdated', true);
};

/**
 * @desc Returns true if there are more than one cosigners
 * @return {boolean}
 */
Wallet.prototype.isShared = function() {
  return this.totalCopayers > 1;
};

/**
 * @desc Returns true if more than one signature is required
 * @return {boolean}
 */
Wallet.prototype.requiresMultipleSignatures = function() {
  return this.requiredCopayers > 1;
};

/**
 * @desc Returns true if the keyring is complete
 * @return {boolean}
 */
Wallet.prototype.isReady = function() {
  return this.publicKeyRing.isComplete();
};

/**
 * @desc Return a list of past transactions
 *
 * @param {number} opts.currentPage - the desired page in the dataset
 * @param {number} opts.itemsPerPage - number of items per page
 * @return {Object} the list of transactions
 */
Wallet.prototype.getTransactionHistory = function(opts, cb) {
  var self = this;

  if (_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  opts = opts || {};

  var addresses = self.getAddressesInfo();
  var proposals = self.getTxProposals();
  var satToUnit = 1 / self.settings.unitToSatoshi;

  function extractInsOuts(tx) {
    // Inputs
    var inputs = _.map(tx.vin, function(item) {
      var addr = _.findWhere(addresses, {
        addressStr: item.addr
      });
      return {
        type: 'in',
        address: addr ? addr.addressStr : item.addr,
        isMine: !_.isUndefined(addr),
        isChange: addr ? !!addr.isChange : false,
        amountSat: item.valueSat,
      }
    });
    var outputs = _.map(tx.vout, function(item) {
      var addr;
      var itemAddr;
      // If classic multisig, ignore
      if (item.scriptPubKey && item.scriptPubKey.addresses.length == 1) {
        itemAddr = item.scriptPubKey.addresses[0];
        addr = _.findWhere(addresses, {
          addressStr: itemAddr,
        });
      }

      return {
        type: 'out',
        address: addr ? addr.addressStr : itemAddr,
        isMine: !_.isUndefined(addr),
        isChange: addr ? !!addr.isChange : false,
        label: self.addressBook[itemAddr] ? self.addressBook[itemAddr].label : undefined,
        amountSat: parseInt((item.value * bitcore.util.COIN).toFixed(0)),
      }
    });

    return inputs.concat(outputs);
  };

  function sum(items, filter) {
    return _.reduce(_.where(items, filter),
      function(memo, item) {
        return memo + item.amountSat;
      }, 0);
  };

  function decorateTx(tx) {
    var items = extractInsOuts(tx);

    var amountIn = sum(items, {
      type: 'in',
      isMine: true
    });

    var amountOut = sum(items, {
      type: 'out',
      isMine: true,
      isChange: false,
    });

    var amountOutChange = sum(items, {
      type: 'out',
      isMine: true,
      isChange: true,
    });

    var fees = parseInt((tx.fees * bitcore.util.COIN).toFixed(0));
    var amount;
    if (amountIn == (amountOut + amountOutChange + (amountIn > 0 ? fees : 0))) {
      tx.action = 'moved';
      amount = amountOut;
    } else {
      amount = amountIn - amountOut - amountOutChange - (amountIn > 0 ? fees : 0);
      tx.action = amount > 0 ? 'sent' : 'received';
    }

    if (tx.action == 'sent' || tx.action == 'moved') {
      var firstOut = _.findWhere(items, {
        type: 'out'
      });
      if (firstOut) {
        tx.labelTo = firstOut.label;
        tx.addressTo = firstOut.address;
      }
    };

    tx.amountSat = Math.abs(amount);
    tx.amount = tx.amountSat * satToUnit;
    tx.minedTs = !_.isNaN(tx.time) ? tx.time * 1000 : undefined;

    var proposal = _.findWhere(proposals, {
      sentTxid: tx.txid
    });

    if (proposal) {
      tx.comment = proposal.comment;
      tx.sentTs = proposal.sentTs;
      tx.merchant = proposal.merchant;
      tx.peerActions = proposal.peerActions;
      tx.finallyRejected = proposal.finallyRejected;
      tx.merchant = proposal.merchant;
      tx.peerActions = proposal.peerActions;
      tx.finallyRejected = proposal.finallyRejected;

      if (tx.peerActions) {
        tx.actionList = self._getActionList(tx.peerActions);
      }
    }
  };

  function paginate(res, currentPage, itemsPerPage) {
    if (!res) {
      res = {
        totalItems: 0,
        items: [],
      };
    };

    var r = {
      itemsPerPage: itemsPerPage || res.totalItems,
      currentPage: currentPage || 1,
      nbItems: res.totalItems,
      items: res.items,
    };
    r.nbPages = r.itemsPerPage != 0 ? Math.ceil(r.nbItems / r.itemsPerPage) : 1;
    return r;
  };

  if (addresses.length > 0) {
    var addressesStr = _.pluck(addresses, 'addressStr');
    var from = (opts.currentPage - 1) * opts.itemsPerPage;
    var to = opts.currentPage * opts.itemsPerPage;
    self.blockchain.getTransactions(addressesStr, from, to, function(err, res) {
      if (err) return cb(err);

      _.each(res.items, function(tx) {
        decorateTx(tx);
      });

      return cb(null, paginate(res, opts.currentPage, opts.itemsPerPage));
    });
  } else {
    return cb(null, paginate(null, opts.currentPage, opts.itemsPerPage));
  }
};

Wallet.prototype.exportEncrypted = function(password, opts) {
  opts = opts || {};
  var crypto = opts.cryptoUtil || cryptoUtil;
  return crypto.encrypt(password, this.toObj());
};

module.exports = Wallet;
