'use strict';

var _ = require('lodash');
var inherits = require('inherits');
var Input = require('./input');
var Output = require('../output');
var $ = require('../../util/preconditions');

var Script = require('../../script');
var Signature = require('../../crypto/signature');
var Sighash = require('../sighash');
var PublicKey = require('../../publickey');
var BufferUtil = require('../../util/buffer');
var TransactionSignature = require('../signature');

/**
 * @constructor
 */
function PayToScriptHashInput(input, redeemScript, sigScript) {
  Input.apply(this, arguments);
  this.redeemScript = redeemScript;
  this.setScript(sigScript);
}

inherits(PayToScriptHashInput, Input);

PayToScriptHashInput.prototype.getSignatures = function(transaction, privateKey, index, sigtype) {
  $.checkState(this.output instanceof Output);
  sigtype = sigtype || Signature.SIGHASH_ALL;

  var results = [];
  results.push(new TransactionSignature({
    publicKey: privateKey.publicKey,
    prevTxId: this.prevTxId,
    outputIndex: this.outputIndex,
    inputIndex: index,
    signature: Sighash.sign(transaction, privateKey, sigtype, index, this.redeemScript),
    sigtype: sigtype
  }));
  return results;
};

PayToScriptHashInput.prototype.isFullySigned = function() {
  return true;
};

PayToScriptHashInput.prototype.addSignature = function() {
};

PayToScriptHashInput.prototype.clearSignatures = function() {
};

PayToScriptHashInput.OPCODES_SIZE = 7; // serialized size (<=3) + 0 .. N .. M OP_CHECKMULTISIG
PayToScriptHashInput.SIGNATURE_SIZE = 74; // size (1) + DER (<=72) + sighash (1)
PayToScriptHashInput.PUBKEY_SIZE = 34; // size (1) + DER (<=33)

module.exports = PayToScriptHashInput;
