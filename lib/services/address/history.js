'use strict';

var bitcore = require('bitcore-lib');
var async = require('async');
var _ = bitcore.deps._;

/**
 * This represents an instance that keeps track of data over a series of
 * asynchronous I/O calls to get the transaction history for a group of
 * addresses. History can be queried by start and end block heights to limit large sets
 * of results (uses leveldb key streaming).
 */
function AddressHistory(args) {
  this.node = args.node;
  this.options = args.options;

  if(Array.isArray(args.addresses)) {
    this.addresses = args.addresses;
  } else {
    this.addresses = [args.addresses];
  }
  this.transactionInfo = [];
  this.combinedArray = [];
  this.detailedArray = [];
}

AddressHistory.MAX_ADDRESS_QUERIES = 20;

/**
 * This function will give detailed history for the configured
 * addresses. See AddressService.prototype.getAddressHistory
 * for complete documentation about options and response format.
 */
AddressHistory.prototype.get = function(callback) {
  var self = this;
  var totalCount;

  async.eachLimit(
    self.addresses,
    AddressHistory.MAX_ADDRESS_QUERIES,
    function(address, next) {
      self.getTransactionInfo(address, next);
    },
    function(err) {
      if (err) {
        return callback(err);
      }

      self.combineTransactionInfo();
      totalCount = Number(self.combinedArray.length);
      self.sortAndPaginateCombinedArray();

      async.eachSeries(
        self.combinedArray,
        function(txInfo, next) {
          self.getDetailedInfo(txInfo, next);
        },
        function(err) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            totalCount: totalCount,
            items: self.detailedArray
          });
        }
      );
    }
  );
};

/**
 * This function will retrieve input and output information for an address
 * and set the property `this.transactionInfo`.
 * @param {String} address - A base58check encoded address
 * @param {Function} next
 */
