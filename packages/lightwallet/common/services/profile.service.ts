import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular/util/events';
import * as _ from 'lodash';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { ENV } from '@app/env';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { Profile } from '@merit/common/models/profile';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { ConfigService } from '@merit/common/services/config.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { IVault } from "@merit/common/models/vault";

/*
  Historically, this acted as the API-Client
  Now, the goal is to roll up convenience-statistics
  and keep a list of wallets.
*/
@Injectable()
export class ProfileService {
  public wallets: Map<string, MeritWalletClient> = new Map<string, MeritWalletClient>();
  public vaults: Array<IVault> = [];
  public profile: Profile = new Profile();

  private UPDATE_PERIOD = 3;
  private validationLock: boolean = false;
  private errors: any = this.bwcService.getErrors();
  private queue: Array<any> = [];
  private toast: any;
  private throttledBwsEvent = _.throttle((n, wallet) => {
    this.propogateBwsEvent(n, wallet);
  }, 10000);

  constructor(
    private logger: LoggerService,
    private persistenceService: PersistenceService,
    private configService: ConfigService,
    private bwcService: MWCService,
    private platformService: PlatformService,
    private appService: AppSettingsService,
    private txFormatService: TxFormatService,
    private events: Events
  ) {
    this.logger.info('Hello ProfileService!');
  }

  public updateWalletSettings(wallet: MeritWalletClient): void {
    let config: any = this.configService.get();
    let defaults: any = this.configService.getDefaults();
    // this.config.whenAvailable(function (config) { TODO
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

  /**
   * This method is called when we receive a 'notification' event
   * from the EventEmitter on the MeritWalletClient.
   *
   * Here we filter event types and propogate them to the rest of the application via
   * Ionic Events.
   */
  public propogateBwsEvent(n: any, wallet: MeritWalletClient): void {
    this.logger.info('We are in newBwsEvent on profileService');
    if (wallet.cachedStatus)
      wallet.cachedStatus.isValid = false;

    if (wallet.completeHistory)
      wallet.completeHistory.isValid = false;

    if (wallet.cachedActivity)
      wallet.cachedActivity.isValid = false;

    if (wallet.cachedTxps)
      wallet.cachedTxps.isValid = false;

    let eventName: string;
    switch (n.type) {
      case 'NewBlock':
        eventName = 'Remote:NewBlock';
        break;
      case 'IncomingTx':
        eventName = 'Remote:IncomingTx';
        break;
      case 'IncomingCoinbase':
        eventName = 'Remote:IncomingCoinbase';
        break;
      case 'IncomingEasySend':
        eventName = 'Remote:IncomingEasySend';
        break;
      case 'IncomingTxProposal':
        eventName = 'Remote:IncomingTxProposal';
        break;
      default:
        eventName = 'Remote:GenericBwsEvent';
        break;
    }
    this.logger.info('Publishing an event with this name: ' + eventName);
    this.events.publish(eventName, wallet.id, n.type, n);
  }

  public updateCredentials(credentials: any): Promise<void> {
    this.profile.updateWallet(credentials);
    return this.persistenceService.storeProfile(this.profile);
  }

  getLastKnownBalance(wid: string): Promise<string> {
    return this.persistenceService.getBalanceCache(wid);
  }

  setLastKnownBalance(wid: string, balance: number): Promise<void> {
    return this.persistenceService.setBalanceCache(wid, {
      balance: balance,
      updatedOn: Math.floor(Date.now() / 1000),
    });
  }

  /*
    Profile-related Methods
  */
  async loadAndBindProfile(): Promise<Profile> {
    const profile: Profile = await this.persistenceService.getProfile();
    if (_.isEmpty(profile)) return;
    this.profile = new Profile().fromObj(profile);
    // Deprecated: storageService.tryToMigrate
    this.logger.debug('Profile read');
    await this.bindProfile(this.profile);
    return this.profile;
  }

  // TODO: move to Starter module, with minimal dependencies
  async getProfile() {
    // If there are no credentials, we assume that the profile has not been bound.
    if (this.profile && this.profile.credentials.length > 0) {
      return this.profile;
    } else {
      return this.loadAndBindProfile();
    }
  }

  async bindProfile(profile: any): Promise<any> {
    let l = profile.credentials.length;
    let i = 0;
    let totalBound = 0;

    if (!l) {
      return;
    }

    await Promise.all(profile.credentials.map(async (credentials) => {
      await this.bindWallet(credentials);
      i++;
      totalBound += 1;
      if (i == l) {
        this.logger.info('Bound ' + totalBound + ' out of ' + l + ' wallets');
      }
    }));

    try {
      await this.isDisclaimerAccepted();
    } catch (err) {
      throw new Error('Could not query disclaimer!');
    }
  }

  // TODO: Revisit this implementation.
  public storeProfileIfDirty(): void {
    if (this.profile.dirty) {
      this.persistenceService.storeProfile(this.profile).then((err: any) => {
        this.logger.debug('Saved modified Profile');
        return;
      });
    } else {
      return;
    }
  }

  // TODO this method can be sync
  async isDisclaimerAccepted() {
    return this.profile && this.profile.disclaimerAccepted;
  }

  async importWallet(str: string, opts: any): Promise<MeritWalletClient> {
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
      throw 'Could not import. Check input file and spending password'; // TODO getTextCatalog
    }

    let strParsed: any = JSON.parse(str);
    let addressBook = strParsed.addressBook ? strParsed.addressBook : {};

    const wallet = await this.addAndBindWalletClient(walletClient, { bwsurl: opts.bwsurl });
    await this.setMetaData(wallet, addressBook);
    return wallet;
  }

