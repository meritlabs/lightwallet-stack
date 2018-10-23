'use strict';

var _ = require('lodash');
var $ = require('preconditions').singleton();
var io = require('socket.io-client');
var requestList = require('./request-list');
var log;

function Insight(opts) {
  $.checkArgument(opts);
  $.checkArgument(_.includes(['livenet', 'testnet'], opts.network));
  $.checkArgument(opts.url);

  this.apiPrefix = opts.apiPrefix || '/insight-api';
  this.network = opts.network || 'livenet';
  this.hosts = opts.url;
  this.userAgent = opts.userAgent || 'bws';
  log = opts.log || require('npmlog');
};


var _parseErr = function(err, res) {
  // The 'err' can be misleading because it's not really the error returned from insight.
  // Instead, it is an error in communicating with insight.
  const errMessage = res.body;
  if (err) {
    log.warn('Network error connecting to blockchain explorer: ', err);
    return { localMessage: "Error connecting to the blockchain explorer.", ...errMessage };
  }
  log.warn("Insight " + res.request.href + " Returned Status: " + res.statusCode + ". Error message: " + errMessage.message);

  return { localMessage: "Error querying the blockchain", ...errMessage };
};

Insight.prototype._doRequest = function(args, cb) {
  var opts = {
    hosts: this.hosts,
    headers: {
      'User-Agent': this.userAgent,
    }
  };
  requestList(_.defaults(args, opts), cb);
};

Insight.prototype.getConnectionInfo = function() {
  return 'Insight (' + this.network + ') @ ' + this.hosts;
};

/**
 * Retrieve a list of unspent outputs associated with an address or set of addresses
 */
Insight.prototype.getUtxos = function(addresses, invites, cb) {
  var url = this.url + this.apiPrefix + '/addrs/utxo';
  var args = {
    method: 'POST',
    path: this.apiPrefix + '/addrs/utxo',
    json: {
      addrs: [].concat(addresses).join(','),
      invites,
    },
  };

  this._doRequest(args, function(err, res, unspent) {
    if (err || res.statusCode !== 200) return cb(_parseErr(err, res));
    return cb(null, unspent);
  });
};

/**
 * Broadcast a transaction to the Merit network
 */
Insight.prototype.broadcast = function(rawTx, cb) {
  var args = {
    method: 'POST',
    path: this.apiPrefix + '/tx/send',
    json: {
      rawtx: rawTx
    },
  };

  this._doRequest(args, function(err, res, body) {
    if (err || res.statusCode !== 200) return cb(_parseErr(err, res));
    return cb(null, body ? body.txid : null);
  });
};

Insight.prototype.getTransaction = function(txid, cb) {
  var args = {
    method: 'GET',
    path: this.apiPrefix + '/tx/' + txid,
    json: true,
  };

  this._doRequest(args, function(err, res, tx) {
    if (res && res.statusCode == 404) return cb();
    if (err || res.statusCode !== 200)
      return cb(_parseErr(err, res));

    return cb(null, tx);
  });
};

Insight.prototype.getReferral = function(refid, cb) {
  var args = {
    method: 'GET',
    path: this.apiPrefix + '/referral/' + refid,
    json: true,
  };

  this._doRequest(args, function(err, res, tx) {
    if (res && res.statusCode == 404) return cb();
    if (err || res.statusCode !== 200)
      return cb(_parseErr(err, res));

    return cb(null, tx);
  });
};

Insight.prototype.getAddressReferrals = function(addresses, cb) {

    var args = {
        method: 'POST',
        path: this.apiPrefix + '/addrs/referrals',
        json: {
            addrs: [].concat(addresses).join(',')
        },
        timeout: 120000
    };

    this._doRequest(args, function(err, res, referrals) {
        if (err || res.statusCode !== 200) return cb(_parseErr(err, res));

        if (_.isObject(referrals)) {
            if (referrals.totalItems)
                var total = referrals.totalItems;

            if (referrals.items)
                referrals = referrals.items;
        }

        // NOTE: Whenever Insight breaks communication with meritd, it returns invalid data but no error code.
        if (!_.isArray(referrals) || (referrals.length != _.compact(referrals).length)) return cb(new Error('Could not retrieve referrals from blockchain. Request was:' + JSON.stringify(args)));

        return cb(null, referrals, total);
    });
};

