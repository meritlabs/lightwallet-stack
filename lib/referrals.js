'use strict';

var Common = require('./common');

function ReferralController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

ReferralController.prototype.generateReferralCode = function(req, res) {
  var self = this;

  self.node.services.bitcoind.generateReferralCode(function(err, newReferralCode) {
    if (err) {
      return self.common.handleErrors(err, res);
    }

    res.json({'referralCode': newReferralCode});
  });
};

ReferralController.prototype.checkReferralCode = function(req, res) {
  var self = this;
  var referralCode = req.params.code;

  self.node.services.checkReferralCode(referralCode, function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    res.json({'isValid': result});
  });
};
