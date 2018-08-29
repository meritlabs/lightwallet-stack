import { ENV } from '@app/env';
import { EasySend, getEasySendURL } from '@merit/common/models/easy-send';
import { generateMnemonic, mnemonicToHDPrivateKey, validateImportMnemonic } from '@merit/common/utils/mnemonic';
import * as Bip38 from 'bip38';
import * as Bitcore from 'bitcore-lib';
import * as _ from 'lodash';
import * as preconditions from 'preconditions';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/interval';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { interval } from 'rxjs/observable/interval';
import { map, retryWhen, switchMap } from 'rxjs/operators';
import { EasyReceiptResult } from '../../models/easy-receipt';
import { ISendMethod } from '../../models/send-method';
import { Constants, Utils } from './common';
import { Credentials } from './credentials';
import { MWCErrors } from './errors';
import { Logger } from './log';
import { PayPro } from './paypro';
import { Verifier } from './verifier';
import { ISmsNotificationSettings } from '../../models/sms-subscription';
import { IGlobalSendHistory } from '../../models/globalsend-history.model';
import { IInviteRequest } from '../../services/invite-request.service';
import { IRankInfo } from '../../models/rank';
import * as queryString from 'querystring';
import { IDisplayTransaction } from '../../models/transaction';

const $ = preconditions.singleton();

const Package = require('../../../package.json');

const DEFAULT_FEE = 10000;


export interface InitOptions {
  request?: any;
  baseUrl?: string;
  payProHttp?: string;
  doNotVerifyPayPro?: boolean;
  timeout?: number;
  logLevel?: string;
}

export enum AddressType {
  PubKey = 1,
  Script,
  ParameterizedScript
}

export interface ISendReferralOptions {
  parentAddress: string;
  address?: string;
  addressType: AddressType;
  signPrivKey: string;
  pubkey?: string;
  network?: string;
  alias?: string;
}

export class API {
  baseUrl: string;
  payProHttp: string;
  doNotVerifyPayPro: boolean;
  timeout: number;
  logLevel: string;
  privateKeyEncryptionOpts: any = {
    iter: 10000,
  };
  credentials: Credentials; // TODO: Make with getters/setters
  notificationIncludeOwn: boolean;
  log: any;
  lastNotificationId: string;
  notificationsIntervalId: any;
  keyDerivationOk: boolean;
  session: any;
  DEBUG_MODE: boolean = false;

  // Mutated from other services (namely wallet.service and profile.service)
  id: string; // TODO: Re-evaluate where this belongs.
  completeHistory: any; // This is mutated from Wallet.Service.ts; for now.
  cachedStatus: any;
  cachedActivity: any;
  cachedTxps: any;
  pendingTxps: any;
  totalBalanceMicros: number;
  scanning: boolean;
  hasUnsafeConfirmed: boolean;
  network: string;
  n: number;
  m: number;
  notAuthorized: boolean;
  needsBackup: boolean;
  name: string;
  color: string;
  started: boolean;
  copayerId: string;
  unlocked: boolean;
  confirmed: boolean;
  parentAddress: string;
  balanceHidden: boolean;
  status: any;
  secret: string;
  email: string;
  cachedBalance: string;
  cachedBalanceUpdatedOn: string;
  totalNetworkValue: string;
  displayAddress: string;
  miningRewards: string;
  growthRewards: string;
  onConnectionError: any;
  onAuthenticationError: any;
  onConnectionRestored: any;
  vaults: Array<any> = [];
  locked: boolean;

  rootAddress: any;
  rootAlias: string;
  communitySize: number;

  balance: any;
  invitesBalance: any;
  availableInvites: number = 0; // total invites I have 
  pendingInvites: number = 0; // invites that are currently pending confirmation
  sendableInvites: number = 0; // invites I can send right now


  /** is disabled when wallet is temporary decrypted */
  credentialsSaveAllowed: boolean = true;

  constructor(opts: InitOptions) {
    this.baseUrl = opts.baseUrl || ENV.mwsUrl;
    this.doNotVerifyPayPro = opts.doNotVerifyPayPro;
    this.timeout = opts.timeout || 50000;
    this.logLevel = opts.logLevel || 'debug';
    this.log = Logger.getInstance();
    this.log.setLevel(this.logLevel);
  }


  // Do we need an initialize now?  Constructor should be able to handle.
  initialize(notificationIncludeOwn?: boolean) {
    $.checkState(this.credentials);
    this.notificationIncludeOwn = notificationIncludeOwn;
  }

  setOnConnectionError(cb: any) {
    this.onConnectionError = cb;
  }

  setOnAuthenticationError(cb: any) {
    this.onAuthenticationError = cb;
  }

  setOnConnectionRestored(cb: any) {
    this.onConnectionRestored = cb;
  }

  async _fetchLatestNotifications(interval: number): Promise<any[]> {
    let opts: any = {
      lastNotificationId: this.lastNotificationId,
      includeOwn: this.notificationIncludeOwn,
    };

    if (!this.lastNotificationId)
      opts.timeSpan = interval + 1;

    const notifications = await this.getNotifications(opts);

    if (notifications && notifications.length > 0)
      this.lastNotificationId = notifications[notifications.length - 1].id;


    return notifications;
  }

  initNotifications(int: number = 10): Observable<any[]> {
    return interval(int * 1000)
      .pipe(
        switchMap(() => fromPromise(this._fetchLatestNotifications(int))),
        retryWhen(err =>
          err.pipe(
            map((err) => !err || err !== MWCErrors.NOT_FOUND && err !== MWCErrors.NOT_AUTHORIZED),
          ),
        ),
      );
  }

  /**
   * Encrypt a message
   * @private
   * @static
   * @memberof Client.API
   * @param {String} message
   * @param {String} encryptingKey
   */
  private _encryptMessage(message, encryptingKey) {
    if (!message) return null;
    return Utils.encryptMessage(message, encryptingKey);
  }

  /**
   * Decrypt a message
   * @private
   * @static
   * @memberof Client.API
   * @param {String} message
   * @param {String} encryptingKey
   */
  private _decryptMessage(message, encryptingKey) {
    if (!message) return '';
    try {
      return Utils.decryptMessage(message, encryptingKey);
    } catch (ex) {
      return '<ECANNOTDECRYPT>';
    }
  }

  _processTxNotes(notes): void {
    if (!notes) return;
    let encryptingKey = this.credentials.sharedEncryptingKey;
    notes.forEach((note) => {
      note.encryptedBody = note.body;
      note.body = this._decryptMessage(note.body, encryptingKey);
      note.encryptedEditedByName = note.editedByName;
      note.editedByName = this._decryptMessage(note.editedByName, encryptingKey);
    });

    return notes;
  }

  /**
   * Decrypt text fields in transaction proposals
   * @private
   * @static
   * @memberof Client.API
   * @param {Array} txps
   * @param {String} encryptingKey
   */
  async _processTxps(txps) {
    if (!txps) return;

    txps = [].concat(txps);

    let encryptingKey = this.credentials.sharedEncryptingKey;

    txps.forEach(txp => {
      txp.actions = txp.actions || [];
      txp.outputs = txp.outputs || [];

      txp.encryptedMessage = txp.message;
      txp.message = this._decryptMessage(txp.message, encryptingKey) || null;
      txp.creatorName = this._decryptMessage(txp.creatorName, encryptingKey);

      txp.actions.forEach(action => {
        action.copayerName = this._decryptMessage(action.copayerName, encryptingKey);
        action.comment = this._decryptMessage(action.comment, encryptingKey);
        // TODO get copayerName from Credentials -> copayerId to copayerName
        // action.copayerName = null;
      });

      txp.outputs.forEach(output => {
        output.encryptedMessage = output.message;
        output.message = this._decryptMessage(output.message, encryptingKey) || null;
      });

      txp.hasUnconfirmedInputs = txp.inputs.some(input => input.confirmations == 0);

      this._processTxNotes(txp.note);
    });
  }

