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
const Networks = require('../networks');
const Address = require('../address');
const PublicKey = require('../publickey');

function Referral(serialized) {
  if (!(this instanceof Referral)) {
    return new Referral(serialized);
  }

  this.version = 1;
  this.parentAddress = null;
  this.address = null;
  this.addressType = 0;
  this.pubkey = null;
  this.signature = null;
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

//Referral.prototype.inspect = function() {
//  return `<Referral: ${this.uncheckedSerialize()}>`;
//};

Referral.prototype.toBuffer = function() {
  const writer = new BufferWriter();
  return this.toBufferWriter(writer).toBuffer();
};

Referral.prototype.toBufferWriter = function(writer) {

  const parentAddressBuf = this.parentAddress.toBufferLean();
  const addressBuf = this.address.toBufferLean();
  const pubkeyBuf = this.pubkey.toBuffer();
  const signatureBuf = this.signature;
  writer.writeInt32LE(this.version);
  writer.write(parentAddressBuf);
  writer.writeUInt8(this.addressType);
  writer.write(addressBuf);
  writer.writeVarintNum(pubkeyBuf.length);
  writer.write(pubkeyBuf);
  writer.writeVarintNum(signatureBuf.length);
  writer.write(signatureBuf);

  if (this.version >= 1) {
    writer.writeVarintNum(this.alias.length);
    writer.writeString(this.alias);
  }

  return writer;
};

Referral.prototype.fromBuffer = function(buffer) {
  const reader = new BufferReader(buffer);
  return this.fromBufferReader(reader);
};

Referral.prototype.fromBufferReader = function(reader) {
  $.checkArgument(!reader.finished(), 'No referral data received');

  this.version = reader.readInt32LE();
  // we assume parent address type is a pubkeyhash
  // TODO: get network value from some global variable
  this.parentAddress = Address.fromBuffer(Buffer.concat([new Buffer([0x6e]), reader.read(20)]), Networks.testnet, Address.PayToPublicKeyHashType);
  this.addressType = reader.readUInt8();
  this.address = Address.fromBuffer(Buffer.concat([new Buffer([0x6e]), reader.read(20)]), Networks.testnet, this.addressType);
  this.pubkey = PublicKey.fromBuffer(reader.readVarLengthBuffer());
  this.signature = reader.readVarLengthBuffer();
  // check that we have more data for pre-daedalus support
  if (!reader.eof) {
    this.alias = reader.readVarLengthBuffer().toString();
  }

  return this;
};

Referral.prototype.toObject = Referral.prototype.toJSON = function toObject() {
  const obj = {
    hash: this.hash,
    version: this.version,
    parentAddress: this.parentAddress.toString(),
    address: this.address.toString(),
    addressType: this.addressType,
    pubkey: this.pubkey.toString(),
    signature: this.signature.toString('hex'),
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

  this.version = referral.version || CURRENT_VERSION;
  this.parentAddress = Address.fromString(referral.parentAddress, Networks.testnet, Address.PayToPublicKeyHashType);
  this.addressType = referral.addressType;
  this.address = Address.fromString(referral.address, Networks.testnet, this.addressType);
  this.pubkey = PublicKey.fromString(referral.pubkey, Networks.testnet);
  this.signature = BufferUtil.hexToBuffer(referral.signature);
  this.alias = referral.alias || '';

  console.log('referral from object:', this);

  return this;
};


Referral.prototype.fromString = function(string) {
  return this.fromBuffer(BufferUtil.hexToBuffer(string));
};

Referral.prototype._newReferral = function() {
  this.version = CURRENT_VERSION;
  this.nLockTime = DEFAULT_NLOCKTIME;
};

Referral.prototype.serialize = Referral.prototype.toString = function() {
  return this.toBuffer().toString('hex');
};

module.exports = Referral;