  // Adds and bind a new client to the profile
  async addAndBindWalletClient(wallet: MeritWalletClient, opts: any): Promise<MeritWalletClient> {
    if (!wallet || !wallet.credentials) {
      throw 'Could not access wallet'; // TODO gettextCatalog
    }
    let walletId: string = wallet.credentials.walletId;

    if (!this.profile.addWallet(JSON.parse(wallet.export()))) {
      const appInfo: any = await this.appService.getInfo();
      throw 'Wallet already in ' + appInfo.nameCase; // TODO gettextCatalog
    }

    if (!this.shouldSkipValidation(walletId))
      await this.runValidation(wallet);

    try {
      const alreadyBound: boolean = await this.bindWalletClient(wallet);

      if (!alreadyBound) {
        this.logger.info('WalletClient already bound; skipping profile storage...');
        return;
      }

      let defaults: any = this.configService.getDefaults();
      let bwsFor: any = {};
      bwsFor[walletId] = opts.bwsurl || ENV.mwsUrl;

      // Dont save the default
      if (bwsFor[walletId] != ENV.mwsUrl) {
        this.configService.set({ bwsFor: bwsFor });
      }

      await this.persistenceService.storeProfile(this.profile);
      return wallet;
    } catch (err) {
      this.logger.info('We got errored');
      this.logger.info(err);
      throw new Error(err);
    }
  }

  async importExtendedPrivateKey(xPrivKey: string, opts: any): Promise<any> {
    const walletClient = this.bwcService.getClient(null, opts);
    this.logger.debug('Importing Wallet xPrivKey');

    try {
      await walletClient.importFromExtendedPrivateKey(xPrivKey, opts);
      return this.addAndBindWalletClient(walletClient, { bwsurl: opts.bwsurl });
    } catch (err) {
      if (err instanceof this.errors.NOT_AUTHORIZED) {
        throw err;
      }
      throw 'MWC Error: Could not import';
    }
  }

