'use strict';

const bitcore = require('bitcore-lib');
const _ = bitcore.deps._;
const $ = bitcore.util.preconditions;
const Common = require('./common');
const async = require('async');

const COINBASE_MATURITY = bitcore.Block.COINBASE_MATURITY;

const MAXINT = 0xffffffff; // Math.pow(2, 32) - 1;


function TxController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

TxController.prototype.show = function(req, res) {
  if (req.transaction) {
    res.jsonp(req.transaction);
  }
};

/**
 * Find transaction by hash ...
 */
TxController.prototype.transaction = function(req, res, next) {
  var self = this;
  var txid = req.params.txid;

  this.node.getDetailedTransaction(txid, function(err, transaction) {
    if (err && err.code === -5) {
      return self.common.handleErrors(null, res);
    } else if(err) {
      return self.common.handleErrors(err, res);
    }

    self.transformTransaction(transaction, function(err, transformedTransaction) {
      if (err) {
        return self.common.handleErrors(err, res);
      }
      req.transaction = transformedTransaction;
      next();
    });

  });
};

TxController.prototype.transformTransaction = function(transaction, options, callback) {
  if (_.isFunction(options)) {
    callback = options;
    options = {};
  }
  $.checkArgument(_.isFunction(callback));

  var confirmations = 0;
  if(transaction.height >= 0) {
    confirmations = this.node.services.meritd.height - transaction.height + 1;
  }

  var transformed = {
    txid: transaction.hash,
    version: transaction.version,
    locktime: transaction.locktime
  };

  if(transaction.isCoinbase) {
    transformed.vin = [
      {
        coinbase: transaction.inputs[0].script,
        sequence: transaction.inputs[0].sequence,
        n: 0
      }
    ];
  } else {
    transformed.vin = transaction.inputs.map(this.transformInput.bind(this, options));
  }

  transformed.vout = transaction.outputs.map(this.transformOutput.bind(this, options));

  transformed.blockhash = transaction.blockHash;
  transformed.blockheight = transaction.height;
  transformed.confirmations = confirmations;
  // TODO consider mempool txs with receivedTime?
  var time = transaction.blockTimestamp ? transaction.blockTimestamp : Math.round(Date.now() / 1000);
  transformed.time = time;

  if (transformed.confirmations) {
    transformed.blocktime = transformed.time;
  }

  if (transaction.isCoinbase) {
    let maturity = COINBASE_MATURITY[this.node.network.name];
    transformed.isCoinbase = true;
    transformed.isMature = transformed.confirmations >= maturity ? true : false;
  }

  transformed.isInvite = transaction.isInvite;

  transformed.valueOut = transaction.outputMicros;
  transformed.valueIn = transaction.inputMicros;

  if (!transformed.isInvite) {
    transformed.valueOut /= 1e8;
    transformed.valueIn /= 1e8;
  }

  transformed.fees = transaction.feeMicros / 1e8;

  callback(null, transformed);
};

TxController.prototype.transformInput = function(options, input, index) {
  // Input scripts are validated and can be assumed to be valid
  var transformed = {
    txid: input.prevTxId,
    vout: input.outputIndex,
    sequence: input.sequence,
    n: index
  };

  if (!options.noScriptSig) {
    transformed.scriptSig = {
      hex: input.script
    };
    if (!options.noAsm) {
      transformed.scriptSig.asm = input.scriptAsm;
    }
  }

  transformed.addr = input.address;
  transformed.alias = input.alias;
  transformed.valueMicros = input.micros;
  transformed.value = input.micros / 1e8;
  transformed.doubleSpentTxID = null; // TODO
  //transformed.isConfirmed = null; // TODO
  //transformed.confirmations = null; // TODO
  //transformed.unconfirmedInput = null; // TODO

  return transformed;
};

TxController.prototype.transformOutput = function(options, output, index) {
  var transformed = {
    value: (output.micros / 1e8).toFixed(8),
    n: index,
    scriptPubKey: {
      hex: output.script
    }
  };

  if (!options.noAsm) {
    transformed.scriptPubKey.asm = output.scriptAsm;
  }

  if (!options.noSpent) {
    transformed.spentTxId = output.spentTxId || null;
    transformed.spentIndex = _.isUndefined(output.spentIndex) ? null : output.spentIndex;
    transformed.spentHeight = output.spentHeight || null;
  }

  if (output.address) {
    transformed.scriptPubKey.addresses = [output.address];
    transformed.scriptPubKey.aliases = [output.alias];
    var address = bitcore.Address(output.address); //TODO return type from merit-node
    transformed.scriptPubKey.type = address.type;
  }
  return transformed;
};

