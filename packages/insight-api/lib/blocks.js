'use strict';

var async = require('async');
var meritcore = require('meritcore-lib');
var _ = meritcore.deps._;
var pools = require('../pools.json');
var BN = meritcore.crypto.BN;
var LRU = require('lru-cache');
var Common = require('./common');

function BlockController(options) {
  var self = this;
  this.node = options.node;

  this.blockSummaryCache = LRU(options.blockSummaryCacheSize || BlockController.DEFAULT_BLOCKSUMMARY_CACHE_SIZE);
  this.blockCacheConfirmations = 6;
  this.blockCache = LRU(options.blockCacheSize || BlockController.DEFAULT_BLOCK_CACHE_SIZE);

  this.poolStrings = {};
  pools.forEach(function(pool) {
    pool.searchStrings.forEach(function(s) {
      self.poolStrings[s] = {
        poolName: pool.poolName,
        url: pool.url,
      };
    });
  });

  this.common = new Common({ log: this.node.log });
}

var BLOCK_LIMIT = 200;

BlockController.DEFAULT_BLOCKSUMMARY_CACHE_SIZE = 1000000;
BlockController.DEFAULT_BLOCK_CACHE_SIZE = 1000;

function isHexadecimal(hash) {
  if (!_.isString(hash)) {
    return false;
  }
  return /^[0-9a-fA-F]+$/.test(hash);
}

BlockController.prototype.checkBlockHash = function(req, res, next) {
  var self = this;
  var hash = req.params.blockHash;
  if (hash.length < 64 || !isHexadecimal(hash)) {
    return self.common.handleErrors(null, res);
  }
  next();
};

/**
 * Find block by hash ...
 */
BlockController.prototype.block = function(req, res, next) {
  var self = this;
  var hash = req.params.blockHash;
  var blockCached = self.blockCache.get(hash);

  if (blockCached) {
    blockCached.confirmations = self.node.services.meritd.height - blockCached.height + 1;
    req.block = blockCached;
    next();
  } else {
    self.node.getBlock(hash, function(err, block) {
      if ((err && err.code === -5) || (err && err.code === -8)) {
        return self.common.handleErrors(null, res);
      } else if (err) {
        return self.common.handleErrors(err, res);
      }

      self.node.services.meritd.getBlockHeader(hash, function(err, info) {
        if (err) {
          return self.common.handleErrors(err, res);
        }
        var blockResult = self.transformBlock(block, info);
        if (blockResult.confirmations >= self.blockCacheConfirmations) {
          self.blockCache.set(hash, blockResult);
        }
        req.block = blockResult;
        req.rawBlock = block.toString();

        next();
      });
    });
  }
};

BlockController.prototype._normalizePrevHash = function(hash) {
  // TODO fix meritcore to give back null instead of null hash
  if (hash !== '0000000000000000000000000000000000000000000000000000000000000000') {
    return hash;
  } else {
    return null;
  }
};

BlockController.prototype.transformBlock = function(block, info) {
  const blockObj = block.toObject();
  const transactionIds = blockObj.transactions.map(function(tx) {
    return tx.hash;
  });
  const inviteIds = blockObj.invites.map(function(invite) {
    return invite.hash;
  });
  const referralIds = blockObj.referrals.map(function(ref) {
    return ref.hash;
  });
  const result = {
    hash: block.hash,
    size: block.toBuffer().length,
    height: info.height,
    version: blockObj.header.version,
    merkleroot: blockObj.header.merkleRoot,
    tx: transactionIds,
    invites: inviteIds,
    referrals: referralIds,
    time: blockObj.header.time,
    nonce: blockObj.header.nonce,
    cycle: block.header.cycle,
    bits: blockObj.header.bits.toString(16),
    edgeBits: block.header.edgeBits,
    difficulty: block.header.getDifficulty(),
    chainwork: info.chainWork,
    confirmations: info.confirmations,
    previousblockhash: this._normalizePrevHash(blockObj.header.prevHash),
    nextblockhash: info.nextblockhash,
    reward: this.getBlockReward(info.height) / 1e8,
    isMainChain: info.confirmations !== -1,
    poolInfo: this.getPoolInfo(block),
  };

  return result;
};

/**
 * Show block
 */
BlockController.prototype.show = function(req, res) {
  if (req.block) {
    res.jsonp(req.block);
  }
};

BlockController.prototype.showRaw = function(req, res) {
  if (req.rawBlock) {
    res.jsonp(req.rawBlock);
  }
};

BlockController.prototype.blockIndex = function(req, res) {
  var self = this;
  var height = req.params.height;
  this.node.services.meritd.getBlockHeader(parseInt(height), function(err, info) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    res.jsonp({
      blockHash: info.hash,
    });
  });
};

