'use strict';

const _ = require('lodash');
const $ = require('../util/preconditions');
const buffer = require('buffer');

const errors = require('../errors');
const BufferUtil = require('../util/buffer');
const JSUtil = require('../util/js');
const BufferReader = require('../encoding/bufferreader');
const BufferWriter = require('../encoding/bufferwriter');

function Referral(serialized) {
  if (!(this instanceof Referral)) {
    return new Referral(serialized);
  }

  this.previousReferral = '';
  this.codeHash = '';

  if (serialized) {
    if (serialized instanceof Referral) {
      return Referral.shallowCopy(serialized);
    } else if (JSUtil.ishexa(serialized)) {
      this.fromString(serialized);
    } else if (BufferUtil.isBuffer(serialized)) {
      this.fromBuffer(serialized);
    } else if (_.isObject(serialized)) {
      this.fromObject(serialized);
    } else {
      throw new errors.InvalidArgument('Must provide an object or string to deserialize a referral');
    }
  } else {
    this._newReferral();
  }
  return null;
}

const CURRENT_VERSION = 1;
const DEFAULT_NLOCKTIME = 0;

Referral.shallowCopy = function(transaction) {
  const copy = new Referral(transaction.toBuffer());
  return copy;
};

Referral.prototype.inspect = function() {
  return `<Referral: ${this.uncheckedSerialize()}>`;
};

Referral.prototype.toBuffer = function() {
  const writer = new BufferWriter();
  return this.toBufferWriter(writer).toBuffer();
};

Referral.prototype.toBufferWriter = function(writer) {
  writer.writeInt32LE(this.version);
  writer.writeUInt64LEBN(this.previousReferral);
  writer.writeUInt32LE(this.cKeyId);
  writer.writeUInt64LEBN(this.codeHash);
  writer.writeUInt32LE(this.nLockTime);
  // ToDo: Implement me correctly
  return writer;
};

Referral.prototype.fromBuffer = function(buffer) {
  const reader = new BufferReader(buffer);
  return this.fromBufferReader(reader);
};

Referral.prototype.fromBufferReader = function(reader) {
  $.checkArgument(!reader.finished(), 'No referral data received');

  this.version = reader.readInt32LE();
  this.previousReferral = reader.readUInt64LEBN();
  this.cKeyId = reader.readUInt32LE();
  this.codeHash = reader.readUInt64LEBN();
  this.nLockTime = reader.readUInt32LE();
  // ToDo: Implement me correctly

  return this;
};

Referral.prototype.toObject = Referral.prototype.toJSON = function toObject() {
  const obj = {
    version: this.version,
    previousReferral: this.previousReferral,
    cKeyId: this.cKeyId,
    codeHash: this.codeHash,
    nLockTime: this.nLockTime,
  };

  return obj;
};

Referral.prototype.fromObject = function fromObject(arg) {
  $.checkArgument(_.isObject(arg) || arg instanceof Referral);
  var self = this;

  let referral = {};
  if (arg instanceof Referral) {
    referral = referral.toObject();
  } else {
    referral = arg;
  }

  this.version = referral.version;
  this.previousReferral = referral.previousReferral;
  this.cKeyId = referral.cKeyId;
  this.codeHash = referral.codeHash;
  this.nLockTime = referral.nLockTime;

  return this;
};


Referral.prototype.fromString = function(string) {
  this.fromBuffer(new buffer.Buffer(string, 'hex'));
};

Referral.prototype._newReferral = function() {
  this.version = CURRENT_VERSION;
  this.nLockTime = DEFAULT_NLOCKTIME;
};

Referral.prototype.serialize = function(unsafe) {
  if (true === unsafe || unsafe && unsafe.disableAll) {
    return this.uncheckedSerialize();
  } else {
    return this.checkedSerialize(unsafe);
  }
};

Referral.prototype.uncheckedSerialize = Referral.prototype.toString = function() {
  return this.toBuffer().toString('hex');
};

Referral.prototype.checkedSerialize = function(opts) {
  const serializationError = this.getSerializationError(opts);
  if (serializationError) {
    serializationError.message += ' - For more information please see: ' +
      'https://bitcore.io/api/lib/referrals#serialization-checks';
    throw serializationError;
  }
  return this.uncheckedSerialize();
};

module.exports = Referral;
