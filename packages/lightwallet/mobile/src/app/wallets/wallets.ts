import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { IVault } from '@merit/common/models/vault';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { Events, IonicPage, NavController, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsView {
  totalInvites: number;
  totalAmount: number;

  wallets: Array<any> = []; //todo display wallet or meritwalletclient?
  vaults: IVault[] = [];

  loading: boolean; //initial load, no data displayed
  refreshing: boolean; //soft data refresh

  showCommunityPopup: boolean;
  communitySize: number;

  constructor(
    private navCtrl: NavController,
    private logger: LoggerService,
    private toastCtrl: ToastControllerService,
    private profileService: ProfileService,
    private platform: Platform,
    private events: Events,
  ) {
    this.logger.debug('WalletsView constructor!');
  }

  async ngOnInit() {
    this.logger.debug('Hello WalletsView :: IonViewDidLoad!');
    this.showCommunityPopup = !(await this.profileService.isCommunityPopupClosed());
    this.platform.resume.subscribe(() => {
      this.logger.info('WalletView is going to refresh data on resume.');
      if (this.isActivePage) {
        this.refreshing = true;
        this.updateAllInfo().then(() => (this.refreshing = false));
      }
    });

    this.events.subscribe('Remote:IncomingTx', () => {
      this.refreshing = true;
      this.updateAllInfo().then(() => (this.refreshing = false));
    });
  }

  private get isActivePage(): boolean {
    try {
      return this.navCtrl.last().instance instanceof WalletsView;
    } catch (e) {
      return false;
    }
  }

  async ionViewDidLoad() {
    this.loading = true;
    try {
      this.wallets = await this.profileService.getWallets();
      this.vaults = await this.profileService.getVaults();
      this.setTotalValues();
      this.loading = false;
      this.refreshing = true;
      await this.updateAllInfo();
    } catch (e) {
    } finally {
      this.loading = false;
      this.refreshing = true;
    }
  }

  async ionViewWillEnter() {
    this.wallets = await this.profileService.getWallets();
    this.vaults = await this.profileService.getVaults();
    this.refreshing = true;
    await this.updateAllInfo();
    this.refreshing = false;
  }

  async doRefresh(refresher) {
    this.refreshing = true;
    await this.updateAllInfo();
    this.refreshing = false;
    refresher.complete();
  }

  async loadCommunitySize() {
    let communitySize = 0;
    const getCommunitySizes = () =>
      this.wallets.map(async w => {
        let { referralcount } = await w.getCommunityInfo(w.rootAddress.toString());
        return (w.communitySize = referralcount);
      });
    await Promise.all(getCommunitySizes());
    this.communitySize = communitySize;
  }

  toAddWallet() {
    let referralAddress = '';
    this.wallets.some(w => {
      if (w.availableInvites) return (referralAddress = w.rootAddress);
    });
    return this.navCtrl.push('CreateWalletView', { parentAddress: referralAddress });
  }

  async updateAllInfo() {
    try {
      await this.profileService.refreshData();
      await this.loadCommunitySize();
      this.setTotalValues();
      this.profileService.storeProfile();
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.error(err.text || 'Unknown error');
    }
  }

  private setTotalValues() {
    this.totalInvites = this.wallets.reduce((number, w) => {
      return number + w.availableInvites;
    }, 0);

    let totalAmount = this.wallets.reduce((amount, w) => {
      return amount + w.balance.spendableAmount;
    }, 0);

    totalAmount += this.vaults.reduce((amount, v) => {
      return amount + v.amount;
    }, 0);

    this.totalAmount = totalAmount;
    this.communitySize = this.wallets.reduce((size, w) => {
      return size + w.communitySize;
    }, 0);
  }

  closeCommunityPopup() {
    this.showCommunityPopup = false;
    this.profileService.closeCommunityPopup();
  }
}