  async importExtendedPublicKey(opts: any): Promise<any> {
    const walletClient = this.bwcService.getClient(null, opts);
    this.logger.debug('Importing Wallet XPubKey');

    try {
      await walletClient.importFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, {
        account: opts.account || 0,
        derivationStrategy: opts.derivationStrategy || 'BIP44',
      });

      return this.addAndBindWalletClient(walletClient, {
        bwsurl: opts.bwsurl
      });
    } catch (err) {
      // in HW wallets, req key is always the same. They can't addAccess.
      if (err instanceof this.errors.NOT_AUTHORIZED)
        err.name = 'WALLET_DOES_NOT_EXIST';

      throw 'MWC Error: Could not import';
    }
  }

  async deleteWalletClient(wallet: MeritWalletClient): Promise<any> {
    const walletId = wallet.credentials.walletId;

    this.logger.debug('Deleting Wallet:', wallet.credentials.walletName);
    wallet.eventEmitter.removeAllListeners();

    this.profile.deleteWallet(walletId);

    delete this.wallets[walletId];

    try {
      await this.persistenceService.removeAllWalletData(walletId);
      await this.persistenceService.storeProfile(this.profile);
    } catch (err) {
      this.logger.warn(err);
    }
  }

  async setDisclaimerAccepted(): Promise<any> {
    this.profile.disclaimerAccepted = true;
    await this.persistenceService.storeProfile(this.profile);
  }

  async getWallets(opts: any = {}): Promise<MeritWalletClient[]> {
    await this.getProfile();
    let ret: MeritWalletClient[] = _.values(this.wallets);

    ret = ret.filter((x: any) =>
      (!opts.network || x.credentials.network == opts.network) &&
      (!opts.n || x.credentials.n == opts.n) &&
      (!opts.m || x.credentials.m == opts.m) &&
      (!opts.hasFunds || (x.status && x.status.availableBalanceSat > 0)) &&
      (!opts.minAmount || (x.status && x.status.availableBalanceSat > opts.minAmount)) &&
      (!opts.onlyComplete || x.isComplete())
    );

    ret.forEach(this.addLastKnownBalance.bind(this));

    return _.sortBy(ret, [(x: any) => x.isComplete(), 'createdOn']);
  }


  /*
    Wallet-related Methods
  */

  async getHeadWalletClient() {
    const ws = await this.getWallets();
    if (_.isEmpty(ws)) {
      return;
    }
    return _.head(ws);
  }

  public getWallet(walletId: string): MeritWalletClient {
    const wallet = this.wallets[walletId];
    if (wallet) {
      this.addLastKnownBalance(wallet);
      return wallet;
    }
  }

  async toggleHideBalanceFlag(walletId: string): Promise<any> {
    this.wallets[walletId].balanceHidden = !this.wallets[walletId].balanceHidden;
    await this.persistenceService.setHideBalanceFlag(walletId, this.wallets[walletId].balanceHidden.toString());
  }

  public async getNotifications(opts: any): Promise<any> {
    opts = opts ? opts : {};

    let TIME_STAMP = 60 * 60 * 6;
    let MAX = 30;

    let typeFilter = {
      'OutgoingTx': 1,
      'IncomingTx': 1,
      'IncomingCoinbase': 1
    };

    let isActivityCached = (wallet: MeritWalletClient): boolean => {
      return wallet.cachedActivity && wallet.cachedActivity.isValid;
    };
    let updateNotifications = async (wallet: MeritWalletClient): Promise<any> => {
      if (isActivityCached(wallet) && !opts.force) {
        return;
      }

      const n = await wallet.getNotifications({
        timeSpan: TIME_STAMP,
        includeOwn: true,
      });

      wallet.cachedActivity = {
        n: n.slice(-MAX),
        isValid: true,
      };
    };
    let process = (notifications: any): Array<any> => {
      if (!notifications) return [];

      let shown = _.sortBy(notifications, 'createdOn').reverse();

      shown = shown.splice(0, opts.limit || MAX);

      _.each(shown, (x: any) => {
        x.txpId = x.data ? x.data.txProposalId : null;
        x.txid = x.data ? x.data.txid : null;
        x.types = [x.type];

        if (x.data && x.data.amount) x.amountStr = this.txFormatService.formatAmountStr(x.data.amount);
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
    };

    try {
      const w = await this.getWallets();

      if (_.isEmpty(w)) return;

      let notifications = [];

      await Promise.all(w.map(async (wallet: MeritWalletClient) => {
        await updateNotifications(wallet);
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
          }
        });

        notifications.push(n);
      }));

      // Return the roll-up of notificaitons across wallets.
      notifications = _.sortBy(notifications, 'createdOn');
      notifications = _.compact(_.flatten(notifications)).slice(0, MAX);
      let total = notifications.length;
      return { notifications: process(notifications), count: total };
    } catch (err) {
      this.logger.warn('Error updating notifications:' + err);
    }
  }

  async getTxps(opts: any): Promise<any> {
    let MAX = 100;
    opts = opts ? opts : {};

    const walletClients: MeritWalletClient[] = await this.getWallets();
    if (_.isEmpty(walletClients)) {
      return { txps: [], n: 0 }
    }

    let txps = [];

    _.each(walletClients, (x: any) => {
      if (x && x.pendingTxps)
        txps = txps.concat(x.pendingTxps);
    });

    let n = txps.length;
    txps = _.sortBy(txps, 'pendingForUs', 'createdOn');
    txps = _.compact(_.flatten(txps)).slice(0, opts.limit || MAX);
    return { txps: txps, n: n };
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

  async hasFunds(): Promise<boolean> {
    const allWallets = await this.getWallets();

    const walletsWithMerit = _.filter(allWallets, (wallet: any) =>
      (wallet.status && wallet.status.totalBalanceMicros > 0)
    );

    const totalMicros = _.reduce(walletsWithMerit, (totalBalance, filteredWallet) =>
      totalBalance + filteredWallet.status.totalBalanceMicros
      , 0);

    return totalMicros > 0;
  }

  public addVault(vault: any) {
    this.vaults.push(vault);
  }

  public updateVault(vault: any) {
    this.vaults.some((v:any) => {
      if (vault._id == v._id) {
        v = vault; 
        return true;
      }
    });
  }

  public async getVaults(reload: boolean = false) {
    if (!this.wallets) return [];
    if (!this.vaults.length || reload) {  
        let wallets: MeritWalletClient[] = _.values(this.wallets);
        this.vaults = [];
        for (let wallet of wallets) {
          const vaults = await wallet.getVaults();
          this.vaults = this.vaults.concat( vaults.map(v => Object.assign(v, {walletClient: wallet})) );  
        }
    }
    return this.vaults; 
  }

  private requiresBackup(wallet: MeritWalletClient): boolean {
    if (wallet.isPrivKeyExternal()) return false;
    if (!wallet.credentials.mnemonic) return false;

    return wallet.credentials.network != 'testnet';
  }

  private needsBackup(wallet: MeritWalletClient): Promise<boolean> {


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

  private async balanceIsHidden(wallet: MeritWalletClient): Promise<boolean> {
    try {
      return !!await this.persistenceService.getHideBalanceFlag(wallet.credentials.walletId);
    } catch (err) {
      this.logger.error(err);
    }
  }

  // Adds a WalletService client (BWC) into the wallet.
  private async bindWalletClient(wallet: MeritWalletClient, opts?: any): Promise<boolean> {
    try {

      this.logger.info('Binding the wallet client!');
      this.logger.info('Binding 1');
      opts = opts ? opts : {};
      let walletId = wallet.credentials.walletId;

      // Wallet is already bound
      if ((this.wallets[walletId] && this.wallets[walletId].started) && !opts.force) {
        return false;
      }

      // INIT WALLET VIEWMODEL
      wallet.id = walletId;
      wallet.started = true;
      wallet.network = wallet.credentials.network;
      wallet.copayerId = wallet.credentials.copayerId;
      wallet.m = wallet.credentials.m;
      wallet.n = wallet.credentials.n;
      wallet.unlocked = wallet.credentials.unlocked;
      wallet.parentAddress = wallet.credentials.parentAddress;
      this.updateWalletSettings(wallet);
      this.wallets[walletId] = wallet;

      await wallet.initialize({ notificationIncludeOwn: true });

      wallet.balanceHidden = await this.balanceIsHidden(wallet);

      wallet.eventEmitter.removeAllListeners();

      wallet.eventEmitter.on('report', (n: any) => {
        this.logger.info('BWC Report:' + n);
      });

      wallet.eventEmitter.on('notification', (n: any) => {
        this.logger.info('BWC Notification:', n);

        if (n.type == 'NewBlock' && n.data.network == ENV.network) {
          this.throttledBwsEvent(n, wallet);
        } else this.propogateBwsEvent(n, wallet);
      });

      wallet.eventEmitter.on('walletCompleted', () => {
        return this.updateCredentials(JSON.parse(wallet.export())).then(() => {
          this.logger.info('Updated the credentials and now publishing this: ', walletId);
          this.events.publish('Local:WalletCompleted', walletId);
          return Promise.resolve(); // not sure this is needed
        });
      });

      wallet.needsBackup = await this.needsBackup(wallet);

      const openWallet = await wallet.openWallet();

      if (wallet.status !== true) {
        this.logger.info('Wallet + ' + walletId + ' status:' + openWallet.status);
      }

      /* TODO $rootScope.$on('Local/SettingsUpdated', (e: any, walletId: string) => {
        if (!walletId || walletId == wallet.id) {
          this.logger.debug('Updating settings for wallet:' + wallet.id);
          this.updateWalletSettings(wallet);
        }
      }); */

      return true;

    } catch (err) {

      this.logger.error('Could not bind the wallet client:', err);
      throw new Error('Could not bind wallet client!');

    }
  }

  private async addLastKnownBalance(wallet: MeritWalletClient): Promise<void> {
    let now = Math.floor(Date.now() / 1000);
    let showRange = 600; // 10min;

    const data: any = await this.getLastKnownBalance(wallet.id);
    if (data) {
      let parseData = data;
      //let parseData: any = JSON.parse(data);
      wallet.cachedBalance = parseData.balance;
      wallet.cachedBalanceUpdatedOn = (parseData.updatedOn < now - showRange) ? parseData.updatedOn : null;
    }
  }

  private async runValidation(wallet: MeritWalletClient, delay?: number, retryDelay?: number) {

    delay = delay ? delay : 500;
    retryDelay = retryDelay ? retryDelay : 500;

    if (this.validationLock) {
      return setTimeout(() => {
        return this.runValidation(wallet, delay, retryDelay);
      }, retryDelay);
    }
    this.validationLock = true;

    // IOS devices are already checked
    let skipDeviceValidation = this.platformService.isIOS || this.profile.isDeviceChecked(this.platformService.ua);
    let walletId = wallet.credentials.walletId;

    this.logger.debug('ValidatingWallet: ' + walletId + ' skip Device:' + skipDeviceValidation);
    try {
      const isOK: boolean = await Observable.fromPromise(wallet.validateKeyDerivation({
        skipDeviceValidation,
      })).timeout(1000).toPromise();

      this.validationLock = false;

      this.logger.debug('ValidatingWallet End:  ' + walletId + ' isOK:' + isOK);

      if (isOK) {
        this.profile.setChecked(this.platformService.ua, walletId);
      } else {
        this.logger.warn('Key Derivation failed for wallet:' + walletId);
        this.persistenceService.clearLastAddress(walletId);
      }

      this.storeProfileIfDirty();

    } catch (e) {
      throw new Error('Validating wallet timed out');
    }
  }

  // todo move to Starter module, with minimal dependencies
  private async loadProfile(): Promise<Profile> {
    const profile: Profile = await this.persistenceService.getProfile();

    if (!profile) return;

    this.profile = new Profile();
    this.profile = this.profile.fromObj(profile);
    return profile;
  }

  private shouldSkipValidation(walletId: string): boolean {
    return this.profile.isChecked(this.platformService.ua, walletId) || this.platformService.isIOS;
  }

  private async setMetaData(wallet: MeritWalletClient, addressBook: any): Promise<any> {
    const localAddressBook: any = await this.persistenceService.getAddressbook(wallet.credentials.network);
    const mergeAddressBook = _.merge(addressBook, (localAddressBook || {}));
    await this.persistenceService.setAddressbook(wallet.credentials.network, mergeAddressBook);
  }

  private async bindWallet(credentials: any): Promise<any> {
    if (!credentials.walletId || !credentials.m) {
      throw 'bindWallet should receive credentials JSON';
    }

    // Create the client
    const config: any = this.configService.get();
    const defaults: any = this.configService.getDefaults();
    const bwsurl = ((config.bwsFor && config.bwsFor[credentials.walletId]) || ENV.mwsUrl);

    const walletClient = this.bwcService.getClient(JSON.stringify(credentials), { bwsurl });

    const skipKeyValidation = this.shouldSkipValidation(credentials.walletId);
    if (!skipKeyValidation)
      await this.runValidation(walletClient, 500);

    this.logger.info('Binding wallet:' + credentials.walletId + ' Validating?:' + !skipKeyValidation);

    await this.bindWalletClient(walletClient);

    return walletClient;
  }

  /*
  * returns addresses strings we decided to hide when declining unlock request
  */
  public getHiddenUnlockRequestsAddresses() {
    return this.persistenceService.getHiddenUnlockRequestsAddresses();
  }

}
