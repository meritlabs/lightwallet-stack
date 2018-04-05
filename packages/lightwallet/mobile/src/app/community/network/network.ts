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

  wallets: MeritWalletClient[];

  network:{
    communitySize: number,
    miningRewards: number,
    ambassadorRewards: number
    wallets: Array<{
      name: string,
      referralAddress: string,
      alias: string,
      confirmed: boolean,
      communitySize: number
      miningRewards: number,
      ambassadorRewards: number
    }>
  } = {
    communitySize: 0,
    miningRewards: 0,
    ambassadorRewards: 0,
    wallets: []
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
  }

  async ionViewDidLoad() {
    this.loading = true;
    this.activeUnlockRequests = this.unlockRequestService.activeRequestsNumber;
    await this.loadCommunityInfo();
    this.loading = false;
  }

  async ionViewWillEnter() {
    this.refreshing = true;
    await Promise.all([this.loadCommunityInfo(), this.loadRequestsInfo()]);
    this.refreshing = false;
  }

  async doRefresh(refresher) {
    this.refreshing = true;
    await Promise.all([this.loadCommunityInfo(), this.loadRequestsInfo()]);
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

  private async loadCommunityInfo() {

    try {
      this.wallets = await this.profileService.getWallets();

      let network = {
        communitySize: 0,
        networkValue: 0,
        miningRewards: 0,
        ambassadorRewards: 0,
        wallets: this.wallets.map(w => { return {
          name: w.name,
          alias: w.rootAlias,
          referralAddress: w.rootAddress.toString(),
          confirmed: w.confirmed,
          communitySize: 0,
          miningRewards: 0,
          ambassadorRewards: 0
        }})
      };

      this.availableInvites = this.wallets.reduce((number, w) => {
        return number + w.availableInvites;
      }, 0);

      const addresses = network.wallets.map(w => w.referralAddress);

      if (addresses.length) {

        // const getAnvMethods = () => addresses.map(async (a) => {
        //   const anv = await this.wallets[0].getANV(a);
        //   let w = network.wallets.find(w => w.referralAddress == a);
        //   w.networkValue = anv;
        //   network.networkValue += anv;
        // });

        const getCommunitySizes = () => addresses.map(async (a) => {
          const { referralcount } = await this.wallets[0].getCommunityInfo(a);
          let w = network.wallets.find(w => w.referralAddress == a);
          w.communitySize = referralcount;
          network.communitySize += referralcount;
        });

        const getStatuses = () => this.wallets.map((w) => {
          return w.getStatus();
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

        await Promise.all([getRewards()].concat(getCommunitySizes()).concat(getStatuses()));
      }

      this.network = network;
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.create({
        message: err.text || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

  }

  private async loadRequestsInfo() {
    try {
      await this.unlockRequestService.loadRequestsData();
      this.activeUnlockRequests = this.unlockRequestService.activeRequestsNumber;
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.create({
        message: err.text || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
  }

}

