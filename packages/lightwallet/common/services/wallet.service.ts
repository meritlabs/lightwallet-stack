import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular/util/events';
import * as _ from 'lodash';
import { ENV } from '@app/env';

import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/mergeMap';
import { LoggerService } from '@merit/common/services/logger.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { ConfigService } from '@merit/common/services/config.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { RateService } from '@merit/common/services/rate.service';
import { PopupService } from '@merit/common/services/popup.service';
import { LanguageService } from '@merit/common/services/language.service';
import { MnemonicService } from '@merit/common/services/mnemonic.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { FiatAmount } from '@merit/common/models/fiat-amount';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { EasySend } from '@merit/common/models/easy-send';

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
              private events: Events) {
    this.logger.info('Hello WalletService Service');
  }

  invalidateCache(wallet: MeritWalletClient) {
    if (wallet.cachedStatus)
      wallet.cachedStatus.isValid = false;

    if (wallet.completeHistory)
      wallet.completeHistory.isValid = false;

    if (wallet.cachedActivity)
      wallet.cachedActivity.isValid = false;

    if (wallet.cachedTxps)
      wallet.cachedTxps.isValid = false;
  }

  async getStatus(wallet: MeritWalletClient, opts?: any): Promise<any> {
    opts = opts || {};
    const walletId = wallet.id;

    return new Promise((resolve, reject) => {
      let processPendingTxps = async (status: any): Promise<any> => {
        status = status || {};
        let txps = await status.pendingTxps;
        let now = Math.floor(Date.now() / 1000);

        wallet.pendingTxps = await Promise.all(txps.map(async (tx: any) => {
          const pTx = await this.txFormatService.processTx(tx);

          // no future transactions...
          if (pTx.createdOn > now)
            pTx.createdOn = now;

          pTx.wallet = wallet;

          if (!pTx.wallet) {
            this.logger.error('no wallet at pTxp?');
            return;
          }

          let action: any = _.find(pTx.actions, {
            copayerId: pTx.wallet.copayerId
          });

          if (!action && pTx.status == 'pending') {
            pTx.pendingForUs = true;
          }

          if (action && action.type == 'accept') {
            pTx.statusForUs = 'accepted';
          } else if (action && action.type == 'reject') {
            pTx.statusForUs = 'rejected';
          } else {
            pTx.statusForUs = 'pending';
          }

          if (!pTx.deleteLockTime)
            pTx.canBeRemoved = true;

          return pTx;
        }));

      };

      //TODO: Separate, clarify, and tighten usage of Rate and Tx-Format service below.
      let cacheBalance = (wallet: MeritWalletClient, status: any): Promise<any> => {
        return new Promise((resolve, reject) => {
          if (!status.balance) return resolve();

          let configGet: any = this.configService.get();
          let config: any = configGet.wallet;

          let cache = wallet.cachedStatus;

          // Address with Balance
          cache.balanceByAddress = status.balance.byAddress;

          // Total wallet balance is same regardless of 'spend unconfirmed funds' setting.
          cache.totalBalanceMicros = status.balance.totalAmount;

          if (status.invitesBalance) {
            cache.availableInvites = Math.max(0, status.invitesBalance.totalConfirmedAmount - 1);
          }

          cache.pendingCoinbaseAmount = status.balance.totalPendingCoinbaseAmount;

          // Spend unconfirmed funds
          if (config.spendUnconfirmed) {
            cache.lockedBalanceSat = status.balance.lockedAmount;
            cache.availableBalanceSat = status.balance.availableAmount;
            cache.totalBytesToSendMax = status.balance.totalBytesToSendMax;
            cache.pendingAmount = 0;
            cache.spendableAmount = status.balance.totalAmount - status.balance.lockedAmount - status.balance.totalPendingCoinbaseAmount;
          } else {
            cache.lockedBalanceSat = status.balance.lockedConfirmedAmount;
            cache.availableBalanceSat = status.balance.availableConfirmedAmount;
            cache.totalBytesToSendMax = status.balance.totalBytesToSendConfirmedMax;
            cache.pendingAmount = status.balance.totalAmount - status.balance.totalConfirmedAmount;
            cache.spendableAmount = status.balance.totalConfirmedAmount - status.balance.lockedAmount - status.balance.totalPendingCoinbaseAmount;
          }
          cache.confirmedAmount = status.balance.totalConfirmedAmount - status.balance.lockedAmount - status.balance.totalPendingCoinbaseAmount;

          // Selected unit
          cache.unitToMicro = config.settings.unitToMicro;
          cache.satToUnit = 1 / cache.unitToMicro;

          //STR
          cache.totalBalanceStr = this.txFormatService.formatAmountStr(cache.totalBalanceMicros);
          cache.lockedBalanceStr = this.txFormatService.formatAmountStr(cache.lockedBalanceSat);
          cache.availableBalanceStr = this.txFormatService.formatAmountStr(cache.availableBalanceSat);
          cache.spendableBalanceStr = this.txFormatService.formatAmountStr(cache.spendableAmount);
          cache.pendingBalanceStr = this.txFormatService.formatAmountStr(cache.pendingAmount);

          cache.alternativeName = config.settings.alternativeName;
          cache.alternativeIsoCode = config.settings.alternativeIsoCode;

          // Check address
          return this.isAddressUsed(wallet, status.balance.byAddress).then((used) => {
            if (used) {
              this.logger.debug('Address used. Creating new');
              // Force new address
              return this.getAddress(wallet, true).then((addr) => {
                this.logger.debug('New address: ', addr);
              });
            }
          }).then(() => {
            return this.rateService.whenAvailable().then(() => {

              let totalBalanceAlternative = this.rateService.fromMicrosToFiat(cache.totalBalanceMicros, cache.alternativeIsoCode);
              let totalBalanceAlternativeStr = this.rateService.fromMicrosToFiat(cache.totalBalanceMicros, cache.alternativeIsoCode);
              let pendingBalanceAlternative = this.rateService.fromMicrosToFiat(cache.pendingAmount, cache.alternativeIsoCode);
              let lockedBalanceAlternative = this.rateService.fromMicrosToFiat(cache.lockedBalanceSat, cache.alternativeIsoCode);
              let spendableBalanceAlternative = this.rateService.fromMicrosToFiat(cache.spendableAmount, cache.alternativeIsoCode);
              let alternativeConversionRate = this.rateService.fromMicrosToFiat(100000000, cache.alternativeIsoCode);

              cache.totalBalanceAlternative = new FiatAmount(totalBalanceAlternative);
              cache.totalBalanceAlternativeStr = cache.totalBalanceAlternative.amountStr;
              cache.pendingBalanceAlternative = new FiatAmount(pendingBalanceAlternative);
              cache.lockedBalanceAlternative = new FiatAmount(lockedBalanceAlternative);
              cache.spendableBalanceAlternative = new FiatAmount(spendableBalanceAlternative);
              cache.alternativeConversionRate = new FiatAmount(alternativeConversionRate);

              cache.alternativeBalanceAvailable = totalBalanceAlternative > 0;
              cache.isRateAvailable = true;
              return resolve();
            }).catch((err) => {
              // We don't want to blow up the promise chain if the rateService is down.
              // TODO: Fallback to last known conversion rate.
              this.logger.warn('Could not get rates from rateService.');
              return resolve();
            });
          }).catch((err) => {
            return reject(err);
          });
        });
      };

      let isStatusCached = (): any => {
        return wallet.cachedStatus && wallet.cachedStatus.isValid;
      };

      let cacheStatus = (status: any): Promise<any> => {
        if (status.wallet && status.wallet.scanStatus == 'running') return;

        wallet.cachedStatus = status || {};
        let cache = wallet.cachedStatus;
        cache.statusUpdatedOn = Date.now();
        cache.isValid = true;
        cache.email = status.preferences ? status.preferences.email : null;
        return cacheBalance(wallet, status);
      };

      let walletStatusHash = (status: any): any => {
        return status ? status.balance.totalAmount : wallet.totalBalanceMicros;
      };

      let _getStatus = async (initStatusHash: any, tries: number): Promise<any> => {
        return new Promise(async (resolve, reject) => {
          if (isStatusCached() && !opts.force) {
            this.logger.debug('Wallet status cache hit:' + wallet.id);
            return cacheStatus(wallet.cachedStatus).then(() => {
              return processPendingTxps(wallet.cachedStatus).then(() => {
                return resolve(wallet.cachedStatus);
              });
            }).catch((err) => {
              this.logger.debug('Error in caching status:' + err);
            });
          }

          tries = tries || 0;

          try {
            const status = await wallet.getStatus({});
            let currentStatusHash = walletStatusHash(status);
            this.logger.debug('Status update. hash:' + currentStatusHash + ' Try:' + tries);
            if (opts.untilItChanges && initStatusHash == currentStatusHash && tries < this.WALLET_STATUS_MAX_TRIES && walletId == wallet.credentials.walletId) {

              return new Promise<any>((resolve) => {
                setTimeout(() => {
                  this.logger.debug('Retrying update... ' + walletId + ' Try:' + tries);
                  resolve(_getStatus(initStatusHash, ++tries));
                }, this.WALLET_STATUS_DELAY_BETWEEN_TRIES * tries);
              });
            }


            await processPendingTxps(status);
            await cacheStatus(status);
            wallet.scanning = status.wallet && status.wallet.scanStatus == 'running';
            return resolve(status);

          } catch (err) {
            this.logger.error('Could not get the status!');
            this.logger.error(err);
            return reject(err);
          }

        });
      };

      return _getStatus(walletStatusHash(null), 0).then((status) => {
        return resolve(status);
      }).catch((err) => {
        this.logger.warn('Error getting status: ', err);
        return reject(err);
      });
    });

  }

  async getAddress(wallet: MeritWalletClient, forceNew: boolean): Promise<any> {

    const addr = await this.persistenceService.getLastAddress(wallet.id);
    if (!forceNew && addr) return addr;

    if (!wallet.isComplete())
      throw new Error('WALLET_NOT_COMPLETE');

    try {
      const address = await wallet.createAddress({});
      await this.persistenceService.storeLastAddress(wallet.id, address);
      return address;
    } catch (err) {
      if (err.code == MWCErrors.MAIN_ADDRESS_GAP_REACHED.code && !forceNew) {
        const address = await this.getMainAddress(wallet);
        await this.persistenceService.storeLastAddress(wallet.id, address);
        return address;
      }

      throw err;
    }
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

  sendInvite(wallet: MeritWalletClient, toAddress: string) {
    return wallet.sendInvite(toAddress);
  }

  createTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    return wallet.createTxProposal(txp);
  }

  async publishTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    if (_.isEmpty(txp) || _.isEmpty(wallet))
      throw new Error('MISSING_PARAMETER');
    try {
      return wallet.publishTxProposal({ txp })
    } catch (err) {
      throw new Error('error publishing tx: ' + err);
    }
  }

  signTx(wallet: MeritWalletClient, txp: any, password: string): Promise<any> {
    if (!wallet || !txp)
      throw new Error('MISSING_PARAMETER');

    return wallet.signTxProposal(txp, password);
  }

  broadcastTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    if (_.isEmpty(txp) || _.isEmpty(wallet))
      throw new Error('MISSING_PARAMETER');

    if (txp.status != 'accepted')
      throw new Error('TX_NOT_ACCEPTED');

    return wallet.broadcastTxProposal(txp);
  }

  rejectTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    if (_.isEmpty(txp) || _.isEmpty(wallet))
      throw new Error('MISSING_PARAMETER');

    return wallet.rejectTxProposal(txp, null);
  }

  async removeTx(wallet: MeritWalletClient, txp: any): Promise<any> {
    if (_.isEmpty(txp) || _.isEmpty(wallet))
      throw new Error('MISSING_PARAMETER');

    await wallet.removeTxProposal(txp);

    this.logger.debug('Transaction removed');
    this.invalidateCache(wallet);
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

  async startScan(wallet: MeritWalletClient): Promise<any> {
    this.logger.debug('Scanning wallet ' + wallet.id);
    if (!wallet.isComplete())
      throw new Error('Wallet is not complete');

    wallet.scanning = true;
    return wallet.startScan({
      includeCopayerBranches: true
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

  expireAddress(wallet: MeritWalletClient): Promise<any> {
    this.logger.debug('Cleaning Address ' + wallet.id);
    return this.persistenceService.clearLastAddress(wallet.id);
  }

  async getMainAddresses(wallet: MeritWalletClient, opts: any = {}): Promise<Array<any>> {
    opts.reverse = true;
    const addresses = await wallet.getMainAddresses(opts);
    return addresses.map(address => address.address);
  }

  getBalance(wallet: MeritWalletClient, opts: any = {}): Promise<any> {
    return wallet.getBalance(opts);
  }

  getInvitesBalance(wallet: MeritWalletClient, opts: any = {}): Promise<any> {
    return wallet.getInvitesBalance(opts);
  }

  async getLowUtxos(wallet: any, levels: any): Promise<any> {
    const resp = await wallet.getUtxos();

    if (!resp || !resp.length) throw '';

    const minFee = this.getMinFee(wallet, levels, resp.length);
    const balance = _.sumBy(resp, 'micros');

    // for 2 outputs
    const lowAmount = this.getLowAmount(wallet, levels);
    const lowUtxos = resp.filter(x => x.micros < lowAmount);

    return {
      allUtxos: resp || [],
      lowUtxos: lowUtxos || [],
      warning: minFee / balance > this.TOTAL_LOW_WARNING_RATIO,
      minFee: minFee
    };
  }

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

  isReady(wallet: MeritWalletClient): string {
    if (!wallet.isComplete())
      return 'WALLET_NOT_COMPLETE';
    if (wallet.needsBackup)
      return 'WALLET_NEEDS_BACKUP';
    return null;
  }

  encrypt(wallet: MeritWalletClient, password: string): Promise<any> {
    wallet.encryptPrivateKey(password, {});
    return this.profileService.updateWallet(wallet);
  };

  decrypt(wallet: MeritWalletClient, password: string) {
    wallet.decryptPrivateKey(password);
  }

  async handleEncryptedWallet(wallet: MeritWalletClient): Promise<any> {
    if (!this.isEncrypted(wallet)) return;
    const password: string = await this.askPassword(wallet.name, 'Enter Spending Password');

    if (!password)
      throw new Error('No password');

    if (!wallet.checkPassword(password))
      throw new Error('Wrong password');

    return password;
  }

  async reject(wallet: MeritWalletClient, txp: any): Promise<any> {
    const txpr = await this.rejectTx(wallet, txp);
    this.invalidateCache(wallet);
    return txpr;
  }

  async onlyPublish(wallet: MeritWalletClient, txp: any): Promise<any> {
    const publishedTxp = await this.publishTx(wallet, txp);
    this.invalidateCache(wallet);
    this.events.publish('Local:Tx:Publish', publishedTxp);
  }

  prepare(wallet: MeritWalletClient): Promise<any> {
    return this.handleEncryptedWallet(wallet);
    // TODO: rewrite this when integrating Fingerprint service

    // return new Promise((resolve, reject) => {
    //   return this.touchidService.checkWallet(wallet).then(() => {
    //     return this.handleEncryptedWallet(wallet).then((password: string) => {
    //       return resolve(password);
    //     }).catch((err) => {
    //       return reject(err);
    //     });
    //   }).catch((err) => {
    //     return reject(err);
    //   });
    // });
  }

  async publishAndSign(wallet: MeritWalletClient, txp: any): Promise<any> {
    this.logger.info('@@PS: ENTER');
    const password = await this.prepare(wallet);
    this.logger.info('@@PS: AFTER PREPARE');

    if (txp.status == 'pending') {
      this.logger.info('@@PS: PENDING');
    } else {
      this.logger.info('@@PS: NOT PENDING');
      txp = await this.publishTx(wallet, txp);
      this.logger.info('@@PS: AFTER PublishTx');
    }

    return this.signAndBroadcast(wallet, txp, password);
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

  // setTouchId(wallet: MeritWalletClient, enabled: boolean): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     var opts = {
  //       touchIdFor: {}
  //     };
  //     opts.touchIdFor[wallet.id] = enabled;
  //
  //     return this.touchidService.checkWallet(wallet).then(() => {
  //       this.configService.set(opts);
  //       return resolve();
  //     }).catch((err) => {
  //       opts.touchIdFor[wallet.id] = !enabled;
  //       this.logger.debug('Error with fingerprint:' + err);
  //       this.configService.set(opts);
  //       return reject(err);
  //     });
  //   });
  // }

  // getKeys(wallet: MeritWalletClient): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     return this.prepare(wallet).then((password: string) => {
  //       let keys;
  //       try {
  //         keys = wallet.getKeys(password);
  //       } catch (e) {
  //         return reject(e);
  //       }
  //       return resolve(keys);
  //     }).catch((err) => {
  //       return reject(err);
  //     });
  //   });
  // };

  async setHiddenBalanceOption(walletId: string, hideBalance: boolean): Promise<void> {
    if (this.wallets[walletId]) {
      this.wallets[walletId].balanceHidden = hideBalance;
      await this.persistenceService.setHideBalanceFlag(walletId, String(hideBalance));
    }
  }

  getSendMaxInfo(wallet: MeritWalletClient, opts: any = {}): Promise<any> {
    return wallet.getSendMaxInfo(opts);
  };

  getProtocolHandler(wallet: MeritWalletClient): string {
    return 'merit';
  }

  copyCopayers(wallet: MeritWalletClient, newWallet: MeritWalletClient): Promise<any> {
    return new Promise((resolve, reject) => {
      let walletPrivKey = this.mwcService.getBitcore().PrivateKey.fromString(wallet.credentials.walletPrivKey);
      let copayer = 1;
      let i = 0;

      _.each(wallet.credentials.publicKeyRing, (item) => {
        let name = item.copayerName || ('copayer ' + copayer++);
        return newWallet.doJoinWallet(newWallet.credentials.walletId, walletPrivKey, item.xPubKey, item.requestPubKey, name, {}).then((err) => {
          //Ignore error is copayer already in wallet
          if (err && !(err == MWCErrors.COPAYER_IN_WALLET)) return reject(err);
          if (++i == wallet.credentials.publicKeyRing.length) return resolve();
        });
      });
    });
  };

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
   * @returns [{address, rewards: {mining, ambassador}}] An array of objects, each with an 'address' and a corresponding 'rewards' object that contains the 'mining' and 'ambassador' properties.
   */
  async getRewards(wallet: MeritWalletClient): Promise<{ address: string; rewards: { mining: number; ambassador: number; } }[]> {
    try {
      return await wallet.getRewards(wallet.getRootAddress());
    } catch (e) {
      return [{
        address: wallet.displayAddress,
        rewards: {
          mining: 0,
          ambassador: 0
        }
      }];
    }
  }

  // Check address
  private isAddressUsed(wallet: MeritWalletClient, byAddress: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.persistenceService.getLastAddress(wallet.id).then((addr) => {
        let used = _.find(byAddress, {
          address: addr
        });
        return resolve(used);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  private createAddress(wallet: MeritWalletClient): Promise<any> {
    return new Promise((resolve, reject) => {
      return wallet.createAddress({}).then((address) => {
        return resolve(address);
      }).catch((err) => {
        if (err.code == MWCErrors.MAIN_ADDRESS_GAP_REACHED.code) {
          return this.getMainAddress(wallet).then((address) => {
            return resolve(address);
          });
        } else {
          return reject(err);
        }
      });

    });
  }

  private getMainAddress(wallet: MeritWalletClient) {
    return wallet.getMainAddresses({
      reverse: true,
      limit: 1
    }).then((addr) => {
      return Promise.resolve(addr[0].address);
    });
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

    const easySends = await this.getPendingEasySends(wallet);
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
          .mergeMap(([err, attempt]) => {
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

  // An alert dialog
  private askPassword(name: string, title: string): Promise<any> {
    return this.popupService.prompt(title, name, null, null);
  };

  private signAndBroadcast(wallet: MeritWalletClient, publishedTxp: any, password: any): Promise<any> {
    this.logger.info('@@SB: ENTRY');

    return new Promise((resolve, reject) => {

      return this.signTx(wallet, publishedTxp, password).then((signedTxp: any) => {
        this.logger.info('@@SB: After Sign');

        this.invalidateCache(wallet);
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
        ;
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

  private getPendingEasySends(wallet: MeritWalletClient): Promise<EasySend[]> {
    return this.easySendService.updatePendingEasySends(wallet);
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
        derivationStrategy: opts.derivationStrategy || 'BIP44',
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
