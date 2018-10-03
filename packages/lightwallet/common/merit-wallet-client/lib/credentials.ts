import * as preconditions from 'preconditions';
import * as _ from 'lodash';
import * as Meritcore from 'meritcore-lib';
import * as sjcl from 'sjcl';
import { mnemonicToHDPrivateKey, validateImportMnemonic, generateMnemonic } from '@merit/common/utils/mnemonic';

const $ = preconditions.singleton();

import { Common } from './common';
import { ENV } from '@app/env';
const Constants = Common.Constants;
const Utils = Common.Utils;

const FIELDS = [
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
  'parentAddress',
  'refid',
  'version',
];

function _checkNetwork(network: string): void {
  if (!_.includes(['livenet', 'testnet'], network)) throw new Error('Invalid network');
};

export class Credentials {

  public network: string;
  public xPrivKey: any;
  public xPubKey: string;
  public compliantDerivation: boolean;
  public account: any;
  public mnemonic: string;
  public mnemonicHasPassphrase: boolean;
  public derivationStrategy: any;
  public entropySourcePath: any;
  public entropySource: any;
  public externalSource: any;
  public addressType: any;
  public xPrivKeyEncrypted: any;
  public version: string;
  public sharedEncryptingKey: string;
  public walletPrivKey: string;
  public copayerId: string;
  public requestPrivKey: string;
  public requestPubKey: string;
  public personalEncryptingKey: string;
  public walletId: string;
  public walletName: string;
  public m: any;
  public n: any;
  public beacon: string;
  public publicKeyRing: any;
  public unlocked: boolean;
  public parentAddress: string;
  public hwInfo: string;





  public static create = function(network): Credentials {
    _checkNetwork(network);

    let x = new Credentials();

    x.network = network;
    x.xPrivKey = (new Meritcore.HDPrivateKey(network)).toString();
    x.compliantDerivation = true;
    x._expand();
    return x;
  };

  /**
   * retryGeneration will attempt to generate a mnemonic up to a maximum number
   * n times.
   * @param {string} m - Space-separated mnemonic
   * @param {number} tries - maximum number of times to attempt generation
   */
  private static createMnemonicWithRetries(m?: string, tries?: number) {
    m = m || generateMnemonic();
    tries = tries || 5;
    if(!validateImportMnemonic(m)){
      if (--tries > 0) {
        this.createMnemonicWithRetries(m, tries)
      } else {
        throw new Error("Error generating valid mnemonic")
      }
    }
    return m;
  }


  public static createWithMnemonic = function(network, passphrase, language, account, opts: any = {}): Credentials {
    _checkNetwork(network);
    $.shouldBeNumber(account);

    let m: string  = this.createMnemonicWithRetries(null, 5);
    let x = new Credentials();
    x.network = network;
    x.account = account;
    x.xPrivKey = mnemonicToHDPrivateKey(m, passphrase, network).toString();
    x.compliantDerivation = true;
    x._expand();
    x.mnemonic = m.normalize('NFKD');
    x.mnemonicHasPassphrase = !!passphrase;

    return x;
  };

