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

    res.json({'referralCode': result});
  });
};

ReferralController.prototype.validateReferralCode = function(req, res) {
  var self = this;
  var referralCode = req.params.code;

  self.node.services.bitcoind.validateReferralCode(referralCode, function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    res.json({'isValid': result});
  });
};

ReferralController.prototype.setReferralCode = function(req, res) {
  var self = this;
  var referralCode = req.params.code;

  self.node.services.bitcoind.setReferralCode(referralCode, function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    res.json({'isSet': result});
  });
};

module.exports = ReferralController;
