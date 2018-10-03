'use strict';

const bitcore = require('meritcore-lib');
const async = require('async');
const TxController = require('./transactions');
const Common = require('./common');
const _ = require('lodash');

const COINBASE_MATURITY = bitcore.Block.COINBASE_MATURITY;

function AddressController(node) {
  this.node = node;
  this.txController = new TxController(node);
  this.common = new Common({log: this.node.log});
};

AddressController.prototype.show = function(req, res) {
  var self = this;
  var options = {
    noTxList: parseInt(req.query.noTxList)
  };

  if (req.query.from && req.query.to) {
    options.from = parseInt(req.query.from);
    options.to = parseInt(req.query.to);
  }

  this.getAddressSummary(req.addr, options, function(err, data) {
    if(err) {
      return self.common.handleErrors(err, res);
    }

    res.jsonp(data);
  });
};

AddressController.prototype.balance = function(req, res) {
  this.addressSummarySubQuery(req, res, 'balanceMicros');
};

AddressController.prototype.totalReceived = function(req, res) {
  this.addressSummarySubQuery(req, res, 'totalReceivedMicros');
};

AddressController.prototype.totalSent = function(req, res) {
  this.addressSummarySubQuery(req, res, 'totalSentMicros');
};

AddressController.prototype.unconfirmedBalance = function(req, res) {
  this.addressSummarySubQuery(req, res, 'unconfirmedBalanceMicros');
};

AddressController.prototype.addressSummarySubQuery = function(req, res, param) {
  var self = this;
  this.getAddressSummary(req.addr, {}, function(err, data) {
    if(err) {
      return self.common.handleErrors(err, res);
    }

    res.jsonp(data[param]);
  });
};

AddressController.prototype.getAddressSummary = function(address, options, callback) {

  this.node.getAddressSummary(address, options, function(err, summary) {
    if(err) {
      return callback(err);
    }

    var transformed = {
      addrStr: address,
      balance: summary.balance / 1e8,
      balanceMicros: summary.balance,
      totalReceived: summary.totalReceived / 1e8,
      totalReceivedMicros: summary.totalReceived,
      totalSent: summary.totalSpent / 1e8,
      totalSentMicros: summary.totalSpent,
      unconfirmedBalance: summary.unconfirmedBalance / 1e8,
      unconfirmedBalanceMicros: summary.unconfirmedBalance,
      unconfirmedTxApperances: summary.unconfirmedAppearances, // misspelling - ew
      txApperances: summary.appearances, // yuck
      transactions: summary.txids
    };

    callback(null, transformed);
  });
};

AddressController.prototype.checkAddr = function(req, res, next) {
  req.addr = req.params.addr;

  if (this.check(req, res, next, [req.addr])) {
    return this.common.handleErrors({
      message: 'Must include address',
      code: 1
    }, res);
  }

  next();
};

AddressController.prototype.checkAddrOrAlias = function(req, res, next) {
  req.addr = req.params.addr;
  if (this.check(req, res, next, [req.addr] || !this.checkAlias(req, res, next, [req.addr]))) {
    return this.common.handleErrors({
      message: 'Invalid address: ' + + req.addr,
      code: 1
    }, res);
  }

  next();
};

AddressController.prototype.checkAddrs = function(req, res, next) {
  if(req.body.addrs) {
    req.addrs = req.body.addrs.split(',');
  } else {
    req.addrs = req.params.addrs.split(',');
  }

  if (this.check(req, res, next, req.addrs)) {
    return this.common.handleErrors({
      message: 'Must include address',
      code: 1
    }, res);
  }

  next();
};

AddressController.prototype.check = function(req, res, next, addresses) {
  if (!addresses.length || !addresses[0]) {
    return this.common.handleErrors({
      message: 'Must include address',
      code: 1
    }, res);
  }

  addresses = _.reject(addresses, _.isEmpty);

  for(var i = 0; i < addresses.length; i++) {
    try {
       new bitcore.Address(addresses[i]);
    } catch(e) {
      return false;
    }
  }
};

AddressController.prototype.checkAlias = function(req, res, next, aliases) {
  if(!aliases.length || !aliases[0]) {
    return this.common.handleErrors({
      message: 'Must include alias',
      code: 1
    }, res);
  }

  aliases = _.reject(aliases, _.isEmpty);

  return aliases.every(bitcore.Referral.validateAlias);
};

