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

  public communityInfo: {
    communitySize: number,
    networkValue: number,
    miningRewards: number,
    growthRewards: number,
    wallets: Array<{
      name: string,
      alias: string,
      referralAddress: string,
      confirmed: boolean,
      communitySize: number,
      miningRewards: number,
      growthRewards: number,
      color: string
    }>;
  };

  constructor(
    private persistenceService: PersistenceService,
    private logger: LoggerService,
    private events: Events,
    private mwcService: MWCService
  ){
    this.loadProfile();
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
      case 'IncomingTx':
        eventName = 'Remote:IncomingTx';
        break;
      default:
        return;
    }
    this.logger.info('Publishing an event with this name: ' + eventName);
    this.events.publish(eventName, wallet.id, n.type, n);
  }


  async loadProfile() {
    const profile = await this.persistenceService.getProfile();

    let wallets = [];
    if (profile) {
      if (profile.wallets) {
        wallets = profile.wallets.map(w => MeritWalletClient.fromObj(w));
      } else if (profile.credentials) {
        wallets = profile.credentials.map(c =>
          this.mwcService.getClient(JSON.stringify(c))
        )
      }
    }
    this.wallets = wallets;
    this.storeProfile();

    return profile;
  }

  async isAuthorized() {
    if (this.wallets == undefined) await this.loadProfile();
    return (this.wallets.length > 0);
  }

  async getWallets() {
    if (this.wallets == undefined) await this.loadProfile();
    return this.wallets;
  }

  async getConfimedWallets() {
    if (this.wallets == undefined) await this.loadProfile();
    return this.wallets.filter(w => w.confirmed);
  }

  async getVaults() {
    if (this.wallets == undefined) await this.loadProfile();
    let vaults = [];
    this.wallets.forEach(w => {
      w.vaults.forEach(v => {
        v.walletClient = w;
        vaults.push(v);
      });
    });
    return vaults;
  }

  async refreshData() {
    let updateWallets = () => this.wallets.map(async (w) => {
      status = await w.getStatus();
    });

    let updateVaults = () => this.wallets.map(async (w) => {
      w.vaults = await w.getVaults();
      w.vaults.forEach(v => {
        v.walletClient = w;
      })
    });

    await Promise.all(updateWallets().concat(updateVaults()));
    this.storeProfile();
  }

  async addWallet(wallet: MeritWalletClient) {

    if (this.wallets.find(w => w.id == wallet.credentials.walletId)) throw new Error('Wallet already added');

    wallet.initialize(true);

    await wallet.openWallet();

    this.wallets.push(wallet);

    await this.refreshData();
    await this.storeProfile();
    return wallet;
  }

  async updateWallet(wallet: MeritWalletClient) {

    this.wallets = this.wallets.filter(w => w.id != wallet.id);

    this.wallets.push(wallet);

    return this.storeProfile();
  }

  async deleteWallet(wallet: MeritWalletClient) {
    this.wallets = this.wallets.filter(w => (w.id != wallet.id));
    return this.storeProfile();
  }

  async addVault(vault: IVault) {

    this.wallets.some(w => {
      if (w.id == vault.walletClient.id) {
        if (!w.vaults) w.vaults = [];
        w.vaults.push(vault);
        return true;
      }
    });

    return this.storeProfile();
  }

  async updateVault(vault: IVault) {

    this.wallets.some(w => {
      if (w.id == vault.walletClient.id) {
        w.vaults = w.vaults.filter(v => (v._id != vault._id));
        w.vaults.push(vault);
        return true;
      }
    });

    return this.storeProfile();
  }

  storeProfile() {

    if (this.wallets == undefined) return;

    /** do not save profile if we have wallet in temporary mode */
    if (this.wallets.find(w => !w.credentialsSaveAllowed)) return;

    let profile = {
      version: '2.0.0',
      wallets: this.wallets.map(w => w.toObj()),
      credentials: this.wallets.map(w => w.export())
    };

    this.persistenceService.storeProfile(profile);
  }

  isCommunityPopupClosed() {
    return this.persistenceService.isCommunityPopupClosed();
  }

  closeCommunityPopup() {
    return this.persistenceService.closeCommunityPopup();
  }

  async refreshCommunityInfo() {
    await this.refreshData();
    const wallets = await this.getWallets();

    const network = {
      communitySize: 0,
      networkValue: 0,
      miningRewards: 0,
      growthRewards: 0,
      wallets: wallets.map(w => { return {
        name: w.name,
        alias: w.rootAlias,
        referralAddress: w.rootAddress.toString(),
        confirmed: w.confirmed,
        communitySize: 0,
        miningRewards: 0,
        growthRewards: 0,
        color: w.color
      }})
    };

    const addresses = network.wallets.map(w => w.referralAddress);

    if (addresses.length) {

      const getCommunitySizes = () => addresses.map(async (address) => {
        const { referralcount } = await wallets[0].getCommunityInfo(address);
        let w = network.wallets.find(w => w.referralAddress == address);
        w.communitySize = referralcount;
        network.communitySize += referralcount;
      });

      const getRewards = async () => {
        const rewards = await this.wallets[0].getRewards(addresses);
        rewards.forEach(r => {
          let w = network.wallets.find(w => w.referralAddress == r.address);
          w.miningRewards = r.rewards.mining;
          w.growthRewards = r.rewards.ambassador;
          network.miningRewards += w.miningRewards;
          network.growthRewards += w.growthRewards;
        });
      };

      await Promise.all([getRewards()].concat(getCommunitySizes()));
    }

    this.communityInfo = network;
    this.persistenceService.storeCommunityInfo(this.communityInfo);
    return network;
  }

  async getCommunityInfo() {
    if (this.communityInfo == undefined) {
      this.communityInfo = await this.persistenceService.getCommunityInfo();
      if (!this.communityInfo) await this.refreshCommunityInfo();
    }
    return this.communityInfo;
  }

}
