'use strict';

var Common = require('./common');

function WalletController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

WalletController.prototype.unlock = function(req, res) {
  // TODO: Handle Unlock RPC call and response
};

module.exports = WalletController;
