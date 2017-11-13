import { Injectable } from '@angular/core';
import { Logger } from 'merit/core/logger';
import * as _ from 'lodash';
import { PersistenceService } from 'merit/core/persistence.service';
import { ConfigService } from 'merit/shared/config.service';
import { BwcService } from 'merit/core/bwc.service';
import { BwcError } from 'merit/core/bwc-error.model';
import { PlatformService } from 'merit/core/platform.service';
import { AppService } from 'merit/core/app-settings.service';
import { LanguageService } from 'merit/core/language.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { Profile } from 'merit/core/profile.model';
import { Wallet } from 'merit/wallets/wallet.model';
import { Promise } from 'bluebird';


/* 
  Historically, this acted as the API-Client
  Now, the goal is to roll up convenience-statistics 
  and keep a list of wallets.
*/ 
@Injectable()
export class ProfileService {
  public wallets: Map<string, Wallet> = new Map<string, Wallet>();
  public profile: Profile = new Profile();

  private UPDATE_PERIOD = 15;
  private throttledBwsEvent: any;
  private validationLock: boolean = false;
  private errors: any = this.bwcService.getErrors();
  private queue: Array<any> = [];

  constructor(
    private logger: Logger,
    private persistenceService: PersistenceService,
    private configService: ConfigService,
    private bwcService: BwcService,
    private bwcErrorService: BwcError,
    private platformService: PlatformService,
    private appService: AppService,
    private languageService: LanguageService,
    private txFormatService: TxFormatService
  ) {
    console.log("Hello ProfileService!");
    this.throttledBwsEvent = _.throttle((n, wallet) => {
      this.newBwsEvent(n, wallet);
    }, 10000);
  }

  private updateWalletSettings(wallet: any): void {
    let config: any = this.configService.get();
    let defaults: any = this.configService.getDefaults();
    // this.config.whenAvailable(function (config) { TODO
    wallet.usingCustomBWS = config.bwsFor && config.bwsFor[wallet.id] && (config.bwsFor[wallet.id] != defaults.bws.url);
    wallet.name = (config.aliasFor && config.aliasFor[wallet.id]) || wallet.credentials.walletName;
    wallet.color = (config.colorFor && config.colorFor[wallet.id]);
    wallet.email = config.emailFor && config.emailFor[wallet.id];
    //});
  }

  public setBackupFlag(walletId: string): void {
    this.persistenceService.setBackupFlag(walletId).then(() => {
      this.logger.debug('Backup flag stored');
      this.wallets[walletId].needsBackup = false;
    }).catch((err) => {
      if (err) this.logger.error(err);
    });
  }

  private requiresBackup(wallet: any): boolean {
    if (wallet.isPrivKeyExternal()) return false;
    if (!wallet.credentials.mnemonic) return false;
    if (wallet.credentials.network == 'testnet') return false;

    return true;
  }

  private needsBackup(wallet: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.requiresBackup(wallet)) {
        return resolve(false);
      }

