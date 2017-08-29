'use strict';

var BaseService = require('../../service');
var inherits = require('util').inherits;
var async = require('async');
var index = require('../../');
var log = index.log;
var bitcore = require('bitcore-lib');
var Unit = bitcore.Unit;
var _ = bitcore.deps._;
var Encoding = require('./encoding');
var utils = require('../../utils');
var Transform = require('stream').Transform;
var assert = require('assert');

var AddressService = function(options) {
  BaseService.call(this, options);
  this._db = this.node.services.db;
  this._tx = this.node.services.transaction;
  this._header = this.node.services.header;
  this._timestamp = this.node.services.timestamp;
  this._network = this.node.network;
  if (this._network === 'livenet') {
    this._network = 'main';
  }
};

inherits(AddressService, BaseService);

AddressService.dependencies = [
  'p2p',
  'db',
  'block',
  'transaction',
  'timestamp'
];

// ---- public function prototypes
AddressService.prototype.getAddressHistory = function(addresses, options, callback) {
  var self = this;

  options = options || {};
  options.from = options.from || 0;
  options.to = options.to || 0xffffffff;
  options.queryMempool = _.isUndefined(options.queryMempool) ? true : false;

  async.mapLimit(addresses, 4, function(address, next) {

    self._getAddressHistory(address, options, next);

  }, function(err, txLists) {

    if(err) {
      return callback(err);
    }

    var txList = _.flatten(txLists);

    var results = {
      totalItems: txList.length,
      from: options.from,
      to: options.to,
      items: txList
    };

    callback(null, results);

  });

};

AddressService.prototype.getAddressSummary = function(address, options, callback) {

  var self = this;

  options = options || {};
  options.from = options.from || 0;
  options.to = options.to || 0xffffffff;
  options.queryMempool = _.isUndefined(options.queryMempool) ? true : false;

  var result = {
    addrStr: address,
    balance: 0,
    balanceSat: 0,
    totalReceived: 0,
    totalReceivedSat: 0,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 0,
    transactions: []
  };

  // txid criteria
  var start = self._encoding.encodeAddressIndexKey(address, options.from);
  var end = self._encoding.encodeAddressIndexKey(address, options.to);

  var criteria = {
    gte: start,
    lt: end
  };

  // txid stream
  var txidStream = self._db.createKeyStream(criteria);

  txidStream.on('close', function() {
    txidStream.unpipe();
  });

  // tx stream
  var txStream = new Transform({ objectMode: true, highWaterMark: 1000 });

  txStream.on('end', function() {
    result.balance = Unit.fromSatoshis(result.balanceSat).toBTC();
    result.totalReceived = Unit.fromSatoshis(result.totalReceivedSat).toBTC();
    result.totalSent = result.totalSentSat;
    result.unconfirmedBalance = result.unconfirmedBalanceSat;
    callback(null, result);
  });

  // pipe txids into tx stream for processing
  txidStream.pipe(txStream);

  txStream._transform = function(chunk, enc, callback) {

    var key = self._encoding.decodeAddressIndexKey(chunk);

    self._tx.getTransaction(key.txid, options, function(err, tx) {

      if(err) {
        log.error(err);
        txStream.emit('error', err);
        return;
      }

      if (!tx) {
        log.error('Could not find tx for txid: ' + key.txid + '. This should not be possible, check indexes.');
        txStream.emit('error', new Error('Txid should map to a tx.'));
        return;
      }

      var confirmations = self._header.getBestHeight() - key.height;

      result.transactions.push(tx.txid());
      result.txApperances++;
      // is this an input?
      if (key.input) {

        return self._transaction.getInputValues(key.txid, null, function(err, tx) {

          if(err) {
            log.error(err);
            txStream.emit('error', err);
            return;
          }

          result.balanceSat -= tx.__inputValues[key.index];
          result.totalSentSat += tx.__inputValues[key.index];

          if (confirmations < 1) {
            result.unconfirmedBalanceSat -= tx.__inputValues[key.index];
            result.unconfirmedTxApperances++;
          }

          callback();

        });

      }

      result.balanceSat += tx.outputs[key.index].value;
      result.totalReceivedSat += tx.outputs[key.index].value;

      if (confirmations < 1) {
        result.unconfirmedBalanceSat += tx.__inputValues[key.index];
        result.unconfirmedTxApperances++;
      }

      callback();

    });

  };

  txStream.on('error', function(err) {
    log.error(err);
    txStream.unpipe();
  });

  txStream._flush = function(callback) {
    txStream.emit('end');
    callback();
  };
};