  /**
   * Parse errors
   * @private
   * @static
   * @memberof Client.API
   * @param {Object} body
   */
  private _parseError = (body: any): Error => {
    if (!body) return;

    if (_.isString(body)) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {
          error: body,
        };
      }
    }
    let ret;
    if (body.code) {
      if (MWCErrors[body.code]) {
        ret = MWCErrors[body.code];
        if (body.message) ret.message = body.message;
      } else {
        ret = body.code + ': ' + body.message;
      }
    } else {
      ret = body.error || JSON.stringify(body);
    }
    this.log.error(ret);
    return ret;
  };

  /**
   * Sign an HTTP request
   * @private
   * @static
   * @memberof Client.API
   * @param {String} method - The HTTP method
   * @param {String} url - The URL for the request
   * @param {Object} args - The arguments in case this is a POST/PUT request
   * @param {String} privKey - Private key to sign the request
   */
  private _signRequest = function(method, url, args, privKey) {
    let message = [method.toLowerCase(), url, JSON.stringify(args)].join('|');
    return Utils.signMessage(message, privKey);
  };


  /**
   * Seed from random
   *
   * @param {Object} opts
   * @param {String} opts.network - default 'livenet'
   */
  seedFromRandom(opts: any): any {
    $.checkArgument(arguments.length <= 1, 'DEPRECATED: only 1 argument accepted.');
    $.checkArgument(_.isUndefined(opts) || _.isObject(opts), 'DEPRECATED: argument should be an options object.');

    opts = opts || {};
    this.credentials = Credentials.create(opts.network || 'livenet');
  }


  /**
   * Seed from random
   *
   * @param {Object} opts
   * @param {String} opts.passphrase
   * @param {String} opts.skipDeviceValidation
   */
  validateKeyDerivation(opts: any): Promise<any> {
    return new Promise((resolve, reject) => {

      let _deviceValidated: boolean;

      opts = opts || {};

      let c = this.credentials;

      function testMessageSigning(xpriv, xpub) {
        let nonHardenedPath = 'm/0/0';
        let message = 'Lorem ipsum dolor sit amet, ne amet urbanitas percipitur vim, libris disputando his ne, et facer suavitate qui. Ei quidam laoreet sea. Cu pro dico aliquip gubergren, in mundi postea usu. Ad labitur posidonium interesset duo, est et doctus molestie adipiscing.';
        let priv = xpriv.deriveChild(nonHardenedPath).privateKey;
        let signature = Utils.signMessage(message, priv);
        let pub = xpub.deriveChild(nonHardenedPath).publicKey;
        return Utils.verifyMessage(message, signature, pub);
      }

      function testHardcodedKeys() {
        let words = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
        let xpriv = mnemonicToHDPrivateKey(words, '', c.network).toHDPrivateKey();

        if (xpriv.toString() != 'xprv9s21ZrQH143K2jHFB1HM4GNbVaBSSnjHDQP8uBtKKTvusxMirfmKEmaUS4fkwqeoLqVVT2ShayUSmnEZNV1AKqTSESqyAFCBW8nvEqKfvGy') return false;

        xpriv = xpriv.deriveChild('m/44\'/0\'/0\'');
        if (xpriv.toString() != 'xprv9ynVfpDwjVTeyQALCLp4EVHwonHHoE37DoUkjsj6A5vxXK1Wh6YEQVPdgdGdtvqWttM4nqgxK8kgmmRD5yfKhWGbD75JGdsDb9yMtozdVc6') return false;

        let xpub = Bitcore.HDPublicKey.fromString('xpub6Cmr5KkqZs1xBtEoJNM4bdEgMp7nCgkxb2QMYG8hiRTwQ7LfEdrUxHi7XrjNxkeuRrNSqHLXHAuwZvqoeASrp5jxjnpMa4d8PFpA9TRxVCd');
        return testMessageSigning(xpriv, xpub);
      }

      function testLiveKeys() {
        let words;
        try {
          words = c.getMnemonic();
        } catch (ex) {
        }

        let xpriv;
        if (words && (!c.mnemonicHasPassphrase || opts.passphrase)) {
          let m: string = generateMnemonic();
          xpriv = mnemonicToHDPrivateKey(m, opts.passphrase, c.network).toString();
        }
        if (!xpriv) {
          xpriv = new Bitcore.HDPrivateKey(c.xPrivKey);
        }
        xpriv = xpriv.deriveChild(c.getBaseAddressDerivationPath());
        let xpub = new Bitcore.HDPublicKey(c.xPubKey);

        return testMessageSigning(xpriv, xpub);
      }

      let hardcodedOk = true;
      if (!_deviceValidated && !opts.skipDeviceValidation) {
        hardcodedOk = testHardcodedKeys();
        _deviceValidated = true;
      }

      let liveOk = (c.canSign() && !c.isPrivKeyEncrypted()) ? testLiveKeys() : true;

      this.keyDerivationOk = hardcodedOk && liveOk;

      return resolve(this.keyDerivationOk);
    });
  };

  /**
   * Seed from random with mnemonic
   *
   * @param {Object} opts
   * @param {String} opts.network - default 'livenet'
   * @param {String} opts.passphrase
   * @param {Number} opts.language - default 'en'
   * @param {Number} opts.account - default 0
   */
  seedFromRandomWithMnemonic(opts: any = {}): any {
    $.checkArgument(arguments.length <= 1, 'DEPRECATED: only 1 argument accepted.');
    $.checkArgument(_.isUndefined(opts) || _.isObject(opts), 'DEPRECATED: argument should be an options object.');

    this.credentials = Credentials.createWithMnemonic(opts.network || 'livenet', opts.passphrase, opts.language || 'en', opts.account || 0);

  }

  getMnemonic(): any {
    return this.credentials.getMnemonic();
  }

  mnemonicHasPassphrase(): any {
    return this.credentials.mnemonicHasPassphrase;
  }


  clearMnemonic(): any {
    return this.credentials.clearMnemonic();
  }

  getNewMnemonic(data: any): any {
    return generateMnemonic();
  }

  /**
   * Creates Address from hdPrivKey
   */
  getRootAddress() {
    if (this.rootAddress) return this.rootAddress;
    const xpub = new Bitcore.HDPublicKey(this.credentials.xPubKey);
    return this.rootAddress = Bitcore.Address.fromPublicKey(xpub.deriveChild('m/0/0').publicKey, this.credentials.network);
  }

  getRootAddressPubkey() {
    const xpub = new Bitcore.HDPublicKey(this.credentials.xPubKey);
    return xpub.deriveChild('m/0/0').publicKey;
  }

  getRootPrivateKey(password: string) {
    const derivedKey = this.credentials.getDerivedXPrivKey(password);
    const xprv = new Bitcore.HDPrivateKey(derivedKey);
    return xprv.deriveChild('m/0/0').privateKey;
  }

  /**
   * Seed from extended private key
   *
   * @param {String} xPrivKey
   * @param {Number} opts.account - default 0
   * @param {String} opts.derivationStrategy - default 'BIP44'
   */
  seedFromExtendedPrivateKey(xPrivKey: any, opts: any = {}): void {
    this.credentials = Credentials.fromExtendedPrivateKey(xPrivKey, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44, opts);
  }

  /**
   * Seed from Mnemonics (language autodetected)
   * Can throw an error if mnemonic is invalid
   *
   * @param {String} BIP39 words
   * @param {Object} opts
   * @param {String} opts.network - default 'livenet'
   * @param {String} opts.passphrase
   * @param {Number} opts.account - default 0
   * @param {String} opts.derivationStrategy - default 'BIP44'
   */
  seedFromMnemonic(words: Array<string>, opts: any = {}): any {
    this.credentials = Credentials.fromMnemonic(opts.network || 'livenet', words, opts.passphrase, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44, opts);
  }

  /**
   * Seed from external wallet key
   *
   * @param {String} xPubKey
   * @param {String} source - A name identifying the source of the xPrivKey (e.g. ledger, TREZOR, ...)
   * @param {String} entropySourceHex - A HEX string containing pseudo-random data, that can be deterministically
   *   derived from the xPrivKey, and should not be derived from xPubKey.
   * @param {Object} opts
   * @param {Number} opts.account - default 0
   * @param {String} opts.derivationStrategy - default 'BIP44'
   */
  seedFromExtendedPublicKey(xPubKey: any, source: any, entropySourceHex: any, opts: any = {}): any {
    this.credentials = Credentials.fromExtendedPublicKey(xPubKey, source, entropySourceHex, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
  }

  static fromObj(obj) {
    let wallet = new this({
      baseUrl: obj.baseUrl || ENV.mwsUrl,
      timeout: 100000,
    });

    wallet.import(obj.credentials);
    wallet.name = obj.name || '';
    wallet.id = obj.id || '';
    wallet.color = obj.color;
    wallet.confirmed = obj.confirmed || false;
    wallet.balance = obj.balance || {};
    wallet.invitesBalance = obj.invitesBalance || {};
    wallet.availableInvites = obj.availableInvites || 0;
    wallet.pendingInvites = obj.pendingInvites || 0;
    wallet.network = obj.network || ENV.network;
    wallet.rootAddress = Bitcore.Address.fromString(obj.rootAddress, wallet.network);
    wallet.rootAlias = obj.rootAlias || '';
    wallet.parentAddress = Bitcore.Address.fromString(obj.rootAddress, wallet.network);
    wallet.vaults = obj.vaults || [];
    wallet.communitySize = obj.communitySize || 0;
    return wallet;
  }

  toObj() {

    return {
      credentials: this.export(),
      name: this.name,
      id: this.id,
      confirmed: this.confirmed,
      balance: this.balance,
      invitesBalance: this.invitesBalance,
      pendingInvites: this.pendingInvites,
      availableInvites: this.availableInvites,
      communitySize: this.communitySize,
      rootAddress: this.getRootAddress().toString(),
      rootAlias: this.rootAlias,
      parentAddress: this.parentAddress,
      color: this.color,
      network: this.network,
      vaults: this.vaults.map(v => {
        return {
          _id: v._id,
          name: v.name,
          amount: v.amount,
          address: v.address,
          coins: v.coins,
          masterPubKey: v.masterPubKey,
          status: v.status,
          whitelist: v.whitelist,
        };
      }),
    };
  }

  /**
   * Export wallet
   *
   * @param {Object} opts
   * @param {Boolean} opts.password
   * @param {Boolean} opts.noSign
   */
  export(opts: any = {}): any {
    $.checkState(this.credentials);

    let output;

    let c = Credentials.fromObj(this.credentials);

    if (opts.noSign) {
      c.setNoSign();
    } else if (opts.password) {
      c.decryptPrivateKey(opts.password);
    }

    output = JSON.stringify(c.toObj());

    return output;
  }

  /**
   * Import wallets
   *
   * @param {Object} str - The serialized JSON created with #export
   */
  import(str: string): any {
    try {
      let credentials = Credentials.fromObj(JSON.parse(str));
      this.credentials = credentials;
      this.name = credentials.walletName;
      this.id = credentials.walletId;
    } catch (ex) {
      throw MWCErrors.INVALID_BACKUP;
    }
  }

  async _import(): Promise<any> {

    $.checkState(this.credentials);

    try {
      return await this.openWallet();
    } catch (e) {

      if (e.code != 'NOT_AUTHORIZED') {
        throw e;
      } else {

        const walletPrivKey = new Bitcore.PrivateKey(void 0, this.credentials.network);
        const pubkey = walletPrivKey.toPublicKey();
        this.credentials.addWalletPrivateKey(walletPrivKey.toString());
        let rootAddress = this.getRootAddress();

        let defaultOpts = {
          m: 1,
          n: 1,
          walletName: 'Personal Wallet',
          copayerName: 'me',
        };

        //call 'recreate wallet' method to create wallet instance with exision
        let args = {
          m: defaultOpts.m,
          n: defaultOpts.n,
          walletName: defaultOpts.walletName,
          copayerName: defaultOpts.copayerName,
          pubKey: pubkey.toString(),
          rootAddress: rootAddress.toString(),
          network: this.credentials.network,
          singleAddress: true, //daedalus wallets are single-addressed
        };

        let res = await this._doPostRequest('/v1/recreate_wallet/', args);

        if (res) {
          let walletId = res.walletId;
          let parentAddress = res.parentAddress;
          this.credentials.addWalletInfo(walletId, defaultOpts.walletName, defaultOpts.m, defaultOpts.n, defaultOpts.copayerName, parentAddress);

          return this.doJoinWallet(walletId, walletPrivKey, this.credentials.xPubKey, this.credentials.requestPubKey, defaultOpts.copayerName, {});
        } else {
          throw new Error('failed to recreate wallet');
        }
      }
    }
  }

  /**
   * Import from Mnemonics (language autodetected)
   * Can throw an error if mnemonic is invalid
   *
   * @param {String} BIP39 words
   * @param {Object} opts
   * @param {String} opts.network - default 'livenet'
   * @param {String} opts.passphrase
   * @param {Number} opts.account - default 0
   * @param {String} opts.derivationStrategy - default 'BIP44'
   * @param {String} opts.entropySourcePath - Only used if the wallet was created on a HW wallet, in which that private
   *   keys was not available for all the needed derivations
   */
  importFromMnemonic(words: string, opts: any = {}): Promise<any> {
    this.log.debug('Importing from 12 Words');

    function derive(nonCompliantDerivation) {
      return Credentials.fromMnemonic(opts.network || 'livenet', words, opts.passphrase, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44, {
        nonCompliantDerivation: nonCompliantDerivation,
        entropySourcePath: opts.entropySourcePath,
      });
    }

    try {
      this.credentials = derive(false);
    } catch (e) {
      this.log.error('Mnemonic error !:', e.Error);
      return Promise.reject(MWCErrors.INVALID_BACKUP);
    }

    return this._import().catch(err => {
      if (err == MWCErrors.INVALID_BACKUP) return Promise.reject(err);
      if (err == MWCErrors.NOT_AUTHORIZED || err == MWCErrors.WALLET_DOES_NOT_EXIST) {

        let altCredentials = derive(true);
        if (altCredentials.xPubKey.toString() == this.credentials.xPubKey.toString()) return Promise.reject(err);
        this.credentials = altCredentials;
        return this._import();
      }
      return Promise.reject(err);
    });

  }

  /*
   * Import from extended private key
   *
   * @param {String} xPrivKey
   * @param {Number} opts.account - default 0
   * @param {String} opts.derivationStrategy - default 'BIP44'
   * @param {Callback} cb - The callback that handles the response. It returns a flag indicating that the wallet is imported.
   */
  importFromExtendedPrivateKey(xPrivKey: any, opts: any = {}): Promise<any> {
    this.log.debug('Importing from Extended Private Key');

    try {
      this.credentials = Credentials.fromExtendedPrivateKey(xPrivKey, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
    } catch (e) {
      this.log.info('xPriv error:', e);
      return new Promise((resolve, reject) => {
        return reject(MWCErrors.INVALID_BACKUP);
      });
    }

    return this._import();
  }

  /**
   * Import from Extended Key
   *
   * @param {String} xPubKey
   * @param {String} source - A name identifying the source of the xPrivKey
   * @param {String} entropySourceHex - A HEX string containing pseudo-random data, that can be deterministically
   *   derived from the xPrivKey, and should not be derived from xPubKey.
   * @param {Object} opts
   * @param {Number} opts.account - default 0
   * @param {String} opts.derivationStrategy - default 'BIP44'
   */
  importFromExtendedPublicKey(xPubKey: any, source: any, entropySourceHex: any, opts: any = {}): Promise<any> {
    $.checkArgument(arguments.length == 5, 'DEPRECATED: should receive 5 arguments');

    this.log.debug('Importing from Extended Private Key');
    try {
      this.credentials = Credentials.fromExtendedPublicKey(xPubKey, source, entropySourceHex, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
    } catch (e) {
      this.log.info('xPriv error:', e);
      return new Promise((resolve, reject) => {
        return reject(MWCErrors.INVALID_BACKUP);
      });
    }

    return this._import();
  };

  decryptBIP38PrivateKey(encryptedPrivateKeyBase58: any, passphrase: string, opts: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {

      let bip38 = new Bip38();

      let privateKeyWif;
      try {
        privateKeyWif = bip38.decrypt(encryptedPrivateKeyBase58, passphrase);
      } catch (ex) {
        return reject(new Error('Could not decrypt BIP38 private key: ' + ex));
      }

      let privateKey = new Bitcore.PrivateKey(privateKeyWif, 'livenet');
      let address = privateKey.publicKey.toAddress().toString();
      let addrBuff = new Buffer(address, 'ascii');
      let actualChecksum = Bitcore.crypto.Hash.sha256sha256(addrBuff).toString('hex').substring(0, 8);
      let expectedChecksum = Bitcore.encoding.Base58Check.decode(encryptedPrivateKeyBase58).toString('hex').substring(6, 14);

      if (actualChecksum != expectedChecksum)
        return reject(new Error('Incorrect passphrase'));

      return resolve(privateKeyWif);
    });
  };


  getBalanceFromPrivateKey(_privateKey: string): Promise<any> {
    return new Promise((resolve, reject) => {

      let privateKey = new Bitcore.PrivateKey(_privateKey);
      let address = privateKey.publicKey.toAddress();
      return this.getUtxos({
        addresses: address.toString(),
      }).then((utxos) => {
        return resolve(_.sumBy(utxos, 'micros'));
      });
    });
  };

  buildTxFromPrivateKey(_privateKey: any, destinationAddress: any, opts: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let privateKey = new Bitcore.PrivateKey(_privateKey);
      let address = privateKey.publicKey.toAddress();

      return this.getUtxos({
        addresses: address.toString(),
      }).then((utxos) => {
        if (!_.isArray(utxos) || utxos.length == 0) return reject(new Error('No utxos found'));

        let fee = opts.fee || DEFAULT_FEE;
        let amount = _.sumBy(utxos, 'micros') - fee;
        if (amount <= 0) return reject(MWCErrors.INSUFFICIENT_FUNDS);

        let tx;
        try {
          let toAddress = Bitcore.Address.fromString(destinationAddress);

          tx = new Bitcore.Transaction()
            .from(utxos)
            .to(toAddress, amount)
            .fee(fee)
            .sign(privateKey);

          // Make sure the tx can be serialized
          tx.serialize();

        } catch (ex) {
          this.log.error('Could not build transaction from private key', ex);
          return reject(MWCErrors.COULD_NOT_BUILD_TRANSACTION);
        }
        return resolve(tx);
      });
    });
  };


  openWallet(): Promise<any> {
    this.log.warn('Opening wallet');
    return new Promise((resolve, reject) => {

      $.checkState(this.credentials);
      if (this.credentials.isComplete() && this.credentials.hasWalletInfo()) {
        this.log.warn('WALLET OPEN');
        return resolve(true); // wallet is already open
      }

      return this._doGetRequest('/v1/wallets/', { includeExtendedInfo: 1 }).then((ret) => {
        const wallet = ret.wallet;

        return this._processStatus(ret).then(() => {

          if (!this.credentials.hasWalletInfo()) {
            const me: any = _.find(wallet.copayers, {
              id: this.credentials.copayerId,
            });
            this.credentials.addWalletInfo(wallet.id, wallet.name, wallet.m, wallet.n, me.name, wallet.parentAddress);
          }

          if (wallet.status != 'complete')
            return resolve();

          if (this.credentials.walletPrivKey) {
            if (!Verifier.checkCopayers(this.credentials, wallet.copayers)) {
              return reject(MWCErrors.SERVER_COMPROMISED);
            }
          } else {
            // this should only happen in AIR-GAPPED flows
            this.log.warn('Could not verify copayers key (missing wallet Private Key)');
          }

          this.credentials.addPublicKeyRing(this._extractPublicKeyRing(wallet.copayers));

          return resolve(ret);
        });
      }).catch(err => {
        return reject(err);
      });
    });
  };

  _getHeaders(): Headers {
    return new Headers({
      'x-client-version': 'MWC-' + Package.version,
      'Content-Type': 'application/json',
    });
  };


  protected async _doRequest(method: string, url: string, qs?: any, body?: any, useSession?: boolean, secondRun?: boolean, bodyEncoding: 'json' | 'blob' | 'text' = 'json') {
    body = body || {};

    if (qs) {
      Object.keys(qs)
        .forEach((key: string) => {
          if (typeof qs[key] === 'undefined' || qs[key] === null) {
            delete qs[key];
          }
        });

      url = url + '?' + queryString.stringify(qs);
    }

    const headers: Headers = this._getHeaders();

    if (this.credentials) {
      headers.set('x-identity', this.credentials.copayerId);

      if (useSession && this.session) {
        headers.set('x-session', this.session);
      } else if (this.credentials.requestPrivKey) {
        headers.set('x-signature', this._signRequest(method, url, body, this.credentials.requestPrivKey));
      }
    }

    const reqOpts: any = {
      method,
      headers,
      mode: 'cors',
    };

    if (['PUT', 'POST'].indexOf(method.toUpperCase()) > -1) {
      try {
        reqOpts.body = JSON.stringify(body);
      } catch (err) {
        reqOpts.body = body;
      }
    }

    let res: Response;

    try {
      res = await fetch(this.baseUrl + url, reqOpts);
    } catch (err) {
      // Technical issue
      console.log(err);
      throw 'Unexpected error occurred';
    }

    let respBody: any;

    try {
      respBody = await res[bodyEncoding]();
    } catch (err) {
      // Can't parse body
      console.log(err);
      throw 'Unexpected error occurred';
    }

    if (!res.status) {
      throw MWCErrors.CONNECTION_ERROR.text;
    }

    if (res.status >= 400) {
      // failed request

      switch (res.status) {
        case 404:
          throw MWCErrors.NOT_FOUND.text;

        case 401:
          if (!secondRun) {
            await this._doRequest('post', '/v1/login', null, null, false, true);
            return this._doRequest(method, url, qs, body, useSession, true);
          } else {
            throw MWCErrors.AUTHENTICATION_ERROR.text;
          }

        case 502:
        case 504:
          throw MWCErrors.SERVER_UNAVAILABLE.text;

        default:
          if (MWCErrors[res.status]) {
            throw MWCErrors[res.status].text;
          }
          throw respBody && (respBody.error || respBody.message || respBody) || 'Unknown error occurred';
      }
    }

    return respBody;
  }

  private _login(): Promise<any> {
    return this._doPostRequest('/v1/login', {});
  };

  private _logout(): Promise<any> {
    return this._doPostRequest('/v1/logout', {});
  };

  private async _doRequestWithLogin(method: string, url: string, qs?: any, body?: any): Promise<any> {
    if (!this.session) {
      const s = await this._login();
      if (!s) {
        throw MWCErrors.NOT_AUTHORIZED.text;
      }
      this.session = s;
    }

    return this._doRequest(method, url, qs, body, true);
  };

  _doPostRequest(url: string, body?: any): Promise<any> {
    return this._doRequest('post', url, null, body, false);
  };

  _doPutRequest(url: string, body: any): Promise<any> {
    return this._doRequest('put', url, null, body, false);
  };

  _doGetRequest(url: string, qs?: any): Promise<any> {
    return this._doRequest('get', url, qs, null, false);
  };

  _doGetRequestWithLogin(url: string, qs?: any): Promise<any> {
    return this._doRequestWithLogin('get', url, qs);
  };

  private _doDeleteRequest(url: string): Promise<any> {
    return this._doRequest('delete', url, null, null, false);
  };

  private _buildSecret = function(walletId, walletPrivKey, network) {
    if (_.isString(walletPrivKey)) {
      walletPrivKey = Bitcore.PrivateKey.fromString(walletPrivKey);
    }
    let widHex = new Buffer(walletId.replace(/-/g, ''), 'hex');
    let widBase58 = new Bitcore.encoding.Base58(widHex).toString();
    return _.padEnd(widBase58, 22, '0') + walletPrivKey.toWIF() + (network == 'testnet' ? 'T' : 'L');
  };

  parseSecret(secret: string): any {
    $.checkArgument(secret);

    function split(str, indexes) {
      let parts = [];
      indexes.push(str.length);
      let i = 0;
      while (i < indexes.length) {
        parts.push(str.substring(i == 0 ? 0 : indexes[i - 1], indexes[i]));
        i++;
      }
      ;
      return parts;
    };

    try {
      let secretSplit = split(secret, [22, 74]);
      let widBase58 = secretSplit[0].replace(/0/g, '');
      let widHex = Bitcore.encoding.Base58.decode(widBase58).toString('hex');
      let walletId = split(widHex, [8, 12, 16, 20]).join('-');

      let walletPrivKey = Bitcore.PrivateKey.fromString(secretSplit[1]);
      let networkChar = secretSplit[2];

      return {
        walletId: walletId,
        walletPrivKey: walletPrivKey,
        network: networkChar == 'T' ? 'testnet' : 'livenet',
      };
    } catch (ex) {
      throw new Error('Invalid secret');
    }
  };

  buildTx(txp: any): any {
    return Utils.buildTx(txp);
  }

  getRawTx(txp: any): any {
    let t = Utils.buildTx(txp);

    return t.uncheckedSerialize();
  };

  signTxp(txp: any, derivedXPrivKey): any {
    //Derive proper key to sign, for each input
    let privs = [];
    let derived = {};

    let xpriv = new Bitcore.HDPrivateKey(derivedXPrivKey);

    _.each(txp.inputs, function(i) {
      $.checkState(i.path, 'Input derivation path not available (signing transaction)');
      if (!derived[i.path]) {
        derived[i.path] = xpriv.deriveChild(i.path).privateKey;
        privs.push(derived[i.path]);
      }
    });

    let t = Utils.buildTx(txp);

    let signatures = _.map(privs, function(priv, i) {
      return t.getSignatures(priv);
    });

    signatures = _.map(_.sortBy(_.flatten(signatures), 'inputIndex'), function(s) {
      return s.signature.toDER().toString('hex');
    });

    return signatures;
  };

  private _signTxp(txp, password): any {
    let derived = this.credentials.getDerivedXPrivKey(password);
    return this.signTxp(txp, derived);
  };

  _getCurrentSignatures(txp: any): any {
    let acceptedActions = _.filter(txp.actions, {
      type: 'accept',
    });

    return _.map(acceptedActions, function(x: any) {
      return {
        signatures: x.signatures,
        xpub: x.xpub,
      };
    });
  };

  _addSignaturesToBitcoreTx(txp: any, t: any, signatures: any, xpub: any): any {
    if (signatures.length != txp.inputs.length)
      throw new Error('Number of signatures does not match number of inputs');

    let i = 0,
      x = new Bitcore.HDPublicKey(xpub);

    _.each(signatures, function(signatureHex) {
      let input = txp.inputs[i];
      try {
        let signature = Bitcore.crypto.Signature.fromString(signatureHex);
        let pub = x.deriveChild(txp.inputPaths[i]).publicKey;
        let s = {
          inputIndex: i,
          signature: signature,
          sigtype: Bitcore.crypto.Signature.SIGHASH_ALL,
          publicKey: pub,
        };
        t.inputs[i].addSignature(t, s);
        i++;
      } catch (e) {
      }
      ;
    });

    if (i != txp.inputs.length)
      throw new Error('Wrong signatures');
  };


  _applyAllSignatures(txp: any, t: any): any {

    $.checkState(txp.status == 'accepted');

    let sigs = this._getCurrentSignatures(txp);
    _.each(sigs, function(x) {
      this._addSignaturesToBitcoreTx(txp, t, x.signatures, x.xpub);
    });
  };

  /**
   * Join
   * @public
   *
   * @param {String} walletId
   * @param {String} walletPrivKey
   * @param {String} xPubKey
   * @param {String} requestPubKey
   * @param {String} copayerName
   * @param {Object} Optional args
   * @param {String} opts.customData
   * @param {Callback} cb
   */
  doJoinWallet(walletId: any, walletPrivKey: any, xPubKey: any, requestPubKey: any, copayerName: string, opts: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {

      // Adds encrypted walletPrivateKey to CustomData
      opts.customData = opts.customData || {};
      opts.customData.walletPrivKey = walletPrivKey.toString();
      let encCustomData = Utils.encryptMessage(JSON.stringify(opts.customData), this.credentials.personalEncryptingKey);
      let encCopayerName = Utils.encryptMessage(copayerName, this.credentials.sharedEncryptingKey);

      let args: any = {
        walletId: walletId,
        name: encCopayerName,
        xPubKey: xPubKey,
        requestPubKey: requestPubKey,
        customData: encCustomData,
      };
      if (opts.dryRun) args.dryRun = true;

      if (_.isBoolean(opts.supportBIP44AndP2PKH))
        args.supportBIP44AndP2PKH = opts.supportBIP44AndP2PKH;

      let hash = Utils.getCopayerHash(args.name, args.xPubKey, args.requestPubKey);
      args.copayerSignature = Utils.signMessage(hash, walletPrivKey);

      let url = '/v1/wallets/' + walletId + '/copayers';
      return this._doPostRequest(url, args).then((body) => {
        return this._processWallet(body.wallet).then(() => {
          return resolve(body.wallet);
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  };

  /**
   * Return if wallet is complete
   */
  isComplete(): any {
    return this.credentials && this.credentials.isComplete();
  };

  /**
   * Is private key currently encrypted?
   *
   * @return {Boolean}
   */
  isPrivKeyEncrypted(): any {
    return this.credentials && this.credentials.isPrivKeyEncrypted();
  };

  /**
   * Is private key external?
   *
   * @return {Boolean}
   */
  isPrivKeyExternal(): any {
    return this.credentials && this.credentials.hasExternalSource();
  };

  /**
   * Get external wallet source name
   *
   * @return {String}
   */
  getPrivKeyExternalSourceName(): any {
    return this.credentials ? this.credentials.getExternalSourceName() : null;
  };

  /**
   * Returns unencrypted extended private key and mnemonics
   *
   * @param password
   */
  getKeys(password: string): any {
    return this.credentials.getKeys(password);
  };


  /**
   * Checks is password is valid
   * Returns null (keys not encrypted), true or false.
   *
   * @param password
   */
  checkPassword(password: string): any {
    if (!this.isPrivKeyEncrypted()) return;

    try {
      let keys = this.getKeys(password);
      return !!keys.xPrivKey;
    } catch (e) {
      return false;
    }
    ;
  };


  /**
   * Can this credentials sign a transaction?
   * (Only returns fail on a 'proxy' setup for airgapped operation)
   *
   * @return {undefined}
   */
  canSign(): any {
    return this.credentials && this.credentials.canSign();
  };


  private _extractPublicKeyRing = function(copayers) {
    return _.map(copayers, function(copayer: any) {
      let pkr: any = _.pick(copayer, ['xPubKey', 'requestPubKey']);
      pkr.copayerName = copayer.name;
      return pkr;
    });
  };

  /**
   * sets up encryption for the extended private key
   *
   * @param {String} password Password used to encrypt
   * @param {Object} opts optional: SJCL options to encrypt (.iter, .salt, etc).
   * @return {undefined}
   */
  encryptPrivateKey(password: string, opts?: any): any {
    this.credentials.encryptPrivateKey(password, opts || this.privateKeyEncryptionOpts);
  };

  /**
   * disables encryption for private key.
   *
   * @param {String} password Password used to encrypt
   */
  decryptPrivateKey(password: string): any {
    return this.credentials.decryptPrivateKey(password);
  };

  /**
   * Get current fee levels for the specified network
   *
   * @param {string} network - 'livenet' (default) or 'testnet'
   * @returns {Callback} cb - Returns error or an object with status information
   */
  getFeeLevels(network: string = this.network || ENV.network): Promise<any> {
    (!$.checkArgument(network || _.includes(['livenet', 'testnet'], network)));

    return this._doGetRequest('/v1/feelevels', { network });
  };

  /**
   * Get fee for easy receive
   * fees for easy receive transactions are fixed and received from MWS side
   */
  getEasyReceiveFee(): Promise<any> {
    return this._doGetRequest('/v1/easy_fee/');
  };

  /**
   * Get service version
   *
   * @param {Callback} cb
   */
  getVersion(): any {
    this._doGetRequest('/v1/version/');
  };

  _checkKeyDerivation(): any {
    let isInvalid = (this.keyDerivationOk === false);
    if (isInvalid) {
      this.log.error('Key derivation for this device is not working as expected');
    }
    return !isInvalid;
  };

  /**
   *
   * Create a wallet.
   * @param {String} walletName
   * @param {String} copayerName
   * @param {Number} m
   * @param {Number} n
   * @param {object} opts (optional: advanced options)
   * @param {string} opts.network[='livenet']
   * @param {string} opts.parentAddress - A required parent address to enable this address on the network.
   * @param {String} opts.walletPrivKey - set a walletPrivKey (instead of random)
   * @param {String} opts.id - set a id for wallet (instead of server given)
   * @param cb
   * @return {undefined}
   */
  createWallet(walletName: string, copayerName: string, m: number, n: number, opts: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {

      if (!this._checkKeyDerivation()) return reject(new Error('Cannot create new wallet'));

      if (opts) $.shouldBeObject(opts);

      let network = opts.network || ENV.network;
      if (!_.includes(['testnet', 'livenet'], network)) return reject(new Error('Invalid network'));

      if (!this.credentials) {
        this.log.info('Generating new keys');
        this.seedFromRandom({
          network: network,
        });
      } else {
        this.log.info('Using existing keys');
      }

      if (network != this.credentials.network) {
        return reject(new Error('Existing keys were created for a different network'));
      }

      const walletPrivKey = opts.walletPrivKey || new Bitcore.PrivateKey(void 0, network);
      const pubkey = walletPrivKey.toPublicKey();
      this.credentials.addWalletPrivateKey(walletPrivKey.toString());
      let address = this.getRootAddress();

      const referralOpts = {
        parentAddress: opts.parentAddress,
        address: address.toString(),
        pubkey: pubkey.toString(),
        addressType: Bitcore.Address.PayToPublicKeyHashType,
        signPrivKey: walletPrivKey,
        network: network,
        alias: opts.alias,
      };

      // Create wallet
      return this.sendReferral(referralOpts).then(refid => {

        let c = this.credentials;
        let encWalletName = Utils.encryptMessage(walletName, c.sharedEncryptingKey);

        let args = {
          name: encWalletName,
          m: m,
          n: n,
          pubKey: pubkey.toString(),
          network: network,
          singleAddress: true, //daedalus wallets are single-addressed
          id: opts.id,
          parentAddress: opts.parentAddress,
          referralId: refid,
        };

        return this._doPostRequest('/v1/wallets/', args).then(res => {
          if (res) {
            let walletId = res.walletId;
            c.addWalletInfo(walletId, walletName, m, n, copayerName, opts.parentAddress);
            this.name = walletName;

            let secret = this._buildSecret(c.walletId, c.walletPrivKey, c.network);

            return this.doJoinWallet(walletId, walletPrivKey, c.xPubKey, c.requestPubKey, copayerName, {}).then(
              wallet => {
                return resolve(n > 1 ? secret : null);
              },
            );
          } else {
            return reject(Error(res));
          }
        });
      }).catch(reject);
    });
  };

  /**
   * Broadcast raw referral to network
   * @param {Object} opts
   * @param {string} opts.parentAddress    - parent address that referrs new address
   * @param {string} opts.address          - (optional) address to beacon
   * @param {number} opts.addressType      - address type: 1 - pubkey, 2 - sript, 3 - parameterizedscript
   * @param {PrivateKey} opts.signPrivKey  - private key to sign referral
   * @param {string} opts.pubkey        - (optional) pubkey of beaconing address. omitted for script
   * @param {string} opts.network          - (optional) network
   * @param {string} opts.alias          - (optional) Address alias
   */
  async sendReferral(opts?: ISendReferralOptions): Promise<any> {
    opts.network = opts.network || ENV.network;

    if (!_.includes(['testnet', 'livenet'], opts.network)) {
      throw Error('Invalid network');
    }

    if (opts.network != this.credentials.network) {
      throw Error('Existing keys were created for a different network');
    }

    if (!this.credentials) {
      this.log.info('Generating new keys');
      this.seedFromRandom({
        network: opts.network,
      });
    } else {
      this.log.info('Using existing keys');
    }

    let parentAddress = opts.parentAddress;

    try {
      // Checking if the parent is address (it could be an alias)
      Bitcore.encoding.Base58Check.decode(parentAddress);
    } catch (e) {
      // It's not an address, so let's check if it's a valid alias.
      if (!Bitcore.Referral.validateAlias(parentAddress)) {
        throw Error('Invalid invite code or alias');
      }

      // It's a valid alias, so let's get the address of that alias.
      const parentReferral = await this._doGetRequest(`/v1/referral/${parentAddress}`);
      parentAddress = parentReferral.address;
    }

    const hash = Bitcore.crypto.Hash.sha256sha256(Buffer.concat([
      Bitcore.Address.fromString(parentAddress, opts.network).toBufferLean(),
      Bitcore.Address.fromString(opts.address, opts.network).toBufferLean(),
    ]));

    const signature = Bitcore.crypto.ECDSA.sign(hash, opts.signPrivKey, 'big').toString('hex');

    // The referral constructor requires that the parentAddress is in 
    // full address form (ripe160); it should not be an alias here. 
    const referral = new Bitcore.Referral({
      parentAddress,
      address: opts.address,
      addressType: opts.addressType,
      pubkey: opts.pubkey,
      signature: signature.toString('hex'),
      alias: opts.alias,
    }, opts.network);

    return this._doPostRequest('/v1/referral/', { referral: referral.serialize() });
  };

  /**
   * Join an existing wallet
   *
   * @param {String} secret
   * @param {String} copayerName
   * @param {Object} opts
   * @param {Boolean} opts.dryRun[=false] - Simulate wallet join
   * @returns {Promise}
   */

  async joinWallet(secret: string, copayerName: string, opts: any = {}): Promise<any> {
    if (!this._checkKeyDerivation())
      throw new Error('Cannot join wallet');

    let secretData = this.parseSecret(secret);

    if (!this.credentials) {
      this.seedFromRandom({
        network: secretData.network,
      });
    }

    this.credentials.addWalletPrivateKey(secretData.walletPrivKey.toString());

    const wallet = await this.doJoinWallet(secretData.walletId, secretData.walletPrivKey, this.credentials.xPubKey, this.credentials.requestPubKey, copayerName, {
      dryRun: !!opts.dryRun,
    });

    if (!opts.dryRun) {
      this.credentials.addWalletInfo(wallet.id, wallet.name, wallet.m, wallet.n, copayerName, wallet.parentAddress);
    }

    return wallet;
  }

  /**
   * Recreates a wallet, given credentials (with wallet id)
   */
  async recreateWallet(): Promise<any> {
    $.checkState(this.credentials);
    $.checkState(this.credentials.isComplete());
    $.checkState(this.credentials.walletPrivKey);
    //$.checkState(this.credentials.hasWalletInfo());

    // First: Try to get the wallet with current credentials
    await this.getStatus({
      includeExtendedInfo: true,
    });

    let c = this.credentials;
    let walletPrivKey = Bitcore.PrivateKey.fromString(c.walletPrivKey);
    let walletId = c.walletId;
    let supportBIP44AndP2PKH = c.derivationStrategy != Constants.DERIVATION_STRATEGIES.BIP45;
    let encWalletName = Utils.encryptMessage(c.walletName || 'recovered wallet', c.sharedEncryptingKey);

    let args = {
      name: encWalletName,
      m: c.m,
      n: c.n,
      pubKey: walletPrivKey.toPublicKey().toString(),
      network: c.network,
      id: walletId,
      supportBIP44AndP2PKH,
      beacon: c.beacon,
    };

    const body = await this._doPostRequest('/v1/wallets/', args);

    if (!walletId) {
      walletId = body.walletId;
    }

    await this.addAccess({});
    await this.openWallet();

    let i = 1;

    return Promise.all(this.credentials.publicKeyRing.map((item: any) => {
      let name = item.copayerName || ('copayer ' + i++);
      return this.doJoinWallet(walletId, walletPrivKey, item.xPubKey, item.requestPubKey, name, {
        supportBIP44AndP2PKH,
      });
    }));
  };

  private async _processWallet(wallet): Promise<any> {
    let encryptingKey = this.credentials.sharedEncryptingKey;

    let name = Utils.decryptMessage(wallet.name, encryptingKey);
    if (name != wallet.name) {
      wallet.encryptedName = wallet.name;
    }
    wallet.name = name;

    wallet.copayers.forEach(copayer => {
      let name = Utils.decryptMessage(copayer.name, encryptingKey);
      if (name != copayer.name) {
        copayer.encryptedName = copayer.name;
      }
      copayer.name = name;

      copayer.requestPubKeys.forEach(access => {
        if (!access.name) return;

        let name = Utils.decryptMessage(access.name, encryptingKey);
        if (name != access.name) {
          access.encryptedName = access.name;
        }

        access.name = name;
      });
    });
  };

  private async _processStatus(status) {
    this.id = status.wallet.id;
    this.network = status.wallet.network;

    this.balance = status.balance || {};
    this.invitesBalance = status.invitesBalance || {};
    this.confirmed = (status.invitesBalance && status.invitesBalance.totalAmount > 0);
    if (this.confirmed) {
      this.availableInvites = Math.max(0, status.invitesBalance.availableConfirmedAmount - 1);
      this.pendingInvites = status.invitesBalance.availableAmount - status.invitesBalance.availableConfirmedAmount;
      if (status.invitesBalance.availableConfirmedAmount == 0) this.pendingInvites = Math.max(0, this.pendingInvites - 1);
      this.sendableInvites = Math.max(0, status.invitesBalance.availableAmount - 1);
    }
    //todo check if we use 'spendunconfirmed' options
    this.balance.spendableAmount = status.balance.totalAmount - status.balance.lockedAmount - status.balance.totalPendingCoinbaseAmount;

    const processCustomData = async (data) => {
      let copayers = data.wallet.copayers;
      if (!copayers) return;

      const me = copayers.find(copayer => copayer.id == this.credentials.copayerId);

      if (!me || !me.customData) return;

      let customData;

      try {
        customData = JSON.parse(Utils.decryptMessage(me.customData, this.credentials.personalEncryptingKey));
      } catch (e) {
        this.log.warn('Could not decrypt customData:', me.customData);
      }

      if (!customData) return;

      // Update walletPrivateKey
      if (!this.credentials.walletPrivKey && customData.walletPrivKey) {
        this.credentials.addWalletPrivateKey(customData.walletPrivKey);
      }

      // Add it to result
      return data.customData = customData;
    };

    const validateAddress = async () => {
      if (!this.rootAlias) {
        const { alias } = await this.validateAddress(this.getRootAddress().toString());
        this.rootAlias = alias;
      }
    };

    // Resolve all our async calls here, then resolve this wrapping promise.
    await Promise.all([
      processCustomData(status),
      this._processWallet(status.wallet),
      this._processTxps(status.pendingTxps),
      validateAddress(),
    ]);

    return status;
  }

  /**
   * Get latest notifications
   *
   * @param {object} opts
   * @param {String} opts.lastNotificationId (optional) - The ID of the last received notification
   * @param {String} opts.timeSpan (optional) - A time window on which to look for notifications (in seconds)
   * @param {String} opts.includeOwn[=false] (optional) - Do not ignore notifications generated by the current copayer
   * @returns {Callback} cb - Returns error or an array of notifications
   */
  // TODO: Make this return a promise of []Notifications
  getNotifications(opts: any = {}): Promise<any> {
    $.checkState(this.credentials);

    const qs: any = {};

    if (opts.lastNotificationId) {
      qs.notificationId = opts.lastNotificationId;
    } else if (opts.timeSpan) {
      qs.timeSpan = opts.timeSpan;
    }

    return this._doGetRequest('/v1/notifications/', qs);
  };

  /**
   * Get status of the wallet
   *
   * @param {Boolean} opts.twoStep[=false] - Optional: use 2-step balance computation for improved performance
   * @param {Boolean} opts.includeExtendedInfo (optional: query extended status)
   * @returns {Callback} cb - Returns error or an object with status information
   */
  async getStatus(opts: any = {}): Promise<any> {
    $.checkState(this.credentials);

    const qs = {
      includeExtendedInfo: Number(Boolean(opts.includeExtendedInfo)),
      twoStep: Number(Boolean(opts.twoStep)),
    };

    const result = await this._doGetRequest('/v1/wallets/', qs);

    if (result.wallet.status == 'pending') {
      const c = this.credentials;
      result.wallet.secret = this._buildSecret(c.walletId, c.walletPrivKey, c.network);
    }

    return this._processStatus(result);
  };

  getANV(addr?: string): Promise<any> {
    $.checkState(this.credentials);

    addr = addr || this.getRootAddress().toString();

    return this._doGetRequest('/v1/anv/', {
      network: this.credentials.network,
      keys: addr,
    });
  }

  getCommunityInfo(addr?: string) {
    $.checkState(this.credentials);

    addr = addr || this.getRootAddress().toString();

    return this._doGetRequest('/v1/communityinfo/', {
      network: this.credentials.network,
      keys: addr,
    });
  }

  getRewards(addresses?: string[]): Promise<any> {
    $.checkState(this.credentials);
    addresses = addresses || [this.getRootAddress().toString()];
    return this._doGetRequest('/v1/rewards/', {
      network: this.credentials.network,
      addresses: addresses.join(','),
    });
  }

  /**
   * Get copayer preferences
   */
  getPreferences(): Promise<any> {
    $.checkState(this.credentials);

    return this._doGetRequest('/v1/preferences/');
  };

  /**
   * Save copayer preferences
   *
   * @param {Object} preferences
   */
  savePreferences(preferences: any): Promise<any> {
    $.checkState(this.credentials);

    return this._doPutRequest('/v1/preferences/', preferences);
  };


  /**
   * fetchPayPro
   *
   * @param opts.payProUrl  URL for paypro request
   * @returns {Callback} cb - Return error or the parsed payment protocol request
   * Returns (err,paypro)
   *  paypro.amount
   *  paypro.toAddress
   *  paypro.memo
   */
  // TODO: Promisify (if we keep PayPro functionality.)
  fetchPayPro(opts: any): Promise<any> {
    $.checkArgument(opts)
      .checkArgument(opts.payProUrl);

    return PayPro.get({
      url: opts.payProUrl,
      http: this.payProHttp,
    });
  };

  /**
   * Gets list of utxos
   *
   * @param {Function} cb
   * @param {Object} opts
   * @param {Array} opts.addresses (optional) - List of addresses from where to fetch UTXOs.
   */
  getUtxos(opts: any = {}): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    let qs: any;

    if (opts.addresses && opts.addresses.length) {
      qs = {
        addresses: opts.addresses.join(','),
        invites: opts.invites,
      };
    }
    return this._doGetRequest('/v1/utxos/', qs);
  };

  _getCreateTxProposalArgs(opts: any): any {
    let args = _.cloneDeep(opts);
    args.message = this._encryptMessage(opts.message, this.credentials.sharedEncryptingKey) || null;
    args.payProUrl = opts.payProUrl || null;
    _.each(args.outputs, (o) => {
      o.message = this._encryptMessage(o.message, this.credentials.sharedEncryptingKey) || null;
    });

    return args;
  };

  /**
   * Create a transaction proposal
   *
   * @param {Object} opts
   * @param {string} opts.txProposalId - Optional. If provided it will be used as this TX proposal ID. Should be unique
   *   in the scope of the wallet.
   * @param {Array} opts.outputs - List of outputs.
   * @param {string} opts.outputs[].toAddress - Destination address.
   * @param {number} opts.outputs[].amount - Amount to transfer in micro.
   * @param {string} opts.outputs[].message - A message to attach to this output.
   * @param {string} opts.message - A message to attach to this transaction.
   * @param {number} opts.feeLevel[='normal'] - Optional. Specify the fee level for this TX ('priority', 'normal',
   *   'economy', 'superEconomy').
   * @param {number} opts.feePerKb - Optional. Specify the fee per KB for this TX (in micro).
   * @param {string} opts.changeAddress - Optional. Use this address as the change address for the tx. The address
   *   should belong to the wallet. In the case of singleAddress wallets, the first main address will be used.
   * @param {Boolean} opts.sendMax - Optional. Send maximum amount of funds that make sense under the specified
   *   fee/feePerKb conditions. (defaults to false).
   * @param {string} opts.payProUrl - Optional. Paypro URL for peers to verify TX
   * @param {Boolean} opts.excludeUnconfirmedUtxos[=false] - Optional. Do not use UTXOs of unconfirmed transactions as
   *   inputs
   * @param {Boolean} opts.validateOutputs[=true] - Optional. Perform validation on outputs.
   * @param {Boolean} opts.dryRun[=false] - Optional. Simulate the action but do not change server state.
   * @param {Array} opts.inputs - Optional. Inputs for this TX
   * @param {number} opts.fee - Optional. Use an fixed fee for this TX (only when opts.inputs is specified)
   * @param {Boolean} opts.noShuffleOutputs - Optional. If set, TX outputs won't be shuffled. Defaults to false
   */
  async createTxProposal(opts: any): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());
    $.checkState(this.credentials.sharedEncryptingKey);
    $.checkArgument(opts);

    let args = this._getCreateTxProposalArgs(opts);
    const txp = await this._doPostRequest('/v1/txproposals/', args);

    if (!txp) {
      throw new Error('Could not get transaction proposal from server.');
    }

    if (txp.code && txp.code == 'INSUFFICIENT_FUNDS') {
      throw MWCErrors.INSUFFICIENT_FUNDS;
    }

    await this._processTxps(txp);

    if (!Verifier.checkProposalCreation(args, txp, this.credentials.sharedEncryptingKey, opts.sendMax)) {
      throw MWCErrors.SERVER_COMPROMISED;
    }

    return txp;
  };

  /**
   * Publish a transaction proposal
   *
   * @param {Object} opts
   * @param {Object} opts.txp - The transaction proposal object returned by the API#createTxProposal method
   */
  async publishTxProposal(opts: any): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete(), 'no authorization data');
    $.checkArgument(opts);
    $.checkArgument(opts.txp, 'txp is required');
    $.checkState(parseInt(opts.txp.version) >= Bitcore.Transaction.CURRENT_VERSION);

    const hash = Utils.buildTx(opts.txp).uncheckedSerialize();
    const args = {
      proposalSignature: Utils.signMessage(hash, this.credentials.requestPrivKey),
    };

    try {
      return await this._doPostRequest('/v1/txproposals/' + opts.txp.id + '/publish/', args);
    } catch (err) {
      throw new Error('error in post /v1/txproposals/' + err);
    }
  };

  /**
   * Send signed referral to beacon address and unlock in MWS
   * @param {Referral} opts
   */
  async signAddressAndUnlock(opts: any = {}): Promise<any> {
    const refid: string = await this.sendReferral(opts);
    await this._doPostRequest('/v1/addresses/unlock/', {
      address: opts.address,
      parentAddress: opts.parentAddress,
      refid,
    });

    return refid;
  };

  /**
   * Sign and unlock address with root wallet address if it's not beaconed yet
   * @param {Address} address Address object to sign and beacon
   */
  signAddressAndUnlockWithRoot(address: any): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    if (address.signed) {
      return address.refid;
    }

    // try to sign address and unlock it
    // getDerivedXPrivKey gives a key derived from xPrivKey to get corresponging privkey to pubkey by path
    const signPrivKey = this.credentials.getDerivedXPrivKey('').deriveChild(address.path).privateKey;

    const unlockOpts = {
      // privKey.toPublicKey().toAddress() and privKey.toAddress() gives two different strings, but daemon treats them
      // as same string ???
      parentAddress: Bitcore.PrivateKey(this.credentials.walletPrivKey, this.credentials.network).toPublicKey().toAddress().toString(),
      address: address.address,
      pubkey: address.publicKeys[0],
      addressType: 1,
      signPrivKey,
      network: address.network,
    };

    return this.signAddressAndUnlock(unlockOpts);
  }

  /**
   * Create a new address
   *
   * @param {Object} opts
   * @param {Boolean} opts.ignoreMaxGap[=false]
   */
  async createAddress(opts: any = {}): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    if (!this._checkKeyDerivation())
      throw new Error('Cannot create new address for this wallet');

    opts.ignoreMaxGap = true;

    const address = await this._doPostRequest('/v1/addresses/', opts);

    if (!Verifier.checkAddress(this.credentials, address)) {
      throw MWCErrors.SERVER_COMPROMISED;
    }

    if (!address.signed) {
      await this.signAddressAndUnlockWithRoot(address);
    }

    return address;
  };

  /**
   * Adds access to the current copayer
   * @param {Object} opts
   * @param {bool} opts.generateNewKey Optional: generate a new key for the new access
   * @param {string} opts.restrictions
   *    - cannotProposeTXs
   *    - cannotXXX TODO
   * @param {string} opts.name  (name for the new access)
   *
   * return the accesses Wallet and the requestPrivateKey
   */
  addAccess(opts: any = {}): Promise<any> {
    $.checkState(this.credentials && this.credentials.canSign());

    let reqPrivKey = new Bitcore.PrivateKey(opts.generateNewKey ? null : this.credentials.requestPrivKey);
    let requestPubKey = reqPrivKey.toPublicKey().toString();

    let xPriv = new Bitcore.HDPrivateKey(this.credentials.xPrivKey)
      .deriveChild(this.credentials.getBaseAddressDerivationPath());
    let sig = Utils.signRequestPubKey(requestPubKey, xPriv);
    let copayerId = this.credentials.copayerId;

    let encCopayerName = opts.name ? Utils.encryptMessage(opts.name, this.credentials.sharedEncryptingKey) : null;

    opts = {
      copayerId: copayerId,
      requestPubKey: requestPubKey,
      signature: sig,
      name: encCopayerName,
      restrictions: opts.restrictions,
    };

    return this._doPutRequest('/v1/copayers/' + copayerId + '/', opts);
  };

  // Ensure that an address is in a valid format, and that it has been beaconed on the blockchain.
  validateAddress(address: string): Promise<any> {
    const url = `/v1/addresses/${address}/validate/`;
    return this._doGetRequest(url);
  };


  /**
   * Get your main addresses
   *
   * @param {Object} opts
   * @param {Boolean} opts.doNotVerify
   * @param {Numeric} opts.limit (optional) - Limit the resultset. Return all addresses by default.
   * @param {Boolean} [opts.reverse=false] (optional) - Reverse the order of returned addresses.
   */
  async getMainAddresses(opts: any = {}): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    const qs = {
      limit: opts.limit,
      reverse: opts.reverse ? 1 : 0,
    };

    const url = '/v1/addresses/';

    const addresses = await this._doGetRequest(url, qs);

    if (!opts.doNotVerify) {
      const fake = addresses.sort(address => !Verifier.checkAddress(this.credentials, address));

      if (fake) {
        throw MWCErrors.SERVER_COMPROMISED;
      }
    }

    return addresses;
  };

  /**
   * Update wallet balance
   *
   * @param {Boolean} opts.twoStep[=false] - Optional: use 2-step balance computation for improved performance
   */
  async getBalance(opts: any = {}): Promise<number> {
    $.checkState(this.credentials && this.credentials.isComplete());
    const balance = await this._doGetRequest('/v1/balance/', { twoStep: Number(Boolean(opts.twoStep)) });
    return balance.availableAmount;
  };

  /**
   * Update wallet invites balance
   */
  getInvitesBalance(): Promise<number> {
    $.checkState(this.credentials && this.credentials.isComplete());
    return this._doGetRequest('/v1/invites/');
  };

  /**
   * Get list of transactions proposals
   *
   * @param {Object} opts
   * @param {Boolean} opts.doNotVerify
   * @param {Boolean} opts.forAirGapped
   * @param {Boolean} opts.doNotEncryptPkr
   * @return {Callback} cb - Return error or array of transactions proposals
   */
  async getTxProposals(opts: any): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    let txps = await this._doGetRequest('/v1/txproposals/');

    await this._processTxps(txps);

    await Promise.all(txps.map(async (txp) => {
      if (!opts.doNotVerify) {
        // TODO: Find a way to run this check in parallel.
        const paypro = await this.getPayPro(txp);

        if (!Verifier.checkTxProposal(this.credentials, txp, { paypro })) {
          throw MWCErrors.SERVER_COMPROMISED;
        }

        return paypro;
      }
    }));

    let result: any;
    if (opts.forAirGapped) {
      result = {
        txps: JSON.parse(JSON.stringify(txps)),
        encryptedPkr: opts.doNotEncryptPkr ? null : Utils.encryptMessage(JSON.stringify(this.credentials.publicKeyRing), this.credentials.personalEncryptingKey),
        unencryptedPkr: opts.doNotEncryptPkr ? JSON.stringify(this.credentials.publicKeyRing) : null,
        m: this.credentials.m,
        n: this.credentials.n,
      };
    } else {
      result = txps;
    }
    return result;
  };

  //TODO: Refactor Paypro module to be Promisified.
  private async getPayPro(txp): Promise<any> {
    if (!txp.payProUrl || this.doNotVerifyPayPro)
      return;

    const paypro = await PayPro.get({
      url: txp.payProUrl,
      http: this.payProHttp,
    });

    if (!paypro) {
      throw new Error('Cannot check paypro transaction now.');
    }
    return paypro;
  };

  /**
   * Sign a transaction proposal
   * @param {Object} txp
   * @param {String} password - (optional) A password to decrypt the encrypted private key (if encryption is set).
   */
  async signTxProposal(txp: any, password?: string): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());
    $.checkArgument(txp.creatorId);

    if (!txp.signatures) {
      if (!this.canSign())
        throw MWCErrors.MISSING_PRIVATE_KEY;

      if (this.isPrivKeyEncrypted() && !password)
        throw MWCErrors.ENCRYPTED_PRIVATE_KEY;
    }

    const paypro = await this.getPayPro(txp);

    let isLegit = Verifier.checkTxProposal(this.credentials, txp, { paypro });

    if (!isLegit)
      throw MWCErrors.SERVER_COMPROMISED;

    let signatures = txp.signatures;

    if (_.isEmpty(signatures)) {
      signatures = this._signTxp(txp, password);
    }

    const url = '/v1/txproposals/' + txp.id + '/signatures/';
    const args = {
      signatures,
    };

    txp = await this._doPostRequest(url, args);
    await this._processTxps(txp);
    return txp;
  }

  /**
   * Sign transaction proposal from AirGapped
   *
   * @param {Object} txp
   * @param {String} encryptedPkr
   * @param {Number} m
   * @param {Number} n
   * @param {String} password - (optional) A password to decrypt the encrypted private key (if encryption is set).
   * @return {Object} txp - Return transaction
   */
  signTxProposalFromAirGapped(txp: any, encryptedPkr: string, m: number, n: number, password: string): Promise<any> {
    $.checkState(this.credentials);
    if (!this.canSign())
      throw MWCErrors.MISSING_PRIVATE_KEY;

    if (this.isPrivKeyEncrypted() && !password)
      throw MWCErrors.ENCRYPTED_PRIVATE_KEY;

    let publicKeyRing;
    try {
      publicKeyRing = JSON.parse(Utils.decryptMessage(encryptedPkr, this.credentials.personalEncryptingKey));
    } catch (ex) {
      throw new Error('Could not decrypt key ring');
    }

    if (!_.isArray(publicKeyRing) || publicKeyRing.length != n) {
      throw new Error('Invalid key ring');
    }

    this.credentials.m = m;
    this.credentials.n = n;
    this.credentials.addressType = txp.addressType;
    this.credentials.addPublicKeyRing(publicKeyRing);

    if (!Verifier.checkTxProposalSignature(this.credentials, txp))
      throw new Error('Fake transaction proposal');

    return this._signTxp(txp, password);
  };


  /**
   * Reject a transaction proposal
   *
   * @param {Object} txp
   * @param {String} reason
   */
  async rejectTxProposal(txp: any, reason: any): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    const url = '/v1/txproposals/' + txp.id + '/rejections/';
    const args = {
      reason: this._encryptMessage(reason, this.credentials.sharedEncryptingKey) || '',
    };

    txp = await this._doPostRequest(url, args);
    await this._processTxps(txp);

    return txp;
  }

  /**
   * Broadcast raw transaction
   *
   * @param {Object} opts
   * @param {String} opts.network
   * @param {String} opts.rawTx
   * @param {Callback} cb
   * @return {Callback} cb - Return error or txid
   */
  broadcastRawTx(opts?: any): Promise<any> {
    $.checkState(this.credentials);
    opts = opts || {};

    const url = '/v1/broadcast_raw/';
    return this._doPostRequest(url, opts);
  };

  private async _doBroadcast(txp: any): Promise<any> {
    const url = '/v1/txproposals/' + txp.id + '/broadcast/';
    txp = await this._doPostRequest(url);
    await this._processTxps(txp);

    return txp;
  };

  /**
   * Broadcast a transaction proposal
   *
   * @param {Object} txp
   */
  async broadcastTxProposal(txp: any): Promise<any> {
    this.log.warn('Inside broadCastTxProposal');
    $.checkState(this.credentials && this.credentials.isComplete());

    if (_.isArray(txp))
      txp = txp[0];

    await this.signAddressAndUnlockWithRoot(txp.changeAddress);
    const paypro = await this.getPayPro(txp);

    if (paypro) {
      this.log.warn('WE ARE PAYPRO');
      let t = Utils.buildTx(txp);
      this._applyAllSignatures(txp, t);

      await PayPro.send({
        http: this.payProHttp,
        url: txp.payProUrl,
        amountMicros: txp.amount,
        refundAddr: txp.changeAddress.address,
        merchant_data: paypro.merchant_data,
        rawTx: t.serialize({
          disableSmallFees: true,
          disableLargeFees: true,
          disableDustOutputs: true,
        }),
      });
    }

    return this._doBroadcast(txp);
  };

  /**
   * Remove a transaction proposal
   * @param {Object} txp
   */
  removeTxProposal(txp: any): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());
    return this._doDeleteRequest('/v1/txproposals/' + txp.id);
  };

  /**
   * Get transaction history
   *
   * @param {Object} opts
   * @param {Number} opts.skip (defaults to 0)
   * @param {Number} opts.limit
   * @param {Boolean} opts.includeExtendedInfo
   * @param {Callback} cb
   * @return {Callback} cb - Return error or array of transactions
   */
  async getTxHistory(opts: any): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    const qs = {
      skip: opts.skip,
      limit: opts.limit,
      includeExtendedInfo: Number(Boolean(opts.includeExtendedInfo)),
    };

    const url = '/v1/txhistory/';
    const txps = await this._doGetRequest(url, qs);
    await this._processTxps(txps);

    return txps;
  }

  async getTx(id: any): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    const txp = await this._doGetRequest('/v1/txproposals/' + id);
    await this._processTxps(txp);

    return txp;
  };

  /**
   * Start an address scanning process.
   * When finished, the scanning process will send a notification 'ScanFinished' to all copayers.
   *
   * @param {Object} opts
   * @param {Boolean} opts.includeCopayerBranches (defaults to false)
   * @param {Callback} cb
   */
  startScan(opts?: any): Promise<any> {
    opts = opts || {};
    $.checkState(this.credentials && this.credentials.isComplete());
    const args = {
      includeCopayerBranches: opts.includeCopayerBranches,
    };
    return this._doPostRequest('/v1/addresses/scan', args);
  };

  /**
   * Get a note associated with the specified txid
   * @param {Object} opts
   * @param {string} opts.txid - The txid to associate this note with
   */
  async getTxNote(opts: any = {}): Promise<any> {
    $.checkState(this.credentials);
    const note = await this._doGetRequest('/v1/txnotes/' + opts.txid + '/');
    return this._processTxNotes(note);
  }

  /**
   * Edit a note associated with the specified txid
   * @param {Object} opts
   * @param {string} opts.txid - The txid to associate this note with
   * @param {string} opts.body - The contents of the note
   */
  async editTxNote(opts: any = {}): Promise<any> {
    $.checkState(this.credentials);
    if (opts.body) {
      opts.body = this._encryptMessage(opts.body, this.credentials.sharedEncryptingKey);
    }

    const note = await this._doPutRequest('/v1/txnotes/' + opts.txid + '/', opts);
    return this._processTxNotes(note);
  };

  /**
   * Get all notes edited after the specified date
   * @param {Object} opts
   * @param {string} opts.minTs - The starting timestamp
   */
  async getTxNotes(opts: any = {}): Promise<any> {
    $.checkState(this.credentials);

    const notes = await this._doGetRequest('/v1/txnotes/', { minTs: opts.minTs });

    return this._processTxNotes(notes);
  }

  /**
   * Returns exchange rate for the specified currency & timestamp.
   * @param {Object} opts
   * @param {string} opts.code - Currency ISO code.
   * @param {Date} [opts.ts] - A timestamp to base the rate on (default Date.now()).
   * @param {String} [opts.provider] - A provider of exchange rates (default 'BitPay').
   * @returns {Object} rates - The exchange rate.
   */
  getFiatRate(opts: any = {}): Promise<any> {
    $.checkState(this.credentials);
    return this._doGetRequest('/v1/fiatrates/' + opts.code + '/', {
      ts: opts.ts,
      provider: opts.provider,
    });
  }

  /**
   * Get all rates
   * @returns {Promise<any>}
   */
  getRates(): Promise<any> {
    return this._doGetRequest('/v1/rates');
  }

  /**
   * Subscribe to push notifications.
   * @param {Object} opts
   * @param {String} opts.type - Device type (ios or android).
   * @param {String} opts.token - Device token.
   * @returns {Object} response - Status of subscription.
   */
  pushNotificationsSubscribe(opts: any): Promise<any> {
    const url = '/v1/pushnotifications/subscriptions/';
    return this._doPostRequest(url, opts);
  };

  /**
   * Unsubscribe from push notifications.
   * @param {String} token - Device token
   * @return {Callback} cb - Return error if exists
   */
  pushNotificationsUnsubscribe(token: string): Promise<any> {
    const url = '/v1/pushnotifications/subscriptions/' + token;
    return this._doDeleteRequest(url);
  };

  smsNotificationsSubscribe(phoneNumber: string, platform: string, settings: ISmsNotificationSettings) {
    return this._doPostRequest('/v1/sms-notifications', {
      phoneNumber,
      platform,
      walletId: this.id,
      settings,
    });
  }

  smsNotificationsUnsubscribe() {
    return this._doDeleteRequest('/v1/sms-notifications');
  }

  getSmsNotificationSubscription() {
    return this._doGetRequest('/v1/sms-notifications');
  }

  /**
   * Listen to a tx for its first confirmation.
   * @param {Object} opts
   * @param {String} opts.txid - The txid to subscribe to.
   * @returns {Object} response - Status of subscription.
   */
  txConfirmationSubscribe(opts: any): Promise<any> {
    const url = '/v1/txconfirmations/';
    return this._doPostRequest(url, opts);
  };

  /**
   * Stop listening for a tx confirmation.
   * @param {String} txid - The txid to unsubscribe from.
   */
  txConfirmationUnsubscribe(txid: string): Promise<any> {
    const url = '/v1/txconfirmations/' + txid;
    return this._doDeleteRequest(url);
  };

  /**
   * Returns send max information.
   * @param {String} opts
   * @param {number} opts.feeLevel[='normal'] - Optional. Specify the fee level ('priority', 'normal', 'economy',
   *   'superEconomy').
   * @param {number} opts.feePerKb - Optional. Specify the fee per KB (in micro).
   * @param {Boolean} opts.excludeUnconfirmedUtxos - Indicates it if should use (or not) the unconfirmed utxos
   * @param {Boolean} opts.returnInputs - Indicates it if should return (or not) the inputs
   */
  getSendMaxInfo(opts: any = {}): Promise<any> {
    return this._doGetRequest('/v1/sendmaxinfo/', {
      feeLevel: opts.feeLevel,
      feePerKb: opts.feePerKb,
      excludeUnconfirmedUtxos: Number(Boolean(opts.excludeUnconfirmedUtxos)),
      returnInputs: Number(Boolean(opts.returnInputs)),
    });
  };

  /**
   * Get wallet status based on a string identifier (one of: walletId, address, txid)
   *
   * @param {string} opts.identifier - The identifier
   * @param {Boolean} opts.twoStep[=false] - Optional: use 2-step balance computation for improved performance
   * @param {Boolean} opts.includeExtendedInfo (optional: query extended status)
   */
  async getStatusByIdentifier(opts: any = {}): Promise<any> {
    $.checkState(this.credentials);

    const qs = {
      includeExtendedInfo: Number(Boolean(opts.includeExtendedInfo)),
      twoStep: Number(Boolean(opts.twoStep)),
    };

    const result = await this._doGetRequest('/v1/wallets/', qs);

    if (!result || !result.wallet)
      throw new Error('Could not get status by identifier.');

    if (result.wallet.status == 'pending') {
      const { walletId, walletPrivKey, network } = this.credentials;
      result.wallet.secret = this._buildSecret(walletId, walletPrivKey, network);
    }

    await this._processStatus(result);

    return result;
  };

  referralTxConfirmationSubscribe(opts): Promise<any> {
    const url = '/v1/referraltxconfirmations/';
    return this._doPostRequest(url, opts);
  };

  referralTxConfirmationUnsubscribe(codeHash): Promise<any> {
    const url = '/v1/referraltxconfirmations/' + codeHash;
    return this._doDeleteRequest(url);
  }

  /**
   *
   * Checks the blockChain for a valid EasySend transaction that can be unlocked.
   * @param {String} scriptId The script of the easySend, generated client side
   * @param cb Callback or handler to manage response from BWS
   */
  validateEasyScript(scriptId: string): Promise<EasyReceiptResult> {
    this.log.warn('Validating: ' + scriptId);

    let url = '/v1/easyreceive/validate/' + scriptId;
    return this._doGetRequest(url);
  };

  /**
   * Vaulting
   */
  getVaults() {
    $.checkState(this.credentials);
    return this._doGetRequest('/v1/vaults/');
  };

  getVault(vaultId) {
    $.checkState(this.credentials);
    return this._doGetRequest(`/v1/vaults/${ vaultId }`);
  }

  /**
   * Updating vault info on MWS side. Coins and amount will be calculated and stored on backend
   */
  updateVaultInfo(vault) {
    $.checkState(this.credentials);

    return this._doPostRequest(`/v1/vaults/${vault._id}/update_info`, vault);
  }

  createVault(vault: any) {
    $.checkState(this.credentials);

    return this._doPostRequest('/v1/vaults/', vault);
  };

  renewVault(vault: any) {
    $.checkState(this.credentials);
    delete vault.walletClient;
    return this._doPostRequest(`/v1/vaults/${vault._id}`, vault);
  };

  getVaultTxHistory(vaultId: string, network: string): Promise<Array<any>> {
    $.checkState(this.credentials);
    return this._doGetRequest(`/v1/vaults/${vaultId}/txhistory?network=${network}`);
  };

  getDefaultFee() {
    return DEFAULT_FEE;
  }

  deliverGlobalSend(globalSend: EasySend, type: ISendMethod) {
    return this._doPostRequest('/v1/globalsend', {
      globalSend: _.pick(globalSend, ['secret', 'senderPubKey', 'senderName', 'blockTimeout', 'parentAddress', 'inviteOnly']),
      type: {
        method: type.destination,
        destination: type.value,
      },
    });
  }

  /**
   * registering global send on MWS so we can access history from any device
   */
  registerGlobalSend(easySend: EasySend) {
    $.checkState(this.credentials);
    return this._doPostRequest(`/v1/globalsend/register`, {
      scriptAddress: easySend.scriptAddress,
      globalsend: this.encryptGlobalSend(easySend),
      blockTimeout: easySend.blockTimeout,
      inviteOnly: easySend.inviteOnly,
    });
  }

  /**
   * Mark globalsend as cancelled
   */
  cancelGlobalSend(scriptAddress: string) {
    $.checkState(this.credentials);
    return this._doPostRequest(`/v1/globalsend/cancel`, { scriptAddress });
  }

  /**
   * receiving sent globalsends to add links to history and make them cancellable
   */
  async getGlobalSendHistory(): Promise<IGlobalSendHistory> {
    $.checkState(this.credentials);
    return this._doGetRequest(`/v1/globalsend/history`);
  }

  async getCommunityLeaderboard() {
    $.checkState(this.credentials);
    return this._doGetRequest('/v1/leaderboard');
  }

  async getRankInfo(): Promise<IRankInfo> {
    $.checkState(this.credentials);
    return this._doGetRequest('/v1/rank-info');
  }

  private encryptGlobalSend(easySend: EasySend) {
    return this._encryptMessage(JSON.stringify(easySend), this.credentials.personalEncryptingKey);
  }

  decryptGlobalSend(data) {
    return this._decryptMessage(data, this.credentials.personalEncryptingKey);
  }

  getInviteRequests(): Promise<IInviteRequest[]> {
    return this._doGetRequest('/v1/invite-requests');
  }

  deleteInviteRequest(id: string): Promise<void> {
    return this._doDeleteRequest('/v1/invite-requests/' + id);
  }

  async getHistory(start?: number, end?: number): Promise<IDisplayTransaction[]> {
    return this._doGetRequest('/v2/history', { start, end });
  }

  async getMempoolHistory(): Promise<IDisplayTransaction[]> {
    return this._doGetRequest('/v2/history/mempool');
  }

}
