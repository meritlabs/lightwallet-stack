import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { EasySend } from '@merit/common/models/easy-send';
import { FiatAmount } from '@merit/common/models/fiat-amount';
import { ConfigService } from '@merit/common/services/config.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { LanguageService } from '@merit/common/services/language.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MnemonicService } from '@merit/common/services/mnemonic.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { PopupService } from '@merit/common/services/popup.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { RateService } from '@merit/common/services/rate.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { Events } from 'ionic-angular/util/events';
import { AlertController } from 'ionic-angular';
import * as _ from 'lodash';

import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/zip';
import { Observable } from 'rxjs/Observable';


function accessWallet(target, key: string, descriptor: any) {

  function askForPassword(wallet) {
    return new Promise((resolve, reject) => {
      let showPassPrompt = (highlightInvalid = false) => {
        this.alertCtrl
          .create({
            title: 'Enter spending password',
            cssClass: highlightInvalid ? 'invalid-input-prompt password-prompt' : 'password-prompt',
            inputs: [ { name: 'password', placeholder: 'Password', type: 'text' } ],
            buttons: [
              {text: 'Cancel', role: 'cancel', handler: () => { reject(); }},
              { text: 'Ok', handler: data => {
                if (!data.password) {
                  showPassPrompt(true);
                } else {
                  try {
                    wallet.decryptPrivateKey(data.password);
                    wallet.encryptPrivateKey(data.password);
                    resolve(data.password);
                  } catch (e) {
                    showPassPrompt(true);
                  }
                }
              }
              }
            ]
          }).present();
      };

      showPassPrompt();
    });
  }

  return {
    value: async function (...args:any[]) {

      let wallet = args[0];
      if (!wallet || !wallet.credentials) {
        throw new Error(`first argument of ${key} method should be type of MeritWalletClient so we can check access`);
      }

      let password = null;
      if (wallet.isPrivKeyEncrypted()) {
        try {
          password = await askForPassword.apply(this, [wallet]);
        } catch (e) {
          throw new Error('No access to wallet');
        }
      }

      if (password) {
        wallet.decryptPrivateKey(password);
        wallet.credentialsSaveAllowed = false;
      }
      try {
        var result = await descriptor.value.apply(this, args);
      } finally {
        if (password) {
          wallet.encryptPrivateKey(password);
          wallet.credentialsSaveAllowed = false;
        }
      }
      return result;
    }

  };
}


/* Refactor CheckList:
 - Bwc Error provider
 - Remove ongoingProcess provider, and handle Loading indicators in controllers
 - Decouple the tight dependencies on ProfileService; and create logical separation concerns
 - Ensure that anything returning a promise has promises through the stack.
 */
@Injectable()
export class WalletService {

  // TODO: Implement wallet model.
  private wallets: { [walletId: string]: MeritWalletClient; } = <any>{};

  // Ratio low amount warning (fee/amount) in incoming TX
  private LOW_AMOUNT_RATIO: number = 0.15;

  // Ratio of "many utxos" warning in total balance (fee/amount)
  private TOTAL_LOW_WARNING_RATIO: number = .3;

  private WALLET_STATUS_MAX_TRIES: number = 7;
  private WALLET_STATUS_DELAY_BETWEEN_TRIES: number = 1.4 * 1000;
  private SOFT_CONFIRMATION_LIMIT: number = 12;
  private SAFE_CONFIRMATIONS: number = 6;

  //private errors: any = this.bwcService.getErrors();

  constructor(private logger: LoggerService,
              private mwcService: MWCService,
              private txFormatService: TxFormatService,
              private configService: ConfigService,
              private profileService: ProfileService,
              private persistenceService: PersistenceService,
              private rateService: RateService,
              private popupService: PopupService,
              private languageService: LanguageService,
              private mnemonicService: MnemonicService,
              private easySendService: EasySendService,
              private events: Events,
              private alertCtrl: AlertController
  ) {
  }



  // Approx utxo amount, from which the uxto is economically redeemable
  getLowAmount(wallet: MeritWalletClient, feeLevels: any, nbOutputs?: number) {
    let minFee: number = this.getMinFee(wallet, feeLevels, nbOutputs);
    return (minFee / this.LOW_AMOUNT_RATIO);
  }

