'use strict';

var Bitcore = require('bitcore');

function Address() {
  this.version = '1.0.0';
};

Address.create = function(opts) {
  opts = opts || {};

  var x = new Address();

  x.createdOn = Math.floor(Date.now() / 1000);
  x.address = opts.address;
  x.isChange = opts.isChange;
  x.path = opts.path;
  x.publicKeys = opts.publicKeys;
  return x;
};

Address.fromObj = function(obj) {
  var x = new Address();

  x.createdOn = obj.createdOn;
  x.address = obj.address;
  x.isChange = obj.isChange;
  x.path = obj.path;
  x.publicKeys = obj.publicKeys;
  return x;
};


/**
 * getScriptPubKey
 *
 * @param {number} threshold - amount of required signatures to spend the output
 * @return {Script}
 */
Address.prototype.getScriptPubKey = function(threshold) {
  return Bitcore.Script.buildMultisigOut(this.publicKeys, threshold).toScriptHashOut();
};

module.exports = Address;
