import { Injectable } from '@angular/core';
import { Logger } from 'merit/core/logger';

import { ConfigService } from 'merit/shared/config.service';
import { BwcService } from 'merit/core/bwc.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { PersistenceService } from 'merit/core/persistence.service';
import { BwcError } from 'merit/core/bwc-error.model'; 
import { RateService } from 'merit/transact/rate.service';
import { FiatAmount } from 'merit/shared/fiat-amount.model';
import { PopupService } from 'merit/core/popup.service';
import { SpinnerService } from 'merit/core/spinner.service';
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';
import { LanguageService } from 'merit/core/language.service';
import { ProfileService } from 'merit/core/profile.service';
import { MnemonicService } from 'merit/utilities/mnemonic/mnemonic.service';
import { Promise } from 'bluebird';

import * as _ from 'lodash';
import {Wallet} from "./wallet.model";


/* Refactor CheckList:
  - Bwc Error provider
  - Remove ongoingProcess provider, and handle Loading indicators in controllers
  - Decouple the tight dependencies on ProfileService; and create logical separation concerns 
  - Ensure that anything returning a promise has promises through the stack.
*/


@Injectable()
export class WalletService {

  // TODO: Implement wallet model.
  private wallets: any = {}

  // Ratio low amount warning (fee/amount) in incoming TX
  private LOW_AMOUNT_RATIO: number = 0.15;

  // Ratio of "many utxos" warning in total balance (fee/amount)
  private TOTAL_LOW_WARNING_RATIO: number = .3;

  private WALLET_STATUS_MAX_TRIES: number = 7;
  private WALLET_STATUS_DELAY_BETWEEN_TRIES: number = 1.4 * 1000;
  private SOFT_CONFIRMATION_LIMIT: number = 12;
  private SAFE_CONFIRMATIONS: number = 6;

  private errors: any = this.bwcService.getErrors();
  

  constructor(
    private logger: Logger,
    private bwcService: BwcService,
    private txFormatService: TxFormatService,
    private configService: ConfigService,
    private profileService: ProfileService,
    private persistenceService: PersistenceService,
    private bwcErrorService: BwcError,
    private rateService: RateService,
    private popupService: PopupService,
    private spinnerService: SpinnerService,
    private touchidService: TouchIdService,
    private languageService: LanguageService, 
    private mnemonicService: MnemonicService
  ) {
    console.log('Hello WalletService Service');
  }



  private invalidateCache(wallet: any) {
    if (wallet.cachedStatus)
      wallet.cachedStatus.isValid = false;

    if (wallet.completeHistory)
      wallet.completeHistory.isValid = false;

    if (wallet.cachedActivity)
      wallet.cachedActivity.isValid = false;

    if (wallet.cachedTxps)
      wallet.cachedTxps.isValid = false;
  }