BlockController.prototype._getBlockSummary = function(hash, moreTimestamp, next) {
  var self = this;

  function finish(result) {
    if (moreTimestamp > result.time) {
      moreTimestamp = result.time;
    }
    return next(null, result);
  }

  var summaryCache = self.blockSummaryCache.get(hash);

  if (summaryCache) {
    finish(summaryCache);
  } else {
    self.node.services.meritd.getRawBlock(hash, function(err, blockBuffer) {
      if (err) {
        return next(err);
      }

      var br = new meritcore.encoding.BufferReader(blockBuffer);

      // take a shortcut to get number of transactions and the blocksize.
      // Also reads the coinbase transaction and only that.
      // Old code parsed all transactions in every block _and_ then encoded
      // them all back together to get the binary size of the block.
      // FIXME: This code might still read the whole block. Fixing that
      // would require changes in merit-node.
      var header = meritcore.BlockHeader.fromBufferReader(br);
      var info = {};
      var txlength = br.readVarintNum();
      info.transactions = [meritcore.Transaction().fromBufferReader(br)];

      self.node.services.meritd.getBlockHeader(hash, function(err, blockHeader) {
        if (err) {
          return next(err);
        }
        var height = blockHeader.height;

        var summary = {
          height: height,
          size: blockBuffer.length,
          hash: hash,
          time: header.time,
          txlength: txlength,
          poolInfo: self.getPoolInfo(info),
        };

        var confirmations = self.node.services.meritd.height - height + 1;
        if (confirmations >= self.blockCacheConfirmations) {
          self.blockSummaryCache.set(hash, summary);
        }

        finish(summary);
      });
    });
  }
};

// List blocks by date
BlockController.prototype.list = function(req, res) {
  var self = this;

  var dateStr;
  var todayStr = this.formatTimestamp(new Date());
  var isToday;

  if (req.query.blockDate) {
    dateStr = req.query.blockDate;
    var datePattern = /\d{4}-\d{2}-\d{2}/;
    if (!datePattern.test(dateStr)) {
      return self.common.handleErrors(new Error('Please use yyyy-mm-dd format'), res);
    }

    isToday = dateStr === todayStr;
  } else {
    dateStr = todayStr;
    isToday = true;
  }

  var gte = Math.round(new Date(dateStr).getTime() / 1000);

  //pagination
  var lte = parseInt(req.query.startTimestamp) || gte + 86400;
  var prev = this.formatTimestamp(new Date((gte - 86400) * 1000));
  var next = lte ? this.formatTimestamp(new Date(lte * 1000)) : null;
  var limit = parseInt(req.query.limit || BLOCK_LIMIT);
  var more = false;
  var moreTimestamp = lte;

  self.node.services.meritd.getBlockHashesByTimestamp(lte, gte, function(err, hashes) {
    if (err) {
      return self.common.handleErrors(err, res);
    }

    hashes.reverse();

    if (hashes.length > limit) {
      more = true;
      hashes = hashes.slice(0, limit);
    }

    async.mapSeries(
      hashes,
      function(hash, next) {
        self._getBlockSummary(hash, moreTimestamp, next);
      },
      function(err, blocks) {
        if (err) {
          return self.common.handleErrors(err, res);
        }

        blocks.sort(function(a, b) {
          return b.height - a.height;
        });

        var data = {
          blocks: blocks,
          length: blocks.length,
          pagination: {
            next: next,
            prev: prev,
            currentTs: lte - 1,
            current: dateStr,
            isToday: isToday,
            more: more,
          },
        };

        if (more) {
          data.pagination.moreTs = moreTimestamp;
        }

        res.jsonp(data);
      },
    );
  });
};

BlockController.prototype.getPoolInfo = function(block) {
  if (block.transactions[0] && block.transactions[0].inputs && block.transactions[0].inputs[0]) {
    const coinbaseBuffer = block.transactions[0].inputs[0]._scriptBuffer;

    for (let k in this.poolStrings) {
      if (coinbaseBuffer.toString('utf-8').match(k)) {
        return this.poolStrings[k];
      }
    }
  }

  return {};
};

//helper to convert timestamps to yyyy-mm-dd format
BlockController.prototype.formatTimestamp = function(date) {
  var yyyy = date.getUTCFullYear().toString();
  var mm = (date.getUTCMonth() + 1).toString(); // getMonth() is zero-based
  var dd = date.getUTCDate().toString();

  return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]); //padding
};

// TODO: update this one
BlockController.prototype.getBlockReward = function(height) {
  var halvings = Math.floor(height / 210000);
  // Force block reward to zero when right shift is undefined.
  if (halvings >= 64) {
    return 0;
  }

  // Subsidy is cut in half every 210,000 blocks which will occur approximately every 4 years.
  var subsidy = new BN(50 * 1e8);
  subsidy = subsidy.shrn(halvings);

  return parseInt(subsidy.toString(10));
};

module.exports = BlockController;