Insight.prototype.getTransactions = function(addresses, from, to, cb) {
  var qs = [];
  var total;
  if (_.isNumber(from)) qs.push('from=' + from);
  if (_.isNumber(to)) qs.push('to=' + to);

  // Trim output
  qs.push('noAsm=1');
  qs.push('noScriptSig=1');
  qs.push('noSpent=1');

  var args = {
    method: 'POST',
    path: this.apiPrefix + '/addrs/txs' + (qs.length > 0 ? '?' + qs.join('&') : ''),
    json: {
      addrs: [].concat(addresses).join(',')
    },
    timeout: 120000,
  };

  this._doRequest(args, function(err, res, txs) {
    if (err || res.statusCode !== 200) return cb(_parseErr(err, res));

    if (_.isObject(txs)) {
      if (txs.totalItems)
        total = txs.totalItems;

      if (txs.items)
        txs = txs.items;
    }

    // NOTE: Whenever Insight breaks communication with meritd, it returns invalid data but no error code.
    if (!_.isArray(txs) || (txs.length != _.compact(txs).length)) return cb(new Error('Could not retrieve transactions from blockchain. Request was:' + JSON.stringify(args)));

    return cb(null, txs, total);
  });
};

Insight.prototype.getAddressActivity = function(address, cb) {
  var self = this;

  var args = {
    method: 'GET',
    path: self.apiPrefix + '/addr/' + address,
    json: true,
  };

  this._doRequest(args, function(err, res, result) {
    if (res && res.statusCode == 404) return cb();
    if (err || res.statusCode !== 200)
      return cb(_parseErr(err, res));

    var nbTxs = result.unconfirmedTxApperances + result.txApperances;
    return cb(null, nbTxs > 0);
  });
};

Insight.prototype.estimateFee = function(nbBlocks, cb) {
  var path = this.apiPrefix + '/utils/estimatefee';
  if (nbBlocks) {
    path += '?nbBlocks=' + [].concat(nbBlocks).join(',');
  }

  var args = {
    method: 'GET',
    path: path,
    json: true,
  };
  this._doRequest(args, function(err, res, body) {
    if (err || res.statusCode !== 200) return cb(_parseErr(err, res));
    return cb(null, body);
  });
};

Insight.prototype.getBlockchainHeight = function(cb) {
  var path = this.apiPrefix + '/sync';

  var args = {
    method: 'GET',
    path: path,
    json: true,
  };
  this._doRequest(args, function(err, res, body) {
    if (err || res.statusCode !== 200) return cb(_parseErr(err, res));
    return cb(null, body.blockChainHeight);
  });
};

Insight.prototype.getBlock = function(blockHash, cb) {
  const self = this;

  console.log('Insight getBlock!');

  const args = {
    method: 'GET',
    path: `${this.apiPrefix}/block/${blockHash}`,
    json: true,
  };

  this._doRequest(args, function(err, res, body) {
    if (err || res.statusCode !== 200) return cb(_parseErr(err, res));
    console.log('insight block received. Referrals: ', body.referrals);
    return cb(null, body);
  });
}

Insight.prototype.initSocket = function() {
  console.log('Insight hosts:', this.hosts);
  // sockets always use the first server on the pull
  var socket = io.connect(_.head([].concat(this.hosts)), {
    'reconnection': true,
  });
  return socket;
};

Insight.prototype.validateAddress = function(address, cb) {
  const args = {
    method: 'GET',
    path: `${this.apiPrefix}/addr/${address}/validate`,
  };

  this._doRequest(args, function(err, res, body) {
    if (err || res.statusCode !== 200) {
      return cb(_parseErr(err, res));
    }

    return cb(null, JSON.parse(body));
  });
};

Insight.prototype.getANV = function(addresses, cb) {
  var self = this;

  var args = {
    method: 'GET',
    path: `${this.apiPrefix}/anv`,
    json: {
      addresses: addresses
    }
  };

  this._doRequest(args, function(err, res, body) {
    if (err || res.statusCode !== 200) {
      return cb(_parseErr(err, res));
    }
    return cb(null, body);
  });
};

Insight.prototype.getCommunityInfo = function(address, cb) {
  const args = {
    method: 'GET',
    path: `${this.apiPrefix}/communityinfo/${address}`
  };

  this._doRequest(args, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      return cb(_parseErr(err, res));
    }
    return cb(null, JSON.parse(body));
  });
};

Insight.prototype.getRewards = function(addresses, cb) {
  var self = this;

    var args = {
      method: 'GET',
      path: `${this.apiPrefix}/rewards`,
      json: {
        addresses: addresses
      }
    };

    this._doRequest(args, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        return cb(_parseErr(err, res));
      }
      return cb(null, body);
    });
}

module.exports = Insight;
