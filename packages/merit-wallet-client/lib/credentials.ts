'use strict';

const $ = require('preconditions').singleton();
let _ = require('lodash');

let Bitcore = require('bitcore-lib');
let Mnemonic = require('bitcore-mnemonic');
let sjcl = require('sjcl');

let Common = require('./common');
let Constants = Common.Constants;
let Utils = Common.Utils;

let FIELDS = [
  'network',
  'xPrivKey',
  'xPrivKeyEncrypted',
  'xPubKey',
  'requestPrivKey',
  'requestPubKey',
  'copayerId',
  'publicKeyRing',
  'walletId',
  'walletName',
  'm',
  'n',
  'walletPrivKey',
  'personalEncryptingKey',
  'sharedEncryptingKey',
  'copayerName',
  'externalSource',
  'mnemonic',
  'mnemonicEncrypted',
  'entropySource',
  'mnemonicHasPassphrase',
  'derivationStrategy',
  'account',
  'compliantDerivation',
  'addressType',
  'hwInfo',
  'entropySourcePath',
  'unlocked',
  'beacon',
  'shareCode'
];

export class Credentials {

  public network: string;
  public xPrivKey: any;
  public xPubKey: string;
  public compliantDerivation: boolean;
  public account: any;
  public mnemonic: any;
  public mnemonicHasPassphrase: boolean;
  public derivationStrategy: any;
  public entropySourcePath: any;
  public entropySource: any;
  public externalSource: any;
  public addressType: any;
  public xPrivKeyEncrypted: any;


  private wordsForLang = {
    'en': Mnemonic.Words.ENGLISH,
    'es': Mnemonic.Words.SPANISH,
    'ja': Mnemonic.Words.JAPANESE,
    'zh': Mnemonic.Words.CHINESE,
    'fr': Mnemonic.Words.FRENCH,
    'it': Mnemonic.Words.ITALIAN,
  };

  constructor() {
    let fixedNet = 'testnet';
    this.network = fixedNet;
    this.xPrivKey = (new Bitcore.HDPrivateKey(fixedNet)).toString();
    this.compliantDerivation = true;
  }

   public Mnemonic = function(network, passphrase, language, account, opts) {
    if (!this.wordsForLang[language]) throw new Error('Unsupported language');
    $.shouldBeNumber(account);

    opts = opts || {};

    var m = new Mnemonic(this.wordsForLang[language]);
    while (!Mnemonic.isValid(m.toString())) {
      m = new Mnemonic(this.wordsForLang[language])
    };
    var x = new Credentials();

    x.network = network;
    x.account = account;
    x.xPrivKey = m.toHDPrivateKey(passphrase, network).toString();
    x.compliantDerivation = true;
    x._expand();
    x.mnemonic = m.phrase;
    x.mnemonicHasPassphrase = !!passphrase;

    return x;
  };

