import * as _ from 'lodash';
import { PayPro } from './paypro';
import { Verifier } from './verifier';
import { EventEmitter } from 'eventemitter3';
import { Common } from './common';
import { Logger } from "./log";
import { Credentials } from './credentials';

const log = Logger.getInstance();
const $ = require('preconditions').singleton();
let util = require('util');
let async = require('async');
let Bitcore = require('bitcore-lib');
let Mnemonic = require('bitcore-mnemonic');
let sjcl = require('sjcl');
let url = require('url');
let querystring = require('querystring');
let Stringify = require('json-stable-stringify');
let Bip38 = require('bip38');
let Errors = require('./errors');

let request = require('superagent');

let Constants = Common.Constants;
let Defaults = Common.Defaults;
let Utils = Common.Utils;

let Package = require('../package.json');

import { Promise } from 'bluebird';

/**
 * Merit Wallet Client; (re-)written in typescript.
 * TODO: 
 * 
 */

interface InitOptions { 
  request?: any;
  baseUrl?: string;
  payProHttp?: string;
  doNotVerifyPayPro?: boolean;
  timeout?: number;
  logLevel?: string;
}

export class API extends EventEmitter {
  private static BASE_URL = 'http://localhost:3232/bws/api';
  private request: any;
  private baseUrl: string;
  private payProHttp: string;
  private doNotVerifyPayPro: boolean;
  private timeout: number;
  private logLevel: string;
  private privateKeyEncryptionOpts: any = {
    iter: 10000
  };
  public credentials: any; // TODO: Make private with getters/setters
  private notificationIncludeOwn: boolean;
  private log: any;
  private lastNotificationId: string;
  private notificationsIntervalId: any;
  private keyDerivationOk: boolean;
  private session: any;

  
  constructor(opts: InitOptions) {
    super();
    this.request = opts.request || request;
    this.baseUrl = opts.baseUrl || API.BASE_URL;
    this.payProHttp = null; // Only for testing
    this.doNotVerifyPayPro = opts.doNotVerifyPayPro;
    this.timeout = opts.timeout || 50000;
    this.logLevel = opts.logLevel || 'silent';
    this.log = log; 

    log.setLevel(this.logLevel);
  }


  initNotifications(): Promise<any> {
    log.warn('DEPRECATED: use initialize() instead.');
    return this.initialize({});
  };

  // Do we need an initialize now?  Constructor should be able to handle.
  initialize(opts): Promise<any> {
    return new Promise((resolve, reject) => {
      $.checkState(this.credentials);
      this.notificationIncludeOwn = !!opts.notificationIncludeOwn;
      this._initNotifications(opts);
      return resolve();
    });
  };

  dispose(): any {
    this._disposeNotifications();
    this._logout();
  };

  _fetchLatestNotifications(interval): Promise<any> {      
      let opts:any = {
        lastNotificationId: this.lastNotificationId,
        includeOwn: this.notificationIncludeOwn,
      };
      
      if (!this.lastNotificationId) {
        opts.timeSpan = interval + 1;
      }
      
      return this.getNotifications(opts).then((notifications: any) => {
        if (notifications.length > 0) {
          this.lastNotificationId = (_.last(notifications) as any).id;
        }

        _.each(notifications, function(notification) {
          this.emit('notification', notification);
        });
      });

  }
    
  _initNotifications(opts: any = {}): any {
    const interval = opts.notificationIntervalSeconds || 5;
    const self = this;
    self.notificationsIntervalId = setInterval(function() {
      self._fetchLatestNotifications(interval).catch((err) => {
        if (err) {
          if (err instanceof Errors.NOT_FOUND || err instanceof Errors.NOT_AUTHORIZED) {
            self._disposeNotifications();
          }
        }
      });
    }, interval * 1000);
  };
  
  _disposeNotifications(): void {  
    if (this.notificationsIntervalId) {
      clearInterval(this.notificationsIntervalId);
      this.notificationsIntervalId = null;
    }
  };
  

  /**
   * Reset notification polling with new interval
   * @param {Numeric} notificationIntervalSeconds - use 0 to pause notifications
   */
  setNotificationsInterval(notificationIntervalSeconds): any {
    this._disposeNotifications();
    if (notificationIntervalSeconds > 0) {
      this._initNotifications({
        notificationIntervalSeconds: notificationIntervalSeconds
      });
    }
  };


  /**
   * Encrypt a message
   * @private
   * @static
   * @memberof Client.API
   * @param {String} message
   * @param {String} encryptingKey
   */
  private _encryptMessage = function(message, encryptingKey) {
    if (!message) return null;
    return Utils.encryptMessage(message, encryptingKey);
  };

  /**
   * Decrypt a message
   * @private
   * @static
   * @memberof Client.API
   * @param {String} message
   * @param {String} encryptingKey
   */
  private _decryptMessage = function(message, encryptingKey) {
    if (!message) return '';
    try {
      return Utils.decryptMessage(message, encryptingKey);
    } catch (ex) {
      return '<ECANNOTDECRYPT>';
    }
  };

  _processTxNotes(notes): any {

    if (!notes) return;

    var encryptingKey = this.credentials.sharedEncryptingKey;
    _.each([].concat(notes), function(note) {
      note.encryptedBody = note.body;
      note.body = this._decryptMessage(note.body, encryptingKey);
      note.encryptedEditedByName = note.editedByName;
      note.editedByName = this._decryptMessage(note.editedByName, encryptingKey);
    });
  };

  /**
   * Decrypt text fields in transaction proposals
   * @private
   * @static
   * @memberof Client.API
   * @param {Array} txps
   * @param {String} encryptingKey
   */
  _processTxps(txps): any {
    if (!txps) return;

    var encryptingKey = this.credentials.sharedEncryptingKey;
    _.each([].concat(txps), function(txp) {
      txp.encryptedMessage = txp.message;
      txp.message = this._decryptMessage(txp.message, encryptingKey) || null;
      txp.creatorName = this._decryptMessage(txp.creatorName, encryptingKey);

      _.each(txp.actions, function(action) {
        action.copayerName = this._decryptMessage(action.copayerName, encryptingKey);
        action.comment = this._decryptMessage(action.comment, encryptingKey);
        // TODO get copayerName from Credentials -> copayerId to copayerName
        // action.copayerName = null;
      });
      _.each(txp.outputs, function(output) {
        output.encryptedMessage = output.message;
        output.message = this._decryptMessage(output.message, encryptingKey) || null;
      });
      txp.hasUnconfirmedInputs = _.some(txp.inputs, function(input: any) {
        return input.confirmations == 0;
      });
      this._processTxNotes(txp.note);
    });
  };

