'use strict';

var _ = require('lodash');
var async = require('async');
var Common = require('./common');

function UtilsController(node) {
  this.node = node;
  this.common = new Common({ log: this.node.log });
}

UtilsController.prototype.estimateSmartFee = function(req, res) {
  var self = this;
  var args = req.query.nbBlocks || '2';
  var nbBlocks = args.split(',');

  async.map(
    nbBlocks,
    function(n, next) {
      var num = parseInt(n);
      // Insight and Merit JSON-RPC return merit for this value (instead of micros).

      self.node.services.meritd.estimateSmartFee(num, function(err, fee) {
        if (err) {
          return next(err);
        }
        next(null, [num, fee]);
      });
    },
    function(err, result) {
      if (err) {
        return self.common.handleErrors(err, res);
      }
      res.jsonp(_.fromPairs(result));
    },
  );
};

module.exports = UtilsController;
