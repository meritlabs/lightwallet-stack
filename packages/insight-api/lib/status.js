'use strict';

var Common = require('./common');

function StatusController(node) {
  this.node = node;
  this.common = new Common({ log: this.node.log });
}

StatusController.prototype.show = function(req, res) {
  var self = this;
  var option = req.query.q;

  switch (option) {
    case 'getDifficulty':
      this.getDifficulty(function(err, result) {
        if (err) {
          return self.common.handleErrors(err, res);
        }
        res.jsonp(result);
      });
      break;
    case 'getLastBlockHash':
      res.jsonp(this.getLastBlockHash());
      break;
    case 'getBestBlockHash':
      this.getBestBlockHash(function(err, result) {
        if (err) {
          return self.common.handleErrors(err, res);
        }
        res.jsonp(result);
      });
      break;
    case 'getInfo':
    default:
      this.getInfo(function(err, result) {
        if (err) {
          return self.common.handleErrors(err, res);
        }
        res.jsonp({
          info: result,
        });
      });
  }
};

StatusController.prototype.getInfo = function(callback) {
  this.node.services.meritd.getInfo(function(err, result) {
    if (err) {
      return callback(err);
    }
    var info = {
      version: result.version,
      protocolversion: result.protocolVersion,
      blocks: result.blocks,
      timeoffset: result.timeOffset,
      connections: result.connections,
      proxy: result.proxy,
      difficulty: result.difficulty,
      testnet: result.testnet,
      relayfee: result.relayFee,
      errors: result.errors,
      network: result.network,
    };
    callback(null, info);
  });
};

StatusController.prototype.getLastBlockHash = function() {
  var hash = this.node.services.meritd.tiphash;
  return {
    syncTipHash: hash,
    lastblockhash: hash,
  };
};

StatusController.prototype.getBestBlockHash = function(callback) {
  this.node.services.meritd.getBestBlockHash(function(err, hash) {
    if (err) {
      return callback(err);
    }
    callback(null, {
      bestblockhash: hash,
    });
  });
};

StatusController.prototype.getDifficulty = function(callback) {
  this.node.services.meritd.getInfo(function(err, info) {
    if (err) {
      return callback(err);
    }
    callback(null, {
      difficulty: info.difficulty,
    });
  });
};

StatusController.prototype.sync = function(req, res) {
  var self = this;
  var status = 'syncing';

  this.node.services.meritd.isSynced(function(err, synced) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    if (synced) {
      status = 'finished';
    }

    self.node.services.meritd.syncPercentage(function(err, percentage) {
      if (err) {
        return self.common.handleErrors(err, res);
      }
      var info = {
        status: status,
        blockChainHeight: self.node.services.meritd.height,
        syncPercentage: Math.round(percentage),
        height: self.node.services.meritd.height,
        error: null,
        type: 'Merit Node',
      };

      res.jsonp(info);
    });
  });
};

// Hard coded to make insight ui happy, but not applicable
StatusController.prototype.peer = function(req, res) {
  res.jsonp({
    connected: true,
    host: '127.0.0.1',
    port: null,
  });
};

StatusController.prototype.version = function(req, res) {
  var pjson = require('../package.json');
  res.jsonp({
    version: pjson.version,
  });
};

module.exports = StatusController;
