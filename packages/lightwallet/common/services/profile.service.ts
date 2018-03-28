import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular/util/events';
import { ENV } from '@app/env';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { IVault } from "@merit/common/models/vault";
import { LoggerService } from '@merit/common/services/logger.service';
import { MWCService } from '@merit/common/services/mwc.service';

/**
 * keeps and manages user data
 */
@Injectable()
export class ProfileService {

  public wallets: Array<MeritWalletClient>;

  constructor(
    private persistenceService: PersistenceService,
    private logger: LoggerService,
    private events: Events,
    private mwcService: MWCService
  ){
    this.loadProfile().then(() => this.refreshData());
  }

  /**
   * This method is called when we receive a 'notification' event
   * from the EventEmitter on the MeritWalletClient.
   *
   * Here we filter event types and propogate them to the rest of the application via
   * Ionic Events.
   */
  public propogateBwsEvent(n: any, wallet: MeritWalletClient): void {
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


  async loadProfile() {
    let profile = await this.persistenceService.getProfile();

    let wallets = [];
    if (profile) {
      if (profile.wallets) {
        wallets = profile.wallets.map(w => MeritWalletClient.fromObj(w));
      } else if (profile.credentials) {
        wallets = profile.credentials.map(c => {
          let wallet = this.mwcService.getClient(JSON.stringify(c));
          return wallet;
        })
      }
    }
    this.wallets = wallets;
    this.storeProfile();
  }

  async isAuthorized() {
    if (this.wallets == undefined) await this.loadProfile();
    return (this.wallets.length > 0);
  }

  async getWallets() {
    if (this.wallets == undefined) await this.loadProfile();
    return this.wallets;
  }

  async getVaults() {
    if (this.wallets == undefined) await this.loadProfile();
    let vaults = [];
    this.wallets.forEach(w => vaults.concat(w.vaults));
    return vaults;
  }

  async refreshData() {
    let updateWallets = () => this.wallets.map(async (w) => {
      status = await w.getStatus();
    });

    let updateVaults = () => this.wallets.map(async (w) => {
      w.vaults = await w.getVaults();
    });

    await Promise.all(updateWallets().concat(updateVaults()));
    this.storeProfile();
  }

  async addWallet(wallet: MeritWalletClient) {

    if (this.wallets.find(w => w.id == wallet.credentials.walletId)) throw new Error('Wallet already added');

    await wallet.initialize({ notificationIncludeOwn: true });

    wallet.eventEmitter.on('report', (n: any) => { this.logger.info('NWC Report:' + n); });

    wallet.eventEmitter.on('notification', (n: any) => {
      this.logger.info('MWC Notification:', n);

      //if (n.type == 'NewBlock' && n.data.network == ENV.network) {
      //  this.throttledBwsEvent(n, wallet);
      //} else this.propogateBwsEvent(n, wallet);
    });

    wallet.eventEmitter.on('walletCompleted', () => {
      //to do we need this
      //return this.updateCredentials(JSON.parse(wallet.export())).then(() => {
      //  this.logger.info('Updated the credentials and now publishing this: ', walletId);
      //  this.events.publish('Local:WalletCompleted', walletId);
      //  return Promise.resolve(); // not sure this is needed
      //});
    });

    await wallet.openWallet();

    this.wallets.push(wallet);

    await this.storeProfile();
    return wallet;
  }

  async updateWallet(wallet: MeritWalletClient) {

    //todo check if w has .id
    this.wallets = this.wallets.filter(w => w.id == wallet.id);

    this.wallets.push(wallet);

    return this.storeProfile();
  }

  async deleteWallet(wallet: MeritWalletClient) {

    wallet.eventEmitter.removeAllListeners();

    this.wallets = this.wallets.filter(w => w.id == wallet.id);

    return this.storeProfile();
  }

  async addVault(vault: IVault) {

    this.wallets.some(w => {
      if (w.id == vault.walletClient.id) {
        if (!w.vaults) w.vaults = [];
        w.vaults.push(vault); //todo remove client from vault
        return true;
      }
    });

    return this.storeProfile();
  }

  async updateVault(vault: IVault) {

    //todo find and update vault

    return this.storeProfile();
  }

  storeProfile() {

    let profile = {
      version: '2.0.0',
      wallets: this.wallets.map(w => w.toObj()),
      credentials: this.wallets.map(w => w.export())
    };

    this.persistenceService.storeProfile(profile);
  }
}