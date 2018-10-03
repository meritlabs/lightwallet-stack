'use strict';

const bitcore = require('meritcore-lib');
const _ = bitcore.deps._;
const $ = bitcore.util.preconditions;
const Common = require('./common');
const async = require('async');

const MAXINT = 0xffffffff; // Math.pow(2, 32) - 1;


function ReferralsController(node) {
  this.node = node;
  this.common = new Common({ log: this.node.log });
}

ReferralsController.prototype.show = function(req, res) {
  if (req.referral) {
    res.jsonp(req.referral);
  }
};

/**
 * Find referral by hash, address or alias
 */
ReferralsController.prototype.referral = function(req, res, next) {
  var refid = req.params.refid;

  this.node.getReferral(refid, (err, referral) => {
    if (err && err.code === -5) {
      return this.common.handleErrors(null, res);
    } else if(err) {
      return this.common.handleErrors(err, res);
    }

    req.referral = referral;
    next();
  });
};

module.exports = ReferralsController;