  public static fromExtendedPrivateKey = function(xPrivKey, account, derivationStrategy, opts: any = {}): Credentials {
    $.shouldBeNumber(account);
    $.checkArgument(_.includes(_.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    let x = new Credentials();
    x.xPrivKey = xPrivKey;
    x.account = account;
    x.derivationStrategy = derivationStrategy;
    x.compliantDerivation = !opts.nonCompliantDerivation;
    x._expand();
    return x;
  };

  public static fromMnemonic = function(network, words, passphrase, account, derivationStrategy, opts: any = {}): Credentials {
    _checkNetwork(network);
    $.shouldBeNumber(account);
    $.checkArgument(_.includes(_.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    let x = new Credentials();
    x.xPrivKey = mnemonicToHDPrivateKey(words, passphrase, network).toString();
    x.mnemonic = words;
    x.mnemonicHasPassphrase = !!passphrase;
    x.account = account;
    x.derivationStrategy = derivationStrategy;
    x.compliantDerivation = !opts.nonCompliantDerivation;
    x.entropySourcePath = opts.entropySourcePath;

    x._expand();
    return x;
  };

  public static fromExtendedPublicKey = function(xPubKey, source, entropySourceHex, account, derivationStrategy, opts: any = {}): Credentials {
    $.checkArgument(entropySourceHex);
    $.shouldBeNumber(account);
    $.checkArgument(_.includes(_.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    let entropyBuffer = new Buffer(entropySourceHex, 'hex');
    //require at least 112 bits of entropy
    $.checkArgument(entropyBuffer.length >= 14, 'At least 112 bits of entropy are needed')

    let x = new Credentials();
    x.xPubKey = xPubKey;
    x.entropySource = Meritcore.crypto.Hash.sha256sha256(entropyBuffer).toString('hex');
    x.account = account;
    x.derivationStrategy = derivationStrategy;
    x.externalSource = source;
    x.compliantDerivation = true;
    x._expand();
    return x;
  };

  private _getNetworkFromExtendedKey = function(xKey): string {
    $.checkArgument(xKey && _.isString(xKey));
    return xKey.charAt(0) == 't' ? 'testnet' : 'livenet';
  };

  public static fromObj = function(obj): Credentials {
    let x = new Credentials();

    _.each(FIELDS, function(k) {
      x[k] = obj[k];
    });

    x.derivationStrategy = x.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP45;
    x.addressType = x.addressType || Constants.SCRIPT_TYPES.P2SH;
    x.account = x.account || 0;

    $.checkState(x.xPrivKey || x.xPubKey || x.xPrivKeyEncrypted, "invalid input");
    return x;
  };

  private static _xPubToCopayerId = function(xpub) {
    var hash = sjcl.hash.sha256.hash(xpub);
    return sjcl.codec.hex.fromBits(hash);
  };

  constructor() {
    this.network = ENV.network;
    this.xPrivKey = (new Meritcore.HDPrivateKey(ENV.network)).toString();
    this.compliantDerivation = true;
    this.version = '1.0.0';
    this.derivationStrategy = Constants.DERIVATION_STRATEGIES.BIP44;
    this.account = 0;
  }

   public Mnemonic = function(network, passphrase, language, account, opts): Credentials {
    $.shouldBeNumber(account);

    opts = opts || {};

    let m = this.createMnemonicWithRetries(null, 5);
    let x = new Credentials();

    x.network = network;
    x.account = account;
    x.xPrivKey = mnemonicToHDPrivateKey(m, passphrase, network).toString();
    x.compliantDerivation = true;
    x._expand();
    x.mnemonic = m.phrase;
    x.mnemonicHasPassphrase = !!passphrase;

    return x;
  };

  public edPrivateKey = function(xPrivKey, account, derivationStrategy, opts: any = {}): Credentials {
    $.shouldBeNumber(account);
    $.checkArgument(_.includes(_.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    let x = new Credentials();
    x.xPrivKey = xPrivKey;
    x.account = account;
    x.derivationStrategy = derivationStrategy;
    x.compliantDerivation = !opts.nonCompliantDerivation;
    x._expand();
    return x;
  };

  // note that mnemonic / passphrase is NOT stored
  public ic = function(network, words, passphrase, account, derivationStrategy, opts: any = {}): Credentials {
    $.shouldBeNumber(account);
    $.checkArgument(_.includes(_.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    let m = this.createMnemonicWithRetries(null, 5);
    let x = new Credentials();
    x.xPrivKey = mnemonicToHDPrivateKey(m, passphrase, network).toString();
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
  public edPublicKey = function(xPubKey, source, entropySourceHex, account, derivationStrategy, opts: any = {}): Credentials {
    $.checkArgument(entropySourceHex);
    $.shouldBeNumber(account);
    $.checkArgument(_.includes(_.values(Constants.DERIVATION_STRATEGIES), derivationStrategy));

    let entropyBuffer = new Buffer(entropySourceHex, 'hex');
    //require at least 112 bits of entropy
    $.checkArgument(entropyBuffer.length >= 14, 'At least 112 bits of entropy are needed')

    let x = new Credentials();
    x.xPubKey = xPubKey;
    x.entropySource = Meritcore.crypto.Hash.sha256sha256(entropyBuffer).toString('hex');
    x.account = account;
    x.derivationStrategy = derivationStrategy;
    x.externalSource = source;
    x.compliantDerivation = true;
    x._expand();
    return x;
  };

  // Get network from extended private key or extended public key
  public getNetworkFromExtendedKey = function(xKey): string {
    $.checkArgument(xKey && _.isString(xKey));
    return xKey.charAt(0) == 't' ? 'testnet' : 'livenet';
  };

  public xPubToCopayerId = function(xpub) {
    let hash = sjcl.hash.sha256.hash(xpub);
    return sjcl.codec.hex.fromBits(hash);
  };

  public _hashFromEntropy = function(prefix, length) {
    $.checkState(prefix);
    let b = new Buffer(this.entropySource, 'hex');
    let b2 = Meritcore.crypto.Hash.sha256hmac(b, new Buffer(prefix));
    return b2.slice(0, length);
  };


  public _expand = function(): void {
    $.checkState(this.xPrivKey || (this.xPubKey && this.entropySource));

    let deriveFn: any = _.noop;
    let network = this._getNetworkFromExtendedKey(this.xPrivKey || this.xPubKey);
    if (this.network) {
      $.checkState(this.network == network);
    } else {
      this.network = network;
    }

    if (this.xPrivKey) {
      let xPrivKey = new Meritcore.HDPrivateKey.fromString(this.xPrivKey);

      deriveFn = this.compliantDerivation ? _.bind(xPrivKey.deriveChild, xPrivKey) : _.bind(xPrivKey.deriveNonCompliantChild, xPrivKey);

      const derivedXPrivKey: any = deriveFn(this.getBaseAddressDerivationPath());

      // this is the xPubKey shared with the server.
      this.xPubKey = derivedXPrivKey.hdPublicKey.toString();
    }

    // requests keys from mnemonics, but using a xPubkey
    // This is only used when importing mnemonics FROM
    // an hwwallet, in which xPriv was not available when
    // the wallet was created.
    if (this.entropySourcePath) {
      let seed = deriveFn(this.entropySourcePath).publicKey.toBuffer();
      this.entropySource = Meritcore.crypto.Hash.sha256sha256(seed).toString('hex');
    }

    if (this.entropySource) {
      // request keys from entropy (hw wallets)
      let seed = this._hashFromEntropy('reqPrivKey', 32);
      let privKey = new Meritcore.PrivateKey(seed.toString('hex'), network);
      this.requestPrivKey = privKey.toString();
      this.requestPubKey = privKey.toPublicKey().toString();
    } else {
      // request keys derived from xPriv
      const requestDerivation: any = deriveFn(Constants.PATHS.REQUEST_KEY);
      this.requestPrivKey = requestDerivation.privateKey.toString();

      const pubKey: any = requestDerivation.publicKey;
      this.requestPubKey = pubKey.toString();

      this.entropySource = Meritcore.crypto.Hash.sha256(requestDerivation.privateKey.toBuffer()).toString('hex');
    }

    this.personalEncryptingKey = this._hashFromEntropy('personalKey', 16).toString('base64');

    this.copayerId = Credentials._xPubToCopayerId(this.xPubKey);
    this.publicKeyRing = [{
      xPubKey: this.xPubKey,
      requestPubKey: this.requestPubKey,
    }];
  };

  public fromObj = function(obj): Credentials {
    let x = new Credentials();

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
    let self = this;

    let x = {};
    _.each(FIELDS, function(k) {
      x[k] = self[k];
    });
    return x;
  };

  public getBaseAddressDerivationPath = function(): string {
    let purpose;
    switch (this.derivationStrategy) {
      case Constants.DERIVATION_STRATEGIES.BIP45:
        return "m/45'";
      case Constants.DERIVATION_STRATEGIES.BIP44:
        purpose = '44';
        break;
      case Constants.DERIVATION_STRATEGIES.BIP48:
        purpose = '48';
        break;
      default:
        throw new Error('Credentials#getBaseAddressDerivationPath: derivation strategy is not set.');
    }

    let coin = (this.network == 'livenet' ? "0" : "1");
    return "m/" + purpose + "'/" + coin + "'/" + this.account + "'";
  };

  public getDerivedXPrivKey = function(password) {
    let path = this.getBaseAddressDerivationPath();
    let xPrivKey = new Meritcore.HDPrivateKey(this.getKeys(password).xPrivKey, this.network);
    let deriveFn = !!this.compliantDerivation ? _.bind(xPrivKey.deriveChild, xPrivKey) : _.bind(xPrivKey.deriveNonCompliantChild, xPrivKey);
    return deriveFn(path);
  };

  public addWalletPrivateKey = function(walletPrivKey): void {
    this.walletPrivKey = walletPrivKey;
    this.sharedEncryptingKey = Utils.privateKeyToAESKey(walletPrivKey);
  };

  // TODO: figure out if we need to store refid in credentials
  public addWalletInfo = function(walletId, walletName, m, n, copayerName, parentAddress): void  {
    this.walletId = walletId;
    this.walletName = walletName;
    this.m = m;
    this.n = n;

    this.parentAddress = parentAddress;
    this.unlocked = true;

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

  public encryptPrivateKey = function(password, opts): void {
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

  public decryptPrivateKey = function(password): void {
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

  public getKeys = function(password):any {
    let keys:any = {};

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

  public addPublicKeyRing = function(publicKeyRing): void {
    this.publicKeyRing = _.clone(publicKeyRing);
  };

  public canSign = function(): boolean {
    return (!!this.xPrivKey || !!this.xPrivKeyEncrypted);
  };

  public setNoSign = function(): void {
    delete this.xPrivKey;
    delete this.xPrivKeyEncrypted;
    delete this.mnemonic;
    delete this.mnemonicEncrypted;
  };

  public isComplete = function(): boolean {
    if (!this.m || !this.n) return false;
    if (!this.publicKeyRing || this.publicKeyRing.length != this.n) return false;
    return true;
  };

  public hasExternalSource = function(): boolean {
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

  public clearMnemonic = function(): void {
    delete this.mnemonic;
    delete this.mnemonicEncrypted;
  };
}
