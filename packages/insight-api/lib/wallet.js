'use strict';

var Common = require('./common');

function WalletController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

WalletController.prototype.unlock = function(req, res) {
  var self = this;
  var unlockCode = req.body.unlockCode;
  var unlockAddress = req.body.unlockAddress;

  self.node.services.meritd.unlockWallet(unlockCode, unlockAddress, function(err, result) {
    if(err) {
      return self.common.handleErrors(err, res);
    }

    res.jsonp(result);
  });
};

module.exports = WalletController;
