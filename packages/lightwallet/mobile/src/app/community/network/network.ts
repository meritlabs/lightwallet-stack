import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage } from 'ionic-angular';
import { ProfileService } from '@merit/common/services/profile.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';
import { LoggerService } from '@merit/common/services/logger.service';

@IonicPage()
@Component({
  selector: 'view-network',
  templateUrl: 'network.html',
})
export class NetworkView {

  loading: boolean;

  network:{
    networkValue: number,
    miningRewards: number,
    ambassadorRewards: number,
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
  activeInvites: number;

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

  async ionViewDidEnter() {
    this.loading = true;
    try {
      await this.loadInfo();
    } catch (e) {} finally {
      this.loading = false;
    }
  }

  async ionViewWillEnter() {
    if (!this.loading) await this.loadInfo();
  }

  async doRefresh(refresher) {
    try {
      await this.loadInfo();
    } catch (e) {} finally {
      refresher.complete();
    }
  }

  shareAddress(address) {
    return this.socialSharing.share(address);
  }

  notifyCopy() {
    this.toastCtrl.create({
      message: 'Copied to clipboard',
      cssClass: ToastConfig.CLASS_MESSAGE
    }).present();
  }

  private async loadInfo() {
    try {

      const wallets = await this.profileService.getWallets();
      console.log(wallets);

      let network = {
        networkValue: 0,
        miningRewards: 0,
        ambassadorRewards: 0,
        wallets: wallets.map(w => { return {
          name: w.name,
          alias: w.rootAlias,
          confirmed: w.confirmed,
          referralAddress: w.getRootAddress().toString(),
          networkValue: 0,
          miningRewards: 0,
          ambassadorRewards: 0
        }})
      };

      const addresses = network.wallets.map(w => w.referralAddress);

      const getAnvMethods = addresses.map(async (a) => {
        const anv = await wallets[0].getANV(a);
        let w = network.wallets.find(w => w.referralAddress == a);
        w.networkValue = anv;
        network.networkValue += anv;
      });

      const getRewards = async () => {
        const rewards = await wallets[0].getRewards(addresses);
        rewards.forEach(r => {
          let w = network.wallets.find(w => w.referralAddress == r.address);
          w.miningRewards = r.rewards.mining;
          w.ambassadorRewards = r.rewards.ambassador;
          network.miningRewards += w.miningRewards;
          network.ambassadorRewards += w.ambassadorRewards;
        });
      };

      await Promise.all([getRewards()].concat(getAnvMethods));

      console.log(network);

      this.network = network;

    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.create({
        message: err.text || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
  }

}