AddressService.prototype.getAddressUnspentOutputs = function(address, options, callback) {

  var self = this;

  options = options || {};
  options.from = options.from || 0;
  options.to = options.to || 0xffffffff;
  options.queryMempool = _.isUndefined(options.queryMempool) ? true : false;

  var results = [];

  var start = self._encoding.encodeUtxoIndexKey(address);
  var final = new Buffer(new Array(73).join('f'), 'hex');
  var end = Buffer.concat([ start.slice(0, -36), final ]);

  var criteria = {
    gte: start,
    lt: end
  };

  var utxoStream = self._db.createReadStream(criteria);

  var streamErr;

  utxoStream.on('end', function() {

    if (streamErr) {
      return callback(streamErr);
    }

    callback(null, results);

  });

  utxoStream.on('error', function(err) {
    streamErr = err;
  });

  utxoStream.on('data', function(data) {

    var key = self._encoding.decodeUtxoIndexKey(data.key);
    var value =  self._encoding.decodeUtxoIndexValue(data.value);

    results.push({
      address: address,
      txid: key.txid,
      vout: key.outputIndex,
      ts: value.timestamp,
      scriptPubKey: value.script.toString('hex'),
      amount: Unit.fromSatoshis(value.satoshis).toBTC(),
      confirmations: self._header.getBestHeight() - value.height,
      satoshis: value.satoshis,
      confirmationsFromCache: true
    });

  });

};

AddressService.prototype.getAPIMethods = function() {
  return [
    ['getAddressHistory', this, this.getAddressHistory, 2],
    ['getAddressSummary', this, this.getAddressSummary, 1],
    ['getAddressUnspentOutputs', this, this.getAddressUnspentOutputs, 1]
  ];
};

AddressService.prototype.start = function(callback) {

  var self = this;

  this._db.getPrefix(this.name, function(err, prefix) {
    if(err) {
      return callback(err);
    }
    self._encoding = new Encoding(prefix);
    callback();
  });
};

AddressService.prototype.stop = function(callback) {
  setImmediate(callback);
};


// ---- start private function prototypes
AddressService.prototype._getAddressHistory = function(address, options, callback) {

  var self = this;

  options = options || {};
  options.start = options.start || 0;
  options.end = options.end || 0xffffffff;

  var endHeightBuf = new Buffer(4);
  endHeightBuf.writeUInt32BE(options.end);

  if (_.isUndefined(options.queryMempool)) {
    options.queryMempool = true;
  }

  var results = [];
  var start = self._encoding.encodeAddressIndexKey(address, options.start);
  var end = Buffer.concat([
    start.slice(0, address.length + 4),
    endHeightBuf,
    new Buffer(new Array(83).join('f'), 'hex')
  ]);

  var criteria = {
    gte: start,
    lte: end
  };

  // txid stream
  var txidStream = self._db.createKeyStream(criteria);

  txidStream.on('close', function() {
    txidStream.unpipe();
  });

  // tx stream
  var txStream = new Transform({ objectMode: true, highWaterMark: 1000 });

  var streamErr;
  txStream.on('end', function() {

    if (streamErr) {
      return callback(streamErr);
    }

    callback(null, results);

  });

  // pipe txids into tx stream for processing
  txidStream.pipe(txStream);

  txStream._transform = function(chunk, enc, callback) {

    var key = self._encoding.decodeAddressIndexKey(chunk);

    self._tx.getTransaction(key.txid, options, function(err, tx) {

      if(err) {
        log.error(err);
        txStream.emit('error', err);
        return callback();
      }

      if (!tx) {
        log.error('Could not find tx for txid: ' + key.txid + '. This should not be possible, check indexes.');
        txStream.emit('error', err);
        return callback();
      }

      results.push(tx);

      callback();

    });

  };

  txStream.on('error', function(err) {
    log.error(err);
    txStream.unpipe();
  });

  txStream._flush = function(callback) {
    txStream.emit('end');
    callback();
  };

};

