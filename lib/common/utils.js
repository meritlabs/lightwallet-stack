'use strict';

var _ = require('lodash');
var $ = require('preconditions').singleton();
var sjcl = require('sjcl');
var Stringify = require('json-stable-stringify');

var Bitcore = require('bitcore-lib');
var Address = Bitcore.Address;
var PrivateKey = Bitcore.PrivateKey;
var PublicKey = Bitcore.PublicKey;
var crypto = Bitcore.crypto;
var encoding = Bitcore.encoding;

var Constants = require('./constants');

function Utils() {};

Utils.encryptMessage = function(message, encryptingKey) {
  var key = sjcl.codec.base64.toBits(encryptingKey);
  return sjcl.encrypt(key, message, {
    ks: 128,
    iter: 1,
  });
};

Utils.decryptMessage = function(cyphertextJson, encryptingKey) {
  var key = sjcl.codec.base64.toBits(encryptingKey);
  return sjcl.decrypt(key, cyphertextJson);
};

/* TODO: It would be nice to be compatible with bitcoind signmessage. How
 * the hash is calculated there? */
Utils.hashMessage = function(text) {
  $.checkArgument(text);
  var buf = new Buffer(text);
  var ret = crypto.Hash.sha256sha256(buf);
  ret = new Bitcore.encoding.BufferReader(ret).readReverse();
  return ret;
};


Utils.signMessage = function(text, privKey) {
  $.checkArgument(text);
  var priv = new PrivateKey(privKey);
  var hash = Utils.hashMessage(text);
  return crypto.ECDSA.sign(hash, priv, 'little').toString();
};


Utils.verifyMessage = function(text, signature, pubKey) {
  $.checkArgument(text);
  $.checkArgument(pubKey);

  if (!signature)
    return false;

  var pub = new PublicKey(pubKey);
  var hash = Utils.hashMessage(text);

  try {
    var sig = new crypto.Signature.fromString(signature);
    return crypto.ECDSA.verify(hash, sig, pub, 'little');
  } catch (e) {
    return false;
  }
};

Utils.privateKeyToAESKey = function(privKey) {
  $.checkArgument(privKey && _.isString(privKey));
  $.checkArgument(Bitcore.PrivateKey.isValid(privKey), 'The private key received is invalid');
  var pk = Bitcore.PrivateKey.fromString(privKey);
  return Bitcore.crypto.Hash.sha256(pk.toBuffer()).slice(0, 16).toString('base64');
};

Utils.getCopayerHash = function(name, xPubKey, requestPubKey) {
  return [name, xPubKey, requestPubKey].join('|');
};

Utils.getProposalHash = function(proposalHeader) {
  function getOldHash(toAddress, amount, message, payProUrl) {
    return [toAddress, amount, (message || ''), (payProUrl || '')].join('|');
  };

  // For backwards compatibility
  if (arguments.length > 1) {
    return getOldHash.apply(this, arguments);
  }

  return Stringify(proposalHeader);
};

Utils.deriveAddress = function(scriptType, publicKeyRing, path, m, network) {
  $.checkArgument(_.contains(_.values(Constants.SCRIPT_TYPES), scriptType));

  var publicKeys = _.map(publicKeyRing, function(item) {
    var xpub = new Bitcore.HDPublicKey(item.xPubKey);
    return xpub.derive(path).publicKey;
  });

  var bitcoreAddress;
  switch (scriptType) {
    case Constants.SCRIPT_TYPES.P2SH:
      bitcoreAddress = Address.createMultisig(publicKeys, m, network);
      break;
    case Constants.SCRIPT_TYPES.P2PKH:
      $.checkState(_.isArray(publicKeys) && publicKeys.length == 1);
      bitcoreAddress = Address.fromPublicKey(publicKeys[0], network);
      break;
  }

  return {
    address: bitcoreAddress.toString(),
    path: path,
    publicKeys: _.invoke(publicKeys, 'toString'),
  };
};

Utils.xPubToCopayerId = function(xpub) {
  var hash = sjcl.hash.sha256.hash(xpub);
  return sjcl.codec.hex.fromBits(hash);
};

Utils.signRequestPubKey = function(requestPubKey, xPrivKey) {
  var priv = new Bitcore.HDPrivateKey(xPrivKey).derive(Constants.PATHS.REQUEST_KEY_AUTH).privateKey;
  return Utils.signMessage(requestPubKey, priv);
};

Utils.verifyRequestPubKey = function(requestPubKey, signature, xPubKey) {
  var pub = (new Bitcore.HDPublicKey(xPubKey)).derive(Constants.PATHS.REQUEST_KEY_AUTH).publicKey;
  return Utils.verifyMessage(requestPubKey, signature, pub.toString());
};



module.exports = Utils;
