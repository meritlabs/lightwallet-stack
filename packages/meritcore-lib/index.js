'use strict';

var meritcore = module.exports;

// module information
meritcore.version = 'v' + require('./package.json').version;
meritcore.versionGuard = function(version) {
  if (version !== undefined) {
    var message =
      'More than one instance of meritcore-lib found. ' +
      'Please make sure to require meritcore-lib and check that submodules do' +
      ' not also include their own meritcore-lib dependency.';
    throw new Error(message);
  }
};
//meritcore.versionGuard(global._meritcore);
global._meritcore = meritcore.version;

// crypto
meritcore.crypto = {};
meritcore.crypto.BN = require('./lib/crypto/bn');
meritcore.crypto.ECDSA = require('./lib/crypto/ecdsa');
meritcore.crypto.Hash = require('./lib/crypto/hash');
meritcore.crypto.Random = require('./lib/crypto/random');
meritcore.crypto.Point = require('./lib/crypto/point');
meritcore.crypto.Signature = require('./lib/crypto/signature');

// encoding
meritcore.encoding = {};
meritcore.encoding.Base58 = require('./lib/encoding/base58');
meritcore.encoding.Base58Check = require('./lib/encoding/base58check');
meritcore.encoding.BufferReader = require('./lib/encoding/bufferreader');
meritcore.encoding.BufferWriter = require('./lib/encoding/bufferwriter');
meritcore.encoding.Varint = require('./lib/encoding/varint');

// utilities
meritcore.util = {};
meritcore.util.buffer = require('./lib/util/buffer');
meritcore.util.js = require('./lib/util/js');
meritcore.util.preconditions = require('./lib/util/preconditions');

// errors thrown by the library
meritcore.errors = require('./lib/errors');

// main Merit library
meritcore.Address = require('./lib/address');
meritcore.Block = require('./lib/block');
meritcore.MerkleBlock = require('./lib/block/merkleblock');
meritcore.BlockHeader = require('./lib/block/blockheader');
meritcore.HDPrivateKey = require('./lib/hdprivatekey.js');
meritcore.HDPublicKey = require('./lib/hdpublickey.js');
meritcore.Message = require('./lib/message');
meritcore.Networks = require('./lib/networks');
meritcore.Opcode = require('./lib/opcode');
meritcore.PrivateKey = require('./lib/privatekey');
meritcore.PublicKey = require('./lib/publickey');
meritcore.Script = require('./lib/script');
meritcore.Transaction = require('./lib/transaction');
meritcore.Referral = require('./lib/referral');
meritcore.URI = require('./lib/uri');
meritcore.Unit = require('./lib/unit');
meritcore.Vault = require('./lib/vault');

// dependencies, subject to change
meritcore.deps = {};
meritcore.deps.bnjs = require('bn.js');
meritcore.deps.bs58 = require('bs58');
meritcore.deps.Buffer = Buffer;
meritcore.deps.elliptic = require('elliptic');
meritcore.deps._ = require('lodash');

// Internal usage, exposed for testing/advanced tweaking
meritcore.Transaction.sighash = require('./lib/transaction/sighash');
