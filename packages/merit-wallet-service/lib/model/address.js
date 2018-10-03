'use strict';

var $ = require('preconditions').singleton();
var _ = require('lodash');

var meritcore = require('meritcore-lib');
var Constants = require('../common/constants');

function Address() {};

Address.create = function(opts) {
  opts = opts || {};

  var x = new Address();

  x.version = '1.0.0';
  x.createdOn = Math.floor(Date.now() / 1000);
  x.address = opts.address;
  x.walletId = opts.walletId;
  x.isChange = opts.isChange;
  x.path = opts.path;
  x.publicKeys = opts.publicKeys;
  x.network = meritcore.Address(x.address).toObject().network;
  x.type = opts.type || Constants.SCRIPT_TYPES.P2SH;
  x.hasActivity = undefined;
  x.parentAddress = opts.parentAddress;
  x.signed = opts.signed || false;
  x.refid = opts.refid;
  return x;
};

Address.fromObj = function(obj) {
  var x = new Address();

  x.version = obj.version;
  x.createdOn = obj.createdOn;
  x.address = obj.address;
  x.walletId = obj.walletId;
  x.network = obj.network;
  x.isChange = obj.isChange;
  x.path = obj.path;
  x.publicKeys = obj.publicKeys;
  x.type = obj.type || Constants.SCRIPT_TYPES.P2SH;
  x.hasActivity = obj.hasActivity;
  x.parentAddress = obj.parentAddress;
  x.signed = obj.signed;
  x.refid = obj.refid;

  return x;
};

Address._deriveAddress = function(scriptType, publicKeyRing, path, m, network) {
  $.checkArgument(_.includes(_.values(Constants.SCRIPT_TYPES), scriptType));

  var publicKeys = _.map(publicKeyRing, function(item) {
    var xpub = new meritcore.HDPublicKey(item.xPubKey);
    return xpub.deriveChild(path).publicKey;
  });

  var meritcoreAddress;
  switch (scriptType) {
    case Constants.SCRIPT_TYPES.P2SH:
      meritcoreAddress = meritcore.Address.createMultisig(publicKeys, m, network);
      break;
    case Constants.SCRIPT_TYPES.P2PKH:
      $.checkState(_.isArray(publicKeys) && publicKeys.length == 1);
      meritcoreAddress = meritcore.Address.fromPublicKey(publicKeys[0], network);
      break;
    case Constants.SCRIPT_TYPES.PP2SH:
      //TODO: Does it make sense to call this function with PP2SH address type?
      $.checkState(false);
      break;
  }

  return {
    address: meritcoreAddress.toString(),
    path: path,
    publicKeys: _.invokeMap(publicKeys, 'toString'),
  };
};

Address.derive = function(walletId, scriptType, publicKeyRing, path, m, network, isChange) {
  var raw = Address._deriveAddress(scriptType, publicKeyRing, path, m, network);
  return Address.create(_.extend(raw, {
    walletId: walletId,
    type: scriptType,
    isChange: isChange
  }));
};


module.exports = Address;
