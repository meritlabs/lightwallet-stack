'use strict';

const _ = require('lodash');
const $ = require('../util/preconditions');
const buffer = require('buffer');

const errors = require('../errors');
const BufferUtil = require('../util/buffer');
const JSUtil = require('../util/js');
const BufferReader = require('../encoding/bufferreader');
const BufferWriter = require('../encoding/bufferwriter');
const Hash = require('../crypto/hash');

function Referral(serialized) {
  if (!(this instanceof Referral)) {
    return new Referral(serialized);
  }

  this.version = 1;
  this.parentAddress = '';
  this.address = '';
  this.addressType = 0;
  this.pubkey = '';
  this.signature = '';
  this.alias = '';

  if (serialized) {
    if (serialized instanceof Referral) {
      return Referral.shallowCopy(serialized);
    } else if (JSUtil.isHexa(serialized)) {
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
};

const CURRENT_VERSION = 1;
const DEFAULT_NLOCKTIME = 0;

const hashProperty = {
  configurable: false,
  enumerable: true,
  get: function() {
    return new BufferReader(this._getHash()).readReverse().toString('hex');
  }
};
Object.defineProperty(Referral.prototype, 'hash', hashProperty);
Object.defineProperty(Referral.prototype, 'id', hashProperty);


Referral.prototype._getHash = function() {
  return Hash.sha256sha256(this.toBuffer());
};

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

  const parentAddressBuf = this.parentAddress.toBufferLean();
  const addressBuf = this.address.toBufferLean();
  const pubkeyBuf = this.pubkey.toBuffer();
  const signatureBuf = this.signature.toBuffer();
  writer.writeInt32LE(this.version);
  writer.write(parentAddressBuf);
  writer.writeUInt8(this.addressType);
  writer.write(addressBuf);
  writer.writeVarintNum(pubkeyBuf.length);
  writer.write(pubkeyBuf);
  writer.writeVarintNum(signatureBuf.length);
  writer.write(signatureBuf);
  writer.writeVarintNum(this.alias.length);
  writer.writeString(this.alias);

  return writer;
};

Referral.prototype.fromBuffer = function(buffer) {
  const reader = new BufferReader(buffer);
  return this.fromBufferReader(reader);
};

Referral.prototype.fromBufferReader = function(reader) {
  $.checkArgument(!reader.finished(), 'No referral data received');

  this.version = reader.readInt32LE();
  this.parentAddress = reader.read(20).toString('hex').match(/.{1,2}/g).reverse().join('');
  this.addressType = reader.readUInt8();
  this.address = reader.read(20).toString('hex').match(/.{1,2}/g).reverse().join('');
  this.pubkey = reader.read(33).toString('hex').match(/.{1,2}/g).reverse().join('');
  this.signature = reader.read(71).toString('hex').match(/.{1,2}/g).reverse().join('')
  var hexToString = function (hex) {
      var string = '';
      for (var i = 0; i < hex.length; i += 2) {
          string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return string;
  };

  var aliasLength = reader.readVarintNum();
  this.alias = hexToString(reader.read(aliasLength).toString('hex'));

  return this;
};

Referral.prototype.toObject = Referral.prototype.toJSON = function toObject() {
  const obj = {
    version: this.version,
    parentAddress: this.parentAddress,
    address: this.address,
    addressType: this.addressType,
    pubkey: this.pubkey,
    signature: this.signature,
    alias: this.alias
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
  this.parentAddress = referral.parentAddress;
  this.address = referral.address;
  this.addressType = referral.addressType;
  this.pubkey = referral.pubkey;
  this.signature = referral.signature;
  this.alias = referral.alias;

  return this;
};


Referral.prototype.fromString = function(string) {
  return this.fromBuffer(new buffer.Buffer(string, 'hex'));
};

Referral.prototype._newReferral = function() {
  this.version = CURRENT_VERSION;
  this.nLockTime = DEFAULT_NLOCKTIME;
};

Referral.prototype.serialize = Referral.prototype.toString = function() {
  return this.toBuffer().toString('hex');
};

module.exports = Referral;