      this.persistenceService.getBackupFlag(wallet.credentials.walletId).then((val: string) => {
        if (val) {
          return resolve(false);
        }
        return resolve(true);
      }).catch((err) => {
        this.logger.error(err);
      });
    })
  }

  private balanceIsHidden(wallet: any): Promise<boolean> {
    return new Promise((resolve, reject) => {

      this.persistenceService.getHideBalanceFlag(wallet.credentials.walletId).then((shouldHideBalance: string) => {
        var hideBalance = (shouldHideBalance == 'true') ? true : false;
        return resolve(hideBalance);
      }).catch((err) => {
        this.logger.error(err);
      });
    });
  }

  // Adds a WalletService client (BWC) into the wallet.  
  private bindWalletClient(wallet: any, opts?: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log("Binding 1");    
      opts = opts ? opts : {};
      var walletId = wallet.credentials.walletId;

      if ((this.wallets[walletId] && this.wallets[walletId].started) && !opts.force) {
        console.log("Sqwiddler in the night.");
        reject(false);
      }

      // INIT WALLET VIEWMODEL
      wallet.id = walletId;
      wallet.started = true;
      wallet.network = wallet.credentials.network;
      wallet.copayerId = wallet.credentials.copayerId;
      wallet.m = wallet.credentials.m;
      wallet.n = wallet.credentials.n;
      wallet.unlocked = wallet.credentials.unlocked;
      wallet.shareCode = wallet.credentials.shareCode;

      this.updateWalletSettings(wallet);
      this.wallets[walletId] = wallet;

      console.log("Binding 2");    
      this.needsBackup(wallet).then((val: any) => {
        wallet.needsBackup = val;
      }).catch((err) => {
        console.log("NeedsBackup Failed!");
        console.log(err);
      });

      this.balanceIsHidden(wallet).then((val: any) => {
        wallet.balanceHidden = val;
      }).catch((err) => {
        console.log("BalanceIsHiddent");
      });;

      console.log("Binding 3");    
      wallet.removeAllListeners();

      wallet.on('report', (n: any) => {
        this.logger.info('BWC Report:' + n);
      });

      wallet.on('notification', (n: any) => {
        this.logger.debug('BWC Notification:', n);

        if (n.type == "NewBlock" && n.data.network == "testnet") {
          this.throttledBwsEvent(n, wallet);
        } else this.newBwsEvent(n, wallet);
      });

      console.log("Binding 4");    

      wallet.on('walletCompleted', () => {
        this.logger.debug('Wallet completed');

        this.updateCredentials(JSON.parse(wallet.export())).then(() => {
          //$rootScope.$emit('Local/WalletCompleted', walletId); TODO
        });
      });

      wallet.initialize({
        notificationIncludeOwn: true,
      }, (err: any) => {
        if (err) {
          console.log("Binding 5");    
          this.logger.error('Could not init notifications err:', err);
          return;
        }
        console.log("Binding 6");    
        wallet.setNotificationsInterval(this.UPDATE_PERIOD);
        wallet.openWallet((err: any) => {
          if (wallet.status !== true)
          this.logger.debug('Wallet + ' + walletId + ' status:' + wallet.status);
        });
      });
      console.log("Binding 6");    

      /* TODO $rootScope.$on('Local/SettingsUpdated', (e: any, walletId: string) => {
        if (!walletId || walletId == wallet.id) {
          this.logger.debug('Updating settings for wallet:' + wallet.id);
          this.updateWalletSettings(wallet);
        }
      }); */

      resolve(true);
    });
  }

  private newBwsEvent(n: any, wallet: any): void {
    if (wallet.cachedStatus)
      wallet.cachedStatus.isValid = false;

    if (wallet.completeHistory)
      wallet.completeHistory.isValid = false;

    if (wallet.cachedActivity)
      wallet.cachedActivity.isValid = false;

    if (wallet.cachedTxps)
      wallet.cachedTxps.isValid = false;

    //$rootScope.$emit('bwsEvent', wallet.id, n.type, n); TODO
  }

  public updateCredentials(credentials: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.profile.updateWallet(credentials);
      this.persistenceService.storeProfile(this.profile).then(() => {
        return resolve();
      });
    });
  }

  public getLastKnownBalance(wid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.persistenceService.getBalanceCache(wid).then((data: string) => {
        return resolve(data);
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  private addLastKnownBalance(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let now = Math.floor(Date.now() / 1000);
      let showRange = 600; // 10min;

      this.getLastKnownBalance(wallet.id).then((data: any) => {
        if (data) {
          let parseData = data;
          //let parseData: any = JSON.parse(data);
          wallet.cachedBalance = parseData.balance;
          wallet.cachedBalanceUpdatedOn = (parseData.updatedOn < now - showRange) ? parseData.updatedOn : null;
        }
        return resolve();
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  public setLastKnownBalance(wid: string, balance: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.persistenceService.setBalanceCache(wid, { balance: balance, updatedOn: Math.floor(Date.now() / 1000), });
      return resolve();
    });
  }

  private runValidation(wallet: any, delay?: number, retryDelay?: number) {

    delay = delay ? delay : 500;
    retryDelay = retryDelay ? retryDelay : 50;

    if (this.validationLock) {
      return setTimeout(() => {
        this.logger.debug('ValidatingWallet Locked: Retrying in: ' + retryDelay);
        return this.runValidation(wallet, delay, retryDelay);
      }, retryDelay);
    }
    this.validationLock = true;

    // IOS devices are already checked
    let skipDeviceValidation = this.platformService.isIOS || this.profile.isDeviceChecked(this.platformService.ua);
    let walletId = wallet.credentials.walletId;

    this.logger.debug('ValidatingWallet: ' + walletId + ' skip Device:' + skipDeviceValidation);
    setTimeout(() => {
      wallet.validateKeyDerivation({
        skipDeviceValidation: skipDeviceValidation,
      }, (err: any, isOK: any) => {
        this.validationLock = false;

        this.logger.debug('ValidatingWallet End:  ' + walletId + ' isOK:' + isOK);
        if (isOK) {
          this.profile.setChecked(this.platformService.ua, walletId);
        } else {
          this.logger.warn('Key Derivation failed for wallet:' + walletId);
          this.persistenceService.clearLastAddress(walletId).then(() => {
          });
        };

        this.storeProfileIfDirty();
      });
    }, delay);
  }

  /* 
    Profile-related Methods
  */ 
  public loadAndBindProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.persistenceService.getProfile().then((profile: any) => {

        if (!profile) {
          return resolve();
        }
        this.profile = new Profile();
        this.profile = this.profile.fromObj(profile);
        // Deprecated: storageService.tryToMigrate
        this.logger.debug('Profile read');
        return this.bindProfile(this.profile).then(() => {
          return resolve(this.profile);
        }).catch((err: any) => {
          return reject(err);
        });
      }).catch((err: any) => {
        //$rootScope.$emit('Local/DeviceError', err); TODO
        return reject(err);
      });
    });
  }

  public bindProfile(profile: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let config = this.configService.get();

      let bindWallets = (): Promise<any> => {
        return new Promise((resolve, reject) => {

          let l = profile.credentials.length;
          let i = 0;
          let totalBound = 0;

          if (!l) {
            return resolve();
          }

          _.each(profile.credentials, (credentials) => {
            this.bindWallet(credentials).then((bound: number) => {
              i++;
              totalBound += bound;
              if (i == l) {
                this.logger.info('Bound ' + totalBound + ' out of ' + l + ' wallets');
                return resolve();
              }
            }).catch((err) => {
              return reject(err);
            });
          });
        });
      };

      return bindWallets().then(() => {
        return this.isDisclaimerAccepted().then((accepted) => {
          if (accepted) {
            return resolve();
          } else {
            return resolve();
            //return reject(new Error('NONAGREEDDISCLAIMER: Non agreed disclaimer'));
          }
        }).catch(() => {
          return reject("Could not query disclaimer!");
        });
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  public storeProfileIfDirty(): void {
    if (this.profile.dirty) {
      this.persistenceService.storeProfile(this.profile).then((err: any) => {
        this.logger.debug('Saved modified Profile');
        return;
      });
    } else {
      return;
    };
  }

  public isDisclaimerAccepted(): Promise<boolean> {
    return new Promise((resolve, reject) => {

        let disclaimerAccepted = (this.profile && this.profile.disclaimerAccepted);
        if (disclaimerAccepted) {
          return resolve(true);
        }

        resolve(false);
    });
  }


  /* 
    Wallet-related Methods
  */ 
  
  public importWallet(str: string, opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let walletClient = this.bwcService.getClient(null, opts);

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
      } catch (err) {
        return reject('Could not import. Check input file and spending password'); // TODO getTextCatalog
      }

      let strParsed: any = JSON.parse(str);

      if (!strParsed.n) {
        return reject("Backup format not recognized. If you are using a Copay Beta backup and version is older than 0.10, please see: https://github.com/bitpay/copay/issues/4730#issuecomment-244522614");
      }

      let addressBook = strParsed.addressBook ? strParsed.addressBook : {};

      return this.addAndBindWalletClient(walletClient, {
        bwsurl: opts.bwsurl
      }).then((walletId: string) => {
        this.setMetaData(walletClient, addressBook).then(() => {
          return resolve(walletClient);
        }).catch((err: any) => {
          this.logger.warn(err);
          return reject(err);
        });
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  // Adds and bind a new client to the profile
  public addAndBindWalletClient(wallet: any, opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!wallet || !wallet.credentials) {
        return reject('Could not access wallet'); // TODO gettextCatalog
      }

      let walletId: string = wallet.credentials.walletId

      if (!this.profile.addWallet(JSON.parse(wallet.export()))) {
        return reject("Wallet already in " + this.appService.info.nameCase); // TODO gettextCatalog
      }


      let skipKeyValidation: boolean = this.shouldSkipValidation(walletId);
      if (!skipKeyValidation)
        this.runValidation(wallet);

      return this.bindWalletClient(wallet).then((success)=> {
        if (success) {
          console.log("Nailed it.");
        }
     
        let saveBwsUrl = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            let defaults: any = this.configService.getDefaults();
            let bwsFor: any = {};
            bwsFor[walletId] = opts.bwsurl || defaults.bws.url;

            // Dont save the default
            if (bwsFor[walletId] == defaults.bws.url) {
              return resolve();
            }

            this.configService.set({ bwsFor: bwsFor });
            return resolve();
          });
        };

        return saveBwsUrl().then(() => {
          return this.persistenceService.storeProfile(this.profile).then(() => {
            return resolve(wallet);
          });
        });
      }).catch((err) => {
        console.log("We got errored");
        console.log(err);
        return reject(err);
      });

    });
  }

  private shouldSkipValidation(walletId: string): boolean {
    return this.profile.isChecked(this.platformService.ua, walletId) || this.platformService.isIOS;
  }

  private setMetaData(wallet: any, addressBook: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.persistenceService.getAddressbook(wallet.credentials.network).then((localAddressBook: any) => {
        let localAddressBook1 = {};
        try {
          localAddressBook1 = JSON.parse(localAddressBook);
        } catch (ex) {
          this.logger.warn(ex);
        }
        let mergeAddressBook = _.merge(addressBook, localAddressBook1);
        this.persistenceService.setAddressbook(wallet.credentials.network, JSON.stringify(addressBook)).then(() => {
          return resolve();
        }).catch((err: any) => {
          return reject(err);
        });
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  public importMnemonic(words, opts) {
    return new Promise((resolve, reject) => {
        resolve({status: {}});  
    });
  }

  public importExtendedPrivateKey(xPrivKey: string, opts: any): Promise<any> {
    return new Promise((resolve, reject) => {

      var walletClient = this.bwcService.getClient(null, opts);
      this.logger.debug('Importing Wallet xPrivKey');

      walletClient.importFromExtendedPrivateKey(xPrivKey, opts).then(() => {
        // this.addAndBindWalletClient(walletClient, {
        //   bwsurl: opts.bwsurl
        // }).then((wallet: any) => {
        //   return resolve(wallet);
        // }).catch((err: any) => {
        //   return reject(err);
        // });
        return this.addAndBindWalletClient(walletClient, {
          bwsurl: opts.bwsurl
        });
      }).catch((err) => {
        if (err instanceof this.errors.NOT_AUTHORIZED) {
          return reject(err);
        }
        return reject(this.bwcErrorService.cb(err, 'Could not import'));
      });
    });
  }

 

  public importExtendedPublicKey(opts: any): Promise<any> {
    return new Promise((resolve, reject) => {

      var walletClient = this.bwcService.getClient(null, opts);
      this.logger.debug('Importing Wallet XPubKey');

      walletClient.importFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, {
        account: opts.account || 0,
        derivationStrategy: opts.derivationStrategy || 'BIP44',
      }).then(() => {

        this.addAndBindWalletClient(walletClient, {
          bwsurl: opts.bwsurl
        }).then((wallet: any) => {
          return resolve(wallet);
        }).catch((err: any) => {
          return reject(err);
        });
      }).catch((err) => {
        // in HW wallets, req key is always the same. They can't addAccess.
        if (err instanceof this.errors.NOT_AUTHORIZED)
          err.name = 'WALLET_DOES_NOT_EXIST';

        return reject (this.bwcErrorService.cb(err, 'Could not import'));
      });
    });
  }

  

  private bindWallet(credentials: any): Promise<any> {
    return new Promise((resolve, reject) => {

      if (!credentials.walletId || !credentials.m) {
        return reject('bindWallet should receive credentials JSON');
      }

      // Create the client
      let getBWSURL = (walletId: string) => {
        var config: any = this.configService.get();
        var defaults: any = this.configService.getDefaults();
        return ((config.bwsFor && config.bwsFor[walletId]) || defaults.bws.url);
      };

      let walletClient = this.bwcService.getClient(JSON.stringify(credentials), {
        bwsurl: getBWSURL(credentials.walletId),
      });

      var skipKeyValidation = this.shouldSkipValidation(credentials.walletId);
      if (!skipKeyValidation) this.runValidation(walletClient, 500);

      this.logger.info('Binding wallet:' + credentials.walletId + ' Validating?:' + !skipKeyValidation);
      return resolve(this.bindWalletClient(walletClient));
    });
  }


  
  public deleteWalletClient(wallet: any): Promise<any> {
    return new Promise((resolve, reject) => {

      var walletId = wallet.credentials.walletId;

      var config = this.configService.get();

      this.logger.debug('Deleting Wallet:', wallet.credentials.walletName);
      wallet.removeAllListeners();

      this.profile.deleteWallet(walletId);

      delete this.wallets[walletId];

      this.persistenceService.removeAllWalletData(walletId).catch((err: any) => {
        this.logger.warn(err);
      });

      this.persistenceService.storeProfile(this.profile).then(() => {
        return resolve();
      }).catch((err: any) => {
        return reject(err);
      });
    });
  };

  
  public setDisclaimerAccepted(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.profile.disclaimerAccepted = true;
      this.persistenceService.storeProfile(this.profile).then(() => {
        return resolve();
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  public getWallets(opts?: any): Promise<any> {

    return new Promise((resolve, reject) => {

      opts = opts || {};
      console.log("Getting wallets");
      console.log(this.wallets);
      let ret = _.values(this.wallets);

      if (opts.network) {
        ret = _.filter(ret, (x: any) => {
          return (x.credentials.network == opts.network);
        });
      }

      if (opts.network) {
        ret = _.filter(ret, (x: any) => {
          return (x.credentials.network == opts.network);
        });
      }

      if (opts.n) {
        ret = _.filter(ret, (w: any) => {
          return (w.credentials.n == opts.n);
        });
      }

      if (opts.m) {
        ret = _.filter(ret, (w: any) => {
          return (w.credentials.m == opts.m);
        });
      }

      if (opts.hasFunds) {
        ret = _.filter(ret, (w: any) => {
          if (!w.status) return;
          return (w.status.availableBalanceSat > 0);
        });
      }

      if (opts.minAmount) {
        ret = _.filter(ret, (w: any) => {
          if (!w.status) return;
          return (w.status.availableBalanceSat > opts.minAmount);
        });
      }

      if (opts.onlyComplete) {
        ret = _.filter(ret, (w: any) => {
          return w.isComplete();
        });
      } else { }

      // Add cached balance async
      _.each(ret, (x: any) => {
        this.addLastKnownBalance(x);
      });


      resolve(_.sortBy(ret, [(x: any) => {
          return x.isComplete();
        }, 'createdOn'])
      );

    });

  }

  public toggleHideBalanceFlag(walletId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.wallets[walletId].balanceHidden = !this.wallets[walletId].balanceHidden;
      this.persistenceService.setHideBalanceFlag(walletId, this.wallets[walletId].balanceHidden.toString()).then(() => {
        return resolve();
      }).catch((err: any) => {
        return reject(err);
      });
    });
  }

  public getNotifications(opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      opts = opts ? opts : {};

      let TIME_STAMP = 60 * 60 * 6;
      let MAX = 30;

      let typeFilter = {
        'NewOutgoingTx': 1,
        'NewIncomingTx': 1,
        'NewIncomingCoinbase': 1
      };

      this.getWallets().then((wallets) => {
        let w = wallets; 
        if (_.isEmpty(w)) return resolve();

        //let l = w.length;
        let l = 1; //temp!!
        let j = 0;
        let notifications = [];
  
  
        let isActivityCached = (wallet: any): boolean => {
          return wallet.cachedActivity && wallet.cachedActivity.isValid;
        }
  
  
        let updateNotifications = (wallet: any): Promise<any> => {
          return new Promise((resolve, reject) => {
  
            if (isActivityCached(wallet) && !opts.force) {
              return resolve();
            }
  
            wallet.getNotifications({
              timeSpan: TIME_STAMP,
              includeOwn: true,
            }, (err: any, n: any) => {
              if (err) {
                return reject(err);
              }
              wallet.cachedActivity = {
                n: n.slice(-MAX),
                isValid: true,
              };
  
              return resolve();
            });
          });
        }
  
        let process = (notifications: any): Array<any> => {
          if (!notifications) return [];
  
          let shown = _.sortBy(notifications, 'createdOn').reverse();
  
          shown = shown.splice(0, opts.limit || MAX);
  
          _.each(shown, (x: any) => {
            x.txpId = x.data ? x.data.txProposalId : null;
            x.txid = x.data ? x.data.txid : null;
            x.types = [x.type];
  
            if (x.data && x.data.amount) x.amountStr = this.txFormatService.formatAmountStr(x.data.amount);
  
            x.action = function () {
              // TODO?
              // $state.go('tabs.wallet', {
              //   walletId: x.walletId,
              //   txpId: x.txpId,
              //   txid: x.txid,
              // });
            };
          });
  
          // let finale = shown; GROUPING DISABLED!
  
          let finale = [];
          let prev: any;
  
  
          // Item grouping... DISABLED.
  
          // REMOVE (if we want 1-to-1 notification) ????
          _.each(shown, (x: any) => {
            if (prev && prev.walletId === x.walletId && prev.txpId && prev.txpId === x.txpId && prev.creatorId && prev.creatorId === x.creatorId) {
              prev.types.push(x.type);
              prev.data = _.assign(prev.data, x.data);
              prev.txid = prev.txid || x.txid;
              prev.amountStr = prev.amountStr || x.amountStr;
              prev.creatorName = prev.creatorName || x.creatorName;
            } else {
              finale.push(x);
              prev = x;
            }
          });
  
          let u = this.bwcService.getUtils();
          _.each(finale, (x: any) => {
            if (x.data && x.data.message && x.wallet && x.wallet.credentials.sharedEncryptingKey) {
              // TODO TODO TODO => BWC
              x.message = u.decryptMessage(x.data.message, x.wallet.credentials.sharedEncryptingKey);
            }
          });
  
          return finale;
        }
  
        _.each(w, (wallet: any) => {
          updateNotifications(wallet).then(() => {
            j++;
            let n = _.filter(wallet.cachedActivity.n, (x: any) => {
              return typeFilter[x.type];
            });
  
            let idToName = {};
            if (wallet.cachedStatus) {
              _.each(wallet.cachedStatus.wallet.copayers, (c: any) => {
                idToName[c.id] = c.name;
              });
            }
  
            _.each(n, (x: any) => {
              x.wallet = wallet;
              if (x.creatorId && wallet.cachedStatus) {
                x.creatorName = idToName[x.creatorId];
              };
            });
  
            notifications.push(n);
  
            if (j == l) {
              notifications = _.sortBy(notifications, 'createdOn');
              notifications = _.compact(_.flatten(notifications)).slice(0, MAX);
              let total = notifications.length;
              return resolve({ processArray: process(notifications), total: total });
            };
          }).catch((err: any) => {
            this.logger.warn('Error updating notifications:' + err);
          });
        });
      });
    });
  }

  public getTxps(opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let MAX = 100;
      opts = opts ? opts : {};

      let w = this.getWallets();
      if (_.isEmpty(w)) {
        return reject('No wallets available');
      }

      let txps = [];

      _.each(w, (x: any) => {
        if (x && x.pendingTxps)
          txps = txps.concat(x.pendingTxps);
      });
      let n = txps.length;
      txps = _.sortBy(txps, 'pendingForUs', 'createdOn');
      txps = _.compact(_.flatten(txps)).slice(0, opts.limit || MAX);
      return resolve({ txps: txps, n: n });
    });
  };

  /*
   This is useful because it helps us know whether or not to show 
   the user occasional helpful guidance about how to get started with Merit. 
   (Beyond the onboarding flow.)
  */
  public hasOwnedMerit(): boolean {
    return true;
  }

  /**
   * This method tells us of the user has funds in any of their wallets.
   */

  public hasFunds(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let allWallets = this.wallets;
      return this.getWallets().then((allWallets) => {
        let walletsWithMerit = _.filter(allWallets, (wallet:any) => {
          return (wallet.status && wallet.status.totalBalanceSat > 0);
        });
        let totalMicros = _.reduce(walletsWithMerit, (totalBalance, filteredWallet) => {
            return totalBalance + filteredWallet.status.totalBalanceSat;
          }, 0);
        return (totalMicros > 0) ? resolve(true) : resolve(false);
      });
    });
  }
}