  public edPrivateKey = function(xPrivKey, account, derivationStrategy, opts) {
    $.shouldBeNumber(account);
    $.checkArgument(_.includes(_.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    opts = opts || {};

    var x = new Credentials();
    x.xPrivKey = xPrivKey;
    x.account = account;
    x.derivationStrategy = derivationStrategy;
    x.compliantDerivation = !opts.nonCompliantDerivation;
    x._expand();
    return x;
  };

  // note that mnemonic / passphrase is NOT stored
  public ic = function(network, words, passphrase, account, derivationStrategy, opts) {
    $.shouldBeNumber(account);
    $.checkArgument(_.includes(_.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    opts = opts || {};

    var m = new Mnemonic(words);
    var x = new Credentials();
    x.xPrivKey = m.toHDPrivateKey(passphrase, network).toString();
    x.mnemonic = words;
    x.mnemonicHasPassphrase = !!passphrase;
    x.account = account;
    x.derivationStrategy = derivationStrategy;
    x.compliantDerivation = !opts.nonCompliantDerivation;
    x.entropySourcePath = opts.entropySourcePath;

    x._expand();
    return x;
  };

  /*
  * BWC uses
  * xPrivKey -> m/44'/network'/account' -> Base Address Key
  * so, xPubKey is PublicKeyHD(xPrivKey.deriveChild("m/44'/network'/account'").
  *
  * For external sources, this derivation should be done before
  * call fromExtendedPublicKey
  *
  * entropySource should be a HEX string containing pseudo-random data, that can
  * be deterministically derived from the xPrivKey, and should not be derived from xPubKey
  */
  public edPublicKey = function(xPubKey, source, entropySourceHex, account, derivationStrategy, opts) {
    $.checkArgument(entropySourceHex);
    $.shouldBeNumber(account);
    $.checkArgument(_.includes(_.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    opts = opts || {};

    var entropyBuffer = new Buffer(entropySourceHex, 'hex');
    //require at least 112 bits of entropy
    $.checkArgument(entropyBuffer.length >= 14, 'At least 112 bits of entropy are needed')

    var x = new Credentials();
    x.xPubKey = xPubKey;
    x.entropySource = Bitcore.crypto.Hash.sha256sha256(entropyBuffer).toString('hex');
    x.account = account;
    x.derivationStrategy = derivationStrategy;
    x.externalSource = source;
    x.compliantDerivation = true;
    x._expand();
    return x;
  };

  // Get network from extended private key or extended public key
  public getNetworkFromExtendedKey = function(xKey) {
    $.checkArgument(xKey && _.isString(xKey));
    return xKey.charAt(0) == 't' ? 'testnet' : 'livenet';
  };

  public xPubToCopayerId = function(xpub) {
    var hash = sjcl.hash.sha256.hash(xpub);
    return sjcl.codec.hex.fromBits(hash);
  };

  public _hashFromEntropy = function(prefix, length) {
    $.checkState(prefix);
    var b = new Buffer(this.entropySource, 'hex');
    var b2 = Bitcore.crypto.Hash.sha256hmac(b, new Buffer(prefix));
    return b2.slice(0, length);
  };


  public _expand = function() {
    $.checkState(this.xPrivKey || (this.xPubKey && this.entropySource));


    var network = this._getNetworkFromExtendedKey(this.xPrivKey || this.xPubKey);
    if (this.network) {
      $.checkState(this.network == network);
    } else {
      this.network = network;
    }

    if (this.xPrivKey) {
      var xPrivKey = new Bitcore.HDPrivateKey.fromString(this.xPrivKey);

      var deriveFn = this.compliantDerivation ? _.bind(xPrivKey.deriveChild, xPrivKey) : _.bind(xPrivKey.deriveNonCompliantChild, xPrivKey);

      var derivedXPrivKey = deriveFn(this.getBaseAddressDerivationPath());

      // this is the xPubKey shared with the server.
      this.xPubKey = derivedXPrivKey.hdPublicKey.toString();
    }

    // requests keys from mnemonics, but using a xPubkey
    // This is only used when importing mnemonics FROM
    // an hwwallet, in which xPriv was not available when
    // the wallet was created.
    if (this.entropySourcePath) {
      var seed = deriveFn(this.entropySourcePath).publicKey.toBuffer();
      this.entropySource = Bitcore.crypto.Hash.sha256sha256(seed).toString('hex');
    }

    if (this.entropySource) {
      // request keys from entropy (hw wallets)
      var seed = this._hashFromEntropy('reqPrivKey', 32);
      var privKey = new Bitcore.PrivateKey(seed.toString('hex'), network);
      this.requestPrivKey = privKey.toString();
      this.requestPubKey = privKey.toPublicKey().toString();
    } else {
      // request keys derived from xPriv
      var requestDerivation = deriveFn(Constants.PATHS.REQUEST_KEY);
      this.requestPrivKey = requestDerivation.privateKey.toString();

      var pubKey = requestDerivation.publicKey;
      this.requestPubKey = pubKey.toString();

      this.entropySource = Bitcore.crypto.Hash.sha256(requestDerivation.privateKey.toBuffer()).toString('hex');
    }

    this.personalEncryptingKey = this._hashFromEntropy('personalKey', 16).toString('base64');

    this.copayerId = this._xPubToCopayerId(this.xPubKey);
    this.publicKeyRing = [{
      xPubKey: this.xPubKey,
      requestPubKey: this.requestPubKey,
    }];
  };

  public fromObj = function(obj) {
    var x = new Credentials();

    _.each(FIELDS, function(k) {
      x[k] = obj[k];
    });

    x.derivationStrategy = x.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP45;
    x.addressType = x.addressType || Constants.SCRIPT_TYPES.P2SH;
    x.account = x.account || 0;

    $.checkState(x.xPrivKey || x.xPubKey || x.xPrivKeyEncrypted, "invalid input");
    return x;
  };

  public toObj = function() {
    var self = this;

    var x = {};
    _.each(FIELDS, function(k) {
      x[k] = self[k];
    });
    return x;
  };

  public getBaseAddressDerivationPath = function() {
    var purpose;
    switch (this.derivationStrategy) {
      case Constants.DERIVATION_STRATEGIES.BIP45:
        return "m/45'";
      case Constants.DERIVATION_STRATEGIES.BIP44:
        purpose = '44';
        break;
      case Constants.DERIVATION_STRATEGIES.BIP48:
        purpose = '48';
        break;
    }

    var coin = (this.network == 'livenet' ? "0" : "1");
    return "m/" + purpose + "'/" + coin + "'/" + this.account + "'";
  };

  public getDerivedXPrivKey = function(password) {
    var path = this.getBaseAddressDerivationPath();
    var xPrivKey = new Bitcore.HDPrivateKey(this.getKeys(password).xPrivKey, this.network);
    var deriveFn = !!this.compliantDerivation ? _.bind(xPrivKey.deriveChild, xPrivKey) : _.bind(xPrivKey.deriveNonCompliantChild, xPrivKey);
    return deriveFn(path);
  };

  public addWalletPrivateKey = function(walletPrivKey) {
    this.walletPrivKey = walletPrivKey;
    this.sharedEncryptingKey = Utils.privateKeyToAESKey(walletPrivKey);
  };

  public addWalletInfo = function(walletId, walletName, m, n, copayerName, beacon, shareCode, codeHash) {
    this.walletId = walletId;
    this.walletName = walletName;
    this.m = m;
    this.n = n;

    if (shareCode) {
      this.beacon = beacon;
      this.shareCode = shareCode;
      this.unlocked = true;
      this.codeHash = codeHash;
    }

    if (copayerName)
      this.copayerName = copayerName;

    if (this.derivationStrategy == 'BIP44' && n == 1)
      this.addressType = Constants.SCRIPT_TYPES.P2PKH;
    else
      this.addressType = Constants.SCRIPT_TYPES.P2SH;

    // Use m/48' for multisig hardware wallets
    if (!this.xPrivKey && this.externalSource && n > 1) {
      this.derivationStrategy = Constants.DERIVATION_STRATEGIES.BIP48;
    }

    if (n == 1) {
      this.addPublicKeyRing([{
        xPubKey: this.xPubKey,
        requestPubKey: this.requestPubKey,
      }]);
    }
  };

  public hasWalletInfo = function() {
    return !!this.walletId;
  };

  public isPrivKeyEncrypted = function() {
    return (!!this.xPrivKeyEncrypted) && !this.xPrivKey;
  };

  public encryptPrivateKey = function(password, opts) {
    if (this.xPrivKeyEncrypted)
      throw new Error('Private key already encrypted');

    if (!this.xPrivKey)
      throw new Error('No private key to encrypt');


    this.xPrivKeyEncrypted = sjcl.encrypt(password, this.xPrivKey, opts);
    if (!this.xPrivKeyEncrypted)
      throw new Error('Could not encrypt');

    if (this.mnemonic)
      this.mnemonicEncrypted = sjcl.encrypt(password, this.mnemonic, opts);

    delete this.xPrivKey;
    delete this.mnemonic;
  };

  public decryptPrivateKey = function(password) {
    if (!this.xPrivKeyEncrypted)
      throw new Error('Private key is not encrypted');

    try {
      this.xPrivKey = sjcl.decrypt(password, this.xPrivKeyEncrypted);

      if (this.mnemonicEncrypted) {
        this.mnemonic = sjcl.decrypt(password, this.mnemonicEncrypted);
      }
      delete this.xPrivKeyEncrypted;
      delete this.mnemonicEncrypted;
    } catch (ex) {
      throw new Error('Could not decrypt');
    }
  };

  public getKeys = function(password) {
    var keys:any = {};

    if (this.isPrivKeyEncrypted()) {
      $.checkArgument(password, 'Private keys are encrypted, a password is needed');
      try {
        keys.xPrivKey = sjcl.decrypt(password, this.xPrivKeyEncrypted);

        if (this.mnemonicEncrypted) {
          keys.mnemonic = sjcl.decrypt(password, this.mnemonicEncrypted);
        }
      } catch (ex) {
        throw new Error('Could not decrypt');
      }
    } else {
      keys.xPrivKey = this.xPrivKey;
      keys.mnemonic = this.mnemonic;
    }
    return keys;
  };

  public addPublicKeyRing = function(publicKeyRing) {
    this.publicKeyRing = _.clone(publicKeyRing);
  };

  public canSign = function() {
    return (!!this.xPrivKey || !!this.xPrivKeyEncrypted);
  };

  public setNoSign = function() {
    delete this.xPrivKey;
    delete this.xPrivKeyEncrypted;
    delete this.mnemonic;
    delete this.mnemonicEncrypted;
  };

  public isComplete = function() {
    if (!this.m || !this.n) return false;
    if (!this.publicKeyRing || this.publicKeyRing.length != this.n) return false;
    return true;
  };

  public hasExternalSource = function() {
    return (typeof this.externalSource == "string");
  };

  public getExternalSourceName = function() {
    return this.externalSource;
  };

  public getMnemonic = function() {
    if (this.mnemonicEncrypted && !this.mnemonic) {
      throw new Error('Credentials are encrypted');
    }

    return this.mnemonic;
  };

  public clearMnemonic = function() {
    delete this.mnemonic;
    delete this.mnemonicEncrypted;
  };
}