  // TODO: Make async
  public getStatus(wallet: any, opts?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      opts = opts || {};
      var walletId = wallet.id;

      let processPendingTxps = (status: any) => {
        status = status || {};
        let txps = status.pendingTxps;
        let now = Math.floor(Date.now() / 1000);

        /* To test multiple outputs...
        var txp = {
          message: 'test multi-output',
          fee: 1000,
          createdOn: new Date() / 1000,
          outputs: []
        };
        function addOutput(n) {
          txp.outputs.push({
            amount: 600,
            toAddress: '2N8bhEwbKtMvR2jqMRcTCQqzHP6zXGToXcK',
            message: 'output #' + (Number(n) + 1)
          });
        };
        _.times(150, addOutput);
        txps.push(txp);
        */

        _.each(txps, (tx: any) => {

          tx = this.txFormatService.processTx(tx);

          // no future transactions...
          if (tx.createdOn > now)
            tx.createdOn = now;

          tx.wallet = wallet;

          if (!tx.wallet) {
            this.logger.error("no wallet at txp?");
            return;
          }

          let action: any = _.find(tx.actions, {
            copayerId: tx.wallet.copayerId
          });

          if (!action && tx.status == 'pending') {
            tx.pendingForUs = true;
          }

          if (action && action.type == 'accept') {
            tx.statusForUs = 'accepted';
          } else if (action && action.type == 'reject') {
            tx.statusForUs = 'rejected';
          } else {
            tx.statusForUs = 'pending';
          }

          if (!tx.deleteLockTime)
            tx.canBeRemoved = true;
        });
        wallet.pendingTxps = txps;
      };


      let get = ():Promise<any> => {
        return new Promise((resolve, reject) => {
          wallet.getStatus({
            twoStep: true
          }, (err, ret) => {
            if (err) {
              if (err instanceof this.errors.NOT_AUTHORIZED) {
                return reject('WALLET_NOT_REGISTERED');
              }
              return reject(err);
            }
            return resolve(ret);
          });
        });
      };
      
      // TODO!!: Make this return a promise and properly promisify the stack.
      let cacheBalance = (wallet: any, balance: any): Promise<any> => {
        return new Promise((resolve, reject) => {

        
          if (!balance) return;

          let configGet: any = this.configService.get();
          let config: any = configGet.wallet;

          let cache = wallet.cachedStatus;

          // Address with Balance
          cache.balanceByAddress = balance.byAddress;

          // Total wallet balance is same regardless of 'spend unconfirmed funds' setting.
          cache.totalBalanceSat = balance.totalAmount;

          // Spend unconfirmed funds
          if (config.spendUnconfirmed) {
            cache.lockedBalanceSat = balance.lockedAmount;
            cache.availableBalanceSat = balance.availableAmount;
            cache.totalBytesToSendMax = balance.totalBytesToSendMax;
            cache.pendingAmount = 0;
            cache.spendableAmount = balance.totalAmount - balance.lockedAmount;
          } else {
            cache.lockedBalanceSat = balance.lockedConfirmedAmount;
            cache.availableBalanceSat = balance.availableConfirmedAmount;
            cache.totalBytesToSendMax = balance.totalBytesToSendConfirmedMax;
            cache.pendingAmount = balance.totalAmount - balance.totalConfirmedAmount;
            cache.spendableAmount = balance.totalConfirmedAmount - balance.lockedAmount;
          }

          // Selected unit
          cache.unitToSatoshi = config.settings.unitToSatoshi;
          cache.satToUnit = 1 / cache.unitToSatoshi;

          //STR
          cache.totalBalanceStr = this.txFormatService.formatAmountStr(cache.totalBalanceSat);
          cache.lockedBalanceStr = this.txFormatService.formatAmountStr(cache.lockedBalanceSat);
          cache.availableBalanceStr = this.txFormatService.formatAmountStr(cache.availableBalanceSat);
          cache.spendableBalanceStr = this.txFormatService.formatAmountStr(cache.spendableAmount);
          cache.pendingBalanceStr = this.txFormatService.formatAmountStr(cache.pendingAmount);

          cache.alternativeName = config.settings.alternativeName;
          cache.alternativeIsoCode = config.settings.alternativeIsoCode;

          // Check address
          return this.isAddressUsed(wallet, balance.byAddress).then((used) => {
            if (used) {
              this.logger.debug('Address used. Creating new');
              // Force new address
              this.getAddress(wallet, true).then((addr) => {
                this.logger.debug('New address: ', addr);
              })
            }
          }).then(() => {
            return this.rateService.whenAvailable().then(() => {
              
              let totalBalanceAlternative = this.rateService.toFiat(cache.totalBalanceSat, cache.alternativeIsoCode);
              let pendingBalanceAlternative = this.rateService.toFiat(cache.pendingAmount, cache.alternativeIsoCode);
              let lockedBalanceAlternative = this.rateService.toFiat(cache.lockedBalanceSat, cache.alternativeIsoCode);
              let spendableBalanceAlternative = this.rateService.toFiat(cache.spendableAmount, cache.alternativeIsoCode);
              let alternativeConversionRate = this.rateService.toFiat(100000000, cache.alternativeIsoCode);

              cache.totalBalanceAlternative = new FiatAmount(totalBalanceAlternative);
              cache.pendingBalanceAlternative = new FiatAmount(pendingBalanceAlternative);
              cache.lockedBalanceAlternative = new FiatAmount(lockedBalanceAlternative);
              cache.spendableBalanceAlternative = new FiatAmount(spendableBalanceAlternative);
              cache.alternativeConversionRate = new FiatAmount(alternativeConversionRate);

              cache.alternativeBalanceAvailable = true;
              cache.isRateAvailable = true;
              resolve();              
            }).catch((err) => {
              // We don't want to blow up the promise chain if the rateService is down.
              // TODO: Fallback to last known conversion rate.
              this.logger.warn("Could not get rates from rateService.");
              resolve();              
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
        return cacheBalance(wallet, status.balance);
      };

      let walletStatusHash = (status: any): any => {
        return status ? status.balance.totalAmount : wallet.totalBalanceSat;
      };

      let _getStatus = (initStatusHash: any, tries: number): Promise<any> => {
        return new Promise((resolve, reject) => {
          if (isStatusCached() && !opts.force) {
            this.logger.debug('Wallet status cache hit:' + wallet.id);
            return cacheStatus(wallet.cachedStatus).then(()=> {
              processPendingTxps(wallet.cachedStatus);
              return resolve(wallet.cachedStatus);
            }).catch((err) => {
              this.logger.debug('Error in caching status:' + err);              
            });
          };

          tries = tries || 0;

          this.logger.debug('Updating Status:', wallet.credentials.walletName, tries);
          return get().then((status) => {
            let currentStatusHash = walletStatusHash(status);
            this.logger.debug('Status update. hash:' + currentStatusHash + ' Try:' + tries);
            if (opts.untilItChanges && initStatusHash == currentStatusHash && tries < this.WALLET_STATUS_MAX_TRIES && walletId == wallet.credentials.walletId) {
              return setTimeout(() => {
                this.logger.debug('Retrying update... ' + walletId + ' Try:' + tries)
                return _getStatus(initStatusHash, ++tries);
              }, this.WALLET_STATUS_DELAY_BETWEEN_TRIES * tries);
            }

            processPendingTxps(status);

            this.logger.debug('Got Wallet Status for:' + wallet.credentials.walletName);
            this.logger.debug(status);

            return cacheStatus(status).then(() => {
              wallet.scanning = status.wallet && status.wallet.scanStatus == 'running';
              return resolve(status);
            });            
          }).catch((err) => {
            this.logger.error("Could not get the status!");
            this.logger.error(err);
            return reject(err);
          });

        });
      };

      return _getStatus(walletStatusHash(null), 0).then((status) => {
        return resolve(status);
      }).catch((err) => {
        this.logger.warn("Error getting status: ", err);
        return reject("Error getting status: " + err);
      });
    });

  }

  public getAddress(wallet: any, forceNew: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.persistenceService.getLastAddress(wallet.id).then((addr) => {
        if (!forceNew && addr) return resolve(addr);

        if (!wallet.isComplete())
          return reject('WALLET_NOT_COMPLETE');

        return this.createAddress(wallet).then((_addr) => {
          if (_.isEmpty(_addr)) {
            return reject(new Error("Cannot retrieve a new address"));
          } else {
            return this.persistenceService.storeLastAddress(wallet.id, _addr).then(() => {
              return resolve(_addr);
            })
          }
          }).catch((err) => {
            return reject(err);
          });
        }).catch((err) => {
          return reject(err);
        });
      });
  }

  // Check address
  private isAddressUsed(wallet: any, byAddress: Array<any>): Promise<any> {
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


  private createAddress(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.debug('Creating address for wallet:', wallet.id);

      wallet.createAddress({}, (err, addr) => {
        if (err) {
          let prefix = 'Could not create address'; //TODO Gettextcatalog
          if (err instanceof this.errors.CONNECTION_ERROR || (err.message && err.message.match(/5../))) {
            this.logger.warn(err);
            return setTimeout(() => {
              this.createAddress(wallet);
            }, 5000);
          } else if (err instanceof this.errors.MAIN_ADDRESS_GAP_REACHED || (err.message && err.message == 'MAIN_ADDRESS_GAP_REACHED')) {
            this.logger.warn(err);
            prefix = null;
            wallet.getMainAddresses({
              reverse: true,
              limit: 1
            }, (err, addr) => {
              if (err) return reject(err);
              return resolve(addr[0].address);
            });
          };
          this.bwcErrorService.cb(err, prefix).then((msg) => {
            return reject(msg);
          });
        };
        return resolve(addr.address);
      });
    });
  }

  private getSavedTxs(walletId: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.persistenceService.getTxHistory(walletId).then((txs: any) => {
        let localTxs = [];

        if (!txs) {
          return resolve(localTxs);
        };

        try {
          localTxs = JSON.parse(txs);
        } catch (ex) {
          this.logger.warn(ex);
        };
        return resolve(_.compact(localTxs));
      }).catch((err: Error) => {
        return reject(err);
      });
    });
  }

  private getTxsFromServer(wallet: any, skip: number, endingTxid: string, limit: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let res = [];

      wallet.getTxHistory({
        skip: skip,
        limit: limit
      }, (err: Error, txsFromServer: Array<any>) => {
        if (err) return reject(err);

        if (!txsFromServer.length)
          return resolve();

        res = _.takeWhile(txsFromServer, (tx) => {
          return tx.txid != endingTxid;
        });

        let result = {
          res: res,
          shouldContinue: res.length >= limit
        };

        return resolve(result);
      });
    });
  }

  private updateLocalTxHistory(wallet: any, opts: any) {
    return new Promise((resolve, reject) => {
      opts = opts ? opts : {};
      let FIRST_LIMIT = 5;
      let LIMIT = 50;
      let requestLimit = FIRST_LIMIT;
      let walletId = wallet.credentials.walletId;
      let progressFn = opts.progressFn || function () { };
      let foundLimitTx = [];


      if (opts.feeLevels) {
        opts.lowAmount = this.getLowAmount(wallet, opts.feeLevels);
      };

      let fixTxsUnit = (txs: any): void => {
        if (!txs || !txs[0] || !txs[0].amountStr) return;

        let cacheCoin: string = txs[0].amountStr.split(' ')[1];

        if (cacheCoin == 'bits') {

          this.logger.debug('Fixing Tx Cache Unit to: MRT');
          _.each(txs, (tx: any) => {
            tx.amountStr = this.txFormatService.formatAmountStr(tx.amount);
            tx.feeStr = this.txFormatService.formatAmountStr(tx.fees);
          });
        };
      };

      this.getSavedTxs(walletId).then((txsFromLocal: any) => {

        fixTxsUnit(txsFromLocal);

        var confirmedTxs = this.removeAndMarkSoftConfirmedTx(txsFromLocal);
        var endingTxid = confirmedTxs[0] ? confirmedTxs[0].txid : null;
        var endingTs = confirmedTxs[0] ? confirmedTxs[0].time : null;

        // First update
        progressFn(txsFromLocal, 0);
        wallet.completeHistory = txsFromLocal;

        let getNewTxs = (newTxs: Array<any>, skip: number): Promise<any> => {
          return new Promise((resolve, reject) => {
            this.getTxsFromServer(wallet, skip, endingTxid, requestLimit).then((result: any) => {

              var res = result.res;
              var shouldContinue = result.shouldContinue ? result.shouldContinue : false;

              newTxs = newTxs.concat(this.processNewTxs(wallet, _.compact(res)));
              progressFn(newTxs.concat(txsFromLocal), newTxs.length);
              skip = skip + requestLimit;
              this.logger.debug('Syncing TXs. Got:' + newTxs.length + ' Skip:' + skip, ' EndingTxid:', endingTxid, ' Continue:', shouldContinue);

              // TODO Dirty <HACK>
              // do not sync all history, just looking for a single TX.
              if (opts.limitTx) {
                foundLimitTx = _.find(newTxs, {
                  txid: opts.limitTx,
                });
                if (foundLimitTx) {
                  this.logger.debug('Found limitTX: ' + opts.limitTx);
                  return resolve(foundLimitTx);
                }
              }
              // </HACK>
              if (!shouldContinue) {
                this.logger.debug('Finished Sync: New / soft confirmed Txs: ' + newTxs.length);
                return resolve(newTxs);
              };

              requestLimit = LIMIT;
              getNewTxs(newTxs, skip);
            }).catch((err) => {
              this.logger.warn(this.bwcErrorService.msg(err, 'Server Error')); //TODO
              if (err instanceof this.errors.CONNECTION_ERROR || (err.message && err.message.match(/5../))) {
                this.logger.info('Retrying history download in 5 secs...');
                return reject(setTimeout(() => {
                  return getNewTxs(newTxs, skip);
                }, 5000));
              };
              return reject(err);
            });
          });
        };

        getNewTxs([], 0).then((txs: any) => {

          let array: Array<any> = _.compact(txs.concat(confirmedTxs));
          let newHistory = _.uniqBy(array, (x: any) => {
            return x.txid;
          });


          let updateNotes = (): Promise<any> => {
            return new Promise((resolve, reject) => {
              if (!endingTs) return resolve();

              this.logger.debug('Syncing notes from: ' + endingTs);
              wallet.getTxNotes({
                minTs: endingTs
              }, (err: any, notes: any) => {
                if (err) {
                  this.logger.warn(err);
                  return reject(err);
                };
                _.each(notes, (note: any) => {
                  this.logger.debug('Note for ' + note.txid);
                  _.each(newHistory, (tx: any) => {
                    if (tx.txid == note.txid) {
                      this.logger.debug('...updating note for ' + note.txid);
                      tx.note = note;
                    };
                  });
                });
                return resolve();
              });
            });
          };

          let updateLowAmount = (txs: any) => {
            if (!opts.lowAmount) return;

            _.each(txs, (tx: any) => {
              tx.lowAmount = tx.amount < opts.lowAmount;
            });
          };

          updateLowAmount(txs);

          updateNotes().then(() => {

            // <HACK>
            if (foundLimitTx) {
              this.logger.debug('Tx history read until limitTx: ' + opts.limitTx);
              return resolve(newHistory);
            }
            // </HACK>

            var historyToSave = JSON.stringify(newHistory);
            _.each(txs, (tx: any) => {
              tx.recent = true;
            });
            this.logger.debug('Tx History synced. Total Txs: ' + newHistory.length);

            // Final update
            if (walletId == wallet.credentials.walletId) {
              wallet.completeHistory = newHistory;
            }

            return this.persistenceService.setTxHistory(historyToSave, walletId).then(() => {
              this.logger.debug('Tx History saved.');
              return resolve();
            }).catch((err) => {
              return reject(err);
            });
          }).catch((err) => {
            return reject(err);
          });
        }).catch((err) => {
          return reject(err);
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  private processNewTxs(wallet: any, txs: any): Array<any> {
    let configGet: any = this.configService.get();
    let config: any = configGet.wallet.settings;
    let now = Math.floor(Date.now() / 1000);
    let txHistoryUnique = {};
    let ret = [];
    wallet.hasUnsafeConfirmed = false;

    _.each(txs, (tx: any) => {
      tx = this.txFormatService.processTx(tx);

      // no future transactions...
      if (tx.time > now)
        tx.time = now;

      if (tx.confirmations >= this.SAFE_CONFIRMATIONS) {
        tx.safeConfirmed = this.SAFE_CONFIRMATIONS + '+';
      } else {
        tx.safeConfirmed = false;
        wallet.hasUnsafeConfirmed = true;
      };

      if (tx.note) {
        delete tx.note.encryptedEditedByName;
        delete tx.note.encryptedBody;
      };

      if (!txHistoryUnique[tx.txid]) {
        ret.push(tx);
        txHistoryUnique[tx.txid] = true;
      } else {
        this.logger.debug('Ignoring duplicate TX in history: ' + tx.txid)
      };
    });

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
  public getLowAmount(wallet: any, feeLevels: any, nbOutputs?: number) {
    let minFee: number = this.getMinFee(wallet, feeLevels, nbOutputs);
    return (minFee / this.LOW_AMOUNT_RATIO);
  }

  // Approx utxo amount, from which the uxto is economically redeemable
  private getMinFee(wallet: any, feeLevels: any, nbOutputs?: number): number {
    let level: any = _.find(feeLevels[wallet.network], {
      level: 'normal',
    });
    let lowLevelRate = parseInt((level.feePerKb / 1000).toFixed(0));

    var size = this.getEstimatedTxSize(wallet, nbOutputs);
    return size * lowLevelRate;
  }

  // These 2 functions were taken from
  // https://github.com/bitpay/bitcore-wallet-service/blob/master/lib/model/txproposal.js#L243
  private getEstimatedSizeForSingleInput(wallet: any): number {
    switch (wallet.credentials.addressType) {
      case 'P2PKH':
        return 147;
      default:
      case 'P2SH':
        return wallet.m * 72 + wallet.n * 36 + 44;
    };
  }

  private getEstimatedTxSize(wallet: any, nbOutputs?: number): number {
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

  public getTxNote(wallet: any, txid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      wallet.getTxNote({
        txid: txid
      }, (err: any, note: any) => {
        if (err) return reject(err);
        return resolve(note);
      });
    });
  }

  public editTxNote(wallet: any, args: any): Promise<any> {
    return new Promise((resolve, reject) => {
      wallet.editTxNote(args, (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }

  public getTxp(wallet: any, txpid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      wallet.getTx(txpid, (err: any, txp: any) => {
        if (err) return reject(err);
        return resolve(txp);
      });
    });
  }

  public getTx(wallet: any, txid: string) {
    return new Promise((resolve, reject) => {
      let finish = (list: any) => {
        let tx = _.find(list, {
          txid: txid
        });

        if (!tx) return reject('Could not get transaction');
        return resolve(tx);
      };

      if (wallet.completeHistory && wallet.completeHistory.isValid) {
        finish(wallet.completeHistory);
      } else {
        let opts = {
          limitTx: txid
        };
        this.getTxHistory(wallet, opts).then((txHistory: any) => {
          finish(txHistory);
        }).catch((err) => {
          return reject(err);
        });
      };
    });
  }

  public getTxHistory(wallet: any, opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      opts = opts ? opts : {};
      let walletId = wallet.credentials.walletId;

      if (!wallet.isComplete()) return resolve();

      let isHistoryCached = () => {
        return wallet.completeHistory && wallet.completeHistory.isValid;
      };

      if (isHistoryCached() && !opts.force) return resolve(wallet.completeHistory);

      this.logger.debug('Updating Transaction History');
      this.updateLocalTxHistory(wallet, opts).then((txs: any) => {
        if (opts.limitTx) {
          return resolve(txs);
        };

        wallet.completeHistory.isValid = true;
        return resolve(wallet.completeHistory);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  public isEncrypted(wallet: any) {
    if (_.isEmpty(wallet)) return;
    let isEncrypted = wallet.isPrivKeyEncrypted();
    if (isEncrypted) this.logger.debug('Wallet is encrypted');
    return isEncrypted;
  }

  public createTx(wallet: any, txp: any) {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(txp) || _.isEmpty(wallet))
        return reject('MISSING_PARAMETER');

      wallet.createTxProposal(txp, (err: any, createdTxp: any) => {
        if (err) return reject(err);
        else {
          this.logger.debug('Transaction created');
          return resolve(createdTxp);
        };
      });
    });
  }

  public publishTx(wallet: any, txp: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(txp) || _.isEmpty(wallet))
        return reject('MISSING_PARAMETER');
      wallet.publishTxProposal({
        txp: txp
      }, (err: any, publishedTx: any) => {
        if (err) return reject(err);
        else {
          this.logger.debug('Transaction published');
          return resolve(publishedTx);
        };
      });
    });
  }

  public signTx(wallet: any, txp: any, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!wallet || !txp)
        return reject('MISSING_PARAMETER');

      try {
        wallet.signTxProposal(txp, password, (err: any, signedTxp: any) => {
          this.logger.debug('Transaction signed err:' + err);
          if (err) return reject(err);
          return resolve(signedTxp);
        });
      } catch (e) {
        this.logger.warn('Error at signTxProposal:', e);
        return reject(e);
      };
    });
  }

  public broadcastTx(wallet: any, txp: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(txp) || _.isEmpty(wallet))
        return reject('MISSING_PARAMETER');

      if (txp.status != 'accepted')
        return reject('TX_NOT_ACCEPTED');

      wallet.broadcastTxProposal(txp, (err: any, broadcastedTxp: any, memo: any) => {
        if (err)
          return reject(err);

        this.logger.debug('Transaction broadcasted');
        if (memo) this.logger.info(memo);

        return resolve(broadcastedTxp);
      });
    });
  }

  public rejectTx(wallet: any, txp: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(txp) || _.isEmpty(wallet))
        return reject('MISSING_PARAMETER');

      wallet.rejectTxProposal(txp, null, (err: any, rejectedTxp: any) => {
        if (err)
          return reject(err);
        this.logger.debug('Transaction rejected');
        return resolve(rejectedTxp);
      });
    });
  }

  public removeTx(wallet: any, txp: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(txp) || _.isEmpty(wallet))
        return reject('MISSING_PARAMETER');

      wallet.removeTxProposal(txp, (err: any) => {
        this.logger.debug('Transaction removed');

        this.invalidateCache(wallet);
        // $rootScope.$emit('Local/TxAction', wallet.id);   
        return resolve(err);
      });
    });
  }

  public updateRemotePreferences(clients: any, prefs: any): Promise<any> {
    return new Promise((resolve, reject) => {
      prefs = prefs || {};

      if (!_.isArray(clients))
        clients = [clients];

      let updateRemotePreferencesFor = (clients: any, prefs: any): Promise<any> => {
        return new Promise((resolve, reject) => {
          let wallet = clients.shift();
          if (!wallet) return resolve();
          this.logger.debug('Saving remote preferences', wallet.credentials.walletName, prefs);

          wallet.savePreferences(prefs, (err: any) => {

            if (err) {
              this.popupService.ionicAlert(this.bwcErrorService.msg(err, 'Could not save preferences on the server')); //TODO Gettextcatalog
              return reject(err);
            }

            updateRemotePreferencesFor(clients, prefs);
          });
        });
      };

      // Update this JIC.
      let config: any = this.configService.get();
      let walletSettings = config.wallet.settings;

      //prefs.email  (may come from arguments)
      prefs.email = config.emailNotifications.email;
      prefs.language = "English" // This line was hardcoded - TODO: prefs.language = uxLanguage.getCurrentLanguage();
      // prefs.unit = walletSettings.unitCode; // TODO: remove, not used

      updateRemotePreferencesFor(_.clone(clients), prefs).then(() => {
        this.logger.debug('Remote preferences saved for' + _.map(clients, (x: any) => {
          return x.credentials.walletId;
        }).join(','));

        _.each(clients, (c: any) => {
          c.preferences = _.assign(prefs, c.preferences);
        });
        return resolve();
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  public recreate(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.debug('Recreating wallet:', wallet.id);
      this.spinnerService.setSpinnerStatus('recreating', true);
      wallet.recreateWallet((err: any) => {
        wallet.notAuthorized = false;
        this.spinnerService.setSpinnerStatus('recreating', false);
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  public startScan(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.debug('Scanning wallet ' + wallet.id);
      if (!wallet.isComplete()) return reject();

      wallet.scanning = true;
      wallet.startScan({
        includeCopayerBranches: true,
      }, (err: any) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

// create and store a wallet
  public createWallet(opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.doCreateWallet(opts).then((walletClient: any) => {
        this.profileService.addAndBindWalletClient(walletClient, {
          bwsurl: opts.bwsurl
        }).then((wallet: any) => {
          return resolve(wallet);
        });
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  // joins and stores a wallet
  public joinWallet(opts: any): Promise<any> {
    return new Promise((resolve, reject) => {

      let walletClient = this.bwcService.getClient(null, opts);
      this.logger.debug('Joining Wallet:', opts);

      try {
        var walletData = this.bwcService.parseSecret(opts.secret);

        // check if exist
        if (_.find(this.profileService.profile.credentials, {
          'walletId': walletData.walletId
        })) {
          return reject('Cannot join the same wallet more that once'); // TODO getTextCatalog
        }
      } catch (ex) {
        this.logger.debug(ex);
        return reject('Bad wallet invitation'); // TODO getTextCatalog
      }
      opts.networkName = walletData.network;
      this.logger.debug('Joining Wallet:', opts);

      this.seedWallet(opts).then((walletClient: any) => {
        walletClient.joinWallet(opts.secret, opts.myName || 'me', {
        }, (err: any) => {
          if (err) {
            this.bwcErrorService.cb(err, 'Could not join wallet').then((msg: string) => { //TODO getTextCatalog
              return reject(msg);
            });
          } else {
            this.profileService.addAndBindWalletClient(walletClient, {
              bwsurl: opts.bwsurl
            }).then((wallet: any) => {
              return resolve(wallet);
            });
          };
        });
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  public getWallet(walletId: string): any {
    return this.profileService.wallets[walletId];
  };


  public expireAddress(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.debug('Cleaning Address ' + wallet.id);
      this.persistenceService.clearLastAddress(wallet.id).then(() => {
        return resolve();
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  public getMainAddresses(wallet: any, opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      opts = opts || {};
      opts.reverse = true;
      wallet.getMainAddresses(opts, (err, addresses) => {
        if (err) return reject(err);
        return resolve(addresses);
      });
    });
  }

  public getBalance(wallet: any, opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      opts = opts || {};
      wallet.getBalance(opts, (err, resp) => {
        if (err) return reject(err);
        return resolve(resp);
      });
    });
  }

  public getLowUtxos(wallet: any, levels: any): Promise<any> {
    return new Promise((resolve, reject) => {
      wallet.getUtxos({
      }, (err, resp) => {
        if (err || !resp || !resp.length) return reject(err);

        let minFee = this.getMinFee(wallet, levels, resp.length);

        let balance = _.sumBy(resp, 'satoshis');

        // for 2 outputs
        let lowAmount = this.getLowAmount(wallet, levels);
        let lowUtxos = _.filter(resp, (x: any) => {
          return x.satoshis < lowAmount;
        });

        let totalLow = _.sumBy(lowUtxos, 'satoshis');
        return resolve({
          allUtxos: resp || [],
          lowUtxos: lowUtxos || [],
          warning: minFee / balance > this.TOTAL_LOW_WARNING_RATIO,
          minFee: minFee,
        });
      });
    });
  }

  public createDefaultWallet(unlockCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      var opts: any = {};
      opts.m = 1;
      opts.n = 1;
      opts.networkName = 'testnet';
      opts.unlockCode = unlockCode;
      this.createWallet(opts).then((wallet: any) => {
        return resolve(wallet);
      }).catch((err) => {
        return reject(err);
      });
    });
  };


  public isReady(wallet: any): string {
    if (!wallet.isComplete())
      return 'WALLET_NOT_COMPLETE';
    if (wallet.needsBackup)
      return 'WALLET_NEEDS_BACKUP';
    return null;
  }

  // An alert dialog
  private askPassword(name: string, title: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.popupService.ionicPrompt(title, name, null, null).then((res: any) => {
        return resolve(res);
      }).catch((err: any) => {
        return reject(err);
      });
    });
  };

  public encrypt(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      var title = 'Enter new spending password'; //TODO gettextcatalog
      var warnMsg = 'Your wallet key will be encrypted. The Spending Password cannot be recovered. Be sure to write it down.'; //TODO gettextcatalog
      this.askPassword(warnMsg, title).then((password: string) => {
        if (!password) return reject('no password'); //TODO gettextcatalog
        title = 'Confirm your new spending password'; //TODO gettextcatalog
        this.askPassword(warnMsg, title).then((password2: string) => {
          if (!password2 || password != password2) return reject('password mismatch');
          wallet.encryptPrivateKey(password);
          return resolve();
        }).catch((err) => {
          return reject(err);
        });
      }).catch((err) => {
        return reject(err);
      });
    });

  };

  public decrypt(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.debug('Disabling private key encryption for' + wallet.name);
      this.askPassword(null, 'Enter Spending Password').then((password: string) => {  //TODO gettextcatalog
        if (!password) return reject('no password');
        try {
          wallet.decryptPrivateKey(password);
        } catch (e) {
          return reject(e);
        }
        return resolve();
      });
    });
  }

  public handleEncryptedWallet(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isEncrypted(wallet)) return reject();
      this.askPassword(wallet.name, 'Enter Spending Password').then((password: string) => { //TODO gettextcatalog
        if (!password) return reject('No password');
        if (!wallet.checkPassword(password)) return reject('Wrong password');
        return resolve(password);
      });
    });
  }

  public reject(wallet: any, txp: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.spinnerService.setSpinnerStatus('rejectTx', true);
      this.rejectTx(wallet, txp).then((txpr: any) => {
        this.invalidateCache(wallet);
        this.spinnerService.setSpinnerStatus('rejectTx', false);
        //$rootScope.$emit('Local/TxAction', wallet.id);
        return resolve(txpr);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  public onlyPublish(wallet: any, txp: any, customStatusHandler: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.spinnerService.setSpinnerStatus('sendingTx', true, customStatusHandler);
      this.publishTx(wallet, txp).then((publishedTxp) => {
        this.invalidateCache(wallet);
        this.spinnerService.setSpinnerStatus('sendingTx', false, customStatusHandler);
        //$rootScope.$emit('Local/TxAction', wallet.id);
        return resolve();
      }).catch((err) => {
        return reject(this.bwcErrorService.msg(err));
      });
    });
  }

  public prepare(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.touchidService.checkWallet(wallet).then(() => {
        this.handleEncryptedWallet(wallet).then((password: string) => {
          return resolve(password);
        }).catch((err) => {
          return reject(err);
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  private signAndBroadcast(wallet: any, publishedTxp: any, password: any, customStatusHandler: any): Promise<any> {
    return new Promise((resolve, reject) => {

      this.spinnerService.setSpinnerStatus('signingTx', true, customStatusHandler);
      this.signTx(wallet, publishedTxp, password).then((signedTxp: any) => {
        this.spinnerService.setSpinnerStatus('signingTx', false, customStatusHandler);
        this.invalidateCache(wallet);
        if (signedTxp.status == 'accepted') {
          this.spinnerService.setSpinnerStatus('broadcastingTx', true, customStatusHandler);
          this.broadcastTx(wallet, signedTxp).then((broadcastedTxp: any) => {
            this.spinnerService.setSpinnerStatus('broadcastingTx', false, customStatusHandler);
            //$rootScope.$emit('Local/TxAction', wallet.id);
            return resolve(broadcastedTxp);
          }).catch((err) => {
            return reject(this.bwcErrorService.msg(err));
          });
        } else {
          //$rootScope.$emit('Local/TxAction', wallet.id);
          return resolve(signedTxp);
        };
      }).catch((err) => {
        this.logger.warn('sign error:' + err);
        let msg = err && err.message ? err.message : 'The payment was created but could not be completed. Please try again from home screen'; //TODO gettextcatalog
        //$rootScope.$emit('Local/TxAction', wallet.id);
        return reject(msg);
      });
    });
  }

  public publishAndSign(wallet: any, txp: any, customStatusHandler: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Already published?
      if (txp.status == 'pending') {
        this.prepare(wallet).then((password: string) => {
          this.signAndBroadcast(wallet, txp, password, customStatusHandler).then((broadcastedTxp: any) => {
            return resolve(broadcastedTxp);
          }).catch((err) => {
            return reject(err);
          });
        }).catch((err) => {
          return reject(this.bwcErrorService.msg(err));
        });
      } else {
        this.prepare(wallet).then((password: string) => {
          this.spinnerService.setSpinnerStatus('sendingTx', true, customStatusHandler);
          this.publishTx(wallet, txp).then((publishedTxp: any) => {
            this.spinnerService.setSpinnerStatus('sendingTx', false, customStatusHandler);
            this.signAndBroadcast(wallet, publishedTxp, password, customStatusHandler).then((broadcastedTxp: any) => {
              return resolve(broadcastedTxp);
            }).catch((err) => {
              return reject(err);
            });
          }).catch((err) => {
            this.spinnerService.setSpinnerStatus('sendingTx', false, customStatusHandler);
            return reject(this.bwcErrorService.msg(err));
          });
        }).catch((err) => {
          return reject(this.bwcErrorService.msg(err));
        });
      };
    });
  }

  public getEncodedWalletInfo(wallet: any, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let derivationPath = wallet.credentials.getBaseAddressDerivationPath();
      let encodingType = {
        mnemonic: 1,
        xpriv: 2,
        xpub: 3
      };
      let info: any = {};

      // not supported yet
      if (wallet.credentials.derivationStrategy != 'BIP44' || !wallet.canSign())
        return reject('Exporting via QR not supported for this wallet'); //TODO gettextcatalog

      var keys = this.getKeysWithPassword(wallet, password);

      if (keys.mnemonic) {
        info = {
          type: encodingType.mnemonic,
          data: keys.mnemonic,
        }
      } else {
        info = {
          type: encodingType.xpriv,
          data: keys.xPrivKey
        }
      }

      return resolve(info.type + '|' + info.data + '|' + wallet.credentials.network.toLowerCase() + '|' + derivationPath + '|' + (wallet.credentials.mnemonicHasPassphrase));
    });
  }

  public getKeysWithPassword(wallet: any, password: string): any {
    try {
      return wallet.getKeys(password);
    } catch (e) {
      this.logger.debug(e);
    }
  }

  public setTouchId(wallet: any, enabled: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      var opts = {
        touchIdFor: {}
      };
      opts.touchIdFor[wallet.id] = enabled;

      this.touchidService.checkWallet(wallet).then(() => {
        this.configService.set(opts);
        return resolve();
      }).catch((err) => {
        opts.touchIdFor[wallet.id] = !enabled;
        this.logger.debug('Error with fingerprint:' + err);
        this.configService.set(opts);
        return reject(err);
      });
    });
  }

  public getKeys(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.prepare(wallet).then((password: string) => {
        let keys;
        try {
          keys = wallet.getKeys(password);
        } catch (e) {
          return reject(e);
        }
        return resolve(keys);
      }).catch((err) => {
        return reject(err);
      });
    });
  };

  public getSendMaxInfo(wallet: any, opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      opts = opts || {};
      wallet.getSendMaxInfo(opts, (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  };

  public getProtocolHandler(wallet: any): string {
    if (wallet.coin == 'bch') return 'bitcoincash';
    else return 'merit';
  }

  public copyCopayers(wallet: any, newWallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let walletPrivKey = this.bwcService.getBitcore().PrivateKey.fromString(wallet.credentials.walletPrivKey);
      let copayer = 1;
      let i = 0;

      _.each(wallet.credentials.publicKeyRing, (item) => {
        let name = item.copayerName || ('copayer ' + copayer++);
        newWallet._doJoinWallet(newWallet.credentials.walletId, walletPrivKey, item.xPubKey, item.requestPubKey, name, {
        }, (err: any) => {
          //Ignore error is copayer already in wallet
          if (err && !(err instanceof this.errors.COPAYER_IN_WALLET)) return reject(err);
          if (++i == wallet.credentials.publicKeyRing.length) return resolve();
        });
      });
    });
  };
  
  // Creates a wallet on BWC/BWS
  private doCreateWallet(opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      
      let showOpts = _.clone(opts);
      if (showOpts.extendedPrivateKey) showOpts.extendedPrivateKey = '[hidden]';
      if (showOpts.mnemonic) showOpts.mnemonic = '[hidden]';
      
      this.logger.debug('Creating Wallet:', showOpts);
      setTimeout(() => {
        this.seedWallet(opts).then((walletClient: any) => {
          
          let name = opts.name || 'Personal Wallet'; // TODO GetTextCatalog
          let myName = opts.myName || 'me'; // TODO GetTextCatalog
          
          // TODO: Rename Beacon to UnlockCode down the stack
          return walletClient.createWallet(name, myName, opts.m, opts.n, {
            network: opts.networkName,
            singleAddress: opts.singleAddress,
            walletPrivKey: opts.walletPrivKey,
            beacon: opts.unlockCode
          }, (err: any, secret: any) => {
            if (err) {
              this.bwcErrorService.cb(err, 'Error creating wallet').then((msg: string) => { //TODO getTextCatalog
                return reject(msg);
              });
            } else {
              // TODO: Subscribe to ReferralTxConfirmation
              return resolve(walletClient);
            }
          });
        }).catch((err: any) => {
          return reject(err);
        });
      }, 5000);
    });
  }

  // TODO: Rename this.  
  private seedWallet(opts: any): Promise<any> {
    return new Promise((resolve, reject) => {

      opts = opts ? opts : {};
      let walletClient = this.bwcService.getClient(null, opts);
      let network = opts.networkName || 'livenet';

      if (opts.mnemonic) {
        try {
          // TODO: Type the walletClient
          this.mnemonicService.seedFromMnemonic(opts, walletClient).then((walletClient: any) => {
            resolve(walletClient)});
        } catch (ex) {
          this.logger.info(ex);
          return reject('Could not create: Invalid wallet recovery phrase'); // TODO getTextCatalog
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
          return reject('Could not create using the specified extended private key'); // TODO GetTextCatalog
        }
      } else if (opts.extendedPublicKey) {
        try {
          walletClient.seedFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, {
            account: opts.account || 0,
            derivationStrategy: opts.derivationStrategy || 'BIP44'
          });
          walletClient.credentials.hwInfo = opts.hwInfo;
        } catch (ex) {
          this.logger.warn("Creating wallet from Extended Public Key Arg:", ex, opts);
          return reject('Could not create using the specified extended public key'); // TODO GetTextCatalog
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
            return reject(e);
          }
        }
      }
      return resolve(walletClient);
    });
  }

  // todo its a mock now!!
  getWalletAnv(wallet:Wallet):Promise<number> {
    return new Promise((resolve, reject) => {
      resolve(
       (wallet.status && wallet.status.totalBalanceMicros) ? wallet.status.totalBalanceMicros : 0
      )
    });
  }
  
  
}