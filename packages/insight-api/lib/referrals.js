'use strict';

var Common = require('./common');

function ReferralController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

ReferralController.prototype.generateReferralCode = function(req, res) {
  var self = this;

  self.node.services.bitcoind.generateReferralCode(function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }

    res.jsonp(result);
  });
};

ReferralController.prototype.validateReferralCode = function(req, res) {
  var self = this;

  var referralCode = req.body.unlockCode;
  
  self.node.services.bitcoind.validateReferralCode(referralCode, function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    res.jsonp(result);
  });
};

module.exports = ReferralController;
