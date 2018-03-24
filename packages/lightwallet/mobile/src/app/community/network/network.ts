import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage } from 'ionic-angular';
import { ProfileService } from '@merit/common/services/profile.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@IonicPage()
@Component({
  selector: 'view-network',
  templateUrl: 'network.html',
})
export class NetworkView {

  loading: boolean;
  refreshing: boolean;

  wallets: Array<MeritWalletClient>;

  network:{
    networkValue: number,
    miningRewards: number,
    ambassadorRewards: number
    wallets: Array<{
      name: string,
      referralAddress: string,
      alias: string,
      confirmed: boolean,
      networkValue: number
      miningRewards: number,
      ambassadorRewards: number
    }>
  };

  activeUnlockRequests: number;
  availableInvites: number;
  shareButtonAvailable: boolean;

  constructor(
    private toastCtrl: MeritToastController,
    private socialSharing: SocialSharing,
    private profileService: ProfileService,
    private unlockRequestService: UnlockRequestService,
    private logger: LoggerService,
    platformService: PlatformService
  ) {
    this.shareButtonAvailable = platformService.isCordova;
    this.network = {
      networkValue: 0,
      miningRewards: 0,
      ambassadorRewards: 0,
      wallets: []
    };
  }

  async ionViewDidLoad() {
    this.loading = true;
    await this.updateInfo();
    this.loading = false;
  }

  async ionViewWillEnter() {
    this.refreshing = true;
    if (!this.loading) await this.updateInfo();
    this.refreshing = false;
  }

  async doRefresh(refresher) {
    this.refreshing = true;
    await this.updateInfo();
    this.refreshing = false;
    refresher.complete();
  }

  shareAddress(address) {
    return this.socialSharing.share(address);
  }

  notifyCopy() {
    this.toastCtrl.create({
      message: 'Copied to clipboard',
      cssClass: ToastConfig.CLASS_SUCCESS
    }).present();
  }

  private async updateInfo() {
    try {
      await Promise.all([this.loadInfo(), this.loadRequests()]);
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.create({
        message: err.text || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
  }

  private async loadInfo() {

      this.wallets = await this.profileService.getWallets();

      let network = {
        networkValue: 0,
        miningRewards: 0,
        ambassadorRewards: 0,
        wallets: this.wallets.map(w => { return {
          name: w.name,
          alias: w.rootAlias,
          confirmed: w.confirmed,
          referralAddress: w.getRootAddress().toString(),
          networkValue: 0,
          miningRewards: 0,
          ambassadorRewards: 0
        }})
      };

      this.availableInvites = this.wallets.reduce((number, w) => {
        console.log(w);
        return number + w.status.availableInvites;
      }, 0);

      const addresses = network.wallets.map(w => w.referralAddress);

      if (addresses.length) {

        const getAnvMethods = addresses.map(async (a) => {
          const anv = await this.wallets[0].getANV(a);
          let w = network.wallets.find(w => w.referralAddress == a);
          w.networkValue = anv;
          network.networkValue += anv;
        });

        const getRewards = async () => {
          const rewards = await this.wallets[0].getRewards(addresses);
          rewards.forEach(r => {
            let w = network.wallets.find(w => w.referralAddress == r.address);
            w.miningRewards = r.rewards.mining;
            w.ambassadorRewards = r.rewards.ambassador;
            network.miningRewards += w.miningRewards;
            network.ambassadorRewards += w.ambassadorRewards;
          });
        };

        await Promise.all([getRewards()].concat(getAnvMethods));
      }

      this.network = network;
  }

  private async loadRequests() {
    this.activeUnlockRequests = this.unlockRequestService.activeRequestsNumber;
    await this.unlockRequestService.loadRequestsData();
    this.activeUnlockRequests = this.unlockRequestService.activeRequestsNumber;
  }

}