  getTxNote(wallet: MeritWalletClient, txid: string): Promise<any> {
    return wallet.getTxNote({
      txid: txid
    });
  }

  editTxNote(wallet: MeritWalletClient, args: any): Promise<any> {
    return wallet.editTxNote(args);
  }

  getTxp(wallet: MeritWalletClient, txpid: string): Promise<any> {
    return wallet.getTx(txpid);
  }

  async getTx(wallet: MeritWalletClient, txid: string) {
    const finish = (list: any) => {
      const tx = list.find(tx => tx.txid == txid);
      if (!tx) throw new Error('Could not get transaction');
      return tx;
    };

    if (wallet.completeHistory && wallet.completeHistory.isValid) {
      return finish(wallet.completeHistory);
    }

    return finish(await this.getTxHistory(wallet, { limitTx: txid }));
  }

  async getTxHistory(wallet: MeritWalletClient, opts?: any): Promise<any> {
    opts = opts || {};

    if (!wallet.isComplete())
      return;

    const isHistoryCached = wallet.completeHistory && wallet.completeHistory.isValid;

    if (isHistoryCached && !opts.force)
      return wallet.completeHistory;

    this.logger.debug('Updating Transaction History');

    const txs = await this.updateLocalTxHistory(wallet, opts);
    this.logger.debug('updateLocalTxHistory returns: ');
    this.logger.debug(txs);

    if (opts.limitTx)
      return txs;

    wallet.completeHistory.isValid = true;
    return wallet.completeHistory;
  }

  isEncrypted(wallet: MeritWalletClient) {
    if (_.isEmpty(wallet)) return;
    let isEncrypted = wallet.isPrivKeyEncrypted();
    if (isEncrypted) this.logger.debug('Wallet is encrypted');
    return isEncrypted;
  }



  createTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    return wallet.createTxProposal(txp);
  }

  async publishTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    if (_.isEmpty(txp) || _.isEmpty(wallet))
      throw new Error('MISSING_PARAMETER');
    try {
      return wallet.publishTxProposal({ txp });
    } catch (err) {
      throw new Error('error publishing tx: ' + err);
    }
  }

  @accessWallet
  signTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    if (!wallet || !txp)
      throw new Error('MISSING_PARAMETER');

    return wallet.signTxProposal(txp);
  }

  @accessWallet
  broadcastTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    if (_.isEmpty(txp) || _.isEmpty(wallet))
      throw new Error('MISSING_PARAMETER');

    if (txp.status != 'accepted')
      throw new Error('TX_NOT_ACCEPTED');

    return wallet.broadcastTxProposal(txp);
  }

  @accessWallet
  rejectTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    if (_.isEmpty(txp) || _.isEmpty(wallet))
      throw new Error('MISSING_PARAMETER');

    return wallet.rejectTxProposal(txp, null);
  }

  @accessWallet
  async removeTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    if (_.isEmpty(txp) || _.isEmpty(wallet))
      throw new Error('MISSING_PARAMETER');

    await wallet.removeTxProposal(txp);

    this.logger.debug('Transaction removed');
  }

  private updateRemotePreferencesFor(clients: any[], prefs: any): Promise<any> {
    return Promise.all(clients.map((wallet: any) =>
      wallet.savePreferences(prefs)
    ));
  }

  async updateRemotePreferences(clients: any[], prefs: any = {}): Promise<any> {
    if (!_.isArray(clients))
      clients = [clients];

    // Update this JIC.
    let config: any = this.configService.get();
    let walletSettings = config.wallet.settings;

    //prefs.email  (may come from arguments)
    prefs.email = config.emailNotifications.email;
    prefs.language = 'en'; // This line was hardcoded - TODO: prefs.language = uxLanguage.getCurrentLanguage();
    // prefs.unit = walletSettings.unitCode; // TODO: remove, not used

    await this.updateRemotePreferencesFor(_.clone(clients), prefs);
    this.logger.debug('Remote preferences saved');

    clients.forEach(c => {
      c.preferences = _.assign(prefs, c.preferences);
    });
  }


  // TODO add typings for `opts`
  async createWallet(opts: any) {
    const wallet = await this.doCreateWallet(opts);
    wallet.name = opts.name || 'Personal Wallet';
    await this.profileService.addWallet(wallet);
    return wallet;
  }

  // joins and stores a wallet
  async joinWallet(opts: any): Promise<any> {
    this.logger.debug('Joining Wallet:', opts);

    let walletData;

    try {
      walletData = this.mwcService.parseSecret(opts.secret);
    } catch (ex) {
      this.logger.debug(ex);
      throw new Error('Bad wallet invitation'); // TODO getTextCatalog
    }

    let wallets = await this.profileService.getWallets();
    if (wallets.find(wallet => wallet.id == walletData.walletId)) {
      throw new Error('Cannot join the same wallet more that once'); // TODO getTextCatalog
    }

    opts.networkName = walletData.network;
    this.logger.debug('Joining Wallet:', opts);

    const walletClient: any = await this.seedWallet(opts);

    await walletClient.joinWallet(opts.secret, opts.myName || 'me');

    return this.profileService.addWallet(walletClient);
  }

  getWallet(walletId: string): any {
    return this.profileService.wallets[walletId];
  };

  createDefaultWallet(parentAddress: string, alias: string) {
    const opts: any = {
      m: 1,
      n: 1,
      networkName: ENV.network,
      parentAddress,
      alias
    };
    return this.createWallet(opts);
  }

  encrypt(wallet: MeritWalletClient, password: string): Promise<any> {
    wallet.encryptPrivateKey(password, {});
    return this.profileService.updateWallet(wallet);
  };

  decrypt(wallet: MeritWalletClient, password: string) {
    return wallet.decryptPrivateKey(password);
  }

  async reject(wallet: MeritWalletClient, txp: any): Promise<any> {
    const txpr = await this.rejectTx(wallet, txp);
    return txpr;
  }

  @accessWallet
  async onlyPublish(wallet: MeritWalletClient, txp: any): Promise<any> {
    const publishedTxp = await this.publishTx(wallet, txp);
    this.events.publish('Local:Tx:Publish', publishedTxp);
  }

  @accessWallet
  async publishAndSign(wallet: MeritWalletClient, txp: any): Promise<any> {

    if (txp.status == 'pending') {
      this.logger.info('@@PS: PENDING');
    } else {
      this.logger.info('@@PS: NOT PENDING');
      txp = await this.publishTx(wallet, txp);
      this.logger.info('@@PS: AFTER PublishTx');
    }

    return this.signAndBroadcast(wallet, txp);
  }

  async getEncodedWalletInfo(wallet: MeritWalletClient, password: string): Promise<any> {
    const derivationPath = wallet.credentials.getBaseAddressDerivationPath();
    const encodingType = {
      mnemonic: 1,
      xpriv: 2,
      xpub: 3
    };
    let info: any = {};

    // not supported yet
    if (wallet.credentials.derivationStrategy != 'BIP44' || !wallet.canSign())
      throw new Error('Exporting via QR not supported for this wallet'); //TODO gettextcatalog

    const keys = this.getKeysWithPassword(wallet, password);

    if (keys.mnemonic) {
      info = {
        type: encodingType.mnemonic,
        data: keys.mnemonic
      };
    } else {
      info = {
        type: encodingType.xpriv,
        data: keys.xPrivKey
      };
    }

    return info.type + '|' + info.data + '|' + wallet.credentials.network.toLowerCase() + '|' + derivationPath + '|' + (wallet.credentials.mnemonicHasPassphrase);
  }

  getKeysWithPassword(wallet: MeritWalletClient, password: string): any {
    try {
      return wallet.getKeys(password);
    } catch (e) {
      this.logger.debug(e);
    }
  }

  async setHiddenBalanceOption(walletId: string, hideBalance: boolean): Promise<void> {
    if (this.wallets[walletId]) {
      this.wallets[walletId].balanceHidden = hideBalance;
      await this.persistenceService.setHideBalanceFlag(walletId, String(hideBalance));
    }
  }

  getProtocolHandler(wallet: MeritWalletClient): string {
    return 'merit';
  }

  /**
   * Gets the ANV for a list of addresses.
   * @param wallet
   */
  getANV(wallet: MeritWalletClient): Promise<any> {
    return wallet.getANV(wallet.getRootAddress());
  }

  /**
   * Gets the aggregate rewards for a list of addresses.
   * @param wallet
   * @returns [{address, rewards: {mining, growth}}] An array of objects, each with an 'address' and a corresponding
   *   'rewards' object that contains the 'mining' and 'growth' properties.
   */
  async getRewards(wallet: MeritWalletClient): Promise<{ address: string; rewards: { mining: number; growth: number; } }[]> {
    try {
      return await wallet.getRewards(wallet.getRootAddress());
    } catch (e) {
      return [{
        address: wallet.displayAddress,
        rewards: {
          mining: 0,
          growth: 0
        }
      }];
    }
  }


  private getSavedTxs(walletId: string): Promise<any> {
    return new Promise((resolve, reject) => {

      return this.persistenceService.getTxHistory(walletId).then((txs: any) => {
        let localTxs = [];

        if (!txs) {
          return resolve(localTxs);
        }
        ;

        try {
          localTxs = JSON.parse(txs);
        } catch (ex) {
          this.logger.warn(ex);
        }
        ;
        return resolve(_.compact(localTxs));
      }).catch((err: Error) => {
        return reject(err);
      });
    });
  }

  private getTxsFromServer(wallet: MeritWalletClient, skip: number, endingTxid: string, limit: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let res = [];

      return wallet.getTxHistory({
        skip: skip,
        limit: limit,
        includeExtendedInfo: true
      }).then((txsFromServer: Array<any>) => {
        if (!txsFromServer || !txsFromServer.length) {
          return resolve();
        }

        if (endingTxid) {
          res = _.takeWhile(txsFromServer, (tx) => {
            return tx.txid != endingTxid;
          });
        } else {
          res = txsFromServer;
        }

        let result = {
          res: res,
          shouldContinue: res.length >= limit
        };

        return resolve(result);
      });
    });
  }

  private async updateLocalTxHistory(wallet: MeritWalletClient, opts: any = {}) {

    opts = opts ? opts : {};
    const FIRST_LIMIT = 5;
    const LIMIT = 50;
    let requestLimit = FIRST_LIMIT;
    const walletId = wallet.credentials.walletId;
    let progressFn = opts.progressFn || function () {
    };
    let foundLimitTx = [];

    if (opts.feeLevels) {
      opts.lowAmount = this.getLowAmount(wallet, opts.feeLevels);
    }

    const fixTxsUnit = (txs: any): void => {
      if (!txs || !txs[0] || !txs[0].amountStr) return;

      const cacheCoin: string = txs[0].amountStr.split(' ')[1];

      if (cacheCoin == 'bits') {

        this.logger.debug('Fixing Tx Cache Unit to: MRT');
        _.each(txs, (tx: any) => {
          tx.amountStr = this.txFormatService.formatAmountStr(tx.amount);
          tx.feeStr = this.txFormatService.formatAmountStr(tx.fees);
        });
      }
    };

    const easySends = await this.easySendService.updatePendingEasySends(wallet);
    const txsFromLocal: any = await this.getSavedTxs(walletId);

    fixTxsUnit(txsFromLocal);

    const confirmedTxs = this.removeAndMarkSoftConfirmedTx(txsFromLocal);
    const endingTxid = confirmedTxs[0] ? confirmedTxs[0].txid : null;
    const endingTs = confirmedTxs[0] ? confirmedTxs[0].time : null;

    // First update
    progressFn(txsFromLocal, 0);
    wallet.completeHistory = this.classifyPendingTxs(txsFromLocal, easySends);

    const getNewTxs = async (newTxs: Array<any> = [], skip: number): Promise<any[]> => {

      const result = await this.getTxsFromServer(wallet, skip, endingTxid, requestLimit);

      // If we haven't bubbled up an error in the promise chain, and this is empty,
      // then we can assume there are no TXs for this wallet.
      if (!result) {
        return newTxs;
      }

      const { res } = result;
      const shouldContinue = Boolean(result.shouldContinue);

      const pTxs = await this.processNewTxs(wallet, _.compact(res));

      newTxs = newTxs.concat(pTxs);
      newTxs = this.classifyPendingTxs(newTxs, easySends);
      progressFn(newTxs.concat(txsFromLocal), newTxs.length);
      skip = skip + requestLimit;
      this.logger.debug('Syncing TXs. Got:' + newTxs.length + ' Skip:' + skip, ' EndingTxid:', endingTxid, ' Continue:', shouldContinue);

      // TODO: do not sync all history, just looking for a single TX.
      // Needs corresponding BWS method.
      if (opts.limitTx) {
        foundLimitTx = _.find(newTxs, {
          txid: opts.limitTx
        });
        if (!_.isEmpty(foundLimitTx)) {
          this.logger.debug('Found limitTX: ' + opts.limitTx);
          return [foundLimitTx];
        }
      }
      if (!shouldContinue) {
        this.logger.debug('Finished Sync: New / soft confirmed Txs: ' + newTxs.length);
        return newTxs;
      }

      requestLimit = LIMIT;
      return getNewTxs(newTxs, skip);
    };

    const txs: any[] = await Observable.defer<any[]>(() => getNewTxs([], 0))
      .retryWhen(errors =>
        errors.zip(Observable.range(1, 3))
          .mergeMap(([err, attempt]: [any, number]): Observable<any> => {
            if (err.code == MWCErrors.CONNECTION_ERROR.code || err.code == MWCErrors.SERVER_UNAVAILABLE && attempt < 3) {
              this.logger.info('Retrying history download in 5 secs...');
              // TODO: use RxJS
              return Observable.timer(5000);
            }
            this.logger.warn(err);
            return Observable.of([]);
          })
      )
      .toPromise<any[]>();

    let array: Array<any> = _.compact(txs.concat(confirmedTxs));
    let newHistory = _.uniqBy(array, 'txid');

    const updateNotes = async () => {
      if (!endingTs) return;
      this.logger.debug('Syncing notes from: ' + endingTs);
      const notes = await wallet.getTxNotes({
        minTs: endingTs
      });

      _.each(notes, (note: any) => {
        this.logger.debug('Note for ' + note.txid);
        _.each(newHistory, (tx: any) => {
          if (tx.txid == note.txid) {
            this.logger.debug('...updating note for ' + note.txid);
            tx.note = note;
          }
        });
      });
    };

    const updateLowAmount = (txs: any) => {
      if (!opts.lowAmount) return;

      _.each(txs, (tx: any) => {
        tx.lowAmount = tx.amount < opts.lowAmount;
      });
    };

    updateLowAmount(txs);

    await updateNotes();

    // <HACK>
    if (!_.isEmpty(foundLimitTx)) {
      this.logger.debug('Tx history read until limitTx: ' + opts.limitTx);
      return newHistory;
    }
    // </HACK>
    const historyToSave = JSON.stringify(newHistory);
    _.each(txs, (tx: any) => {
      tx.recent = true;
    });
    this.logger.debug('Tx History synced. Total Txs: ' + newHistory.length);

    // Final update
    if (walletId == wallet.credentials.walletId) {
      wallet.completeHistory = newHistory;
    }

    await this.persistenceService.setTxHistory(walletId, historyToSave);

    this.logger.debug('Tx History saved.');
    return newHistory;
  }


  private async processNewTxs(wallet: MeritWalletClient, txs: any): Promise<Array<any>> {
    let configGet: any = this.configService.get();
    let config: any = configGet.wallet.settings;
    let now = Math.floor(Date.now() / 1000);
    let txHistoryUnique = {};
    let ret = [];
    wallet.hasUnsafeConfirmed = false;

    await Promise.all(txs.map(async (tx: any) => {
      const pTx = await this.txFormatService.processTx(tx);
      // no future transactions...
      if (pTx.time > now)
        pTx.time = now;

      if (pTx.confirmations >= this.SAFE_CONFIRMATIONS) {
        pTx.safeConfirmed = this.SAFE_CONFIRMATIONS + '+';
      } else {
        pTx.safeConfirmed = false;
        wallet.hasUnsafeConfirmed = true;
      }

      if (pTx.note) {
        delete pTx.note.encryptedEditedByName;
        delete pTx.note.encryptedBody;
      }

      if (!txHistoryUnique[pTx.txid]) {
        ret.push(pTx);
        txHistoryUnique[pTx.txid] = true;
      } else {
        this.logger.debug('Ignoring duplicate TX in history: ' + pTx.txid);
      }
    }));

    return ret;
  }

  private removeAndMarkSoftConfirmedTx(txs: any): Array<any> {
    return _.filter(txs, (tx: any) => {
      if (tx.confirmations >= this.SOFT_CONFIRMATION_LIMIT)
        return tx;
      tx.recent = true;
    });
  }

  // Approx utxo amount, from which the uxto is economically redeemable
  private getMinFee(wallet: MeritWalletClient, feeLevels: any, nbOutputs?: number): number {
    let level: any = _.find(feeLevels[wallet.network], (levs) => {
      return levs.level == 'normal';
    });
    let lowLevelRate = parseInt((level.feePerKb / 1000).toFixed(0));

    var size = this.getEstimatedTxSize(wallet, nbOutputs);
    return size * lowLevelRate;
  }

  // https://github.com/bitpay/bitcore-wallet-service/blob/master/lib/model/txproposal.js#L243
  private getEstimatedSizeForSingleInput(wallet: MeritWalletClient): number {
    switch (wallet.credentials.addressType) {
      case 'P2PKH':
        return 147;
      default:
      case 'P2SH':
        return wallet.m * 72 + wallet.n * 36 + 44;
      case 'PP2SH':
        //TODO: Figure out a better estimate
        return 147;
    }
    ;
  }

  private getEstimatedTxSize(wallet: MeritWalletClient, nbOutputs?: number): number {
    // Note: found empirically based on all multisig P2SH inputs and within m & n allowed limits.
    nbOutputs = nbOutputs ? nbOutputs : 2; // Assume 2 outputs
    let safetyMargin = 0.02;
    let overhead = 4 + 4 + 9 + 9;
    let inputSize = this.getEstimatedSizeForSingleInput(wallet);
    let outputSize = 34;
    let nbInputs = 1; //Assume 1 input

    let size = overhead + inputSize * nbInputs + outputSize * nbOutputs;
    return parseInt((size * (1 + safetyMargin)).toFixed(0));
  }


  @accessWallet
  private signAndBroadcast(wallet: MeritWalletClient, publishedTxp: any): Promise<any> {
    this.logger.info('@@SB: ENTRY');

    return new Promise((resolve, reject) => {

      return this.signTx(wallet, publishedTxp).then((signedTxp: any) => {
        this.logger.info('@@SB: After Sign');

        if (signedTxp.status == 'accepted') {
          return this.broadcastTx(wallet, signedTxp).then((broadcastedTxp: any) => {
            this.logger.info('@@SB: AfterBroadCast');

            this.events.publish('Local:Tx:Broadcast', broadcastedTxp);
            //$rootScope.$emit('Local/TxAction', wallet.id);
            return resolve(broadcastedTxp);
          }).catch((err) => {
            return reject(err);
          });
        } else {
          this.logger.info('@@SB: ElseBlock');

          //$rootScope.$emit('Local/TxAction', wallet.id);
          this.events.publish('Local:Tx:Signed', signedTxp);
          return resolve(signedTxp);
        }
      }).catch((err) => {
        this.logger.warn('sign error:' + err);
        let msg = err && err.message ? err.message : 'The payment was created but could not be completed. Please try again from home screen'; //TODO gettextcatalog
        //$rootScope.$emit('Local/TxAction', wallet.id);
        return reject(msg);
      });
    });
  }

  // Creates a wallet on BWC/BWS
  private async doCreateWallet(opts: any): Promise<any> {
    const showOpts = _.clone(opts);
    if (showOpts.extendedPrivateKey) showOpts.extendedPrivateKey = '[hidden]';
    if (showOpts.mnemonic) showOpts.mnemonic = '[hidden]';

    this.logger.debug('Creating Wallet:', showOpts);

    const seed = async () => {
      const walletClient: MeritWalletClient = await this.seedWallet(opts);
      let name = opts.name || 'Personal Wallet'; // TODO GetTextCatalog
      let myName = opts.myName || 'me'; // TODO GetTextCatalog

      await walletClient.createWallet(name, myName, opts.m, opts.n, {
        network: opts.networkName,
        singleAddress: opts.singleAddress,
        walletPrivKey: opts.walletPrivKey,
        parentAddress: opts.parentAddress,
        alias: opts.alias
      });

      // TODO: Subscribe to ReferralTxConfirmation
      return walletClient;
    };

    return Observable.defer(() => seed())
      .retryWhen(errors =>
        errors
          .zip(Observable.range(1, 3))
          .mergeMap(([err, i]) => {
            this.logger.warn('Error creating wallet in DCW: ', err);
            if (err == MWCErrors.CONNECTION_ERROR && i < 3) {
              return Observable.timer(2000);
            }

            if (err && err.message === 'Checksum mismatch') {
              err = MWCErrors.REFERRER_INVALID;
            }

            return Observable.throw(err);
          })
      )
      .toPromise();
  }

  // TODO: Rename this.
  private async seedWallet(opts: any): Promise<MeritWalletClient> {
    opts = opts ? opts : {};
    let walletClient = this.mwcService.getClient(null, opts);
    let network = opts.networkName || ENV.network;

    if (opts.mnemonic) {
      try {
        // TODO: Type the walletClient
        return this.mnemonicService.seedFromMnemonic(opts, walletClient);
      } catch (ex) {
        this.logger.info(ex);
        throw new Error('Could not create: Invalid wallet recovery phrase'); // TODO getTextCatalog
      }
    } else if (opts.extendedPrivateKey) {
      try {
        walletClient.seedFromExtendedPrivateKey(opts.extendedPrivateKey, {
          network: network,
          account: opts.account || 0,
          derivationStrategy: opts.derivationStrategy || 'BIP44'
        });
      } catch (ex) {
        this.logger.warn(ex);
        throw new Error('Could not create using the specified extended private key'); // TODO GetTextCatalog
      }
    } else if (opts.extendedPublicKey) {
      try {
        walletClient.seedFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, {
          account: opts.account || 0,
          derivationStrategy: opts.derivationStrategy || 'BIP44'
        });
        walletClient.credentials.hwInfo = opts.hwInfo;
      } catch (ex) {
        this.logger.warn('Creating wallet from Extended Key Arg:', ex, opts);
        throw new Error('Could not create using the specified extended key'); // TODO GetTextCatalog
      }
    } else {
      let lang = this.languageService.getCurrent();
      try {
        walletClient.seedFromRandomWithMnemonic({
          network: network,
          passphrase: opts.passphrase,
          language: lang,
          account: 0
        });
      } catch (e) {
        this.logger.info('Error creating recovery phrase: ' + e.message);
        if (e.message.indexOf('language') > 0) {
          this.logger.info('Using default language for recovery phrase');
          walletClient.seedFromRandomWithMnemonic({
            network: network,
            passphrase: opts.passphrase,
            account: 0
          });
        } else {
          throw new Error(e);
        }
      }
    }
    return walletClient;
  }


  private txIsPendingEasySend(tx, easySends: EasySend[]): boolean {
    return _.includes(_.map(easySends, 'txid'), tx.txid);
  }

  private classifyPendingTxs(txs, easySends: EasySend[]) {
    return _.map(txs, (tx: any) => {
      tx.isPendingEasySend = this.txIsPendingEasySend(tx, easySends);
      return tx;
    });
  }

  async importExtendedPublicKey(opts: any): Promise<any> {
    const walletClient = this.mwcService.getClient(null, opts);

    try {
      await walletClient.importFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, {
        account: opts.account || 0,
        derivationStrategy: opts.derivationStrategy || 'BIP44'
      });

      return this.profileService.addWallet(walletClient);
    } catch (err) {
      this.logger.warn(err);
      throw new Error(err.text || 'Error while importing wallet');
    }
  }


  async importExtendedPrivateKey(xPrivKey: string, opts: any): Promise<any> {

    const walletClient = this.mwcService.getClient(null, opts);
    this.logger.debug('Importing Wallet xPrivKey');

    try {
      await walletClient.importFromExtendedPrivateKey(xPrivKey, opts);
      return this.profileService.addWallet(walletClient);
    } catch (err) {
      this.logger.warn(err);
      throw new Error(err.text || 'Error while importing wallet');
    }
  }

  async importWallet(str: string, opts: any): Promise<MeritWalletClient> {
    let walletClient = this.mwcService.getClient(null, opts);

    this.logger.debug('Importing Wallet:', opts);

    try {
      let c = JSON.parse(str);

      if (c.xPrivKey && c.xPrivKeyEncrypted) {
        this.logger.warn('Found both encrypted and decrypted key. Deleting the encrypted version');
        delete c.xPrivKeyEncrypted;
        delete c.mnemonicEncrypted;
      }

      str = JSON.stringify(c);

      walletClient.import(str);

      return this.profileService.addWallet(walletClient);
    } catch (err) {
      throw new Error('Could not import. Check input file and spending password'); // TODO getTextCatalog
    }
  }

}