  /**
   * Parse errors
   * @private
   * @static
   * @memberof Client.API
   * @param {Object} body
   */
  private _parseError = function(body) {
    if (!body) return;

    if (_.isString(body)) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {
          error: body
        };
      }
    }
    var ret;
    if (body.code) {
      if (Errors[body.code]) {
        ret = new Errors[body.code];
        if (body.message) ret.message = body.message;
      } else {
        ret = new Error(body.code + ': ' + body.message);
      }
    } else {
      ret = new Error(body.error || JSON.stringify(body));
    }
    log.error(ret);
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
    var message = [method.toLowerCase(), url, JSON.stringify(args)].join('|');
    return Utils.signMessage(message, privKey);
  };


  /**
   * Seed from random
   *
   * @param {Object} opts
   * @param {String} opts.network - default 'livenet'
   */
  seedFromRandom(opts): any {
    $.checkArgument(arguments.length <= 1, 'DEPRECATED: only 1 argument accepted.');
    $.checkArgument(_.isUndefined(opts) || _.isObject(opts), 'DEPRECATED: argument should be an options object.');

    opts = opts || {};
    this.credentials = Credentials.create(opts.network || 'livenet');
  };


  
  /**
   * Seed from random
   *
   * @param {Object} opts
   * @param {String} opts.passphrase
   * @param {String} opts.skipDeviceValidation
   */
  validateKeyDerivation(opts): Promise<any> {
    return new Promise((resolve, reject) => {
        
      var _deviceValidated: boolean;

      opts = opts || {};

      var c = this.credentials;

      function testMessageSigning(xpriv, xpub) {
        var nonHardenedPath = 'm/0/0';
        var message = 'Lorem ipsum dolor sit amet, ne amet urbanitas percipitur vim, libris disputando his ne, et facer suavitate qui. Ei quidam laoreet sea. Cu pro dico aliquip gubergren, in mundi postea usu. Ad labitur posidonium interesset duo, est et doctus molestie adipiscing.';
        var priv = xpriv.deriveChild(nonHardenedPath).privateKey;
        var signature = Utils.signMessage(message, priv);
        var pub = xpub.deriveChild(nonHardenedPath).publicKey;
        return Utils.verifyMessage(message, signature, pub);
      };

      function testHardcodedKeys() {
        var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
        var xpriv = Mnemonic(words).toHDPrivateKey();

        if (xpriv.toString() != 'xprv9s21ZrQH143K2jHFB1HM4GNbVaBSSnjHDQP8uBtKKTvusxMirfmKEmaUS4fkwqeoLqVVT2ShayUSmnEZNV1AKqTSESqyAFCBW8nvEqKfvGy') return false;

        xpriv = xpriv.deriveChild("m/44'/0'/0'");
        if (xpriv.toString() != 'xprv9ynVfpDwjVTeyQALCLp4EVHwonHHoE37DoUkjsj6A5vxXK1Wh6YEQVPdgdGdtvqWttM4nqgxK8kgmmRD5yfKhWGbD75JGdsDb9yMtozdVc6') return false;

        var xpub = Bitcore.HDPublicKey.fromString('xpub6Cmr5KkqZs1xBtEoJNM4bdEgMp7nCgkxb2QMYG8hiRTwQ7LfEdrUxHi7XrjNxkeuRrNSqHLXHAuwZvqoeASrp5jxjnpMa4d8PFpA9TRxVCd');
        return testMessageSigning(xpriv, xpub);
      };

      function testLiveKeys() {
        var words;
        try {
          words = c.getMnemonic();
        } catch (ex) {}

        var xpriv;
        if (words && (!c.mnemonicHasPassphrase || opts.passphrase)) {
          var m = new Mnemonic(words);
          xpriv = m.toHDPrivateKey(opts.passphrase, c.network);
        }
        if (!xpriv) {
          xpriv = new Bitcore.HDPrivateKey(c.xPrivKey);
        }
        xpriv = xpriv.deriveChild(c.getBaseAddressDerivationPath());
        var xpub = new Bitcore.HDPublicKey(c.xPubKey);

        return testMessageSigning(xpriv, xpub);
      };

      var hardcodedOk = true;
      if (!_deviceValidated && !opts.skipDeviceValidation) {
        hardcodedOk = testHardcodedKeys();
        _deviceValidated = true;
      }

      var liveOk = (c.canSign() && !c.isPrivKeyEncrypted()) ? testLiveKeys() : true;

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

    this.credentials = Credentials.createWithMnemonic(opts.network || 'livenet', opts.passphrase, opts.language || 'en', opts.account || 0);;
  };

  getMnemonic(): any {
    return this.credentials.getMnemonic();
  };

  mnemonicHasPassphrase(): any {
    return this.credentials.mnemonicHasPassphrase;
  };



  clearMnemonic(): any {
    return this.credentials.clearMnemonic();
  };


  /**
   * Seed from extended private key
   *
   * @param {String} xPrivKey
   * @param {Number} opts.account - default 0
   * @param {String} opts.derivationStrategy - default 'BIP44'
   */
  seedFromExtendedPrivateKey(xPrivKey, opts: any = {}): void {
    this.credentials = Credentials.fromExtendedPrivateKey(xPrivKey, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44, opts);
  };


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
  seedFromMnemonic(words, opts): any {
    $.checkArgument(_.isUndefined(opts) || _.isObject(opts), 'DEPRECATED: second argument should be an options object.');

    opts = opts || {};
    this.credentials = Credentials.fromMnemonic(opts.network || 'livenet', words, opts.passphrase, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44, opts);
  };

  /**
   * Seed from external wallet public key
   *
   * @param {String} xPubKey
   * @param {String} source - A name identifying the source of the xPrivKey (e.g. ledger, TREZOR, ...)
   * @param {String} entropySourceHex - A HEX string containing pseudo-random data, that can be deterministically derived from the xPrivKey, and should not be derived from xPubKey.
   * @param {Object} opts
   * @param {Number} opts.account - default 0
   * @param {String} opts.derivationStrategy - default 'BIP44'
   */
  seedFromExtendedPublicKey(xPubKey, source, entropySourceHex, opts): any {
    $.checkArgument(_.isUndefined(opts) || _.isObject(opts));

    opts = opts || {};
    this.credentials = Credentials.fromExtendedPublicKey(xPubKey, source, entropySourceHex, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
  };


  /**
   * Export wallet
   *
   * @param {Object} opts
   * @param {Boolean} opts.password
   * @param {Boolean} opts.noSign
   */
  export(opts): any {
    $.checkState(this.credentials);

    opts = opts || {};

    var output;

    var c = Credentials.fromObj(this.credentials);

    if (opts.noSign) {
      c.setNoSign();
    } else if (opts.password) {
      c.decryptPrivateKey(opts.password);
    }

    output = JSON.stringify(c.toObj());

    return output;
  };


  /**
   * Import wallet
   *
   * @param {Object} str - The serialized JSON created with #export
   */
  import(str): any {
    try {
      var credentials = Credentials.fromObj(JSON.parse(str));
      this.credentials = credentials;
    } catch (ex) {
      throw new Errors.INVALID_BACKUP;
    }
  };

  _import(): Promise<any> {
    return new Promise((resolve, reject) => {
      
      $.checkState(this.credentials);
      
      
      // First option, grab wallet info from BWS.
      this.openWallet().then((ret) => { 
        
        // Is the error other than "copayer was not found"? || or no priv key.
      if (this.isPrivKeyExternal())
      return reject(new Error('No Private Key!'));
      
      //Second option, lets try to add an access
      log.info('Copayer not found, trying to add access');
      this.addAccess({}).then(() => {
        
        return this.openWallet();
      }).catch((err) => {
          return reject(new Errors.WALLET_DOES_NOT_EXIST);
      });
    });
  });
  };

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
   * @param {String} opts.entropySourcePath - Only used if the wallet was created on a HW wallet, in which that private keys was not available for all the needed derivations
   */
  importFromMnemonic(words, opts): Promise<any> {
    return new Promise((resolve, reject) => {
      
    
      log.debug('Importing from 12 Words');


      opts = opts || {};

      function derive(nonCompliantDerivation) {
        return Credentials.fromMnemonic(opts.network || 'livenet', words, opts.passphrase, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44, {
          nonCompliantDerivation: nonCompliantDerivation,
          entropySourcePath: opts.entropySourcePath,
        });
      };

      try {
        this.credentials = derive(false);
      } catch (e) {
        log.info('Mnemonic error:', e);
        return reject(new Errors.INVALID_BACKUP);
      }

      return this._import().then((ret) => {
        return resolve(ret);
      }).then((err) => {
        if (err instanceof Errors.INVALID_BACKUP) return reject(err);
        if (err instanceof Errors.NOT_AUTHORIZED || err instanceof Errors.WALLET_DOES_NOT_EXIST) {
          var altCredentials = derive(true);
          if (altCredentials.xPubKey.toString() == this.credentials.xPubKey.toString()) return reject(err);
          this.credentials = altCredentials;
          return this._import();
        }
      });
    });
  };

  /*
  * Import from extended private key
  *
  * @param {String} xPrivKey
  * @param {Number} opts.account - default 0
  * @param {String} opts.derivationStrategy - default 'BIP44'
  * @param {Callback} cb - The callback that handles the response. It returns a flag indicating that the wallet is imported.
  */
  importFromExtendedPrivateKey(xPrivKey, opts): Promise<any> {
    log.debug('Importing from Extended Private Key');

    try {
      this.credentials = Credentials.fromExtendedPrivateKey(xPrivKey, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
    } catch (e) {
      log.info('xPriv error:', e);
      return new Promise((resolve, reject) => { reject(new Errors.INVALID_BACKUP); });
    };

    return this._import();
  };

  /**
   * Import from Extended Public Key
   *
   * @param {String} xPubKey
   * @param {String} source - A name identifying the source of the xPrivKey
   * @param {String} entropySourceHex - A HEX string containing pseudo-random data, that can be deterministically derived from the xPrivKey, and should not be derived from xPubKey.
   * @param {Object} opts
   * @param {Number} opts.account - default 0
   * @param {String} opts.derivationStrategy - default 'BIP44'
   */
  importFromExtendedPublicKey(xPubKey, source, entropySourceHex, opts): Promise<any> {
    $.checkArgument(arguments.length == 5, "DEPRECATED: should receive 5 arguments");
    $.checkArgument(_.isUndefined(opts) || _.isObject(opts));

    opts = opts || {};
    log.debug('Importing from Extended Private Key');
    try {
      this.credentials = Credentials.fromExtendedPublicKey(xPubKey, source, entropySourceHex, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
    } catch (e) {
      log.info('xPriv error:', e);
      return new Promise((resolve, reject) => { reject(new Errors.INVALID_BACKUP); });
    };

    return this._import();
  };

  decryptBIP38PrivateKey(encryptedPrivateKeyBase58, passphrase, opts): Promise<any> {
    return new Promise((resolve, reject) => {
      
      var bip38 = new Bip38();
      
      var privateKeyWif;
      try {
        privateKeyWif = bip38.decrypt(encryptedPrivateKeyBase58, passphrase);
      } catch (ex) {
        return reject(new Error('Could not decrypt BIP38 private key: ' + ex));
      }
      
      var privateKey = new Bitcore.PrivateKey(privateKeyWif, 'livenet');
      var address = privateKey.publicKey.toAddress().toString();
      var addrBuff = new Buffer(address, 'ascii');
      var actualChecksum = Bitcore.crypto.Hash.sha256sha256(addrBuff).toString('hex').substring(0, 8);
      var expectedChecksum = Bitcore.encoding.Base58Check.decode(encryptedPrivateKeyBase58).toString('hex').substring(6, 14);
      
      if (actualChecksum != expectedChecksum)
        return reject(new Error('Incorrect passphrase'));

      return resolve(privateKeyWif);
    });
  };
  
  getBalanceFromPrivateKey(privateKey): Promise<any> {
    return new Promise((resolve, reject) => {
      
      var privateKey = new Bitcore.PrivateKey(privateKey);
      var address = privateKey.publicKey.toAddress();
      return this.getUtxos({
        addresses: address.toString(),
      }).then((utxos) => {
        return resolve(_.sumBy(utxos, 'micros'));
      });
    });
  };

  buildTxFromPrivateKey(privateKey, destinationAddress, opts: any = {}): Promise<any> {

    return new Promise((resolve, reject) => {
      
      var privateKey = new Bitcore.PrivateKey(privateKey);
      var address = privateKey.publicKey.toAddress();



        this.getUtxos({
          addresses: address.toString(),
        }).then((utxos) => {
          if (!_.isArray(utxos) || utxos.length == 0) return reject(new Error('No utxos found'));
          
          var fee = opts.fee || 10000;
          var amount = _.sumBy(utxos, 'micros') - fee;
          if (amount <= 0) return reject(new Errors.INSUFFICIENT_FUNDS);
  
          var tx;
          try {
            var toAddress = Bitcore.Address.fromString(destinationAddress);
  
            tx = new Bitcore.Transaction()
              .from(utxos)
              .to(toAddress, amount)
              .fee(fee)
              .sign(privateKey);
  
            // Make sure the tx can be serialized
            tx.serialize();
  
          } catch (ex) {
            log.error('Could not build transaction from private key', ex);
            reject(new Errors.COULD_NOT_BUILD_TRANSACTION);
          }
          return resolve(tx);
        });
      });
    
  };

  /**
   * Create an easySend script and create a transaction to the script address
   *
   * @param {Object}      opts
   * @param {string}      opts.passphrase       - optional password to generate receiver's private key
   * @param {number}      opts.timeout          - maximum depth transaction is redeemable by receiver
   * @param {string}      opts.walletPassword   - maximum depth transaction is redeemable by receiver
   * @param {Callback}    cb
   */
  buildEasySendScript(opts:any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      
      let result:any = {}
      return this.createAddress({}).then((addr) => {
        if (addr.publicKeys.length < 1) {
          reject(Error('Error creating an address for easySend'));
        }
        var pubKey = Bitcore.PublicKey.fromString(addr.publicKeys[0]);

        // {key, secret}
        var network = opts.network || 'livenet';
        var rcvPair = Bitcore.PrivateKey.forNewEasySend(opts.passphrase, network);
        
        var pubKeys = [
          rcvPair.key.publicKey.toBuffer(),
          pubKey.toBuffer()
        ];
        
        var timeout = opts.timeout || 1008;
        var script = Bitcore.Script.buildEasySendOut(pubKeys, timeout, network);
        
        result = {
          receiverPubKey: rcvPair.key.publicKey,
          script: script.toScriptHashOut(),
          senderPubKey: pubKey.toString(),
          secret: rcvPair.secret.toString('hex')
        };

        resolve(result);
      });
        
    });
  }

  /**
   * Creates a transaction to redeem an easy send transaction. The input param
   * must contain
   *    {
   *      txn: <transaction info from getinputforeasysend cli call>,
   *      privateKey: <private key used to sign script>,
   *      publicKey: <pub key of the private key>,
   *      script: <easysend script to redeem>,
   *      scriptId: <Address used script>
   *    }
   *
   * input.txn contains
   *     {
   *      amount: <amount in MRT to redeem>,
   *      index: <index of unspent transaction>,
   *      txid: <id of transaction associated with the scriptId>
   *     }
   * @param {input} Input described above.
   * @param {destinationAddress} Address to put the funds into.
   */
  buildEasySendRedeemTransaction(input, destinationAddress, opts): any {
    //TODO: Create and sign a transaction to redeem easy send. Use input as
    //unspent Txo and use script to create scriptSig
    opts = opts || {};

    var inputAddress = input.txn.scriptId;

    var fee = opts.fee || 10000;
    var microAmount = Bitcore.Unit.fromMRT(input.txn.amount).toMicros();
    var amount =  microAmount - fee;
    if (amount <= 0) return new Errors.INSUFFICIENT_FUNDS;

    var tx = new Bitcore.Transaction();

    try {
      var toAddress = Bitcore.Address.fromString(destinationAddress);
      var p2shScript = input.script.toScriptHashOut();

      tx.addInput(
        new Bitcore.Transaction.Input.PayToScriptHashInput({
          output: Bitcore.Transaction.Output.fromObject({
            script: p2shScript,
            micros: microAmount
          }),
          prevTxId: input.txn.txid,
          outputIndex: input.txn.index,
          script: input.script
        }, input.script, p2shScript));

      tx.to(toAddress, amount)
      tx.fee(fee)

      var sig = Bitcore.Transaction.Sighash.sign(tx, input.privateKey, Bitcore.crypto.Signature.SIGHASH_ALL, 0, input.script);
      var inputScript = Bitcore.Script.buildEasySendIn(sig, input.script);

      tx.inputs[0].setScript(inputScript);

      // Make sure the tx can be serialized
      tx.serialize();

    } catch (ex) {
      log.error('Could not build transaction from private key', ex);
      return new Errors.COULD_NOT_BUILD_TRANSACTION;
    }
    return tx;
  };

  /**
   * Open a wallet and try to complete the public key ring.
   *
   * @param {Callback} cb - The callback that handles the response. It returns a flag indicating that the wallet is complete.
   * @fires API#walletCompleted
   */
  openWallet(): Promise<any> {
    return new Promise((resolve, reject) => {
    
      $.checkState(this.credentials);
      if (this.credentials.isComplete() && this.credentials.hasWalletInfo())
        return resolve(true); // wallet is already open

      return this._doGetRequest('/v1/wallets/?includeExtendedInfo=1').then((ret) => {
        var wallet = ret.wallet;

        this._processStatus(ret);

        if (!this.credentials.hasWalletInfo()) {
          var me:any = _.find(wallet.copayers, {
            id: this.credentials.copayerId
          });
          this.credentials.addWalletInfo(wallet.id, wallet.name, wallet.m, wallet.n, me.name, wallet.beacon, wallet.shareCode);
        }

        if (wallet.status != 'complete')
          return resolve();

        if (this.credentials.walletPrivKey) {
          if (!Verifier.checkCopayers(this.credentials, wallet.copayers)) {
            return reject(new Errors.SERVER_COMPROMISED);
          }
        } else {
          // this should only happen in AIR-GAPPED flows
          log.warn('Could not verify copayers key (missing wallet Private Key)');
        }

        this.credentials.addPublicKeyRing(this._extractPublicKeyRing(wallet.copayers));

        this.emit('walletCompleted', wallet);

        return resolve(ret);
      });
    });
  };

  _getHeaders(method, url, args): any {
    var headers = {
      'x-client-version': 'MWC-' + Package.version,
    };

    return headers;
  };


  /**
   * Do an HTTP request
   * @private
   *
   * @param {Object} method
   * @param {String} url
   * @param {Object} args
   * @param {Callback} cb
   */
  _doRequest(method, url, args, useSession): Promise<any> {
    return new Promise((resolve, reject) => {
      

      var headers = this._getHeaders(method, url, args);

      if (this.credentials) {
        headers['x-identity'] = this.credentials.copayerId;

        if (useSession && this.session) {
          headers['x-session'] = this.session;
        } else {
          var reqSignature;
          var key = args._requestPrivKey || this.credentials.requestPrivKey;
          if (key) {
            delete args['_requestPrivKey'];
            reqSignature = this._signRequest(method, url, args, key);
          }
          headers['x-signature'] = reqSignature;
        }
      }

      var r = this.request[method](this.baseUrl + url);

      r.accept('json');

      _.each(headers, function(v, k) {
        if (v) r.set(k, v);
      });

      if (args) {
        if (method == 'post' || method == 'put') {
          r.send(args);

        } else {
          r.query(args);
        }
      }

      r.timeout(this.timeout);

      return r.then((res) => {
        if (!res) {
          return reject(new Errors.CONNECTION_ERROR);
        }

        if (res.body)
          log.debug(util.inspect(res.body, {
            depth: 10
          }));

        if (res.status !== 200) {
          if (res.status === 404)
            return reject(new Errors.NOT_FOUND);

          if (!res.status)
            return reject(new Errors.CONNECTION_ERROR);

          log.error('HTTP Error:' + res.status);

          if (!res.body)
            return reject(new Error(res.status));

          return reject(this._parseError(res.body));
        }

        if (res.body === '{"error":"read ECONNRESET"}')
          return reject(new Errors.ECONNRESET_ERROR(JSON.parse(res.body)));

        return resolve(res.body, res.header);
      });
    });
  };


  private _login(): Promise<any> {
    return this._doPostRequest('/v1/login', {});
  };

  private _logout(): Promise<any> {
    return this._doPostRequest('/v1/logout', {});
  };

  /**
   * Do an HTTP request
   * @private
   *
   * @param {Object} method
   * @param {String} url
   * @param {Object} args
   */
  private _doRequestWithLogin(method, url, args): Promise<any> {

    let doLogin = (): Promise<any> => {
      return new Promise((resolve, reject) => {   
        this._login().then((s) => {
          if (!s) return reject(new Errors.NOT_AUTHORIZED);
          this.session = s;
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    };

      let loginIfNeeded = (): Promise<any> => {
        return new Promise((resolve, reject) => {
          if (this.session) {
            return resolve();
          } 
          return doLogin();   
        });
      }
      

      return loginIfNeeded().then(() => {
        return this._doRequest(method, url, args, true).then((body, header) => {
          return this._doRequest(method, url, args, true);
        });
      });
};

  /**
   * Do a POST request
   * @private
   *
   * @param {String} url
   * @param {Object} args
   * @param {Callback} cb
   */
  _doPostRequest(url, args): Promise<any> {
    return this._doRequest('post', url, args, false);
};

  _doPutRequest(url, args): Promise<any> {
    return this._doRequest('put', url, args, false);
};

  /**
   * Do a GET request
   * @private
   *
   * @param {String} url
   * @param {Callback} cb
   */
  _doGetRequest(url): Promise<any> {
    url += url.indexOf('?') > 0 ? '&' : '?';
    url += 'r=' + _.random(10000, 99999);
    return this._doRequest('get', url, {}, false);
};

  _doGetRequestWithLogin(url): Promise<any> {
    url += url.indexOf('?') > 0 ? '&' : '?';
    url += 'r=' + _.random(10000, 99999);
    return this._doRequestWithLogin('get', url, {});
};

  /**
   * Do a DELETE request
   * @private
   *
   * @param {String} url
   * @param {Callback} cb
   */
  private _doDeleteRequest(url): Promise<any> {
    return this._doRequest('delete', url, {}, false);
};

  private _buildSecret = function(walletId, walletPrivKey, network) {
    if (_.isString(walletPrivKey)) {
      walletPrivKey = Bitcore.PrivateKey.fromString(walletPrivKey);
    }
    var widHex = new Buffer(walletId.replace(/-/g, ''), 'hex');
    var widBase58 = new Bitcore.encoding.Base58(widHex).toString();
    return _.padEnd(widBase58, 22, '0') + walletPrivKey.toWIF() + (network == 'testnet' ? 'T' : 'L');
  };

  parseSecret = function(secret) {
    $.checkArgument(secret);

    function split(str, indexes) {
      var parts = [];
      indexes.push(str.length);
      var i = 0;
      while (i < indexes.length) {
        parts.push(str.substring(i == 0 ? 0 : indexes[i - 1], indexes[i]));
        i++;
      };
      return parts;
    };

    try {
      var secretSplit = split(secret, [22, 74]);
      var widBase58 = secretSplit[0].replace(/0/g, '');
      var widHex = Bitcore.encoding.Base58.decode(widBase58).toString('hex');
      var walletId = split(widHex, [8, 12, 16, 20]).join('-');

      var walletPrivKey = Bitcore.PrivateKey.fromString(secretSplit[1]);
      var networkChar = secretSplit[2];

      return {
        walletId: walletId,
        walletPrivKey: walletPrivKey,
        network: networkChar == 'T' ? 'testnet' : 'livenet',
      };
    } catch (ex) {
      throw new Error('Invalid secret');
    }
  };

  getRawTx = function(txp) {
    var t = Utils.buildTx(txp);
    return t.uncheckedSerialize();
  };

  signTxp = function(txp, derivedXPrivKey) {
    //Derive proper key to sign, for each input
    var privs = [];
    var derived = {};

    var xpriv = new Bitcore.HDPrivateKey(derivedXPrivKey);

    _.each(txp.inputs, function(i) {
      $.checkState(i.path, "Input derivation path not available (signing transaction)")
      if (!derived[i.path]) {
        derived[i.path] = xpriv.deriveChild(i.path).privateKey;
        privs.push(derived[i.path]);
      }
    });

    var t = Utils.buildTx(txp);

    var signatures = _.map(privs, function(priv, i) {
      return t.getSignatures(priv);
    });

    signatures = _.map(_.sortBy(_.flatten(signatures), 'inputIndex'), function(s) {
      return s.signature.toDER().toString('hex');
    });

    return signatures;
  };

  _signTxp(txp, password): any {
    var derived = this.credentials.getDerivedXPrivKey(password);
    return this.signTxp(txp, derived);
  };

  _getCurrentSignatures(txp): any {
    var acceptedActions = _.filter(txp.actions, {
      type: 'accept'
    });

    return _.map(acceptedActions, function(x) {
      return {
        signatures: x.signatures,
        xpub: x.xpub,
      };
    });
  };

  _addSignaturesToBitcoreTx(txp, t, signatures, xpub): any {
    if (signatures.length != txp.inputs.length)
      throw new Error('Number of signatures does not match number of inputs');

    var i = 0,
      x = new Bitcore.HDPublicKey(xpub);

    _.each(signatures, function(signatureHex) {
      var input = txp.inputs[i];
      try {
        var signature = Bitcore.crypto.Signature.fromString(signatureHex);
        var pub = x.deriveChild(txp.inputPaths[i]).publicKey;
        var s = {
          inputIndex: i,
          signature: signature,
          sigtype: Bitcore.crypto.Signature.SIGHASH_ALL,
          publicKey: pub,
        };
        t.inputs[i].addSignature(t, s);
        i++;
      } catch (e) {};
    });

    if (i != txp.inputs.length)
      throw new Error('Wrong signatures');
  };


  _applyAllSignatures(txp, t): any {

    $.checkState(txp.status == 'accepted');

    var sigs = this._getCurrentSignatures(txp);
    _.each(sigs, function(x) {
      this._addSignaturesToBitcoreTx(txp, t, x.signatures, x.xpub);
    });
  };

  /**
   * Join
   * @private
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
  _doJoinWallet(walletId, walletPrivKey, xPubKey, requestPubKey, copayerName, opts:any = {}): Promise<any> {
    return new Promise((resolve, reject) => {

      // Adds encrypted walletPrivateKey to CustomData
      opts.customData = opts.customData || {};
      opts.customData.walletPrivKey = walletPrivKey.toString();
      var encCustomData = Utils.encryptMessage(JSON.stringify(opts.customData), this.credentials.personalEncryptingKey);
      var encCopayerName = Utils.encryptMessage(copayerName, this.credentials.sharedEncryptingKey);

      var args: any = {
        walletId: walletId,
        name: encCopayerName,
        xPubKey: xPubKey,
        requestPubKey: requestPubKey,
        customData: encCustomData,
      };
      if (opts.dryRun) args.dryRun = true;

      if (_.isBoolean(opts.supportBIP44AndP2PKH))
        args.supportBIP44AndP2PKH = opts.supportBIP44AndP2PKH;

      var hash = Utils.getCopayerHash(args.name, args.xPubKey, args.requestPubKey);
      args.copayerSignature = Utils.signMessage(hash, walletPrivKey);

      var url = '/v1/wallets/' + walletId + '/copayers';
      return this._doPostRequest(url, args).then((body) => {
        this._processWallet(body.wallet);
        return resolve(body.wallet);
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
  getKeys(password): any {
    return this.credentials.getKeys(password);
  };


  /**
   * Checks is password is valid
   * Returns null (keys not encrypted), true or false.
   *
   * @param password
   */
  checkPassword(password): any {
    if (!this.isPrivKeyEncrypted()) return;

    try {
      var keys = this.getKeys(password);
      return !!keys.xPrivKey;
    } catch (e) {
      return false;
    };
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
      var pkr: any = _.pick(copayer, ['xPubKey', 'requestPubKey']);
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
  encryptPrivateKey(password, opts): any {
    this.credentials.encryptPrivateKey(password, opts || this.privateKeyEncryptionOpts);
  };

  /**
   * disables encryption for private key.
   *
   * @param {String} password Password used to encrypt
   */
  decryptPrivateKey(password): any {
    return this.credentials.decryptPrivateKey(password);
  };

  /**
   * Get current fee levels for the specified network
   *
   * @param {string} network - 'livenet' (default) or 'testnet'
   * @param {Callback} cb
   * @returns {Callback} cb - Returns error or an object with status information
   */
  getFeeLevels(network): Promise<any> {

    return new Promise((resolve, reject) => {
      
      $.checkArgument(network || _.includes(['livenet', 'testnet'], network));
      
      this._doGetRequest('/v1/feelevels/?network=' + (network || 'livenet')).then((result) => {
        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    });
  };

  /**
   * Get service version
   *
   * @param {Callback} cb
   */
  getVersion(cb): any {
    this._doGetRequest('/v1/version/');
};

  _checkKeyDerivation(): any {
    var isInvalid = (this.keyDerivationOk === false);
    if (isInvalid) {
      log.error('Key derivation for this device is not working as expected');
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
   * @param {string} opts.singleAddress[=false] - The wallet will only ever have one address.
   * @param {string} opts.beacon - A required unlock code to enable this address on the network.
   * @param {String} opts.walletPrivKey - set a walletPrivKey (instead of random)
   * @param {String} opts.id - set a id for wallet (instead of server given)
   * @param cb
   * @return {undefined}
   */
  createWallet(walletName, copayerName, m, n, opts): Promise<any> {
    return new Promise((resolve, reject) => {
      

      if (!this._checkKeyDerivation()) return reject(new Error('Cannot create new wallet'));

      if (opts) $.shouldBeObject(opts);
      opts = opts || {};

      var network = opts.network || 'livenet';
      if (!_.includes(['testnet', 'livenet'], network)) return reject(new Error('Invalid network'));

      if (!this.credentials) {
        log.info('Generating new keys');
        this.seedFromRandom({
          network: network
        });
      } else {
        log.info('Using existing keys');
      }

      if (network != this.credentials.network) {
        return reject(new Error('Existing keys were created for a different network'));
      }

      var walletPrivKey = opts.walletPrivKey || new Bitcore.PrivateKey();

      var c = this.credentials;
      c.addWalletPrivateKey(walletPrivKey.toString());
      var encWalletName = Utils.encryptMessage(walletName, c.sharedEncryptingKey);

      var args = {
        name: encWalletName,
        m: m,
        n: n,
        pubKey: (new Bitcore.PrivateKey(walletPrivKey)).toPublicKey().toString(),
        network: network,
        singleAddress: !!opts.singleAddress,
        id: opts.id,
        beacon: opts.beacon,
        unlocked: opts.unlocked,
        shareCode: opts.shareCode,
      };

      // Create wallet
      return this._doPostRequest('/v1/wallets/', args).then((res) => {
        var walletId = res.walletId;
        var walletShareCode = res.shareCode;
        var walletCodeHash = res.codeHash;
        c.addWalletInfo(walletId, walletName, m, n, copayerName, opts.beacon, walletShareCode, walletCodeHash);


        var secret = this._buildSecret(c.walletId, c.walletPrivKey, c.network);

        return this._doJoinWallet(walletId, walletPrivKey, c.xPubKey, c.requestPubKey, copayerName, {}).then((wallet) => {
            return resolve(n > 1 ? secret : null);
          });
      });
    });    
  };

  /**
   * Join an existing wallet
   *
   * @param {String} secret
   * @param {String} copayerName
   * @param {Object} opts
   * @param {Boolean} opts.dryRun[=false] - Simulate wallet join
   * @param {Callback} cb
   * @returns {Callback} cb - Returns the wallet
   */
  joinWallet(secret, copayerName, opts): Promise<any> {
    return new Promise((resolve, reject) => {
      
      if (!this._checkKeyDerivation()) return reject(new Error('Cannot join wallet'));

      opts = opts || {};

      try {
        var secretData = this.parseSecret(secret);
      } catch (ex) {
        return reject(ex);
      }

      if (!this.credentials) {
        this.seedFromRandom({
          network: secretData.network
        });
      }

      this.credentials.addWalletPrivateKey(secretData.walletPrivKey.toString());
      return this._doJoinWallet(secretData.walletId, secretData.walletPrivKey, this.credentials.xPubKey, this.credentials.requestPubKey, copayerName, {
        dryRun: !!opts.dryRun,
      }).then((wallet) => {
        if (!opts.dryRun) {
          this.credentials.addWalletInfo(wallet.id, wallet.name, wallet.m, wallet.n, copayerName, wallet.beacon, wallet.shareCode);
        }
        return resolve(wallet);
      });
    });
  
  };

  /**
   * Recreates a wallet, given credentials (with wallet id)
   *
   * @returns {Callback} cb - Returns the wallet
   */
  recreateWallet(cb): Promise<any> {
    $.checkState(this.credentials);
    $.checkState(this.credentials.isComplete());
    $.checkState(this.credentials.walletPrivKey);
    //$.checkState(this.credentials.hasWalletInfo());

    // First: Try to get the wallet with current credentials
    return this.getStatus({
      includeExtendedInfo: true
    }).then(() => {
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
        supportBIP44AndP2PKH: supportBIP44AndP2PKH,
        beacon: c.beacon
      };
      

      return this._doPostRequest('/v1/wallets/', args)
      .then((body) => {
        if (!walletId) {
          walletId = body.walletId;
        }  
        return this.addAccess({});
      }).then(() => {
        return this.openWallet();
      }).then(() => {
        let i = 1;
        return Promise.each(this.credentials.publicKeyRing, function(item, next) {
          var name = item.copayerName || ('copayer ' + i++);
          return this._doJoinWallet(walletId, walletPrivKey, item.xPubKey, item.requestPubKey, name, {
            supportBIP44AndP2PKH: supportBIP44AndP2PKH
          });
        });
      });
    });
  };

  // TODO: Promisify!
  _processWallet(wallet): any {

    var encryptingKey = this.credentials.sharedEncryptingKey;

    var name = Utils.decryptMessage(wallet.name, encryptingKey);
    if (name != wallet.name) {
      wallet.encryptedName = wallet.name;
    }
    wallet.name = name;
    _.each(wallet.copayers, function(copayer) {
      var name = Utils.decryptMessage(copayer.name, encryptingKey);
      if (name != copayer.name) {
        copayer.encryptedName = copayer.name;
      }
      copayer.name = name;
      _.each(copayer.requestPubKeys, function(access) {
        if (!access.name) return;

        var name = Utils.decryptMessage(access.name, encryptingKey);
        if (name != access.name) {
          access.encryptedName = access.name;
        }
        access.name = name;
      });
    });
  };

  private _processStatus = (status): any => {

    let processCustomData = (data) => {
      var copayers = data.wallet.copayers;
      if (!copayers) return;

      var me:any = _.find(copayers, {
        'id': this.credentials.copayerId
      });
      if (!me || !me.customData) return;

      var customData;
      try {
        customData = JSON.parse(Utils.decryptMessage(me.customData, this.credentials.personalEncryptingKey));
      } catch (e) {
        log.warn('Could not decrypt customData:', me.customData);
      }
      if (!customData) return;

      // Add it to result
      data.customData = customData;

      // Update walletPrivateKey
      if (!this.credentials.walletPrivKey && customData.walletPrivKey)
        this.credentials.addWalletPrivateKey(customData.walletPrivKey);
    };

    processCustomData(status);
    this._processWallet(status.wallet);
    this._processTxps(status.pendingTxps);
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
  getNotifications(opts): Promise<any> {
    $.checkState(this.credentials);

    opts = opts || {};

    var url = '/v1/notifications/';
    if (opts.lastNotificationId) {
      url += '?notificationId=' + opts.lastNotificationId;
    } else if (opts.timeSpan) {
      url += '?timeSpan=' + opts.timeSpan;
    }

    return this._doGetRequestWithLogin(url).then((result) => {
      var notifications = _.filter(result, function(notification) {
        return opts.includeOwn || (notification.creatorId != this.credentials.copayerId);
      });

      return notifications;
    });
  };

  /**
   * Get status of the wallet
   *
   * @param {Boolean} opts.twoStep[=false] - Optional: use 2-step balance computation for improved performance
   * @param {Boolean} opts.includeExtendedInfo (optional: query extended status)
   * @returns {Callback} cb - Returns error or an object with status information
   */
  getStatus(opts:any = {}): Promise<any> {
    $.checkState(this.credentials);
    var qs = [];
    qs.push('includeExtendedInfo=' + (opts.includeExtendedInfo ? '1' : '0'));
    qs.push('twoStep=' + (opts.twoStep ? '1' : '0'));

    return this._doGetRequest('/v1/wallets/?' + qs.join('&')).then((result) => {
      if (result.wallet.status == 'pending') {
        var c = this.credentials;
        result.wallet.secret = this._buildSecret(c.walletId, c.walletPrivKey, c.network);
      }

      this._processStatus(result);
    });
  };

  getANV(addr): Promise<any> {
      $.checkState(this.credentials);

      var keys = [addr];
      var network = this.credentials.network;

      return this._doGetRequest('/v1/anv/?network=' + network + '&keys=' + keys.join(','));
  }

  getRewards(address): Promise<any> {
    $.checkState(this.credentials);
    var addresses = [address];
    var network = this.credentials.network;
    return this._doGetRequest('/v1/rewards/?network=' + network + '&addresses=' + addresses.join(','));
  }

  /**
   * Get copayer preferences
   *
   * @param {Callback} cb
   * @return {Callback} cb - Return error or object
   */
  getPreferences(cb): Promise<any> {
    $.checkState(this.credentials);
    $.checkArgument(cb);

    return this._doGetRequest('/v1/preferences/');
  };

  /**
   * Save copayer preferences
   *
   * @param {Object} preferences
   * @param {Callback} cb
   * @return {Callback} cb - Return error or object
   */
  savePreferences(preferences): Promise<any> {
    $.checkState(this.credentials);

    this._doPutRequest('/v1/preferences/', preferences);
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
  fetchPayPro(opts, cb): void {
    $.checkArgument(opts)
      .checkArgument(opts.payProUrl);

    PayPro.get({
      url: opts.payProUrl,
      http: this.payProHttp,
    }, function(err, paypro) {
      if (err)
        return cb(err);

      return cb(null, paypro);
    });
  };

  /**
   * Gets list of utxos
   *
   * @param {Function} cb
   * @param {Object} opts
   * @param {Array} opts.addresses (optional) - List of addresses from where to fetch UTXOs.
   * @returns {Callback} cb - Return error or the list of utxos
   */
  getUtxos(opts): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());
    opts = opts || {};
    var url = '/v1/utxos/';
    if (opts.addresses) {
      url += '?' + querystring.stringify({
        addresses: [].concat(opts.addresses).join(',')
      });
    }
    this._doGetRequest(url);
};

  _getCreateTxProposalArgs(opts): any {

    var args = _.cloneDeep(opts);
    args.message = this._encryptMessage(opts.message, this.credentials.sharedEncryptingKey) || null;
    args.payProUrl = opts.payProUrl || null;
    _.each(args.outputs, function(o) {
      o.message = this._encryptMessage(o.message, this.credentials.sharedEncryptingKey) || null;
    });

    return args;
  };

  /**
   * Create a transaction proposal
   *
   * @param {Object} opts
   * @param {string} opts.txProposalId - Optional. If provided it will be used as this TX proposal ID. Should be unique in the scope of the wallet.
   * @param {Array} opts.outputs - List of outputs.
   * @param {string} opts.outputs[].toAddress - Destination address.
   * @param {number} opts.outputs[].amount - Amount to transfer in micro.
   * @param {string} opts.outputs[].message - A message to attach to this output.
   * @param {string} opts.message - A message to attach to this transaction.
   * @param {number} opts.feeLevel[='normal'] - Optional. Specify the fee level for this TX ('priority', 'normal', 'economy', 'superEconomy').
   * @param {number} opts.feePerKb - Optional. Specify the fee per KB for this TX (in micro).
   * @param {string} opts.changeAddress - Optional. Use this address as the change address for the tx. The address should belong to the wallet. In the case of singleAddress wallets, the first main address will be used.
   * @param {Boolean} opts.sendMax - Optional. Send maximum amount of funds that make sense under the specified fee/feePerKb conditions. (defaults to false).
   * @param {string} opts.payProUrl - Optional. Paypro URL for peers to verify TX
   * @param {Boolean} opts.excludeUnconfirmedUtxos[=false] - Optional. Do not use UTXOs of unconfirmed transactions as inputs
   * @param {Boolean} opts.validateOutputs[=true] - Optional. Perform validation on outputs.
   * @param {Boolean} opts.dryRun[=false] - Optional. Simulate the action but do not change server state.
   * @param {Array} opts.inputs - Optional. Inputs for this TX
   * @param {number} opts.fee - Optional. Use an fixed fee for this TX (only when opts.inputs is specified)
   * @param {Boolean} opts.noShuffleOutputs - Optional. If set, TX outputs won't be shuffled. Defaults to false
   * @returns {Callback} cb - Return error or the transaction proposal
   */
  createTxProposal(opts): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());
    $.checkState(this.credentials.sharedEncryptingKey);
    $.checkArgument(opts);


    var args = this._getCreateTxProposalArgs(opts);

    return this._doPostRequest('/v1/txproposals/', args).then((txp) => {
      this._processTxps(txp);

      if (!Verifier.checkProposalCreation(args, txp, this.credentials.sharedEncryptingKey)) {
        return Promise.reject(new Errors.SERVER_COMPROMISED);
      }

      Promise.resolve(txp);
    });
  };

  /**
   * Publish a transaction proposal
   *
   * @param {Object} opts
   * @param {Object} opts.txp - The transaction proposal object returned by the API#createTxProposal method
   * @returns {Callback} cb - Return error or null
   */
  publishTxProposal(opts): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());
    $.checkArgument(opts)
      .checkArgument(opts.txp);

    $.checkState(parseInt(opts.txp.version) >= 3);


    var t = Utils.buildTx(opts.txp);
    var hash = t.uncheckedSerialize();
    var args = {
      proposalSignature: Utils.signMessage(hash, this.credentials.requestPrivKey)
    };

    var url = '/v1/txproposals/' + opts.txp.id + '/publish/';
    this._doPostRequest(url, args).then((txp) => {
      this._processTxps(txp);
      return Promise.resolve(txp);
    });
  };

  /**
   * unlock an address
   * @param {Object} opts
   * @param {String} opts.address     - the address to unlock
   * @param {String} opts.unlockcode  - the code to use to unlock opts.address
   */
  unlockAddress(opts = {}): Promise<any> {
    $.checkState(this.credentials);
    return this._doPostRequest('/v1/addresses/unlock/', opts);
  };

  /**
   * Create a new address
   *
   * @param {Object} opts
   * @param {Boolean} opts.ignoreMaxGap[=false]
   * @param {Callback} cb
   * @returns {Callback} cb - Return error or the address
   */
  createAddress(opts = {}): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    return new Promise((resolve, reject) => {
      if (!this._checkKeyDerivation()) return reject(new Error('Cannot create new address for this wallet'));
      return this._doPostRequest('/v1/addresses/', opts).then((address) => {
        if (!Verifier.checkAddress(this.credentials, address)) {
          return reject(new Errors.SERVER_COMPROMISED);
        } 
        return resolve(address);
      });
    });
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
  addAccess(opts:any = {}): Promise<any> {
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
  validateAddress(address, network): Promise<any> {
    const url = `/v1/addresses/${address}/validate/${network}`;
    return this._doGetRequest(url);
  };

}
