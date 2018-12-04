'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var meritcore = require('meritcore-lib');
var utils = require('../utils');
var $ = meritcore.util.preconditions;
var _ = meritcore.deps._;
var BufferUtil = meritcore.util.buffer;
var BufferReader = meritcore.encoding.BufferReader;

/**
 * A message to confirm that a connection is still valid.
 * @param {Number} arg - A nonce for the Ping message
 * @param {Object=} options
 * @extends Message
 * @constructor
 */
function PingMessage(arg, options) {
  Message.call(this, options);
  this.command = 'ping';
  $.checkArgument(
    _.isUndefined(arg) || (BufferUtil.isBuffer(arg) && arg.length === 8),
    'First argument is expected to be an 8 byte buffer',
  );
  this.nonce = arg || utils.getNonce();
}
inherits(PingMessage, Message);

PingMessage.prototype.setPayload = function(payload) {
  var parser = new BufferReader(payload);
  this.nonce = parser.read(8);

  utils.checkFinished(parser);
};

PingMessage.prototype.getPayload = function() {
  return this.nonce;
};

module.exports = PingMessage;
