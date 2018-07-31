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

const CURRENT_VERSION = 1;
const INVITE_VERSION = 1;

/**
* @param {*} data - The encoded data in various formats
* @param {string=} network - The network: 'livenet' or 'testnet'
* @constructor
*/
function Referral(data, network) {
    if (!(this instanceof Referral)) {
        return new Referral(data, network);
    }

    // check if argument passed is a network
    if (_.isString(data) && !JSUtil.isHexa(data)) {
      const network = Networks.get(data);

      if (!network) {
        throw new TypeError('Wrong network value. It should be "livenet" or "testnet".');
      }

      this.network = network;

      this._newReferral(network);
      return null;
    }

    if (network && !Networks.get(network)) {
      throw new TypeError('Second argument must be "livenet" or "testnet".');
    }

    if (Networks.get(network)) {
      this.network = Networks.get(network);
    }

    this.version = CURRENT_VERSION;
    this.parentAddress = null;
    this.address = null;
    this.addressType = 0;
    this.pubkey = null;
    this.signature = null;
    this.alias = '';

    if (data) {
      if (data instanceof Referral) {
        return Referral.shallowCopy(data, network);
      } else if (JSUtil.isHexa(data)) {
        this.fromString(data);
      } else if (data instanceof BufferReader) {
        this.fromBufferReader(data);
      } else if (BufferUtil.isBuffer(data)) {
        this.fromBuffer(data);
      } else if (_.isObject(data)) {
        this.fromObject(data);
      } else {
        throw new errors.InvalidArgument('Must provide an object or string to deserialize a referral');
      }
    } else {
      this._newReferral();
    }

    return null;
};

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

Referral.shallowCopy = function(data, network) {
    return new Referral(data.toBuffer(), network);
};

Referral.prototype._newReferral = function() {
  this.version = CURRENT_VERSION;
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
    this.parentAddress = Address.fromBuffer(reader.read(20), this.network.name, Address.PayToPublicKeyHashType);
    this.addressType = reader.readUInt8();
    this.address = Address.fromBuffer(reader.read(20), this.network.name, this.addressType);
    this.pubkey = PublicKey.fromBuffer(reader.readVarLengthBuffer());
    this.signature = reader.readVarLengthBuffer();
    // check that we have more data for pre-daedalus support
    if (this.version >= INVITE_VERSION && !reader.eof()) {
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

    let referral = {};
    if (arg instanceof Referral) {
        referral = referral.toObject();
    } else {
        referral = arg;
    }

    this.version = referral.version || CURRENT_VERSION;
    this.parentAddress = Address.fromString(referral.parentAddress, this.network.name, Address.PayToPublicKeyHashType);
    this.addressType = referral.addressType;
    this.address = Address.fromString(referral.address, this.network.name, this.addressType);
    this.pubkey = PublicKey.fromString(referral.pubkey, this.network.name);
    this.signature = BufferUtil.hexToBuffer(referral.signature);
    this.alias = referral.alias || '';

    return this;
};


Referral.prototype.fromString = function(string) {
    return this.fromBuffer(BufferUtil.hexToBuffer(string));
};

Referral.prototype.serialize = Referral.prototype.toString = function() {
    return this.toBuffer().toString('hex');
};

Referral.validateAlias = function (alias) {
    const aliasRegexp = /^[a-z0-9]([a-z0-9_-]){1,18}[a-z0-9]$/i;

    return aliasRegexp.test(alias);
}

module.exports = Referral;