TxController.prototype.transformInvTransaction = function(transaction) {
  const self = this;

  let valueOut = 0;

  const inputAddresses = _.reduce(transaction.inputs, function(acc, input) {
    if (!input.script) {
      return acc;
    }

    const address = input.script.toAddress(self.node.network);
    if (!address) {
      return acc;
    }

    return acc.add(address.toString());
  }, new Set());

  const vout = _.reduce(transaction.outputs, function(acc, output) {
    valueOut += output.micros;
    if (!output.script) {
      return acc;
    }

    const address = output.script.toAddress(self.node.network);
    if (!address) {
      return acc;
    }

    const addresString = address.toString();
    const obj = {
      [addresString]: output.micros,
      isChangeOutput: inputAddresses.has(addresString),
    };
    return acc.concat(obj);
  }, []);

  const isRBF = _.some(_.map(transaction.inputs, 'sequenceNumber'), function(seq) {
    return seq < MAXINT - 1;
  });

  // We want to know if a transaction is coinbase and invite so that we can handle it
  // in a relevant way in various wallets.
  const transformed = {
    txid: transaction.hash,
    valueOut: valueOut / 1e8,
    vout: vout,
    isRBF: isRBF,
    isCoinbase: transaction.isCoinbase(),
    isInvite: transaction.isInvite(),
  };

  return transformed;
};

TxController.prototype.rawTransaction = function(req, res, next) {
  var self = this;
  var txid = req.params.txid;

  this.node.getTransaction(txid, function(err, transaction) {
    if (err && err.code === -5) {
      return self.common.handleErrors(null, res);
    } else if(err) {
      return self.common.handleErrors(err, res);
    }

    req.rawTransaction = {
      'rawtx': transaction.toBuffer().toString('hex')
    };

    next();
  });
};

TxController.prototype.showRaw = function(req, res) {
  if (req.rawTransaction) {
    res.jsonp(req.rawTransaction);
  }
};

TxController.prototype.list = function(req, res) {
  var self = this;

  var blockHash = req.query.block;
  var address = req.query.address;
  var page = parseInt(req.query.pageNum) || 0;
  var pageLength = 10;
  var pagesTotal = 1;

  if(blockHash) {
    self.node.getBlockOverview(blockHash, function(err, block) {
      if(err && err.code === -5) {
        return self.common.handleErrors(null, res);
      } else if(err) {
        return self.common.handleErrors(err, res);
      }

      var totalTxs = block.txids.length;
      var txids;

      if(!_.isUndefined(page)) {
        var start = page * pageLength;
        txids = block.txids.slice(start, start + pageLength);
        pagesTotal = Math.ceil(totalTxs / pageLength);
      } else {
        txids = block.txids;
      }

      async.mapSeries(txids, function(txid, next) {
        self.node.getDetailedTransaction(txid, function(err, transaction) {
          if (err) {
            return next(err);
          }
          self.transformTransaction(transaction, next);
        });
      }, function(err, transformed) {
        if(err) {
          return self.common.handleErrors(err, res);
        }

        res.jsonp({
          pagesTotal: pagesTotal,
          txs: transformed
        });
      });

    });
  } else if(address) {
    var options = {
      from: page * pageLength,
      to: (page + 1) * pageLength
    };

    self.node.getAddressHistory(address, options, function(err, result) {
      if(err) {
        return self.common.handleErrors(err, res);
      }

      var txs = result.items.map(function(info) {
        return info.tx;
      }).filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });

      async.map(
        txs,
        function(tx, next) {
          self.transformTransaction(tx, next);
        },
        function(err, transformed) {
          if (err) {
            return self.common.handleErrors(err, res);
          }
          res.jsonp({
            pagesTotal: Math.ceil(result.totalCount / pageLength),
            txs: transformed
          });
        }
      );
    });
  } else {
    return self.common.handleErrors(new Error('Block hash or address expected'), res);
  }
};

TxController.prototype.send = function(req, res) {
  var self = this;
  this.node.sendTransaction(req.body.rawtx, function(err, txid) {
    if(err) {
      // TODO handle specific errors
      self.common.log.warn("Error when broadcasting rawTx: " + req.body.rawtx);
      return self.common.handleErrors(err, res);
    }

    res.json({'txid': txid});
  });
};

module.exports = TxController;
