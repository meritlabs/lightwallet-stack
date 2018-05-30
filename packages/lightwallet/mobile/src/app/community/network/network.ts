import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage, Events } from 'ionic-angular';
import { ProfileService } from '@merit/common/services/profile.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';

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
    growthRewards: number
    wallets: Array<{
      name: string,
      referralAddress: string,
      alias: string,
      confirmed: boolean,
      communitySize: number
      miningRewards: number,
      growthRewards: number,
      color: string
    }>
  } = {
    communitySize: 0,
    miningRewards: 0,
    growthRewards: 0,
    wallets: []
  };

  activeUnlockRequests: number;
  availableInvites: number;
  pendingInvites: number;
  shareButtonAvailable: boolean;

  constructor(
    private toastCtrl: ToastControllerService,
    private socialSharing: SocialSharing,
    private profileService: ProfileService,
    private unlockRequestService: UnlockRequestService,
    private logger: LoggerService,
    private events: Events,
    platformService: PlatformService
  ) {
    this.shareButtonAvailable = platformService.isCordova;
  }

  async ionViewDidLoad() {
    this.loading = true;
    this.activeUnlockRequests = this.unlockRequestService.activeRequestsNumber;
    await this.loadCommunityInfo();
    this.loading = false;

    this.events.subscribe('Remote:IncomingTx', () => {
      this.refreshData();
    });
  }

  async ionViewWillEnter() {
    if (!this.loading) {
      this.refreshing = true;
      this.refreshData();
      this.refreshing = false;
    }
  }

  async doRefresh(refresher) {
    this.refreshing = true;
    await this.refreshData();
    this.refreshing = false;
    refresher.complete();
  }

  private async refreshData() {
    this.refreshing = true;
    const refreshCommunity = async () => await this.profileService.refreshCommunityInfo();
    const refreshTotalInfo = async () => {
      await this.profileService.refreshData();
      this.wallets = await this.profileService.getWallets();

      this.availableInvites = this.wallets.reduce((number, w) => {
        return number + w.availableInvites;
      }, 0);

      this.pendingInvites = this.wallets.reduce((number, w) => {
        return number + w.pendingInvites;
      }, 0);
    };
    await Promise.all([refreshTotalInfo(), refreshCommunity(), this.loadRequestsInfo()]);
    this.refreshing = false;
  }

  shareAddress(address) {
    return this.socialSharing.share(address);
  }

  notifyCopy() {
    this.toastCtrl.success('Copied to clipboard');
  }

  private async loadCommunityInfo() {

    try {
      this.wallets = await this.profileService.getWallets();

      this.availableInvites = this.wallets.reduce((number, w) => {
        return number + w.availableInvites;
      }, 0);

      this.pendingInvites = this.wallets.reduce((number, w) => {
        return number + w.pendingInvites;
      }, 0);
      this.network = await this.profileService.getCommunityInfo();
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.error(err.text || 'Unknown error');
    }

  }

  private async loadRequestsInfo() {
    try {
      await this.unlockRequestService.loadRequestsData();
      this.activeUnlockRequests = this.unlockRequestService.activeRequestsNumber;
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.error(err.text || 'Unknown error');
    }
  }

}