AddressHistory.prototype.getTransactionInfo = function(address, next) {
  var self = this;

  var args = {
    start: self.options.start,
    end: self.options.end,
    queryMempool: _.isUndefined(self.options.queryMempool) ? true : self.options.queryMempool
  };

  var outputs;
  var inputs;

  async.parallel([
    function(done) {
      self.node.services.address.getOutputs(address, args, function(err, result) {
        if (err) {
          return done(err);
        }
        outputs = result;
        done();
      });
    },
    function(done) {
      self.node.services.address.getInputs(address, args, function(err, result) {
        if (err) {
          return done(err);
        }
        inputs = result;
        done();
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    self.transactionInfo = self.transactionInfo.concat(outputs, inputs);
    next();
  });
};

/**
 * This function combines results from getInputs and getOutputs at
 * `this.transactionInfo` to be "txid" unique at `this.combinedArray`.
 */
AddressHistory.prototype.combineTransactionInfo = function() {
  var combinedArrayMap = {};
  this.combinedArray = [];
  var l = this.transactionInfo.length;
  for(var i = 0; i < l; i++) {
    var item = this.transactionInfo[i];
    var mapKey = item.txid;
    if (combinedArrayMap[mapKey] >= 0) {
      var combined = this.combinedArray[combinedArrayMap[mapKey]];
      if (!combined.addresses[item.address]) {
        combined.addresses[item.address] = {
          outputIndexes: [],
          inputIndexes: []
        };
      }
      if (item.outputIndex >= 0) {
        combined.satoshis += item.satoshis;
        combined.addresses[item.address].outputIndexes.push(item.outputIndex);
      } else if (item.inputIndex >= 0) {
        combined.addresses[item.address].inputIndexes.push(item.inputIndex);
      }
    } else {
      item.addresses = {};
      item.addresses[item.address] = {
        outputIndexes: [],
        inputIndexes: []
      };
      if (item.outputIndex >= 0) {
        item.addresses[item.address].outputIndexes.push(item.outputIndex);
      } else if (item.inputIndex >= 0) {
        item.addresses[item.address].inputIndexes.push(item.inputIndex);
      }
      delete item.outputIndex;
      delete item.inputIndex;
      delete item.address;
      this.combinedArray.push(item);
      combinedArrayMap[mapKey] = this.combinedArray.length - 1;
    }
  }
};

/**
 * A helper function to sort and slice/paginate the `combinedArray`
 */
AddressHistory.prototype.sortAndPaginateCombinedArray = function() {
  this.combinedArray.sort(AddressHistory.sortByHeight);
  if (!_.isUndefined(this.options.from) && !_.isUndefined(this.options.to)) {
    this.combinedArray = this.combinedArray.slice(this.options.from, this.options.to);
  }
};

/**
 * A helper sort function to order by height and then by date
 * for transactions that are in the mempool.
 * @param {Object} a - An item from the `combinedArray`
 * @param {Object} b
 */
AddressHistory.sortByHeight = function(a, b) {
  if (a.height < 0 && b.height < 0) {
    // Both are from the mempool, compare timestamps
    if (a.timestamp === b.timestamp) {
      return 0;
    } else {
      return a.timestamp < b.timestamp ? 1 : -1;
    }
  } else if (a.height < 0 && b.height > 0) {
    // A is from the mempool and B is in a block
    return -1;
  } else if (a.height > 0 && b.height < 0) {
    // A is in a block and B is in the mempool
    return 1;
  } else if (a.height === b.height) {
    // The heights are equal
    return 0;
  } else {
    // Otherwise compare heights
    return a.height < b.height ? 1 : -1;
  }
};

/**
 * This function will transform items from the combinedArray into
 * the detailedArray with the full transaction, satoshis and confirmation.
 * @param {Object} txInfo - An item from the `combinedArray`
 * @param {Function} next
 */
AddressHistory.prototype.getDetailedInfo = function(txInfo, next) {
  var self = this;
  var queryMempool = _.isUndefined(self.options.queryMempool) ? true : self.options.queryMempool;

  self.node.services.db.getTransactionWithBlockInfo(
    txInfo.txid,
    queryMempool,
    function(err, transaction) {
      if (err) {
        return next(err);
      }

      transaction.populateInputs(self.node.services.db, [], function(err) {
        if(err) {
          return next(err);
        }

        self.detailedArray.push({
          addresses: txInfo.addresses,
          satoshis: self.getSatoshisDetail(transaction, txInfo),
          height: transaction.__height,
          confirmations: self.getConfirmationsDetail(transaction),
          timestamp: transaction.__timestamp,
          // TODO bitcore-lib should return null instead of throwing error on coinbase
          fees: !transaction.isCoinbase() ? transaction.getFee() : null,
          tx: transaction
        });

        next();
      });
    }
  );
};

/**
 * A helper function for `getDetailedInfo` for getting the confirmations.
 * @param {Transaction} transaction - A transaction with a populated __height value.
 */
AddressHistory.prototype.getConfirmationsDetail = function(transaction) {
  var confirmations = 0;
  if (transaction.__height >= 0) {
    confirmations = this.node.services.db.tip.__height - transaction.__height + 1;
  }
  return confirmations;
};

/**
 * A helper function for `getDetailedInfo` for getting the satoshis.
 * @param {Transaction} transaction - A transaction populated with previous outputs
 * @param {Object} txInfo - An item from `combinedArray`
 */
AddressHistory.prototype.getSatoshisDetail = function(transaction, txInfo) {
  var satoshis = txInfo.satoshis || 0;

  for(var address in txInfo.addresses) {
    if (txInfo.addresses[address].inputIndexes.length >= 0) {
      for(var j = 0; j < txInfo.addresses[address].inputIndexes.length; j++) {
        satoshis -= transaction.inputs[txInfo.addresses[address].inputIndexes[j]].output.satoshis;
      }
    }
  }

  return satoshis;
};

module.exports = AddressHistory;
