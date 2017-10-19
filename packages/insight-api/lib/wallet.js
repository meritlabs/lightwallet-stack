'use strict';

var Common = require('./common');

function WalletController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

WalletController.prototype.getANV = function(req, res) {
  var self = this;
  var keys = req.body.keys;

  self.node.services.meritd.getANV(keys, function(err, result) {
    if(err) {
      return self.common.handleErrors(err, res);
    }

    res.jsonp(result);
  });
};

WalletController.prototype.getRewards = function(req, res) {
  var self = this;
  var addresses = req.body.addresses;

  self.node.services.meritd.getRewards(addresses, function(err, result) {
    if(err) {
      return self.common.handleErrors(err, res);
    }

    res.jsonp(result);
  });
};

module.exports = WalletController;