AddressController.prototype.validateAddress = function(req, res) {
  const self = this;
  const address = req.addr;

  this.node.validateAddress(address, function(err, response) {
    if (err || !response.result)  {
      return self.common.handleErrors({
        message: 'Invalid address: ' + err.message,
        code: 1
      }, res);
    }

    const info = response.result;

    return res.jsonp({
      address: info.address,
      alias: info.alias,
      isValid: !!info.isvalid,
      isBeaconed: !!info.isbeaconed,
      isConfirmed: !!info.isconfirmed,
     });
  });
};

AddressController.prototype.utxo = function(req, res) {
  var self = this;

  this.node.getAddressUnspentOutputs(req.addr, {}, function(err, utxos) {
    if(err) {
      return self.common.handleErrors(err, res);
    } else if (!utxos.length) {
      return res.jsonp([]);
    }
    res.jsonp(utxos.map(self.transformUtxo.bind(self)));
  });
};

AddressController.prototype.multiutxo = function(req, res) {
  this.node.getAddressUnspentOutputs(req.addrs, { invites: req.body.invites }, (err, utxos) => {
    if(err && err.code === -5) {
      return res.jsonp([]);
    } else if(err) {
      return this.common.handleErrors(err, res);
    }

    res.jsonp(utxos.map(this.transformUtxo.bind(this)));
  });
};

AddressController.prototype.transformUtxo = function(utxoArg) {
  var utxo = {
    address: utxoArg.address,
    txid: utxoArg.txid,
    vout: utxoArg.outputIndex,
    scriptPubKey: utxoArg.script,
    amount: !utxoArg.isInvite ? utxoArg.satoshis / 1e8 : utxoArg.satoshis,
    micros: utxoArg.satoshis,
    isCoinbase: utxoArg.isCoinbase,
    isInvite: utxoArg.isInvite,
  }; // ToDo: update after changes in meritd
  if (utxoArg.height && utxoArg.height > 0) {
    utxo.height = utxoArg.height;
    utxo.confirmations = this.node.services.meritd.height - utxoArg.height + 1;
  } else {
    utxo.confirmations = 0;
  }
  if (utxoArg.timestamp) {
    utxo.ts = utxoArg.timestamp;
  }
  if (utxo.isCoinbase) {
    let maturity = COINBASE_MATURITY[this.node.network.name];
    utxo.isMature = utxo.confirmations >= maturity ? true : false;
  }
  return utxo;
};

AddressController.prototype._getTransformOptions = function(req) {
  return {
    noAsm: parseInt(req.query.noAsm) ? true : false,
    noScriptSig: parseInt(req.query.noScriptSig) ? true : false,
    noSpent: parseInt(req.query.noSpent) ? true : false
  };
};

AddressController.prototype.referrals = function(req, res, next) {
    var self = this;

    var options = {
        from: parseInt(req.query.from) || parseInt(req.body.from) || 0
    };

    options.to = parseInt(req.query.to) || parseInt(req.body.to) || parseInt(options.from) + 10;

    self.node.getAddressReferrals(req.addrs, options, function(err, result) {
        if(err) {
            return self.common.handleErrors(err, res);
        }

        return res.jsonp({
            totalItems: result.totalCount,
            from: options.from,
            to: Math.min(options.to, result.totalCount),
            items: result.items
        });

    });
};

AddressController.prototype.multitxs = function(req, res, next) {
  var self = this;

  var options = {
    from: parseInt(req.query.from) || parseInt(req.body.from) || 0
  };

  options.to = parseInt(req.query.to) || parseInt(req.body.to) || parseInt(options.from) + 10;

  self.node.getAddressHistory(req.addrs, options, function(err, result) {
    if(err) {
      return self.common.handleErrors(err, res);
    }

    var transformOptions = self._getTransformOptions(req);

    self.transformAddressHistoryForMultiTxs(result.items, transformOptions, function(err, items) {
      if (err) {
        return self.common.handleErrors(err, res);
      }
      res.jsonp({
        totalItems: result.totalCount,
        from: options.from,
        to: Math.min(options.to, result.totalCount),
        items: items
      });
    });

  });
};

AddressController.prototype.transformAddressHistoryForMultiTxs = function(txinfos, options, callback) {
  var self = this;

  var items = txinfos.map(function(txinfo) {
    return txinfo.tx;
  }).filter(function(value, index, itemArr) {
    return itemArr.indexOf(value) === index;
  });

  async.map(
    items,
    function(item, next) {
      self.txController.transformTransaction(item, options, next);
    },
    callback
  );
};

module.exports = AddressController;
