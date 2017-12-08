'use strict';

var Common = require('./common');
var _ = require('lodash');

function WalletController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

WalletController.prototype.getANV = function(req, res) {
  var self = this;
  // If there are no keys passed in, the ANV is zero.
  if (_.isEmpty(req.body.keys)) return res.jsonp(0);

  var keys = req.body.keys.join(" ");;

  self.node.services.meritd.getANV(keys, function(err, result) {
    if(err) {
      return self.common.handleErrors(err, res);
    }

    console.log("Insight API responds to getANV with: ", result);
    
    res.jsonp(result);
  });
};

WalletController.prototype.getRewards = function(req, res) {
  var self = this;
  // If there are no keys passed in, the ANV is zero.  
  if (_.isEmpty(req.body.addresses)) return res.jsonp({amount: 0});
  
  var addresses = req.body.addresses;

  self.node.services.meritd.getRewards(addresses, function(err, result) {
    if(err) {
      return self.common.handleErrors(err, res);
    }
    res.jsonp(result);
  });
};

module.exports = WalletController;
