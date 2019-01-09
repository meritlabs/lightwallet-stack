'use strict';

var Common = require('./common');
var _ = require('lodash');

function WalletController(node) {
  this.node = node;
  this.common = new Common({ log: this.node.log });
}

WalletController.prototype.getANV = function(req, res) {
  var self = this;
  // If there are no keys passed in, the ANV is zero.
  if (_.isEmpty(req.body.addresses)) return res.jsonp(0);

  var addresses = req.body.addresses;

  self.node.services.meritd.getANV(addresses, function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    res.jsonp(result);
  });
};

WalletController.prototype.getCommunityInfo = function(req, res) {
  if (_.isEmpty(req.params.addr)) return res.jsonp({ referralcount: 0 });

  const { addr } = req.params;

  this.node.services.meritd.getCommunityInfo(addr, (err, result) => {
    if (err) {
      return this.common.handleErrors(err, res);
    }
    res.jsonp(result);
  });
};

WalletController.prototype.getRewards = function(req, res) {
  var self = this;
  // If there are no keys passed in, the ANV is zero.
  if (_.isEmpty(req.body.addresses)) return res.jsonp({ amount: 0 });

  var addresses = req.body.addresses;

  self.node.services.meritd.getRewards(addresses, function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    res.jsonp(result);
  });
};

module.exports = WalletController;