AddressService.prototype.onReorg = function(args, callback) {

  var self = this;

  var oldBlockList = args[1];

  var removalOps = [];
  // for every tx, remove the address index key for every input and output
  // TODO: DRY self up!
  for(var i = 0; i < oldBlockList.length; i++) {

    var block = oldBlockList[i];
    //txs
    for(var j = 0; j < block.txs.length; j++) {

      var tx = block.txs[j];

      //inputs
      var address;

      for(var k = 0; k < tx.inputs.length; k++) {

        var input = tx.inputs[k];
        address = input.getAddress();

        if (!address) {
          continue;
        }

        address.network = self._network;
        address = address.toString();

        removalOps.push({
          type: 'del',
          key: self._encoding.encodeAddressIndexKey(address, block.height, tx.txid(), k, 1, block.ts)
        });
      }

      //outputs
      for(k = 0; k < tx.outputs.length; k++) {

        var output = tx.outputs[k];
        address = output.getAddress();

        if (!address) {
          continue;
        }

        address.network = self._network;
        address = address.toString();

        removalOps.push({
          type: 'del',
          key: self._encoding.encodeAddressIndexKey(address, block.height, tx.txid(), k, 0, block.ts)
        });

      }
    }
  }

  callback(null, removalOps);
};

AddressService.prototype.onBlock = function(block, callback) {
  var self = this;

  if (self.node.stopping) {
    return callback();
  }

  var operations = [];

  for(var i = 0; i < block.txs.length; i++) {
    var tx = block.txs[i];
    var ops = self._processTransaction(tx, { block: block });
    operations.push(ops);
  }

  operations = _.flatten(operations);
  callback(null, operations);
};

AddressService.prototype._processInput = function(tx, input, opts) {

  var address = input.getAddress();

  if(!address) {
    return;
  }

  address.network = this._network;
  address = address.toString();
  var txid = tx.txid();
  var timestamp = this._timestamp.getTimestampSync(opts.block.rhash());
  assert(timestamp, 'Must have a timestamp in order to process input.');

  // address index
  var addressKey = this._encoding.encodeAddressIndexKey(address, opts.block.height, txid, opts.inputIndex, 1, timestamp);

  var operations = [{
    type: 'put',
    key: addressKey
  }];

  // prev utxo
  var rec = {
    type: 'del',
    key: this._encoding.encodeUtxoIndexKey(address, input.prevout.txid(), input.prevout.index)
  };

  // In the event where we are reorg'ing,
  // this is where we are putting a utxo back in, we don't know what the original height, sats, or scriptBuffer
  // since this only happens on reorg and the utxo that was spent in the chain we are reorg'ing away from will likely
  // be spent again sometime soon, we will not add the value back in, just the key

  operations.push(rec);

  return operations;
};

AddressService.prototype._processOutput = function(tx, output, index, opts) {
  var address = output.getAddress();

  if(!address) {
    return;
  }

  address.network = this._network;
  address = address.toString();
  var txid = tx.txid();
  var timestamp = this._timestamp.getTimestampSync(opts.block.rhash());
  assert(timestamp, 'Must have a timestamp in order to process output.');

  var addressKey = this._encoding.encodeAddressIndexKey(address, opts.block.height, txid, opts.outputIndex, 0, timestamp);

  var utxoKey = this._encoding.encodeUtxoIndexKey(address, txid, index);
  var utxoValue = this._encoding.encodeUtxoIndexValue(
    opts.block.height,
    Unit.fromBTC(output.value).toSatoshis(),
    timestamp,
    output.script.toRaw()
  );

  var operations = [{
    type: 'put',
    key: addressKey
  }];

  operations.push({
    type: 'put',
    key: utxoKey,
    value: utxoValue
  });

  return operations;

};

AddressService.prototype._processTransaction = function(tx, opts) {

  var self = this;

  var _opts = { block: opts.block };

  var outputOperations = tx.outputs.map(function(output, index) {
    return self._processOutput(tx, output, index, _opts);
  });

  outputOperations = _.flatten(_.compact(outputOperations));

  var inputOperations = tx.inputs.map(function(input, index) {
    _opts.inputIndex = index;
    return self._processInput(tx, input, _opts);
  });

  inputOperations = _.flatten(_.compact(inputOperations));

  outputOperations.concat(inputOperations);
  return outputOperations;

};

module.exports = AddressService;
